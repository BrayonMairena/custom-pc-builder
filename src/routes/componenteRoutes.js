const express = require('express');
const router = express.Router();
const componenteController = require('../controllers/componenteController');

/**
 * @swagger
 * tags:
 *   name: Componentes
 *   description: Gestión del inventario de partes de PC
 */

/**
 * @swagger
 * /api/componentes:
 *   get:
 *     summary: Obtiene todos los componentes
 *     tags: [Componentes]
 *     responses:
 *       200:
 *         description: Lista de componentes exitosa
 *   post:
 *     summary: Crea un nuevo componente
 *     tags: [Componentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - tipo
 *               - marca
 *               - precio
 *               - stock
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "RTX 4090"
 *               tipo:
 *                 type: string
 *                 example: "GPU"
 *               marca:
 *                 type: string
 *                 example: "Nvidia"
 *               precio:
 *                 type: number
 *                 example: 1500.50
 *               stock:
 *                 type: integer
 *                 example: 10
 *               proveedorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Componente creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.get('/', componenteController.getAll);
router.post('/', componenteController.create);

/**
 * @swagger
 * /api/componentes/{id}:
 *   get:
 *     summary: Obtiene un componente por ID
 *     tags: [Componentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Componente encontrado
 *       404:
 *         description: Componente no encontrado
 *   put:
 *     summary: Actualiza un componente
 *     tags: [Componentes]
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
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Componente actualizado
 *   delete:
 *     summary: Elimina un componente
 *     tags: [Componentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Componente eliminado
 */
router.get('/:id', componenteController.getById);
router.put('/:id', componenteController.update);
router.delete('/:id', componenteController.delete);

module.exports = router;