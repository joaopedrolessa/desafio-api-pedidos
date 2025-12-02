const jwt = require('jsonwebtoken');

/**
 * auth middleware
 * ---------------
 * Valida o header `Authorization` no formato "Bearer <token>" e
 * decodifica o JWT adicionando `req.userId` para uso posterior.
 *
 * Observações de segurança:
 *  - A `SECRET_KEY` deve vir de variáveis de ambiente em produção.
 *  - Em cenários reais valide também claims adicionais (exp, aud, iss).
 */

const SECRET_KEY = process.env.SECRET_KEY || 'minha_chave_secreta_super_segura';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro no Token' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token malformatado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido' });

        // Expõe o id do usuário decodificado para handlers subsequentes
        req.userId = decoded.id;
        return next();
    });
};