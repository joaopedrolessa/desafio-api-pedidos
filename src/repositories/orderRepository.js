const db = require('../database/connection');

/**
 * OrderRepository
 * ---------------
 * Camada de persistência para `orders` e `items`. Cada método retorna
 * uma Promise que resolve quando a operação no SQLite for concluída.
 *
 * Observações:
 *  - Em fluxos que envolvem múltiplas operações relacionadas (ex.:
 *    inserir order e items) considere usar transações para garantir
 *    atomicidade.
 */

class OrderRepository {
    /**
     * Insere um order na tabela `orders`.
     * @param {{orderId: string, value: number, creationDate: string}} order
     */
    createOrder(order) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)`;
            db.run(query, [order.orderId, order.value, order.creationDate], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    /**
     * Insere um item associado a um order.
     * @param {{productId:string, quantity:number, price:number}} item
     * @param {string} orderId
     */
    createItem(item, orderId) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`;
            db.run(query, [orderId, item.productId, item.quantity, item.price], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    /**
     * Busca um order por id e inclui seus items.
     * @param {string} id
     * @returns {Promise<object|null>} Order com propriedade `items` ou null
     */
    findById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM orders WHERE orderId = ?`, [id], (err, order) => {
                if (err) return reject(err);
                if (!order) return resolve(null);

                db.all(`SELECT productId, quantity, price FROM items WHERE orderId = ?`, [id], (err, items) => {
                    if (err) return reject(err);
                    order.items = items;
                    resolve(order);
                });
            });
        });
    }

    /**
     * Retorna todos os orders (sem items).
     */
    findAll() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM orders`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    /**
     * Remove um order e seus items. A ordem é importante devido à FK.
     * @param {string} id
     */
    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM items WHERE orderId = ?`, [id], (err) => {
                if (err) return reject(err);
                db.run(`DELETE FROM orders WHERE orderId = ?`, [id], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }

    /**
     * Atualiza apenas o campo `value` do order.
     * @param {string} id
     * @param {number} newValue
     */
    updateValue(id, newValue) {
         return new Promise((resolve, reject) => {
            db.run(`UPDATE orders SET value = ? WHERE orderId = ?`, [newValue, id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    /**
     * Cria um order e seus items dentro de uma transação.
     * Garante atomicidade: se algum insert falhar, faz rollback.
     * @param {{orderId:string, value:number, creationDate:string, items: Array}} order
     */
    createOrderWithItems(order) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                const insertOrder = `INSERT INTO orders (orderId, value, creationDate) VALUES (?, ?, ?)`;
                db.run(insertOrder, [order.orderId, order.value, order.creationDate], function(err) {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }

                    const insertItem = `INSERT INTO items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`;
                    // Inserir itens sequencialmente
                    const insertNext = (idx) => {
                        if (idx >= order.items.length) {
                            return db.run('COMMIT', (err) => {
                                if (err) return reject(err);
                                return resolve();
                            });
                        }

                        const item = order.items[idx];
                        db.run(insertItem, [order.orderId, item.productId, item.quantity, item.price], function(err) {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }
                            insertNext(idx + 1);
                        });
                    };

                    insertNext(0);
                });
            });
        });
    }
}

module.exports = new OrderRepository();