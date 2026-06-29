# World Cup Prediction App - Project Part B

This project keeps the visual direction from Part A and upgrades it into a full-stack application for Part B.

The app is no longer a betting app. It is a prediction app: users choose match results and confidence points. No real money, no odds, and no gambling flow.

## Features

- User registration and login with JWT authentication
- Match list loaded dynamically from MongoDB through an Express REST API
- Match search/filter by team and status
- Prediction CRUD:
  - Create prediction
  - Read my predictions
  - Update prediction
  - Delete prediction
- Leaderboard calculated from submitted confidence points
- External API route using REST Countries to show country/team information
- Chart.js leaderboard chart as the required JavaScript library
- Loading, success, error, and no-data messages inside the website
- No `alert`, `confirm`, or `prompt`

## Project structure

```text
Projectpart2/
├── client/
│   ├── index.html
│   ├── signup.html
│   ├── login.html
│   ├── features.html
│   ├── bet.html
│   ├── my-predictions.html
│   ├── leaderboard.html
│   ├── css/
│   ├── js/
│   └── images/
├── server/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── data/
│   └── scripts/
└── postman/
```

## Local setup

### 1. Install server packages

```bash
cd Projectpart2/server
npm install
```

### 2. Create `.env`

Create a file named `.env` inside `Projectpart2/server`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/world_cup_predictions
JWT_SECRET=replace_this_with_a_long_secret
CLIENT_ORIGIN=http://localhost:5500
```

Do not push `.env` to GitHub.

### 3. Seed matches

```bash
npm run seed
```

### 4. Run server

```bash
npm run dev
```

Open:

```text
http://localhost:5000
```

The Express server also serves the client folder, so the project can be deployed as one full-stack app.

## Main API routes

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Matches

```text
GET    /api/matches
GET    /api/matches/:id
POST   /api/matches        admin only
PUT    /api/matches/:id    admin only
DELETE /api/matches/:id    admin only
```

Examples of complex match queries:

```text
GET /api/matches?team=Mexico
GET /api/matches?status=upcoming
GET /api/matches?team=Brazil&status=upcoming
```

### Predictions

```text
POST   /api/predictions
GET    /api/predictions/mine
PUT    /api/predictions/:id
DELETE /api/predictions/:id
```

### Leaderboard

```text
GET /api/leaderboard
```

### External API

```text
GET /api/external/country/:name
```

Example:

```text
GET /api/external/country/Mexico
```

## Git notes

Commit in small steps. Do not upload everything in one final commit.

Recommended commit flow:

```bash
git checkout -b project-part-b
git add .
git commit -m "Prepare client structure for project part B"
git push -u origin project-part-b
```

Then continue with meaningful commits after every real feature.

## Moodle submission notes

Submit:

- ZIP of the project
- deployed homepage link
- Figma link
- GitHub client link
- GitHub server link
- Postman collection link or file
- testing notes
- `.env` only in Moodle if the lecturer asks for it, not on GitHub
