const db = require('../src/database/connection');
const bcrypt = require('bcryptjs');

// Usuário padrão (troque se necessário)
const USERNAME = process.env.SEED_USERNAME || 'admin';
const PASSWORD = process.env.SEED_PASSWORD || '123456';

async function run() {
    const hash = await bcrypt.hash(PASSWORD, 8);

    db.get('SELECT id FROM users WHERE username = ?', [USERNAME], (err, row) => {
        if (err) {
            console.error('Erro ao verificar usuário:', err);
            process.exit(1);
        }

        if (row) {
            console.log('Usuário já existe, nada a fazer.');
            process.exit(0);
        }

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [USERNAME, hash], function(err) {
            if (err) {
                console.error('Erro ao inserir usuário seed:', err);
                process.exit(1);
            }
            console.log(`Usuário seed criado: ${USERNAME}`);
            process.exit(0);
        });
    });
}

run();
