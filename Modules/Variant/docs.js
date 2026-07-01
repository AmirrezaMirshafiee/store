/**
 * @swagger
 * tags:
 *   name: Variant
 *   description: Variant management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Variant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "66b1f1f8b9f3a8c9d1234567"
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: "color"
 *         value:
 *           type: string
 *           example: "Red"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - type
 *         - value
 *
 *     CreateVariantRequest:
 *       type: object
 *       required:
 *         - type
 *         - value
 *       properties:
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: "size"
 *         value:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "XL"
 *
 *     UpdateVariantRequest:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [size, color]
 *           example: "color"
 *         value:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: "Blue"
 */

/**
 * @swagger
 * /api/variants:
 *   get:
 *     summary: Get all variants
 *     tags: [Variant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in type or value
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field, example value or -createdAt
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated fields
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [size, color]
 *         description: Filter by variant type
 *     responses:
 *       200:
 *         description: Variants fetched successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/variant:
 *   post:
 *     summary: Create a new variant
 *     tags: [Variant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVariantRequest'
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: create variant successfully
 *                 data:
 *                   $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/variant/{id}:
 *   get:
 *     summary: Get one variant by ID
 *     tags: [Variant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant fetched successfully
 *       400:
 *         description: Invalid variant ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Variant not found
 */

/**
 * @swagger
 * /api/variant/{id}:
 *   patch:
 *     summary: Update a variant
 *     tags: [Variant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVariantRequest'
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: update variant successfully
 *                 data:
 *                   $ref: '#/components/schemas/Variant'
 *       400:
 *         description: Validation error or invalid variant ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Variant not found
 */

/**
 * @swagger
 * /api/variant/{id}:
 *   delete:
 *     summary: Delete a variant
 *     tags: [Variant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: deleted variant successfully
 *       400:
 *         description: Invalid variant ID or variant is used in product variants
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Variant not found
 */
