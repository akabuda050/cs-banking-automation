# CS online banking automation app

# Start API

```bash
node api.js
```

# Request tokens

In order to export transactions you need obtain `web-api-key` and `authorization` tokens first.

To do so, make POST request to `/cs/auth` with your account info.

```bash
curl -X POST http://localhost:3000/cs/auth \
    -H "Content-Type: application/json" \
    -d '{"account_number": "YOUR_ACCOUNT_NUMBER", "account_day": "10", "account_month": "01"}'
```

While login you will see date and code like `[ '01.01.2024 00:00:00', 'XXXX-1234' ]` so you can verify on mobile if authorization request comes from app.

In response you'll receive short-live tokens which can be used to export transactions for example.

```json
{
    "webApiKey": "...",
    "authorizationBearer": "Bearer ..."
}
```

# Export transactions

Make POST request to `/cs/export/transactions` with tokens in headers and from/to dates in payload.

```bash
curl -X POST http://localhost:3000/cs/export/transactions \
    -H "Content-Type: application/json" \
    -H "Web-Api-Key: ${webApiKey}"
    -H "Authorization: ${authorizationBearer}"
    -d '{"from": "2024-01-01", "to": "2024-01-31"}'
```
