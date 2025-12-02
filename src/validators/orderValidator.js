const { body, param, validationResult } = require('express-validator');

/**
 * Regras de validação para criação e atualização de orders.
 * Mantém os campos esperados conforme o enunciado do desafio.
 */

const createOrderRules = [
    body('numeroPedido').exists().withMessage('numeroPedido é obrigatório').isString(),
    body('valorTotal').exists().withMessage('valorTotal é obrigatório').isNumeric().withMessage('valorTotal deve ser numérico'),
    body('dataCriacao').exists().withMessage('dataCriacao é obrigatória').isISO8601().withMessage('dataCriacao deve ser ISO8601'),
    body('items').exists().withMessage('items é obrigatório').isArray({ min: 1 }).withMessage('items deve ser um array não vazio'),
    body('items.*.idItem').exists().withMessage('items[].idItem é obrigatório').isString(),
    body('items.*.quantidadeItem').exists().withMessage('items[].quantidadeItem é obrigatório').isInt({ min: 1 }).withMessage('quantidadeItem deve ser inteiro >= 1'),
    body('items.*.valorItem').exists().withMessage('items[].valorItem é obrigatório').isNumeric().withMessage('valorItem deve ser numérico')
];

const updateOrderRules = [
    param('id').exists().withMessage('id do pedido é obrigatório').isString(),
    // Permitimos atualizar apenas valorTotal (valor) neste endpoint
    body('valorTotal').optional().isNumeric().withMessage('valorTotal deve ser numérico')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
};

module.exports = {
    createOrderRules,
    updateOrderRules,
    validate
};
