jest.mock('../src/repositories/orderRepository', () => ({
  createOrderWithItems: jest.fn()
}));

const OrderRepository = require('../src/repositories/orderRepository');
const OrderService = require('../src/services/orderService');

describe('OrderService.create', () => {
  it('mapeia os campos e chama OrderRepository.createOrderWithItems', async () => {
    OrderRepository.createOrderWithItems.mockResolvedValue();

    const raw = {
      numeroPedido: 'p1',
      valorTotal: 100,
      dataCriacao: '2023-01-01T00:00:00Z',
      items: [
        { idItem: 'i1', quantidadeItem: 2, valorItem: 50 }
      ]
    };

    const result = await OrderService.create(raw);

    expect(OrderRepository.createOrderWithItems).toHaveBeenCalledWith({
      orderId: 'p1',
      value: 100,
      creationDate: '2023-01-01T00:00:00Z',
      items: [ { productId: 'i1', quantity: 2, price: 50 } ]
    });

    expect(result).toEqual({
      orderId: 'p1',
      value: 100,
      creationDate: '2023-01-01T00:00:00Z',
      items: [ { productId: 'i1', quantity: 2, price: 50 } ]
    });
  });
});
