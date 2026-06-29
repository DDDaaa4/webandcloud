function predictionLabel(prediction) {
    const match = prediction.match;
    if (!match) return prediction.selectedResult;
    if (prediction.selectedResult === 'home') return `${match.homeTeam} Win`;
    if (prediction.selectedResult === 'away') return `${match.awayTeam} Win`;
    return 'Draw';
}

function renderPredictions(predictions) {
    const list = document.getElementById('predictionsList');
    if (!list) return;

    if (!predictions.length) {
        list.innerHTML = '<div class="prediction-card"><h3>No predictions yet</h3><p>Go to Featured Matches and submit your first prediction.</p></div>';
        return;
    }

    list.innerHTML = predictions.map(prediction => {
        const match = prediction.match;
        return `
            <div class="prediction-card">
                <h3>${match.homeTeam} vs ${match.awayTeam}</h3>
                <p><strong>Date:</strong> ${new Date(match.matchDate).toLocaleDateString()}</p>
                <p><strong>Selection:</strong> ${predictionLabel(prediction)}</p>
                <p><strong>Confidence:</strong> ${prediction.confidencePoints} points</p>
                <div class="button-row">
                    <select class="select-input" id="result-${prediction._id}">
                        <option value="home" ${prediction.selectedResult === 'home' ? 'selected' : ''}>${match.homeTeam} Win</option>
                        <option value="draw" ${prediction.selectedResult === 'draw' ? 'selected' : ''}>Draw</option>
                        <option value="away" ${prediction.selectedResult === 'away' ? 'selected' : ''}>${match.awayTeam} Win</option>
                    </select>
                    <input class="input" id="points-${prediction._id}" type="number" min="1" max="10" value="${prediction.confidencePoints}">
                    <button class="btn-secondary" onclick="updatePrediction('${prediction._id}')">Update</button>
                    <button class="btn-danger" onclick="deletePrediction('${prediction._id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

async function loadMyPredictions() {
    if (!getToken()) {
        showMessage('messageBox', 'You must login to view your predictions.', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    try {
        showMessage('messageBox', 'Loading predictions...', 'info');
        const data = await apiRequest('/predictions/mine');
        renderPredictions(data.predictions);
        hideMessage('messageBox');
    } catch (error) {
        showMessage('messageBox', error.message, 'error');
    }
}

async function updatePrediction(predictionId) {
    const selectedResult = document.getElementById(`result-${predictionId}`).value;
    const confidencePoints = Number(document.getElementById(`points-${predictionId}`).value);

    if (!Number.isInteger(confidencePoints) || confidencePoints < 1 || confidencePoints > 10) {
        showMessage('messageBox', 'Confidence points must be between 1 and 10.', 'error');
        return;
    }

    try {
        showMessage('messageBox', 'Updating prediction...', 'info');
        await apiRequest(`/predictions/${predictionId}`, {
            method: 'PUT',
            body: JSON.stringify({ selectedResult, confidencePoints })
        });
        showMessage('messageBox', 'Prediction updated successfully.', 'success');
        await loadMyPredictions();
    } catch (error) {
        showMessage('messageBox', error.message, 'error');
    }
}

async function deletePrediction(predictionId) {
    try {
        showMessage('messageBox', 'Deleting prediction...', 'info');
        await apiRequest(`/predictions/${predictionId}`, { method: 'DELETE' });
        showMessage('messageBox', 'Prediction deleted successfully.', 'success');
        await loadMyPredictions();
    } catch (error) {
        showMessage('messageBox', error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadMyPredictions);
