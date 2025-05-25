# Merrylow Backend

This is the backend for **Merrylow**, a **campus food delivery** platform designed to streamline ordering, vendor management, and seamless transactions for students and faculty. It ensures **fast access to data using cache-based rendering**, reducing database load and improving response times.

### **Key Features**

**Authentication & User Management** → Secure login, registration, and session handling.  
 **Product Listings & Menus** → Dynamic food items from campus vendors with real-time availability.  
 **Optimized Performance** → Implements **Redis caching** to **reduce API latency**, ensuring instant access to frequently requested data like top vendors and popular orders.  
 **Order Processing & Tracking** → Handles live orders, payment integration, and delivery coordination.  
 **Security Measures** → Protects against **SQL injection, XSS, and unauthorized access**, utilizing industry-standard encryption, secure token handling, and role-based access controls (RBAC).  
 **Vendor & Restaurant Management** → Vendors can update menus, availability, and monitor performance analytics.

### **Security Enhancements**

🔹 **Token-Based Authentication** → Secure JWT tokens for request validation.  
🔹 **Data Encryption** → Sensitive data like passwords and transactions are encrypted using **bcrypt and TLS**.  
🔹 **Rate Limiting & Firewall Protection** → Prevents excessive API abuse and protects endpoints.  
🔹 **Role-Based Access Control (RBAC)** → Ensures vendors, admins, and customers only access permitted resources.

> ⚠️ **Note:** This project is actively under development.

---

## Getting Started

### **Prerequisites**

Ensure your environment meets the following requirements:

- **Node.js** (v16+ recommended)
- **PostgreSQL** installed and running
- **Google Cloud OAuth 2.0 credentials**
- **Email service** (configured via Nodemailer with Gmail)

---

## 🌐 Live Deployment

### **Production API**

The backend is live and accessible at:  
🔗 [https://api.merrylow.com](https://api.merrylow.com)

---

## Local Development

To set up a local development environment:

```bash
# Clone the repository
git clone https://github.com/merrylow/merrylow-backend.git
cd merrylow-backend

# Install dependencies
npm install

# Set up environment variables (request .env file if needed)
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma migrate dev --name init

# Start the development server
npm run dev

---
## API Routes

Below are some of the core API endpoints:

| **Endpoint**      | **Description**                            |
| ----------------- | ------------------------------------------ |
| `/api/auth`       | Handles authentication |
| `/api/refresh`    | Token refresh mechanism                    |
| `/api/users`      | User management routes                     |
| `/api/checkout`   | Payment processing & checkout              |
| `/api/order`      | Order tracking and management              |
| `/api/restaurant` | Restaurant details & operations            |
| `/api/products`   | Product listings & details                 |
| `/api/vendor`     | Vendor profile & business details          |
| `/api/account`    | Account settings & modifications           |
| `/api/cart`       | Shopping cart management                   |
| `/api/webhook`    | Webhook handlers for external integrations |

---

## Maintainer

Developed & maintained by [ZiglaCity](https://github.com/ziglacity).

For environment file access (`.env`) or any support, contact via **GitHub**. 💖 **Merrylow**

---

```
