# LILBEE-LOGICS

<div align="center">

![Node Version](https://img.shields.io/badge/node-18.x-green.svg)
![Express](https://img.shields.io/badge/express-4.x-blue.svg)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-orange.svg)](https://firebase.google.com/)

</div>

-

## 📖 Overview

LILBEE-LOGICS is a dynamic web application built with Node.js and Express that serves as a comprehensive feedback and maintenance management system. The platform provides user authentication, feedback submission, maintenance status tracking, and administrative dashboard capabilities. Originally designed as a static site, this version leverages Firebase Firestore for real-time data persistence and Firebase Authentication for secure user management.

The application features a clean, responsive interface for end-users to submit feedback, check maintenance status, and access help resources, while providing administrators with a dashboard to manage and analyze submissions.

# ✨ Features

- **🔐 User Authentication** - Secure signup and login functionality using Firebase Authentication
- **📝 Feedback Management** - Structured feedback forms with automatic categorization and storage
- **🖥️ Admin Dashboard** - Centralized interface for managing user feedback and system status
- **🔧 Maintenance Tracking** - Real-time maintenance status updates and history
- **📄 Legal Compliance** - Built-in privacy policy and terms of service pages
- **⚡ Real-time Database** - Firebase Firestore integration for instant data synchronization
- **🎨 Responsive Design** - Mobile-friendly interface with custom CSS styling
- **🔄 Local Development** - Seed scripts and local database utilities for testing

-

## 🚀 Installation

# Prerequisites
- Node.js 18.x+
- npm 9.x+ or yarn
- Firebase account (for production deployment)

# Local Setup

```bash
# Clone the repository
git clone https://github.com/superomosh94/LILBEE-LOGICS.git
cd LILBEE-LOGICS

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase configuration

# Run development server
npm run dev
```

# Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

-

## 📘 Usage

# Starting the Server

```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

# API Endpoints

# Authentication
```javascript
// Signup
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

# Feedback
```javascript
// Submit feedback
POST /api/feedback
{
  "type": "bug",
  "message": "Description of the issue",
  "userId": "user123"
}

// Get all feedback (Admin only)
GET /api/feedback
```

# Firebase Migration

The project includes a migration utility to transition from local storage to Firebase:

```bash
node migrate-to-firebase.js
```

-

## 🛠️ Configuration

# Firebase Setup

Detailed Firebase configuration instructions are available in [FIREBASE-SETUP.md](FIREBASE-SETUP.md). Basic setup:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Generate service account credentials
5. Add credentials to your `.env` file

# Server Configuration

| Option | Environment Variable | Default | Description |
|-|-|-|-|
| Port | `PORT` | `30` | Server listening port |
| Firebase Project ID | `FIREBASE_PROJECT_ID` | `null` | Firebase project identifier |
| Firebase Client Email | `FIREBASE_CLIENT_EMAIL` | `null` | Service account email |
| Firebase Private Key | `FIREBASE_PRIVATE_KEY` | `null` | Service account private key |

-

## 📁 Project Structure

```
LILBEE-LOGICS/
├── config/
│   └── firebase.js          # Firebase initialization and configuration
├── key/                      # Service account keys (not committed)
├── public/                   # Static frontend files
│   ├── dashboard.html        # Admin dashboard interface
│   ├── dashboard.js          # Dashboard functionality
│   ├── feedbackform.html     # User feedback submission
│   ├── help-feedback.html    # Help and support page
│   ├── index.html            # Landing page
│   ├── local-auth.js         # Authentication utilities
│   ├── local-db.js           # Local database simulation
│   ├── login.html            # User login page
│   ├── maintenance.css       # Maintenance page styling
│   ├── maintenance.html      # System status page
│   ├── privacy.html          # Privacy policy
│   ├── script.js             # Global JavaScript utilities
│   ├── seed-local.html       # Local data seeding interface
│   ├── signup.html           # User registration page
│   ├── style.css             # Global stylesheet
│   └── terms.html            # Terms of service
├── FIREBASE-SETUP.md          # Firebase configuration guide
├── migrate-to-firebase.js     # Data migration utility
├── package.json               # Dependencies and scripts
├── server.js                  # Express server entry point
└── vercel.json                # Vercel deployment configuration
```

-

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Test Firebase integration
npm run test:firebase

# Validate frontend assets
npm run validate
```

-

## 🤝 Contributing

We welcome contributions! Please follow these steps:

```bash
# Fork and clone
git clone https://github.com/your-username/LILBEE-LOGICS.git
cd LILBEE-LOGICS

# Install dependencies
npm install

# Create a branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m 'Add amazing feature'

# Run tests and linting
npm test
npm run lint

# Push and create PR
git push origin feature/amazing-feature
```

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

-

## 📦 Deployment

# Deploy to Vercel

The project includes a `vercel.json` configuration file for easy deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

# Deploy to Heroku

```bash
# Create Heroku app
heroku create lilbee-logics

# Set environment variables
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set FIREBASE_CLIENT_EMAIL=your-client-email
heroku config:set FIREBASE_PRIVATE_KEY="your-private-key"

# Deploy
git push heroku main
```

-

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

-

## 🙏 Acknowledgments

- Firebase for authentication and database services
- Express.js community for the robust framework
- All contributors and users who provide valuable feedback

-

## 📞 Support

- **Documentation**: [View Docs](https://github.com/superomosh94/LILBEE-LOGICS/wiki)
- **Issues**: [GitHub Issues](https://github.com/superomosh94/LILBEE-LOGICS/issues)
- **Email**: support@lilbeelogics.com

-

## 📊 Project Status

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/superomosh94/LILBEE-LOGICS)
![GitHub last commit](https://img.shields.io/github/last-commit/superomosh94/LILBEE-LOGICS)
![GitHub issues](https://img.shields.io/github/issues/superomosh94/LILBEE-LOGICS)

-

<div align="center">
Made with ❤️ by superomosh94
</div>