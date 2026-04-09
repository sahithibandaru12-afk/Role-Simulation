const API_URL = 'https://role-simulation-985b.vercel.app/api';
let currentUser = null;
let currentRole = null;
let currentScenario = null;
let currentMetrics = { cost: 100, time: 100, quality: 100, morale: 100, satisfaction: 100 };
let radarChart = null;
let userActivities = [];
let decisionsMade = 0;
let scenariosCompleted = 0;

// Gap 3 fix: track real impact data
let allImpacts = [];  // stores each decision's total absolute impact

// DOM Elements
const authContainer = document.getElementById('authContainer');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showLoginBtn = document.getElementById('showLoginBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userNameSpan = document.getElementById('userName');
const scenariosList = document.getElementById('scenariosList');
const navUser = document.getElementById('navUser');
const navUserName = document.getElementById('navUserName');
const scenariosSection = document.getElementById('scenariosSection');
const selectedRoleDisplay = document.getElementById('selectedRoleDisplay');
const roleSelectionSection = document.getElementById('roleSelectionSection');
const analyticsSection = document.getElementById('analyticsSection');
const profileSection = document.getElementById('profileSection');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileMemberSince = document.getElementById('profileMemberSince');
const completedCount = document.getElementById('completedCount');
const decisionCount = document.getElementById('decisionCount');
const avgImpactScore = document.getElementById('avgImpactScore');
const recentActivityList = document.getElementById('recentActivityList');

// Modal Elements
const decisionModal = document.getElementById('decisionModal');
const resultModal = document.getElementById('resultModal');
const scoreModal = document.getElementById('scoreModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const decisionsList = document.getElementById('decisionsList');
const resultContent = document.getElementById('resultContent');
const closeButtons = document.querySelectorAll('.modal-close');
const closeResultBtn = document.getElementById('closeResult');

// Metrics Elements
const metricElements = {
    cost: document.getElementById('currentCost'),
    time: document.getElementById('currentTime'),
    quality: document.getElementById('currentQuality'),
    morale: document.getElementById('currentMorale'),
    satisfaction: document.getElementById('currentSatisfaction')
};

const progressElements = {
    cost: document.getElementById('costProgress'),
    time: document.getElementById('timeProgress'),
    quality: document.getElementById('qualityProgress'),
    morale: document.getElementById('moraleProgress'),
    satisfaction: document.getElementById('satisfactionProgress')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkBackend();
    setupEventListeners();
    initRadarChart();
});

function setupEventListeners() {
    if (showLoginBtn && showRegisterBtn) {
        showLoginBtn.addEventListener('click', () => {
            showLoginBtn.classList.add('active');
            showRegisterBtn.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        showRegisterBtn.addEventListener('click', () => {
            showRegisterBtn.classList.add('active');
            showLoginBtn.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) profileBtn.addEventListener('click', showProfile);

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            decisionModal.style.display = 'none';
            resultModal.style.display = 'none';
        });
    });

    if (closeResultBtn) {
        closeResultBtn.addEventListener('click', () => {
            resultModal.style.display = 'none';
            // After closing result, show final score
            showFinalScore();
        });
    }

    // Gap 4: score modal buttons
    const playAgainBtn = document.getElementById('playAgainBtn');
    const backToScenariosBtn = document.getElementById('backToScenariosBtn');
    if (playAgainBtn) playAgainBtn.addEventListener('click', () => {
        scoreModal.style.display = 'none';
        if (currentScenario) openScenario(currentScenario._id);
    });
    if (backToScenariosBtn) backToScenariosBtn.addEventListener('click', () => {
        scoreModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === decisionModal) decisionModal.style.display = 'none';
        if (e.target === resultModal) resultModal.style.display = 'none';
        if (e.target === scoreModal) scoreModal.style.display = 'none';
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Login success logic
            console.log('Login successful', data);
        } else {
            showNotification(data.error || 'Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Server connection error', 'error');
    }
}


async function handleRegister(e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Registration successful! Please login.', 'success');
            showLoginBtn.click();
            registerForm.reset();
        } else {
            showNotification(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showNotification('Server connection error', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    currentRole = null;
    userActivities = [];
    decisionsMade = 0;
    scenariosCompleted = 0;
    allImpacts = [];

    mainContent.style.display = 'none';
    authContainer.style.display = 'flex';
    navUser.style.display = 'none';
    showNotification('Logged out successfully', 'info');
}

function showSection(section) {
    if (roleSelectionSection) roleSelectionSection.style.display = section === 'roleSelection' ? 'block' : 'none';
    if (scenariosSection)     scenariosSection.style.display     = section === 'scenarios'     ? 'block' : 'none';
    if (analyticsSection)     analyticsSection.style.display     = section === 'analytics'     ? 'block' : 'none';
    if (profileSection)       profileSection.style.display       = section === 'profile'       ? 'block' : 'none';
}

window.selectRole = async (role) => {
    currentRole = role;
    if (selectedRoleDisplay) selectedRoleDisplay.textContent = role;
    showSection('scenarios');
    await loadScenarios(role);
    addActivity(`Selected role: ${role}`);
};

window.showRoleSelection = () => { currentRole = null; showSection('roleSelection'); };

window.showAnalytics = () => { showSection('analytics'); updateAnalytics(); };

function showProfile() {
    showSection('profile');
    if (profileName) profileName.textContent = currentUser ? currentUser.name : '';
    if (profileEmail) profileEmail.textContent = currentUser ? currentUser.email : '';
    if (profileMemberSince) {
        profileMemberSince.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}

window.backToScenarios = () => showSection('scenarios');

async function loadScenarios(role) {
    try {
        scenariosList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><h3>Loading scenarios...</h3></div>';
        const response = await fetch(`${API_URL}/scenarios/${encodeURIComponent(role)}`);
        const scenarios = await response.json();
        displayScenarios(scenarios);
    } catch (error) {
        scenariosList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Failed to load scenarios</h3></div>';
    }
}

function displayScenarios(scenarios) {
    if (!scenarios || scenarios.length === 0) {
        scenariosList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No Scenarios Yet</h3>
                <p>Check back later for scenarios tailored to the ${currentRole} role</p>
            </div>`;
        return;
    }

    scenariosList.innerHTML = scenarios.map(scenario => `
        <div class="scenario-card" onclick="openScenario('${scenario._id}')">
            <h4>${scenario.title}</h4>
            <p>${scenario.description.substring(0, 100)}${scenario.description.length > 100 ? '...' : ''}</p>
            <div class="card-footer">
                <span class="decisions-badge">${scenario.decisions.length} decisions</span>
            </div>
        </div>
    `).join('');
}

function initRadarChart() {
    const ctx = document.getElementById('metricsRadar');
    if (!ctx) return;

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Cost', 'Time', 'Quality', 'Morale', 'Satisfaction'],
            datasets: [{
                label: 'Current Metrics',
                data: [100, 100, 100, 100, 100],
                backgroundColor: 'rgba(20, 184, 166, 0.2)',
                borderColor: '#14b8a6',
                pointBackgroundColor: '#14b8a6',
                pointBorderColor: '#fff'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 200,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#94a3b8' },
                    ticks: { color: '#64748b', backdropColor: 'transparent' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function updateRadarChart() {
    if (radarChart) {
        radarChart.data.datasets[0].data = [
            currentMetrics.cost, currentMetrics.time, currentMetrics.quality,
            currentMetrics.morale, currentMetrics.satisfaction
        ];
        radarChart.update();
    }
}

function updateMetricsDisplay() {
    for (const [key, element] of Object.entries(metricElements)) {
        if (element) element.textContent = Math.round(currentMetrics[key]);
    }
    for (const [key, element] of Object.entries(progressElements)) {
        if (element) element.style.width = `${(currentMetrics[key] / 200) * 100}%`;
    }
    updateRadarChart();
}

window.openScenario = async (scenarioId) => {
    try {
        const response = await fetch(`${API_URL}/scenarios/${encodeURIComponent(currentRole)}`);
        const scenarios = await response.json();
        currentScenario = scenarios.find(s => s._id === scenarioId);

        if (currentScenario) {
            modalTitle.textContent = currentScenario.title;
            modalDescription.textContent = currentScenario.description;
            currentMetrics = { cost: 100, time: 100, quality: 100, morale: 100, satisfaction: 100 };
            updateMetricsDisplay();
            displayDecisions(currentScenario.decisions);
            decisionModal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error opening scenario:', error);
    }
};

function displayDecisions(decisions) {
    decisionsList.innerHTML = decisions.map((decision, index) => {
        const impacts = Object.entries(decision.impacts)
            .map(([key, value]) => {
                const cls = value >= 0 ? 'impact-positive' : 'impact-negative';
                const sign = value > 0 ? '+' : '';
                return `<span class="impact-tag ${cls}">${key}: ${sign}${value}</span>`;
            }).join('');

        return `
            <div class="decision-card" onclick="makeDecision(${index})">
                <h4>${decision.option}</h4>
                <div class="impacts">${impacts}</div>
            </div>`;
    }).join('');
}

window.makeDecision = (decisionIndex) => {
    const decision = currentScenario.decisions[decisionIndex];
    let totalAbsImpact = 0;

    for (const [key, value] of Object.entries(decision.impacts)) {
        if (currentMetrics.hasOwnProperty(key)) {
            currentMetrics[key] = Math.max(0, Math.min(200, currentMetrics[key] + value));
            totalAbsImpact += Math.abs(value);
        }
    }

    // Gap 3: store real impact magnitude
    allImpacts.push(totalAbsImpact);
    decisionsMade++;
    addActivity(`Decided: "${decision.option}" as ${currentRole}`);
    updateMetricsDisplay();
    showDecisionResults(decision);
};

function showDecisionResults(decision) {
    const impacts = Object.entries(decision.impacts)
        .map(([key, value]) => {
            const cls = value >= 0 ? 'impact-positive' : 'impact-negative';
            const sign = value > 0 ? '+' : '';
            return `<span class="impact-tag ${cls}">${key}: ${sign}${value}</span>`;
        }).join('');

    const icons = { cost: '💰', time: '⏰', quality: '⭐', morale: '😊', satisfaction: '👍' };
    const newMetrics = Object.entries(currentMetrics)
        .map(([key, value]) => `
            <div style="color:white;font-weight:500;">
                ${icons[key] || '📊'} <strong>${key}:</strong> ${Math.round(value)}
            </div>`).join('');

    resultContent.innerHTML = `
        <h3 style="color:white;margin-bottom:15px;">You chose: ${decision.option}</h3>
        <div style="margin:20px 0;padding:15px;background:rgba(0,0,0,0.2);border-radius:10px;">
            <strong style="color:#94a3b8;">Impacts Applied:</strong>
            <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px;">${impacts}</div>
        </div>
        <div style="margin-top:20px;">
            <strong style="color:#94a3b8;">Updated Metrics:</strong>
            <div style="margin-top:10px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">${newMetrics}</div>
        </div>`;

    decisionModal.style.display = 'none';
    resultModal.style.display = 'flex';
}

// ── Gap 4: Final Score Screen ──────────────────────────────────────
function showFinalScore() {
    scenariosCompleted++;
    addActivity(`Completed scenario: "${currentScenario.title}"`);

    const avg = Object.values(currentMetrics).reduce((a, b) => a + b, 0) / 5;
    // Score: 0–100 based on how close avg metric is to 100 (starting value)
    const score = Math.max(0, Math.min(100, Math.round(avg - 50)));

    let grade, gradeColor, feedback;
    if (score >= 80) {
        grade = 'Excellent'; gradeColor = '#22c55e';
        feedback = 'Outstanding decision-making. You balanced all trade-offs effectively and kept every metric healthy.';
    } else if (score >= 65) {
        grade = 'Good'; gradeColor = '#14b8a6';
        feedback = 'Solid performance. Most metrics stayed positive. Review the areas that dipped and consider alternative choices.';
    } else if (score >= 50) {
        grade = 'Average'; gradeColor = '#f59e0b';
        feedback = 'Acceptable outcome but several metrics suffered. Think about the long-term consequences of each decision.';
    } else {
        grade = 'Needs Improvement'; gradeColor = '#f43f5e';
        feedback = 'Your decisions had significant negative impacts. Try the scenario again with a focus on balancing cost, morale, and quality.';
    }

    const metricRows = Object.entries(currentMetrics).map(([key, val]) => {
        const diff = Math.round(val - 100);
        const sign = diff >= 0 ? '+' : '';
        const color = diff >= 0 ? '#22c55e' : '#f43f5e';
        const icons = { cost: '💰', time: '⏰', quality: '⭐', morale: '😊', satisfaction: '👍' };
        return `
            <div class="score-metric-row">
                <span>${icons[key]} ${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span style="color:${color};font-weight:600;">${Math.round(val)} (${sign}${diff})</span>
            </div>`;
    }).join('');

    document.getElementById('scoreContent').innerHTML = `
        <div class="score-grade" style="color:${gradeColor};">${grade}</div>
        <div class="score-number">${score}<span style="font-size:1.2rem;color:#94a3b8;">/100</span></div>
        <p class="score-feedback">${feedback}</p>
        <div class="score-metrics-breakdown">${metricRows}</div>`;

    scoreModal.style.display = 'flex';
}

async function checkBackend() {
    try {
        // Use /test endpoint instead of root /api
        const response = await fetch(`${API_URL}/test`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend is running:', data.message);
        } else {
            console.log('⚠️ Backend returned status:', response.status);
        }
    } catch (error) {
        console.log('❌ Backend not reachable:', error.message);
        // Don't show alert - just log to console
    }
}

function addActivity(activity) {
    userActivities.unshift({ activity, timestamp: new Date().toLocaleTimeString() });
    if (userActivities.length > 10) userActivities.pop();
    updateActivityList();
}

function updateActivityList() {
    if (!recentActivityList) return;
    if (userActivities.length === 0) {
        recentActivityList.innerHTML = '<p class="no-data">No activity yet</p>';
        return;
    }
    recentActivityList.innerHTML = userActivities.map(item => `
        <div class="activity-item">
            <span class="activity-text">${item.activity}</span>
            <span class="activity-time">${item.timestamp}</span>
        </div>`).join('');
}

// ── Gap 3: Real analytics ──────────────────────────────────────────
function updateAnalytics() {
    if (completedCount) completedCount.textContent = scenariosCompleted;
    if (decisionCount) decisionCount.textContent = decisionsMade;
    if (avgImpactScore) {
        if (allImpacts.length === 0) {
            avgImpactScore.textContent = '—';
        } else {
            const avg = allImpacts.reduce((a, b) => a + b, 0) / allImpacts.length;
            avgImpactScore.textContent = Math.round(avg) + ' pts';
        }
    }
}

function showNotification(message, type) {
    const colors = { success: '#14b8a6', error: '#f43f5e', info: '#6366f1' };
    const toast = document.createElement('div');
    toast.style.cssText = `
        position:fixed;top:80px;right:20px;
        padding:14px 22px;
        background:${colors[type] || colors.info};
        color:white;border-radius:10px;
        font-weight:500;z-index:9999;
        animation:slideIn 0.3s ease;
        box-shadow:0 5px 20px rgba(0,0,0,0.3);
        max-width:320px;font-size:0.9rem;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}