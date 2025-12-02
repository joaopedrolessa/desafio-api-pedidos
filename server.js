const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

/**
 * server.js
 * ---------
 * Ponto de entrada da aplicação Express. Configura middlewares básicos e
 * registra as rotas principais. Em produção recomenda-se:
 *  - usar `process.env.PORT` para configurar a porta
 *  - adicionar tratamento de erros centralizado (error handler)
 */

const errorHandler = require('./src/middlewares/errorHandler');

const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(bodyParser.json())

// Tenta carregar `openapi.json` e registrar a rota `/docs` com Swagger UI.
try {
	const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'openapi.json'), 'utf8'))
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
} catch (err) {
	console.warn('Não foi possível carregar openapi.json para /docs:', err.message)
}

app.use(routes)

// Middleware global de tratamento de erros (deve vir após as rotas)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))