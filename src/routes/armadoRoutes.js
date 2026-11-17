const express = require('express');
const router = express.Router();
const armadoController = require('../controllers/armadoController');

/**
 * @swagger
 * tags:
 *   name: Armados
 *   description: Gestión de ensamblaje de PCs personalizadas y Facturación
 */

/**
 * @swagger
 * /api/armados:
 *   get:
 *     summary: Obtiene todas las facturas/armados
 *     tags: [Armados]
 *     responses:
 *       200:
 *         description: Lista de facturas exitosa
 *   post:
 *     summary: Crea una nueva factura (armado), descuenta stock y calcula IVA
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
 *         description: Factura generada, stock actualizado y totales calculados
 *       400:
 *         description: Stock insuficiente o datos inválidos
 */
router.get('/', armadoController.getAllArmados);
router.post('/', armadoController.createArmado);

/**
 * @swagger
 * /api/armados/{id}:
 *   get:
 *     summary: Obtiene una factura por ID
 *     tags: [Armados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Factura encontrada
 *       404:
 *         description: Factura no encontrada
 */
router.get('/:id', armadoController.getArmadoById);

/**
 * @swagger
 * /api/armados/{id}/pagar:
 *   put:
 *     summary: Procesa el pago de una factura de armado
 *     tags: [Armados]
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
 *               metodoPago:
 *                 type: string
 *                 example: "Tarjeta de Crédito"
 *     responses:
 *       200:
 *         description: Factura pagada exitosamente
 *       404:
 *         description: Factura no encontrada
 */
router.put('/:id/pagar', armadoController.pagarArmado);

module.exports = router;