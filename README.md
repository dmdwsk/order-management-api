
# Order Management API

Backend service for managing orders and their status history.  
Built with **Node.js**, **Express**, **TypeScript**, **MongoDB (Mongoose)**.

---

## 📦 Features

- Order status history (`entity3`)
- Integration with external **Entity1 service**
- Input validation and consistent API errors
- Integration tests with:
    - **Jest**
    - **Supertest**
    - **MongoDB Memory Server**
    - **Fake Entity1 HTTP stub**

---

## 🧱 Tech Stack

- Node.js
- TypeScript (ESM / NodeNext)
- Express
- MongoDB + Mongoose
- Jest + ts-jest
- Supertest

---

## 📁 Project Structure (relevant)

src/
├── app.ts
├── order-status-history/
│ ├── orderStatusHistory.model.ts
│ ├── orderStatusHistory.service.ts
│ ├── orderStatusHistory.router.ts
│ └── test/
│ └── orderStatusHistory.int.test.ts
└── test/
├── mongoMemory.ts
└── fakeEntity1Server.ts

jest.config.ts
tsconfig.json
tsconfig.jest.json


---

## 🚀 API Endpoints

### POST `/api/entity3`
Create a new order status history entry.

**Body:**
```json
{
  "entity1Id": "order-123",
  "status": "NEW",
  "time": "2025-01-02T10:20:30.000Z",
  "note": "created"
}
```
time is optional (auto-generated if missing)

Validates existence of Entity1 via external service

### GET `/api/entity3`

Get order status history by entity1Id.

Query params:

 - entity1Id (required)
 - from (default: 0)
 - size (default: 20)

### POST `/api/entity3/_counts`

Get counts of history records per entity1Id.

Body:
```json
{
  "entity1Ids": ["a", "b", "c"]
}
```
Returns counts including zero values.

⚠️Error Handling

All errors are returned in a unified format:

```json
{
  "message": "Entity1 does not exist",
  "code": "ENTITY1_NOT_FOUND",
  "details": null
}
```
Handled via a custom ApiError + Express error middleware.

🧪 Integration Tests

- Integration tests cover:

- Happy paths

- Validation errors

- External service failures

- Pagination & sorting

- Aggregation logic

- Test setup includes:

- MongoDB Memory Server (no real DB required)

- Fake Entity1 HTTP server

- Real Express app instance

▶️ Running Tests

Install dependencies:
````
npm install
````
Run all tests:
````
npm test
````
Run a specific integration test:
````
npm test -- src/order-status-history/test/orderStatusHistory.int.test.ts --runInBand
````
