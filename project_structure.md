# 📁 Verre server - Project Structure

*Generated on: 11/2/2025, 6:08:19 PM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 36 |
| 📁 Total Folders | 7 |
| 🌳 Max Depth | 2 levels |
| 🛠️ Tech Stack | Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🔵 ▲ **vercel.json** - Vercel config

## 📊 File Statistics

### By File Type

- 📜 **.js** (JavaScript files): 28 files (77.8%)
- ⚙️ **.json** (JSON files): 3 files (8.3%)
- 📖 **.md** (Markdown files): 2 files (5.6%)
- 📄 **.example** (Other files): 2 files (5.6%)
- 🚫 **.gitignore** (Git ignore): 1 files (2.8%)

### By Category

- **JavaScript**: 28 files (77.8%)
- **Config**: 3 files (8.3%)
- **Docs**: 2 files (5.6%)
- **Other**: 2 files (5.6%)
- **DevOps**: 1 files (2.8%)

### 📁 Largest Directories

- **root**: 36 files
- **functions**: 22 files
- **functions\controllers**: 5 files
- **functions\routes**: 5 files
- **functions\config**: 4 files

## 🌳 Directory Structure

```
Verre server/
├── 🟡 🚫 **.gitignore**
├── 📜 abc.js
├── 📜 api.js
├── 📜 data.js
├── 📖 EMAIL_SETUP.md
├── 📄 env.example
├── 📄 env.secure.example
├── 📂 functions/
│   ├── ⚙️ config/
│   │   ├── 📜 db.js
│   │   ├── 📜 emailService.js
│   │   ├── 📜 firebase.js
│   │   └── 📜 paymentConfig.js
│   ├── 📂 controllers/
│   │   ├── 📜 cartController.js
│   │   ├── 📜 orderController.js
│   │   ├── 📜 paymentController.js
│   │   ├── 📜 productController.js
│   │   └── 📜 userController.js
│   ├── 📂 middleware/
│   │   ├── 📜 authMiddleware.js
│   │   ├── 📜 errorMiddleware.js
│   │   └── 📜 rateLimitMiddleware.js
│   ├── 📂 models/
│   │   ├── 📜 abc.js
│   │   ├── 📜 orderModel.js
│   │   ├── 📜 productModel.js
│   │   └── 📜 userModel.js
│   ├── 📂 routes/
│   │   ├── 📜 cartRoutes.js
│   │   ├── 📜 orderRoute.js
│   │   ├── 📜 paymentRoutes.js
│   │   ├── 📜 productRoute.js
│   │   └── 📜 userRoutes.js
│   └── 🔧 utils/
│   │   └── 📜 generateToken.js
├── 📜 orderSeeeder.js
├── 🟡 🔒 **package-lock.json**
├── 🔴 📦 **package.json**
├── 📖 PAYMENT_SETUP.md
├── 📜 seeder.js
├── 📜 userSeeder.js
└── 🔵 ▲ **vercel.json**
```

## 📖 Legend

### File Types
- 🚫 DevOps: Git ignore
- 📜 JavaScript: JavaScript files
- 📖 Docs: Markdown files
- 📄 Other: Other files
- ⚙️ Config: JSON files

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
