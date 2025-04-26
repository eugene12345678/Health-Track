# 🏥 Health Information System (Fullstack)
A Fullstack Health Information System built with Node.js, Express, TypeScript, Prisma ORM, SQLite, and React.js for the frontend.
This system enables doctors to manage health programs and client registrations, enroll clients in programs, search client profiles, and interact with the system through a clean UI.

# 📌 Features
- ✅ Manage health programs (e.g., TB, HIV, Malaria)

- ✅ Register new clients with age and gender

- ✅ Enroll clients into multiple health programs

- ✅ Search clients by name

- ✅ View complete client profiles and enrollment history

- ✅ RESTful API endpoints

- ✅ Fullstack app with React frontend

- ✅ Secure database operations

- ✅ Live deployment on Render

# 🛠 Tech Stack
**Area**	**Technology**
- **Backend**-Node.js, Express, TypeScript, Prisma ORM, SQLite
- **Frontend**-React.js, TypeScript, Tailwind CSS 
- **Deployment**-Render.com, Vercel.com

# 🚀 Live URLs
- 🔗 [Backend API](https://healthtrack-backend-1.onrender.com)

- 🔗 [Frontend App](https://health-track-ashy.vercel.app/)

# 📁 Project Structure
```pgsql
Health-Track/
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   └── index.ts
│   ├── dist/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

# 📦 Installation & Running Locally
1. **Clone the repository**

```bash
git clone https://github.com/eugene12345678/Health-Track.git
cd Health-Track
```

2. **Setup Backend**

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
3. **Setup Frontend**

```bash
npm install
npm run dev
```

# 🔌 Important API Endpoints

| **Method** | **Endpoint**                             | **Purpose**                              |
|------------|------------------------------------------|------------------------------------------|
| POST       | `/api/programs`                          | Create a new health program             |
| POST       | `/api/clients`                           | Register a new client                   |
| POST       | `/api/clients/:clientId/enroll`          | Enroll client in programs               |
| GET        | `/api/clients/search?name={name}`        | Search client by name                   |
| GET        | `/api/clients/:clientId`                 | View client profile                     |

# 📊 Frontend Pages
- **Home** — Overview of the app

- **Programs** — View and create programs

- **Clients** — List, search, register clients

- **Enrollments** — Manage client enrollments

- **Profile** — Detailed view of client profiles

# 🧪 Testing
- Use **Postman**, **Thunder client** or **Insomnia** for backend API testing

- Unit and integration tests can be added with **Jest** (backend) and **React Testing Library** (frontend)

# 🔐 Security Considerations
- Input validation for all backend endpoints

- Error handling for database operations

- Ready for JWT authentication (future upgrade)

- Secure environment variables

# 🧠 Possible Future Improvements
- 🌍 Migrate from SQLite to PostgreSQL

- 🔒 Add full authentication and authorization

- 📄 Auto-generate API docs with Swagger/OpenAPI

- 📈 Create admin dashboard

- 🧪 Add full testing coverage

- 🐳 Dockerize for scalable deployment
