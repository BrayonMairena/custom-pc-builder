const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: Gestión de proveedores de componentes
 */

/**
 * @swagger
 * /api/proveedores:
 *   get:
 *     summary: Obtiene todos los proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores exitosa
 *   post:
 *     summary: Crea un nuevo proveedor
 *     tags: [Proveedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - telefono
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "CompuMundo"
 *               telefono:
 *                 type: string
 *                 example: "555-0199"
 *     responses:
 *       201:
 *         description: Proveedor creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.get('/', proveedorController.getAll);
router.post('/', proveedorController.create);

/**
 * @swagger
 * /api/proveedores/{id}:
 *   get:
 *     summary: Obtiene un proveedor por ID
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *       404:
 *         description: Proveedor no encontrado
 *   put:
 *     summary: Actualiza un proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proveedor actualizado
 *   delete:
 *     summary: Elimina un proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proveedor eliminado
 */
router.get('/:id', proveedorController.getById);
router.put('/:id', proveedorController.update);
router.delete('/:id', proveedorController.delete);

module.exports = router;