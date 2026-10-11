const prisma = require('../lib/prisma');

exports.getAll = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany({ include: { armados: true } });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, email, telefono } = req.body;
        if (!nombre || !email || !telefono) return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        const nuevo = await prisma.cliente.create({ data: { nombre, email, telefono } });
        res.status(201).json(nuevo);
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'El email ya está registrado' });
        res.status(500).json({ error: 'Error al crear cliente' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await prisma.cliente.findUnique({ 
            where: { id: parseInt(id) },
            include: { armados: true } 
        });
        if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar cliente' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono } = req.body;
        const actualizado = await prisma.cliente.update({
            where: { id: parseInt(id) },
            data: { nombre, email, telefono }
        });
        res.status(200).json(actualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.cliente.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
};