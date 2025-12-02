const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pedidos.db');

/**
 * database/connection.js
 * ----------------------
 * Responsável pela conexão com o banco SQLite e pela inicialização
 * das tabelas usadas pela aplicação. Esta é uma inicialização simples
 * (adequada para protótipo). Em aplicações reais, utilize migrations
 * (ex.: knex, umzug) para versionamento do schema.
 */

db.serialize(() => {
    // orders: tabela principal com chave primária orderId
    db.run(`CREATE TABLE IF NOT EXISTS orders (orderId TEXT PRIMARY KEY, value REAL, creationDate TEXT)`);

    // items: itens relacionados a cada pedido (FK para orders.orderId)
    db.run(`CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, orderId TEXT, productId TEXT, quantity INTEGER, price REAL, FOREIGN KEY(orderId) REFERENCES orders(orderId))`);
    
    // users: tabela simples para autenticação (username único, senha hasheada)
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)`);
});

module.exports = db;