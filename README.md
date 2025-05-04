# API

## 🚀 Introduction

This boilerplate provides a structured and scalable Fastify API setup, utilizing TypeScript, Prisma, and modular design principles. It includes authentication, validation, and plugin-based architecture to ensure maintainability and efficiency.

## 📂 Folder Structure

```
project-root/
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── controllers/       # Route handlers
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic (e.g., UserService)
│   ├── plugins/           # Fastify plugins (e.g., Prisma, JWT, CORS)
│   ├── index.ts           # Entry point
│
├── types/                 # Global TypeScript types
├── test/                 # Unit and integration tests
├── dist/                  # Compiled output (after build)
│
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── Dockerfile             # Multi-stage Docker build
├── README.md              # Documentation

```

## 🛠️ Features

- Fastify Framework – High-performance backend framework

- TypeScript Support – Strongly typed development

- Prisma ORM – Database interaction with PostgreSQL, MySQL, etc.

- JWT Authentication – Secure user authentication

- Modular Structure – Scalability and maintainability

- Validation – Built-in schema validation using Fastify

- Docker Support – Production-ready containerization
