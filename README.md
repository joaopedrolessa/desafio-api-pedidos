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
1. Instale dependências:

```powershell
npm install
```

2. (Opcional) Defina variáveis de ambiente:
- `SECRET_KEY` — chave secreta para JWT (recomendado)
- `SEED_USERNAME` / `SEED_PASSWORD` — usuário e senha do seed (opcional)

Exemplo (PowerShell):

```powershell
$env:SECRET_KEY = 'troque_esta_chave'
$env:SEED_PASSWORD = '123456'
```

3. Criar usuário seed (executa apenas se usuário não existir):

```powershell
npm run seed
```

4. Iniciar servidor:

```powershell
npm start
```

Endpoints principais

- GET /docs (Swagger UI) — documentação interativa da API

- POST /login
  - Body: `{ "username": "admin", "password": "123456" }`
  - Retorna: `{ user, token }`

- POST /order (protected)
  - Headers: `Authorization: Bearer <token>`
  - Body de exemplo:

```json
{
  "numeroPedido": "v10089016vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.529Z",
  "items": [
    { "idItem": "2434", "quantidadeItem": 1, "valorItem": 1000 }
  ]
}
```

- GET /order/:id (protected)
- GET /order/list (protected)
- PUT /order/:id (protected) — atualiza `valorTotal` (campo `valorTotal` no body)
- DELETE /order/:id (protected)

Observações técnicas e melhorias possíveis
- A criação de `order` + `items` é atômica (transação) — implementado para evitar inconsistências.
- A autenticação está implementada com `users` no SQLite e `bcryptjs` para hashing de senha.
- Recomenda-se usar migrations (ex.: `knex`) em projetos reais e remover inicialização inline do schema.
- Para avaliações: adicione testes automatizados (Jest) e publique o repositório no GitHub com commits claros.

Testes manuais rápidos (PowerShell)

1) Obter token:

```powershell
$resp = Invoke-RestMethod -Method POST -Uri http://localhost:3000/login -Body (ConvertTo-Json @{ username='admin'; password='123456' }) -ContentType 'application/json'
$token = $resp.token

# Criar order usando token
$body = @{ numeroPedido = 'v10089016vdb-01'; valorTotal = 10000; dataCriacao = '2023-07-19T12:24:11.529Z'; items = @(@{ idItem='2434'; quantidadeItem=1; valorItem=1000 }) } | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method POST -Uri http://localhost:3000/order -Body $body -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
```

Entrega
- Se quiser, posso criar uma branch, commitar as mudanças e preparar a mensagem de PR. Quando quiser, diga o nome da branch — ou eu uso `chore/finish-evaluation`.

---

Arquivo(s) alterados nesta etapa: comentários/todos, validações, autenticação, transação, seed.
