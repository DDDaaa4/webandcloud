# Testing Information

## External API used

REST Countries API through the backend route:

```text
GET /api/external/country/:name
```

The frontend uses this when the user clicks a team in the Featured Matches screen.

## JavaScript library used

Chart.js is used on `leaderboard.html` to visualize the top users.

## Important notes for checking

1. Run `npm install` inside `server`.
2. Create `.env` based on `.env.example`.
3. Run `npm run seed` before testing matches.
4. Run `npm run dev`.
5. Open `http://localhost:5000`.
6. Register a user, go to Featured Matches, submit a prediction, then check My Predictions and Leaderboard.

## Test user flow

1. Register new user.
2. Search for a team in Featured Matches.
3. Click a team to test the external API.
4. Submit a prediction.
5. Update the prediction in My Predictions.
6. Delete the prediction.
7. Submit another prediction and check Leaderboard.
