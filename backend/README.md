# 🎮 HUB GAMER — Backend

API completa do HUB GAMER. Node.js + Express + PostgreSQL + Prisma.

---

## ⚡ Setup Rápido (5 minutos)

### 1. Banco de dados gratuito no Neon

1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um projeto chamado `hub-gamer`
3. Copie a **Connection String** (formato: `postgresql://...`)

### 2. APIs gratuitas necessárias

| API | Link | O que faz |
|-----|------|-----------|
| GNews | [gnews.io](https://gnews.io) | Notícias gaming |
| Currents | [currentsapi.services](https://currentsapi.services) | Fallback notícias |
| RAWG | [rawg.io/apidocs](https://rawg.io/apidocs) | Dados de jogos |
| IGDB | [dev.twitch.tv](https://dev.twitch.tv/console) | Reviews (conta Twitch) |

> CheapShark e HowLongToBeat **não precisam de chave API**.

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas chaves
```

### 4. Instalar e rodar

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

### 5. Verificar

- API: http://localhost:3001/health
- Docs: http://localhost:3001/api/docs

---

## 📁 Estrutura

```
backend/
├── prisma/
│   ├── schema.prisma       # Todas as tabelas
│   └── seed.js             # Dados iniciais
└── src/
    ├── server.js           # Entrada da aplicação
    ├── config/
    │   ├── database.js     # Prisma client singleton
    │   └── swagger.js      # Config da documentação
    ├── middlewares/
    │   ├── auth.middleware.js   # JWT: authenticate, requireRole
    │   ├── errorHandler.js      # Erros globais + validate()
    │   └── notFound.js          # 404 handler
    ├── controllers/
    │   └── auth.controller.js   # Register, login, me, reset
    ├── routes/
    │   ├── auth.routes.js       ✅ Pronto
    │   ├── news.routes.js       ✅ Pronto
    │   ├── qcd.routes.js        ✅ Pronto
    │   ├── user.routes.js       🔧 Em desenvolvimento
    │   ├── games.routes.js      🔧 Em desenvolvimento
    │   ├── reviews.routes.js    🔧 Em desenvolvimento
    │   ├── rpg.routes.js        🔧 Em desenvolvimento
    │   └── admin.routes.js      🔧 Em desenvolvimento
    └── services/
        ├── news.service.js      ✅ Pronto (GNews + Currents + cache)
        └── qcd.service.js       ✅ Pronto (RAWG + CheapShark + HLTB)
```

---

## 🚀 Deploy no Railway (gratuito)

1. Crie conta em [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Adicione as variáveis do `.env` no painel do Railway
4. Na aba "Settings" → Start command: `npm start`

O Railway detecta automaticamente Node.js e faz o deploy.

---

## 🔒 Segurança implementada

- ✅ JWT com expiração configurável
- ✅ Bcrypt (custo 12) para senhas
- ✅ Rate limiting global (100 req/15min)
- ✅ Rate limiting de auth (10 req/15min)
- ✅ Helmet (headers HTTP seguros)
- ✅ CORS configurado por origem
- ✅ Sanitização de inputs (express-validator)
- ✅ Proteção contra SQL injection (Prisma ORM)
- ✅ Erros sem stack trace em produção
