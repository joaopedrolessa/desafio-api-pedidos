const OrderRepository = require('../repositories/orderRepository');

/**
 * OrderService
 * ------------
 * Camada responsável por regras de negócio e transformação de dados
 * entre o formato esperado pela API (entrada) e o formato persistido.
 *
 * Observações:
 *  - Operações multi-step (inserir order + items) devem ser
 *    executadas em transação (atomicidade) em ambientes reais.
 */

class OrderService {
    /**
     * Mapeia o payload recebido (por exemplo em PT) para o modelo interno.
     * @param {object} data
     */
    _mapDataToModel(data) {
        return {
            orderId: data.numeroPedido,
            value: data.valorTotal,
            creationDate: data.dataCriacao,
            items: data.items.map(item => ({
                productId: item.idItem,
                quantity: item.quantidadeItem,
                price: item.valorItem
            }))
        };
    }

    /**
     * Cria um pedido e persiste seus items.
     * @param {object} rawData
     */
    async create(rawData) {
        // 1. Transformação dos dados de entrada
        const orderData = this._mapDataToModel(rawData);

        // 2. Persistência: utilizar operação atômica (transação) que
        // insere order + items em conjunto.
        await OrderRepository.createOrderWithItems(orderData);

        return orderData;
    }

    /**
     * Recupera order por id ou lança erro controlado se não existir.
     * @param {string} id
     */
    async getById(id) {
        const order = await OrderRepository.findById(id);
        if (!order) {
            throw new Error('OrderNotFound');
        }
        return order;
    }
}

module.exports = new OrderService();