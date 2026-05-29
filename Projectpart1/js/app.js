let matchesData = [];
let currentIndex = 0;

window.updateCartBadge = function() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        let count = parseInt(localStorage.getItem('cartCount') || '0');
        if (count > 0) {
            badge.style.display = 'flex';
            badge.innerText = count;
        } else {
            badge.style.display = 'none';
        }
    }
};

window.onload = () => {
    updateCartBadge();
    fetch('./data/fixtures.json')
        .then(response => {
            if (!response.ok) throw new Error("Could not load fixtures.json");
            return response.json();
        })
        .then(data => {
            matchesData = data;
            if (document.getElementById('fixtureCard')) renderMatch();
            if (document.getElementById('betCard')) renderBetPage();
        })
        .catch(err => {
            console.error(err);
        });
};

function renderMatch() {
    if (matchesData.length === 0) return;
    const match = matchesData[currentIndex];
    const card = document.getElementById('fixtureCard');
    
    card.innerHTML = `
        <h3>Match ${match.matchNum}</h3>
        <div class="team-col team-home">
            ${match.homeTeam}
            <img src="${match.homeFlag}" alt="${match.homeCode}" onerror="this.style.display='none'">
        </div>
        <div class="vs">VS</div>
        <div class="team-col team-away">
            ${match.awayTeam}
            <img src="${match.awayFlag}" alt="${match.awayCode}" onerror="this.style.display='none'">
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
    if (matchesData.length > 0) { window.location.href = `bet.html?id=${matchesData[currentIndex].id}`; }
}

function renderBetPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('id') || matchesData[0].id;
    const match = matchesData.find(m => m.id === matchId);
    
    window.selectedOdds = match.odds.home;
    window.selectedTeam = match.homeTeam;

    const card = document.getElementById('betCard');
    card.innerHTML = `
        <h3>Match ${match.matchNum}</h3>
        
        <div class="team-col team-home" onclick="selectTeam('${match.homeTeam}', ${match.odds.home})">
            ${match.homeTeam}
            <img src="${match.homeFlag}" alt="${match.homeCode}" onerror="this.style.display='none'">
        </div>
        <div class="vs">VS</div>
        <div class="team-col team-away" onclick="selectTeam('${match.awayTeam}', ${match.odds.away})">
            ${match.awayTeam}
            <img src="${match.awayFlag}" alt="${match.awayCode}" onerror="this.style.display='none'">
        </div>
        
        <div class="match-date">${match.date}</div>
        <div class="odds-container">
            <div class="odd-box" onclick="selectTeam('${match.homeTeam}', ${match.odds.home})">${match.homeCode} - ${match.odds.home}</div>
            <div class="odd-box" onclick="selectTeam('Draw', ${match.odds.draw})">Draw - ${match.odds.draw}</div>
            <div class="odd-box" onclick="selectTeam('${match.awayTeam}', ${match.odds.away})">${match.awayCode} - ${match.odds.away}</div>
        </div>
        
        <div class="bet-pill-container">
            <div class="bet-label">Selection</div>
            <div class="bet-pill" id="selectionLabel">${match.homeTeam} Win</div>
            
            <div class="bet-label">Bet amount</div>
            <div class="bet-pill">
                <input type="text" id="stakeInput" value="10$" oninput="calculateWin()">
            </div>
            
            <div class="bet-label">Potential win</div>
            <div class="bet-pill" id="potentialWin">${(10 * window.selectedOdds).toFixed(1)}$</div>
        </div>
    `;
}

window.selectTeam = function(teamName, odds) {
    window.selectedOdds = odds;
    document.getElementById('selectionLabel').innerText = teamName === 'Draw' ? 'Draw' : teamName + ' Win';
    calculateWin(); 
};

window.calculateWin = function() {
    let val = document.getElementById('stakeInput').value.replace('$', '');
    const stake = parseFloat(val);
    const winBox = document.getElementById('potentialWin');
    if(stake && stake > 0) {
        winBox.innerText = (stake * window.selectedOdds).toFixed(1) + '$';
    } else {
        winBox.innerText = '0$';
    }
};

window.addToCart = function() {
    let count = parseInt(localStorage.getItem('cartCount') || '0');
    count++;
    localStorage.setItem('cartCount', count);
    updateCartBadge();
    const popup = document.getElementById('betPopup');
    if (popup) popup.style.display = 'flex';
};

window.closePopup = function() {
    const popup = document.getElementById('betPopup');
    if (popup) popup.style.display = 'none';
};