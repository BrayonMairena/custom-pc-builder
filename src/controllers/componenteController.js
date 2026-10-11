const prisma = require('../lib/prisma');

exports.getAll = async (req, res) => {
    try {
        const componentes = await prisma.componente.findMany({ include: { proveedor: true } });
        const respuesta = componentes.map(c => ({ ...c, precio: Number(c.precio) }));
        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener componentes' });
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, tipo, marca, precio, stock, proveedorId } = req.body;
        if (!nombre || !tipo || !marca || precio === undefined || stock === undefined) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        const nuevo = await prisma.componente.create({
            data: { 
                nombre, tipo, marca, 
                precio: Number(precio), 
                stock: parseInt(stock), 
                proveedorId: proveedorId ? parseInt(proveedorId) : null 
            }
        });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear componente' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const comp = await prisma.componente.findUnique({ where: { id: parseInt(id) } });
        if (!comp) return res.status(404).json({ error: 'Componente no encontrado' });
        res.status(200).json({ ...comp, precio: Number(comp.precio) });
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar componente' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock } = req.body;
        const actualizado = await prisma.componente.update({
            where: { id: parseInt(id) },
            data: { 
                nombre, 
                precio: precio ? Number(precio) : undefined, 
                stock: stock ? parseInt(stock) : undefined 
            }
        });
        res.status(200).json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar componente' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.componente.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ mensaje: 'Componente eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar componente' });
    }
};