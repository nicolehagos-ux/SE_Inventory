# 🏪 Inventory Management REST API

A simple Inventory Management API built with Node.js, Express, and MongoDB Atlas, deployed on Render.
This API supports full CRUD operations for managing products, suppliers, and orders.

# 🌍 Base URL

https://se-inventory.onrender.com


# 📦 Products

| Method     | Endpoint            | Description                  |
| ---------- | ------------------- | ---------------------------- |
| **GET**    | `/api/products`     | Get all products             |
| **GET**    | `/api/products/:id` | Get a specific product by ID |
| **POST**   | `/api/products`     | Create a new product         |
| **PUT**    | `/api/products/:id` | Update an existing product   |
| **DELETE** | `/api/products/:id` | Delete a product             |

# 🚚 Suppliers

| Method     | Endpoint             | Description                   |
| ---------- | -------------------- | ----------------------------- |
| **GET**    | `/api/suppliers`     | Get all suppliers             |
| **GET**    | `/api/suppliers/:id` | Get a specific supplier by ID |
| **POST**   | `/api/suppliers`     | Add a new supplier            |
| **PUT**    | `/api/suppliers/:id` | Update supplier details       |
| **DELETE** | `/api/suppliers/:id` | Remove a supplier             |

# 📦 Orders

| Method     | Endpoint          | Description                                    |
| ---------- | ----------------- | ---------------------------------------------- |
| **GET**    | `/api/orders`     | Get all orders                                 |
| **GET**    | `/api/orders/:id` | Get a specific order by ID                     |
| **POST**   | `/api/orders`     | Create a new order                             |
| **PUT**    | `/api/orders/:id` | Update an existing order (e.g., change status) |
| **DELETE** | `/api/orders/:id` | Delete an order                                |

# 🧰 Tech Stack

* Node.js + Express

* MongoDB Atlas

* Mongoose

* Render (hosting)

* dotenv for environment configuration

* morgan for request logging
