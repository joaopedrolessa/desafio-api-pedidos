const express = require('express');
const routes = express.Router();

const OrderController = require('./src/controllers/orderController');
const AuthController = require('./src/controllers/authController');
const authMiddleware = require('./src/middlewares/auth');
const { createOrderRules, updateOrderRules, validate } = require('./src/validators/orderValidator');
const { param } = require('express-validator');

/**
 * routes.js
 * --------
 * Define as rotas HTTP da aplicação e agrupa por requisito de autenticação.
 * Mantenha os route handlers leves; a lógica deve ficar nos controllers.
 * Para adicionar rota protegida, registre-a após `routes.use(authMiddleware)`.
 *
 * Rotas públicas:
 *  - POST /login -> retorna JWT para requisições subsequentes
 *
 * Rotas protegidas (exigem header Authorization "Bearer <token>"):
 *  - Endpoints CRUD para orders
 */

// Rota pública: usado para autenticar e receber um token JWT
routes.post('/login', AuthController.login);

// Todas as rotas registradas após este middleware requerem JWT válido
routes.use(authMiddleware);

// Endpoints de orders (protegidos)
routes.post('/order', createOrderRules, validate, OrderController.store);
routes.get('/order/list', OrderController.index);
// (validate já importado acima)

// Validação do parâmetro :id para GET e DELETE
const idParamRule = [
	param('id').exists().withMessage('id do pedido é obrigatório').isString()
];

routes.get('/order/:id', idParamRule, validate, OrderController.show);
routes.put('/order/:id', updateOrderRules, validate, OrderController.update);
routes.delete('/order/:id', idParamRule, validate, OrderController.delete);

module.exports = routes;