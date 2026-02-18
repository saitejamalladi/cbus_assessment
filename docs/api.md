# API Reference

## Customers Endpoint

Retrieve paginated customer data with optional search.

### GET /customers

#### Query Parameters

- `pageSize` (number, required): Number of items per page (1-100)
- `cursor` (string, optional): Opaque token for pagination (from previous response)
- `q` (string, optional): Case-sensitive search term for full_name or email

#### Success Response (200)

```json
{
  "data": [
    {
      "id": "c_123",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "registrationDate": "2024-10-01T12:00:00Z"
    }
  ],
  "pageSize": 25,
  "hasNext": true,
  "cursor": "eyJMYXN0RXZhbHVhdGVkS2V5IjoiLi4uIn0="
}
```

#### Error Responses

- **400 Validation Error**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "pageSize must be between 1 and 100"
    }
  }
  ```

- **500 Internal Error**
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "Unexpected error"
    }
  }
  ```

#### Examples

Initial load:
```
GET /customers?pageSize=25
```

Search:
```
GET /customers?pageSize=25&q=John
```

Load more:
```
GET /customers?pageSize=25&cursor=eyJMYXN0RXZhbHVhdGVkS2V5IjoiLi4uIn0=&q=John
```

#### Notes

- `cursor` is base64-encoded and should be treated as opaque
- Search is case-sensitive and matches substrings in full_name or email
- Results are ordered by registration date descending (most recent first)
- CORS is enabled for configured origins