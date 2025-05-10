# 🍽️ Merrylow Backend

This is the backend for **Merrylow**, a food ordering and delivery platform. It handles all authentication, product listing, security measures, and core backend logic.

> ⚠️ **Note:** Still in active development.

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL installed and running
- Google Cloud OAuth 2.0 credentials
- A working email service (e.g., Gmail, Mailtrap)

---

### 📦 Setup

```bash
# 1. Clone the repo
git clone https://github.com/merrylow/merrylow-backend.git
cd merrylow-backend

# 2. Install dependencies
npm install

# 3. Create a .env file
# Create a `.env` file in the project root directory.
# Contact the maintainer (GitHub: @ziglacity) to get a copy of the .env file.
# DO NOT run the project without the environment configuration.

# 4. Generate Prisma client
npx prisma generate

# 5. Run DB migrations
npx prisma migrate dev --name init

# 6. Start the development server
npm run dev


---


```
### 📬 Maintainer
Developed & maintained by [ZiglaCity](https://github.com/ziglacity).
For the .env file or any support, contact via GitHub. 💖MerryLow