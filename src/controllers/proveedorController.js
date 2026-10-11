const prisma = require('../lib/prisma');

exports.getAll = async (req, res) => {
    try {
        const proveedores = await prisma.proveedor.findMany({ include: { componentes: true } });
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, telefono } = req.body;
        if (!nombre || !telefono) return res.status(400).json({ error: 'Nombre y teléfono son obligatorios' });
        const nuevo = await prisma.proveedor.create({ data: { nombre, telefono } });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear proveedor' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await prisma.proveedor.findUnique({ 
            where: { id: parseInt(id) },
            include: { componentes: true } 
        });
        if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
        res.status(200).json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar proveedor' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono } = req.body;
        const actualizado = await prisma.proveedor.update({
            where: { id: parseInt(id) },
            data: { nombre, telefono }
        });
        res.status(200).json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.proveedor.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ mensaje: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
};