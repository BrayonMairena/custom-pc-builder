const prisma = require('../lib/prisma');

// 1. Crear un Armado / Factura
exports.createArmado = async (req, res) => {
    try {
        const { nombre, clienteId, componentes } = req.body; 

        if (!componentes || componentes.length === 0) {
            return res.status(400).json({ error: 'Debe incluir al menos un componente' });
        }

        let subtotal = 0;
        const detallesData = [];

        // Validar existencia, stock y calcular subtotal
        for (let item of componentes) {
            const comp = await prisma.componente.findUnique({ where: { id: parseInt(item.componenteId) } });
            
            if (!comp) return res.status(404).json({ error: `Componente ID ${item.componenteId} no existe` });
            if (comp.stock < item.cantidad) {
                return res.status(400).json({ error: `Stock insuficiente para ${comp.nombre}. Disponible: ${comp.stock}, Solicitado: ${item.cantidad}` });
            }

            // Convertimos a Number porque Prisma usa Decimal en SQL Server
            subtotal += Number(comp.precio) * item.cantidad;
            
            detallesData.push({
                componenteId: parseInt(item.componenteId),
                cantidad: parseInt(item.cantidad)
            });
        }

        // Cálculos de la Factura (IVA 15%)
        const impuesto = subtotal * 0.15; 
        const total = subtotal + impuesto;
        
        // Generar un número de factura único
        const numeroFactura = `FAC-${Date.now()}`;

        // Crear el Armado/Factura en la base de datos
        const nuevoArmado = await prisma.armado.create({
            data: {
                numeroFactura,
                nombre,
                clienteId: parseInt(clienteId),
                subtotal: subtotal,
                impuesto: impuesto,
                total: total,
                estadoPago: "Pendiente", // Nace pendiente
                detalles: {
                    create: detallesData
                }
            },
            include: { 
                cliente: true,
                detalles: { include: { componente: true } } 
            }
        });

        // Descontar stock
        for (let item of componentes) {
            await prisma.componente.update({
                where: { id: parseInt(item.componenteId) },
                data: { stock: { decrement: parseInt(item.cantidad) } }
            });
        }

        res.status(201).json({ 
            mensaje: 'Factura generada y stock actualizado', 
            factura: { ...nuevoArmado, subtotal: Number(nuevoArmado.subtotal), impuesto: Number(nuevoArmado.impuesto), total: Number(nuevoArmado.total) }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al crear el armado' });
    }
};

// 2. Obtener todas las facturas/armados
exports.getAllArmados = async (req, res) => {
    try {
        const armados = await prisma.armado.findMany({
            include: { cliente: true, detalles: { include: { componente: true } } }
        });
        // Limpiamos los decimales para que el JSON se vea bien
        const respuesta = armados.map(a => ({ 
            ...a, 
            subtotal: Number(a.subtotal), 
            impuesto: Number(a.impuesto), 
            total: Number(a.total) 
        }));
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener armados' });
    }
};

// 3. Obtener una factura por ID
exports.getArmadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const armado = await prisma.armado.findUnique({
            where: { id: parseInt(id) },
            include: { cliente: true, detalles: { include: { componente: true } } }
        });
        if (!armado) return res.status(404).json({ error: 'Armado no encontrado' });
        res.status(200).json({ 
            ...armado, 
            subtotal: Number(armado.subtotal), 
            impuesto: Number(armado.impuesto), 
            total: Number(armado.total) 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar armado' });
    }
};

// 4. Procesar el pago de la factura
exports.pagarArmado = async (req, res) => {
    try {
        const { id } = req.params;
        const { metodoPago } = req.body; // Ej: "Tarjeta", "Efectivo"

        const armadoPagado = await prisma.armado.update({
            where: { id: parseInt(id) },
            data: { 
                estadoPago: "Pagado",
                metodoPago: metodoPago || "Efectivo"
            }
        });

        res.status(200).json({ 
            mensaje: 'Pago procesado exitosamente', 
            factura: { 
                ...armadoPagado, 
                subtotal: Number(armadoPagado.subtotal), 
                impuesto: Number(armadoPagado.impuesto), 
                total: Number(armadoPagado.total) 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar el pago' });
    }
};