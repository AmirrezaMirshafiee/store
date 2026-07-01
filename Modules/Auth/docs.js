/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthPhoneRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *
 *     LoginWithPasswordRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - password
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         password:
 *           type: string
 *           example: "12345678"
 *
 *     LoginWithOtpRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "1234"
 *
 *     ResendCodeRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *
 *     ForgetPasswordRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - code
 *         - newPassword
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         code:
 *           type: string
 *           example: "1234"
 *         newPassword:
 *           type: string
 *           example: "newPassword123"
 *
 *     AuthUser:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "66a1f1f8b9f3a8c9d1234567"
 *         role:
 *           type: string
 *           example: "user"
 *         phoneNumber:
 *           type: string
 *           example: "09123456789"
 *         fullName:
 *           type: string
 *           nullable: true
 *           example: "Ali Ahmadi"
 *         cartId:
 *           type: string
 *           nullable: true
 *           example: "66a1f1f8b9f3a8c9d9999999"
 *
 *     LoginSuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "login successfully"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             user:
 *               $ref: '#/components/schemas/AuthUser'
 */

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Check auth method and send OTP if needed
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthPhoneRequest'
 *     responses:
 *       200:
 *         description: Auth step checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP Code sent"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userExist:
 *                       type: boolean
 *                       example: false
 *                     userPassword:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Validation error
 *       500:
 *         description: SMS service error
 */

/**
 * @swagger
 * /api/auth/login-password:
 *   post:
 *     summary: Login with phone number and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginWithPasswordRequest'
 *     responses:
 *       200:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Invalid phone number or password
 */

/**
 * @swagger
 * /api/auth/login-otp:
 *   post:
 *     summary: Login or register with OTP code
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginWithOtpRequest'
 *     responses:
 *       200:
 *         description: Login successfully with OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Invalid code
 */

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: Resend OTP code
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendCodeRequest'
 *     responses:
 *       200:
 *         description: OTP code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP Code sent"
 *       400:
 *         description: Validation error
 *       500:
 *         description: SMS service error
 */

/**
 * @swagger
 * /api/auth/forget-password:
 *   post:
 *     summary: Reset password using OTP code
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgetPasswordRequest'
 *     responses:
 *       200:
 *         description: New password set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "new password set"
 *       400:
 *         description: Validation error or user not found
 *       404:
 *         description: Invalid code
 */
