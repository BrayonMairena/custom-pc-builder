const express = require('express');
const router = express.Router();
const armadoController = require('../controllers/armadoController');

/**
 * @swagger
 * tags:
 *   name: Armados
 *   description: Gestión de ensamblaje de PCs personalizadas
 */

/**
 * @swagger
 * /api/armados:
 *   get:
 *     summary: Obtiene todos los armados (PCs ensambladas)
 *     tags: [Armados]
 *     responses:
 *       200:
 *         description: Lista de armados exitosa
 *   post:
 *     summary: Crea un nuevo armado y descuenta stock automáticamente
 *     tags: [Armados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - clienteId
 *               - componentes
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "PC Gamer de Juan"
 *               clienteId:
 *                 type: integer
 *                 example: 1
 *               componentes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     componenteId:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       201:
 *         description: Armado creado y stock actualizado
 *       400:
 *         description: Stock insuficiente o datos inválidos
 *       404:
 *         description: Componente o cliente no encontrado
 */
router.get('/', armadoController.getAllArmados);
router.post('/', armadoController.createArmado);

/**
 * @swagger
 * /api/armados/{id}:
 *   get:
 *     summary: Obtiene un armado por ID
 *     tags: [Armados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Armado encontrado
 *       404:
 *         description: Armado no encontrado
 */
router.get('/:id', armadoController.getArmadoById);

module.exports = router;