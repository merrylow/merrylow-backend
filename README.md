# Merrylow Backend

This is the backend for **Merrylow**, a food ordering and delivery platform. It handles all authentication, product listing, security measures, and core backend logic.

> ⚠️ **Note:** Still in active development.

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL installed and running
- Google Cloud OAuth 2.0 credentials
- A working email service (nodemaile with Gmail)

---

## 🌐 Live Deployment

**Production API:**  
[https://merrylow-backend-production.up.railway.app/](https://merrylow-backend-production.up.railway.app/)

### Local Development
```bash
# Clone repository
git clone https://github.com/merrylow/merrylow-backend.git
cd merrylow-backend

# Install dependencies
npm install

# Setup environment (contact @ziglacity for .env)
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma migrate dev --name init

# Start server
npm run dev

---


```
### 📬 Maintainer
Developed & maintained by [ZiglaCity](https://github.com/ziglacity).
For the .env file or any support, contact via GitHub. 💖MerryLow
