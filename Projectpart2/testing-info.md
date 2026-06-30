# Testing Information

## Project name

World Cup Prediction App

## Homepage / deployed link

Local testing:

```text
http://localhost:5000
```

Deployed version:

```text
ADD_RENDER_LINK_HERE
```

Important note: the project is deployed on Render free tier. The first request may take around 50 seconds if the server is sleeping.

## GitHub

Repository:

```text
https://github.com/DDDaaa4/webandcloud
```

Main branch:

```text
https://github.com/DDDaaa4/webandcloud/tree/main
```

Full project folder:

```text
https://github.com/DDDaaa4/webandcloud/tree/main/Projectpart2
```

Client folder:

```text
https://github.com/DDDaaa4/webandcloud/tree/main/Projectpart2/client
```

Server folder:

```text
https://github.com/DDDaaa4/webandcloud/tree/main/Projectpart2/server
```

Postman collection file:

```text
https://github.com/DDDaaa4/webandcloud/blob/main/Projectpart2/postman/World_Cup_Prediction_API.postman_collection.json
```

Project folder name:

```text
Projectpart2
```

## Figma

```text
https://www.figma.com/design/ymiTd95wGAS9uS2Hilfrid/world-cup-bets?node-id=9-15&t=VynulfaYnkF4tly7-0
```

## Postman

The Postman collection is included in the project here:

```text
Projectpart2/postman/World_Cup_Prediction_API.postman_collection.json
```

GitHub link to the Postman collection:

```text
https://github.com/DDDaaa4/webandcloud/blob/main/Projectpart2/postman/World_Cup_Prediction_API.postman_collection.json
```

Published Postman documentation:

```text
https://documenter.getpostman.com/view/41761358/2sBXwyHnMU
```

The collection includes:

- Auth routes
- Match routes
- Prediction CRUD routes
- Leaderboard route
- External API route
- Success examples
- Error examples
- Two main user flows

## External API used

Open-Meteo Geocoding API is used through the backend route:

```text
GET /api/external/country/:name
```

Example:

```text
GET /api/external/country/Mexico
```

The frontend uses this route when the user clicks a team in the Featured Matches screen.

Returned data includes:

- Country
- Capital / city
- Country code
- Timezone
- Latitude
- Longitude

## JavaScript library used

Chart.js is used on `leaderboard.html` to visualize the top users in the leaderboard.

## Database

MongoDB Atlas is used as the cloud database.

The project uses Mongoose models for:

- Users
- Matches
- Predictions

## Environment variables

Create a `.env` file inside:

```text
Projectpart2/server
```

Use `.env.example` as the template.

Required variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5000
```

For Render deployment, environment variables are added inside the Render dashboard, not pushed to GitHub.

## How to run locally

From the project root:

```bash
cd Projectpart2/server
npm install
npm run seed
npm run dev
```

Then open:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "World Cup Prediction API is running"
}
```

## Main test user flow

1. Open the homepage.
2. Register a new user.
3. Login.
4. Go to Featured Matches.
5. Search or filter matches.
6. Click a team to test the external API.
7. Submit a prediction.
8. Go to My Predictions.
9. Update the prediction.
10. Delete the prediction.
11. Submit another prediction.
12. Go to Leaderboard and verify the ranking/chart updates.

## Important notes for checking

- The app should not be tested only through localhost. A deployed Render link is required.
- If the deployed site loads slowly at first, wait around 50 seconds because Render free tier may wake the server from sleep.
- If matches do not appear, run `npm run seed` from `Projectpart2/server`.
- Do not upload `.env` or `node_modules` to GitHub.