# 📚 AvaliaProf — Backend (NestJS & Prisma) - Grupo 8

API REST para a plataforma AvaliaProf, responsável por autenticação, avaliações, comentários e gerenciamento de usuários, professores e disciplinas.

---

## ✨ Visão Geral

Este repositório contém o **backend** do AvaliaProf, desenvolvido em [NestJS](https://nestjs.com/) com [Prisma ORM](https://www.prisma.io/). Ele fornece endpoints RESTful para todas as funcionalidades do sistema, incluindo autenticação, avaliações, comentários, cadastro e gerenciamento de usuários, professores e disciplinas.

---

## 🛠️ Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/) ou [SQLite](https://www.sqlite.org/)
- [JWT](https://jwt.io/) para autenticação
- [bcrypt](https://www.npmjs.com/package/bcrypt) para hash de senhas

---

## 🧩 Funcionalidades

- Cadastro e login de usuários
- Avaliação de professores e disciplinas
- Sistema de comentários e interações
- Listagem e busca de avaliações
- Filtros e ordenações por disciplina, professor e avaliação
- Painel pessoal para gerenciar avaliações e comentários
- Edição e exclusão de avaliações e perfil
- Página de perfil de usuário e professor
- Validação de dados e autenticação JWT

---

## 📦 Como Rodar o Projeto

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL ou SQLite
- Yarn ou npm

### 1. Clone o repositório

```bash
git clone https://github.com/neatzzy/PT-CJR-2025.1-G8.git
cd PT-CJR-2025.1-G8/Back-PT-CJR-2025.1-G8
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Crie um arquivo `.env` na raiz do backend com as variáveis necessárias:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/avaliaprof"
JWT_SECRET="sua_chave_secreta"
```

### 4. Rode as migrações do banco de dados

```bash
npx prisma migrate dev
```

### 5. Inicie a aplicação

```bash
# Em modo desenvolvimento
npm run start:dev

# Em modo produção
npm run start:prod
```

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes end-to-end
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---

## 🌐 Integração com o Frontend

O frontend do AvaliaProf está disponível em:  
🔗 [https://front-pt-cjr-2025-1-g8.onrender.com/](https://front-pt-cjr-2025-1-g8.onrender.com/)

---

## 👨‍💻 Desenvolvido por

- [Rafael Ximenes](https://github.com/rmxvgit) (Orientador)
- [Élvis Miranda](https://github.com/neatzzy)
- [Guilherme Delmonte](https://github.com/guilhermedelm)
- [Márcio Vieira](https://github.com/marcinv07)
- [Vitor Guedes](https://github.com/VitorGuedes22)

---

Projeto finalizado com sucesso! 🎉
