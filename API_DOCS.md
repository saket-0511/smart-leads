# Smart Leads API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "sales"          // optional: "admin" | "sales" (default: "sales")
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales" }
  }
}
```

---

### POST /auth/login
Login and receive JWT.

**Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Response 200:**
```json
{
  "success": true,
  "data": { "token": "<jwt>", "user": { ... } }
}
```

---

### GET /auth/me 🔒
Get current authenticated user.

**Response 200:**
```json
{
  "success": true,
  "data": { "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }
}
```

---

## Leads Endpoints

All leads endpoints require authentication (`🔒`).

### GET /leads 🔒
Get paginated leads list with optional filters.

**Query Params:**

| Param    | Type   | Values                              | Default  |
|----------|--------|-------------------------------------|----------|
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` | —    |
| `source` | string | `Website`, `Instagram`, `Referral`  | —        |
| `search` | string | any string (searches name + email)  | —        |
| `sort`   | string | `latest`, `oldest`                  | `latest` |
| `page`   | number | any positive integer                | `1`      |
| `limit`  | number | 1–50                                | `10`     |

**Response 200:**
```json
{
  "success": true,
  "data": [ { "_id": "...", "name": "...", "email": "...", "status": "New", "source": "Website", "notes": "...", "createdBy": {...}, "createdAt": "...", "updatedAt": "..." } ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

> **Note:** Sales users only see leads they created. Admins see all.

---

### GET /leads/export/csv 🔒
Download all leads as a CSV file.

**Response:** `text/csv` file download

---

### GET /leads/:id 🔒
Get a single lead by ID.

**Response 200:**
```json
{ "success": true, "data": { ... } }
```

---

### POST /leads 🔒
Create a new lead.

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",           // optional, default: "New"
  "source": "Instagram",     // required
  "notes": "Met at event"    // optional
}
```

**Response 201:**
```json
{ "success": true, "message": "Lead created successfully", "data": { ... } }
```

---

### PUT /leads/:id 🔒
Update a lead. All fields optional.

**Body:** (any subset of lead fields)
```json
{ "status": "Qualified", "notes": "Very interested" }
```

> Sales users can only update their own leads.

---

### DELETE /leads/:id 🔒 (Admin only)
Delete a lead permanently.

**Response 200:**
```json
{ "success": true, "message": "Lead deleted successfully" }
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": "Human readable error message",
  "details": [                          // only on validation errors
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

**HTTP Status Codes:**

| Code | Meaning                  |
|------|--------------------------|
| 200  | OK                       |
| 201  | Created                  |
| 400  | Bad Request / Validation |
| 401  | Unauthorized             |
| 403  | Forbidden                |
| 404  | Not Found                |
| 500  | Internal Server Error    |

---

## Role Permissions Summary

| Action              | Admin | Sales User          |
|---------------------|-------|---------------------|
| View all leads      | ✅    | ❌ (own leads only) |
| Create lead         | ✅    | ✅                  |
| Update any lead     | ✅    | ❌ (own only)       |
| Delete lead         | ✅    | ❌                  |
| Export CSV          | ✅    | ✅ (own leads)      |
