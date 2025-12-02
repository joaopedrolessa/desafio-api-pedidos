const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const bcrypt = require('bcryptjs');

/**
 * AuthController
 * --------------
 * Endpoints de autenticação: agora verifica usuário na tabela `users`
 * usando bcrypt para comparação de senha.
 */

const SECRET_KEY = process.env.SECRET_KEY || 'minha_chave_secreta_super_segura';

class AuthController {
    /**
     * POST /login
     * Body: { username, password }
     * Retorna: { user, token }
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ error: 'username e password são obrigatórios' });
            }

            db.get('SELECT id, username, password FROM users WHERE username = ?', [username], async (err, user) => {
                if (err) return res.status(500).json({ error: 'Erro ao acessar banco' });
                if (!user) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

                const match = await bcrypt.compare(password, user.password);
                if (!match) return res.status(401).json({ error: 'Usuário ou senha inválidos' });

                const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 });
                return res.json({ user: user.username, token });
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro interno' });
        }
    }
}

module.exports = new AuthController();