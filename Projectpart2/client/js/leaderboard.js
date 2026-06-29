let leaderboardChart = null;

function renderLeaderboard(users) {
    const list = document.getElementById('leaderboardList');
    if (!list) return;

    if (!users.length) {
        list.innerHTML = '<div class="leader-card"><h3>No users yet</h3><p>The leaderboard will appear after users register.</p></div>';
        return;
    }

    list.innerHTML = users.map((user, index) => `
        <div class="leader-card">
            <h3>#${index + 1} ${user.username}</h3>
            <p><strong>Points:</strong> ${user.points}</p>
            <p><strong>Predictions:</strong> ${user.predictionsCount}</p>
        </div>
    `).join('');
}

function renderChart(users) {
    const canvas = document.getElementById('leaderboardChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = users.slice(0, 5).map(user => user.username);
    const data = users.slice(0, 5).map(user => user.points);

    if (leaderboardChart) leaderboardChart.destroy();

    leaderboardChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Points',
                data
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

async function loadLeaderboard() {
    try {
        showMessage('messageBox', 'Loading leaderboard...', 'info');
        const data = await apiRequest('/leaderboard');
        renderLeaderboard(data.users);
        renderChart(data.users);
        hideMessage('messageBox');
    } catch (error) {
        showMessage('messageBox', error.message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', loadLeaderboard);
