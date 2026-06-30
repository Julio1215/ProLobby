<div align="center">

# 🎮 ProLobby

**Hub Gamer Completo — Notícias · QCD · Reviews · Fichas RPG · Comunidade**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io)

</div>

---

## 📖 Sobre

ProLobby é um hub gamer full-stack com:

- **Notícias Gamer** — Feed curado de games, RPG, esports e indústria
- **QCD Score** — Sistema proprietário de Qualidade-Custo-Diversão para avaliar jogos
- **Fichas RPG** — Criação e compartilhamento de fichas para D&D 5e, Tormenta 20, Call of Cthulhu e Ordem Paranormal
- **Comunidade** — Posts, reviews, screenshots e artworks
- **Sistema de Usuários** — Autenticação, perfis e avatares

---

## 🏗️ Arquitetura

```
ProLobby/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Auth, error handling
│   │   ├── routes/          # API routes
│   │   └── config/          # DB, uploads, swagger
│   └── prisma/              # Schema e migrations
│
└── frontend/                # React + Vite
    └── src/
        ├── components/
        │   ├── layout/      # Navbar, Sidebar, Layout
        │   ├── pages/       # Dashboard, News, RPG...
        │   ├── rpg/         # Fichas por sistema
        │   ├── community/   # Posts e cards
        │   └── ui/          # Toast, Skeleton, DiceWidget
        ├── services/        # API client (axios)
        ├── store/           # Zustand (auth, theme)
        └── utils/           # Helpers
```

---

## 🚀 Setup Local

### Pré-requisitos

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### 1. Clone e instale

```bash
git clone https://github.com/seu-usuario/prolobby.git
cd prolobby

# Instalar tudo de uma vez
npm install
```

### 2. Configure variáveis de ambiente

```bash
# Backend
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Configure o banco de dados

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate

# Opcional: seed inicial
node prisma/seed.js
```

### 4. Execute

```bash
# Da raiz do projeto (roda backend + frontend juntos)
npm run dev

# Ou separadamente:
cd backend && npm run dev    # API em http://localhost:3001
cd frontend && npm run dev   # UI em http://localhost:5173
```

---

## 🐳 Docker

```bash
# Sobe tudo com um comando
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f backend
```

---

## 📡 API

Documentação interativa disponível em:
```
http://localhost:3001/api/docs
```

### Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Login |
| GET | `/api/news` | Notícias gamer |
| GET | `/api/qcd/ranking` | Ranking QCD |
| GET/POST | `/api/rpg/characters` | Fichas RPG |
| GET/POST | `/api/community` | Posts da comunidade |

---

## 🚢 Deploy

### Railway (Recomendado)

1. Conecte o repositório no [Railway](https://railway.app)
2. Adicione um serviço PostgreSQL
3. Configure as variáveis de ambiente (veja `.env.example`)
4. Deploy automático a cada push na `main`

### Variáveis obrigatórias no deploy

```env
DATABASE_URL=    # URL do PostgreSQL
JWT_SECRET=      # Chave secreta (min 32 chars)
NODE_ENV=production
FRONTEND_URL=    # URL do frontend deployado
```

---

## 🎮 Funcionalidades

### QCD Score
Sistema exclusivo que calcula o valor de um jogo baseado em:
- **Qualidade**: Score do Metacritic
- **Custo**: Preço atual na Steam
- **Diversão**: Horas de gameplay (HowLongToBeat)

### Fichas RPG
Suporte completo para:
- **D&D 5e** — Atributos, habilidades, magias, equipamentos
- **Tormenta 20** — Ficha completa do sistema brasileiro
- **Call of Cthulhu** — Investigadores, sanidade, ocupações
- **Ordem Paranormal** — Agentes, NEX, rituais

### Exportação PDF
Todas as fichas podem ser exportadas em PDF com visual profissional.

---

## 🛠️ Stack Técnica

**Backend:**
- Express.js + express-async-errors
- Prisma ORM + PostgreSQL
- JWT Authentication (bcryptjs)
- Multer (upload de arquivos)
- Helmet + CORS + Rate Limiting
- Swagger UI

**Frontend:**
- React 19 + Vite 8
- React Router v7
- TanStack Query v5
- Zustand (state management)
- Tailwind CSS v4

---

## 📝 Licença

MIT — Veja [LICENSE](LICENSE) para detalhes.
