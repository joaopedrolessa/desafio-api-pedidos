Testes automatizados (Jest)

1) Instale dependências de desenvolvimento (já incluído no projeto):

```powershell
npm install
```

2) Rode os testes:

```powershell
npm test
```

O repositório inclui um teste unitário básico em `tests/orderService.test.js` que mocka o `OrderRepository` e valida que `OrderService.create` mapeia corretamente os campos e chama a operação de persistência atômica.
Testes manuais rápidos (PowerShell)

1) Obter token:

```powershell
$resp = Invoke-RestMethod -Method POST -Uri http://localhost:3000/login -Body (ConvertTo-Json @{ username='admin'; password='123456' }) -ContentType 'application/json'
$token = $resp.token

# Criar order usando token
$body = @{ numeroPedido = 'v10089016vdb-01'; valorTotal = 10000; dataCriacao = '2023-07-19T12:24:11.529Z'; items = @(@{ idItem='2434'; quantidadeItem=1; valorItem=1000 }) } | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method POST -Uri http://localhost:3000/order -Body $body -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
```

Exemplo PowerShell (tratamento de resposta não-2xx com try/catch)

```powershell
try {
  $resp = Invoke-RestMethod -Method GET -Uri http://localhost:3000/order/v10089016vdb-01 -Headers @{ Authorization = "Bearer $token" }
  Write-Output "Found: $($resp | ConvertTo-Json -Depth 5)"
} catch {
  $webException = $_.Exception
  if ($webException.Response -ne $null) {
    $reader = New-Object System.IO.StreamReader($webException.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Output "HTTP Error response body: $body"
  } else {
    Write-Output "Erro inesperado: $($_.Exception.Message)"
  }
}
```
# Desafio API Pedidos

Projeto de exemplo para o desafio técnico — API em Node.js (Express) para gerenciar pedidos.

Resumo rápido
- Endpoints: criar, ler por id, listar, atualizar (valor) e deletar pedidos.
- Persistência: SQLite (`pedidos.db`) com tabelas `orders`, `items` e `users`.
- Autenticação: JWT (rota `POST /login`). Usuário seed `admin` criado pelo script `npm run seed`.
- Validação: `express-validator` aplicada em endpoints de criação e atualização.

Requisitos
- Node.js 18+ (testado com Node 22)

Como rodar localmente
# Desafio: API Pedidos

API simples em Node.js/Express para gerenciar pedidos (orders) com persistência em SQLite.

Sumário
- Endpoints principais: criar, buscar por id, listar, atualizar (valor) e deletar pedidos.
- Autenticação: JWT (rota `POST /login`). Usuário seed `admin` (via `npm run seed`).
- Validação: `express-validator` aplicada nas rotas de criação e atualização.
- Documentação: OpenAPI em `/docs` (Swagger UI).

Requisitos
- Node.js 18+ (recomendado)

Instalação
1. Instale dependências:

```powershell
npm install
```

2. (Opcional) Defina variáveis de ambiente:

- `SECRET_KEY` — chave secreta para JWT (recomendado)
- `SEED_USERNAME` / `SEED_PASSWORD` — credenciais do usuário seed (opcional)

Exemplo (PowerShell):

```powershell
$env:SECRET_KEY = 'troque_esta_chave'
$env:SEED_PASSWORD = '123456'
```

Criar usuário seed

```powershell
npm run seed
```

Iniciar servidor

```powershell
npm start
```

Documentação (Swagger)
- Ao rodar a aplicação localmente, abra: `http://localhost:3000/docs`

Autenticação
- Para acessar rotas protegidas, faça login em `POST /login` com JSON:

```json
{
  "username": "admin",
  "password": "123456"
}
```

Exemplo: obter token (PowerShell)

```powershell
#$resp = Invoke-RestMethod -Method POST -Uri http://localhost:3000/login -Body (ConvertTo-Json @{ username='admin'; password='123456' }) -ContentType 'application/json'
#$token = $resp.token
```

Exemplos de uso (cURL)

- Criar pedido (POST /order)

```bash
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089016vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }
    ]
  }'
```

- Buscar pedido por id (GET /order/:id)

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/order/v10089016vdb-01
```

Observações para PowerShell
- `Invoke-RestMethod` lança exceção em respostas HTTP não-2xx; use `try/catch` para capturar o corpo de erro. Exemplo resumido:

```powershell
try {
  $resp = Invoke-RestMethod -Method GET -Uri http://localhost:3000/order/v10089016vdb-01 -Headers @{ Authorization = "Bearer $token" }
  Write-Output ($resp | ConvertTo-Json -Depth 5)
} catch {
  $webExc = $_.Exception
  if ($webExc.Response -ne $null) {
    $reader = New-Object System.IO.StreamReader($webExc.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Output "Erro HTTP: $body"
  } else {
    Write-Output "Erro inesperado: $($webExc.Message)"
  }
}
```

Testes

- O projeto inclui um teste unitário básico para `OrderService.create` usando Jest.

```powershell
npm test
```

Notas técnicas e boas práticas
- A criação de `order` + `items` é feita de forma atômica (transação) para evitar inconsistências.
- Senhas são armazenadas com `bcryptjs` e a autenticação usa JWT (`jsonwebtoken`).
- Para projetos reais, recomenda-se usar migrations (por exemplo `knex` ou `sequelize`) em vez de criar esquema inline.

Contribuição
- Abra uma issue ou envie um Pull Request com alterações claras e testes quando aplicável.

Licença
- MIT (se desejar, ajuste conforme necessário)

---

Arquivo(s) alterados nesta etapa: `README.md` (conteúdo refatorado para apresentação profissional).
