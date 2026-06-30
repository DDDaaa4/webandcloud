let currentMatch = null;
let selectedResult = 'home';

function getResultText(result) {
    if (!currentMatch) return '';
    if (result === 'home') return `${currentMatch.homeTeam} Win`;
    if (result === 'away') return `${currentMatch.awayTeam} Win`;
    return 'Draw';
}

function selectResult(result) {
    selectedResult = result;
    document.querySelectorAll('.choice-box').forEach(button => {
        button.classList.toggle('selected', button.dataset.result === result);
    });
    const label = document.getElementById('selectionLabel');
    if (label) label.textContent = getResultText(result);
    updatePossiblePoints();
}

function updatePossiblePoints() {
    const input = document.getElementById('confidenceInput');
    const possiblePoints = document.getElementById('possiblePoints');
    if (!input || !possiblePoints) return;

    let value = Number(input.value);
    if (!Number.isInteger(value) || value < 1) value = 1;
    if (value > 10) value = 10;
    input.value = value;
    possiblePoints.textContent = `${value} points`;
}

function renderPredictionCard() {
    const card = document.getElementById('predictionCard');
    if (!card || !currentMatch) return;

    card.innerHTML = `
        <h3>Match ${currentMatch.matchNum}</h3>
        <div class="team-row">
            <div class="team-box">
                ${currentMatch.homeTeam}
                <img src="${currentMatch.homeFlag}" alt="${currentMatch.homeTeam}">
            </div>
            <div class="vs">VS</div>
            <div class="team-box">
                ${currentMatch.awayTeam}
                <img src="${currentMatch.awayFlag}" alt="${currentMatch.awayTeam}">
            </div>
        </div>
        <div class="match-date">${new Date(currentMatch.matchDate).toLocaleDateString()}</div>
        <div class="choice-container">
            <button class="choice-box selected" data-result="home" onclick="selectResult('home')">${currentMatch.homeTeam} Win</button>
            <button class="choice-box" data-result="draw" onclick="selectResult('draw')">Draw</button>
            <button class="choice-box" data-result="away" onclick="selectResult('away')">${currentMatch.awayTeam} Win</button>
        </div>
        <div class="bet-pill-container">
            <div class="bet-label">Selection</div>
            <div class="bet-pill" id="selectionLabel">${currentMatch.homeTeam} Win</div>
            <div class="bet-label">Confidence points</div>
            <div class="bet-pill"><input type="number" id="confidenceInput" min="1" max="10" value="5" oninput="updatePossiblePoints()"></div>
            <div class="bet-label">Possible points</div>
            <div class="bet-pill" id="possiblePoints">5 points</div>
        </div>
    `;
}

async function loadPredictionPage() {
    if (!getToken()) {
        showMessage('messageBox', 'You must login before submitting a prediction.', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const matchId = params.get('id');

    if (!matchId) {
        showMessage('messageBox', 'Missing match id.', 'error');
        return;
    }

    try {
        showMessage('messageBox', 'Loading match...', 'info');
        const data = await apiRequest(`/matches/${matchId}`);
        currentMatch = data.match;
        renderPredictionCard();
        hideMessage('messageBox');
    } catch (error) {
        showMessage('messageBox', error.message, 'error');
    }
}

async function submitPrediction() {
    if (!currentMatch) return;

    const confidencePoints = Number(document.getElementById('confidenceInput')?.value);
    if (!Number.isInteger(confidencePoints) || confidencePoints < 1 || confidencePoints > 10) {
        showMessage('messageBox', 'Confidence points must be a number between 1 and 10.', 'error');
        return;
    }

    try {
        showMessage('messageBox', 'Submitting prediction...', 'info');
        await apiRequest('/predictions', {
            method: 'POST',
            body: JSON.stringify({
                matchId: currentMatch._id,
                selectedResult,
                confidencePoints
            })
        });
        showMessage('messageBox', 'Prediction submitted successfully.', 'success');
        setTimeout(() => window.location.href = 'my-predictions.html', 900);
    } catch (error) {
        showMessage('messageBox', error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadPredictionPage);
