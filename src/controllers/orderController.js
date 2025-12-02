const OrderService = require('../services/orderService');
const OrderRepository = require('../repositories/orderRepository');

/**
 * OrderController
 * ---------------
 * Controller responsável por receber requisições HTTP relacionadas a
 * pedidos e delegar a lógica para services/repositories.
 *
 * Padrões usados:
 *  - Controllers devem validar dados de entrada (nível básico) e
 *    traduzir exceções em respostas HTTP apropriadas.
 *  - Regras de negócio e transformações ficam em `services`.
 */

class OrderController {
    /**
     * Cria um pedido.
     * POST /order
     */
    async store(req, res) {
        try {
            const result = await OrderService.create(req.body);
            return res.status(201).json(result);
        } catch (error) {
            // Em produção mapear tipos de erro para códigos HTTP mais específicos
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * Retorna um pedido por id.
     * GET /order/:id
     */
    async show(req, res) {
        try {
            const { id } = req.params;
            const order = await OrderRepository.findById(id);
            if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
            return res.json(order);
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno' });
        }
    }

    /**
     * Lista todos os pedidos.
     * GET /order/list
     */
    async index(req, res) {
        try {
            const orders = await OrderRepository.findAll();
            return res.json(orders);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Deleta um pedido por id.
     * DELETE /order/:id
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await OrderRepository.delete(id);
            return res.json({ message: 'Pedido deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    /**
     * Atualiza o valor total do pedido (exemplo simplificado).
     * PUT /order/:id
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { valorTotal } = req.body;
            await OrderRepository.updateValue(id, valorTotal);
            return res.json({ message: 'Pedido atualizado' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderController();