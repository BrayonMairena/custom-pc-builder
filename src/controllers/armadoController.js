const prisma = require('../lib/prisma');

exports.getAllArmados = async (req, res) => {
    try {
        const armados = await prisma.armado.findMany({
            include: { cliente: true, detalles: { include: { componente: true } } }
        });
        const respuesta = armados.map(a => ({ ...a, total: Number(a.total) }));
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener armados' });
    }
};

exports.createArmado = async (req, res) => {
    try {
        const { nombre, clienteId, componentes } = req.body; 

        if (!componentes || componentes.length === 0) {
            return res.status(400).json({ error: 'Debe incluir al menos un componente' });
        }

        let total = 0;
        const detallesData = [];

        for (let item of componentes) {
            const comp = await prisma.componente.findUnique({ where: { id: parseInt(item.componenteId) } });
            
            if (!comp) return res.status(404).json({ error: `Componente ID ${item.componenteId} no existe` });
            if (comp.stock < item.cantidad) {
                return res.status(400).json({ error: `Stock insuficiente para ${comp.nombre}. Disponible: ${comp.stock}, Solicitado: ${item.cantidad}` });
            }

            total += Number(comp.precio) * item.cantidad;
            
            detallesData.push({
                componenteId: parseInt(item.componenteId),
                cantidad: parseInt(item.cantidad)
            });
        }

        const nuevoArmado = await prisma.armado.create({
            data: {
                nombre,
                clienteId: parseInt(clienteId),
                total: total,
                detalles: {
                    create: detallesData
                }
            },
            include: { 
                cliente: true,
                detalles: { include: { componente: true } } 
            }
        });

        for (let item of componentes) {
            await prisma.componente.update({
                where: { id: parseInt(item.componenteId) },
                data: { stock: { decrement: parseInt(item.cantidad) } }
            });
        }

        res.status(201).json({ 
            mensaje: 'Armado creado exitosamente y stock actualizado', 
            armado: { ...nuevoArmado, total: Number(nuevoArmado.total) } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al crear el armado' });
    }
};

exports.getArmadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const armado = await prisma.armado.findUnique({
            where: { id: parseInt(id) },
            include: { cliente: true, detalles: { include: { componente: true } } }
        });
        if (!armado) return res.status(404).json({ error: 'Armado no encontrado' });
        res.status(200).json({ ...armado, total: Number(armado.total) });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar armado' });
    }
};