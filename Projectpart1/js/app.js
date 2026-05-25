let matchesData = [];
let currentIndex = 0;

// On load, fetch the data
window.onload = () => {
    fetch('./data/fixtures.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not load fixtures.json");
            return response.json();
        })
        .then(data => {
            matchesData = data;
            
            // Check which page we are on and render accordingly
            if (document.getElementById('fixtureCard')) {
                renderMatch();
            }
            if (document.getElementById('betCard')) {
                renderBetPage();
            }
        })
        .catch(err => {
            console.error(err);
            const card = document.getElementById('fixtureCard') || document.getElementById('betCard');
            if (card) {
                card.innerHTML = `<p style="color:red; text-align:center;">Error loading match data.</p>`;
            }
        });
};

function renderMatch() {
    if (matchesData.length === 0) return;
    const match = matchesData[currentIndex];
    const card = document.getElementById('fixtureCard');
    
    card.innerHTML = `
        <h3>Match ${match.matchNum}</h3>
        <div class="match-teams">
            <div class="team-col">
                ${match.homeTeam}
                <img src="${match.homeFlag}" alt="${match.homeCode}" onerror="this.style.display='none'">
            </div>
            <div class="vs">VS</div>
            <div class="team-col">
                ${match.awayTeam}
                <img src="${match.awayFlag}" alt="${match.awayCode}" onerror="this.style.display='none'">
            </div>
        </div>
        <div class="match-date">${match.date}</div>
        <div class="odds-container">
            <div class="odd-box">${match.homeCode} - ${match.odds.home}</div>
            <div class="odd-box">Draw - ${match.odds.draw}</div>
            <div class="odd-box">${match.awayCode} - ${match.odds.away}</div>
        </div>
    `;
}

function nextMatch() {
    if (currentIndex < matchesData.length - 1) { currentIndex++; renderMatch(); }
}

function prevMatch() {
    if (currentIndex > 0) { currentIndex--; renderMatch(); }
}

function goToBet() {
    if (matchesData.length > 0) {
        window.location.href = `bet.html?id=${matchesData[currentIndex].id}`;
    }
}

function renderBetPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('id') || matchesData[0].id;
    const match = matchesData.find(m => m.id === matchId);
    
    // Store odds globally for the calculate tool
    window.selectedOdds = match.odds.home;

    const card = document.getElementById('betCard');
    card.innerHTML = `
        <h3>Match ${match.matchNum}</h3>
        <div class="match-teams">
            <div class="team-col">
                ${match.homeTeam}
                <img src="${match.homeFlag}" alt="${match.homeCode}" onerror="this.style.display='none'">
            </div>
            <div class="vs">VS</div>
            <div class="team-col">
                ${match.awayTeam}
                <img src="${match.awayFlag}" alt="${match.awayCode}" onerror="this.style.display='none'">
            </div>
        </div>
        <div class="match-date">${match.date}</div>
        <div class="odds-container">
            <div class="odd-box">${match.homeCode} - ${match.odds.home}</div>
            <div class="odd-box">Draw - ${match.odds.draw}</div>
            <div class="odd-box">${match.awayCode} - ${match.odds.away}</div>
        </div>
        
        <div class="bet-selection">
            Selection
            <div class="bet-box">${match.homeTeam} Win</div>
            Bet amount
            <div class="bet-box">
                <input type="number" id="stakeInput" value="10" oninput="calculateWin()">$
            </div>
            Potential win
            <div class="bet-box" id="potentialWin">${(10 * window.selectedOdds).toFixed(1)}$</div>
        </div>
    `;
}

function calculateWin() {
    const stake = document.getElementById('stakeInput').value;
    const winBox = document.getElementById('potentialWin');
    if(stake && stake > 0) {
        winBox.innerText = (stake * window.selectedOdds).toFixed(1) + '$';
    } else {
        winBox.innerText = '0$';
    }
}