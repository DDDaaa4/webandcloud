let matchesData = [];
let currentIndex = 0;

function matchResultLabel(match) {
    if (match.status !== 'finished') return 'Upcoming';
    return `${match.homeScore ?? '-'} : ${match.awayScore ?? '-'}`;
}

function renderMatch() {
    const card = document.getElementById('featureCard');
    if (!card) return;

    if (!matchesData.length) {
        card.innerHTML = '<h3>No matches found</h3><p class="match-date">Try another search.</p>';
        return;
    }

    const match = matchesData[currentIndex];
    card.innerHTML = `
        <h3>Match ${match.matchNum}</h3>
        <div class="team-row">
            <div class="team-box" onclick="showCountryInfo('${match.homeTeam}')">
                ${match.homeTeam}
                <img src="${match.homeFlag}" alt="${match.homeTeam}">
            </div>
            <div class="vs">VS</div>
            <div class="team-box" onclick="showCountryInfo('${match.awayTeam}')">
                ${match.awayTeam}
                <img src="${match.awayFlag}" alt="${match.awayTeam}">
            </div>
        </div>
        <div class="match-date">${new Date(match.matchDate).toLocaleDateString()} · ${matchResultLabel(match)}</div>
        <div class="choice-container">
            <div class="choice-box">${match.homeTeam} Win</div>
            <div class="choice-box">Draw</div>
            <div class="choice-box">${match.awayTeam} Win</div>
        </div>
    `;
}

async function showCountryInfo(countryName) {
    try {
        showMessage('messageBox', `Loading ${countryName} info from external API...`, 'info');
        const data = await apiRequest(`/external/country/${encodeURIComponent(countryName)}`);
        showMessage('messageBox', `${data.name}: ${data.region}, capital ${data.capital || 'N/A'}, population ${data.population?.toLocaleString() || 'N/A'}.`, 'success');
    } catch (error) {
        showMessage('messageBox', error.message, 'error');
    }
}

async function loadMatches() {
    try {
        showMessage('messageBox', 'Loading matches...', 'info');
        const team = document.getElementById('teamSearch')?.value.trim() || '';
        const status = document.getElementById('statusFilter')?.value || '';
        const query = new URLSearchParams();

        if (team) query.set('team', team);
        if (status) query.set('status', status);

        const data = await apiRequest(`/matches?${query.toString()}`);
        matchesData = data.matches;
        currentIndex = 0;
        renderMatch();

        if (!matchesData.length) {
            showMessage('messageBox', 'No matches to show.', 'info');
        } else {
            hideMessage('messageBox');
        }
    } catch (error) {
        showMessage('messageBox', error.message, 'error');
    }
}

function nextMatch() {
    if (!matchesData.length) return;
    currentIndex = (currentIndex + 1) % matchesData.length;
    renderMatch();
}

function prevMatch() {
    if (!matchesData.length) return;
    currentIndex = (currentIndex - 1 + matchesData.length) % matchesData.length;
    renderMatch();
}

function goToPrediction() {
    if (!getToken()) {
        showMessage('messageBox', 'You must login before submitting a prediction.', 'error');
        return;
    }

    if (!matchesData.length) {
        showMessage('messageBox', 'No match selected.', 'error');
        return;
    }

    window.location.href = `bet.html?id=${matchesData[currentIndex]._id}`;
}

document.addEventListener('DOMContentLoaded', loadMatches);
