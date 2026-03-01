// ============ API CONFIGURATION ============
const API_URL = 'http://localhost:3000/api';

// ============ STATE MANAGEMENT ============
let currentUser = null;
let currentScenario = null;
let currentMetrics = {
    cost: 100,
    time: 100,
    quality: 100,
    morale: 100,
    satisfaction: 100
};

// ============ DOM ELEMENTS ============
const authSection = document.getElementById('authSection');
const registerSection = document.getElementById('registerSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterBtn = document.getElementById('showRegister');
const backToLoginBtn = document.getElementById('backToLogin');
const logoutBtn = document.getElementById('logoutBtn');
const userNameSpan = document.getElementById('userName');
const userRoleSpan = document.getElementById('userRole');
const scenariosList = document.getElementById('scenariosList');

// Modal elements
const decisionModal = document.getElementById('decisionModal');
const resultModal = document.getElementById('resultModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const decisionsList = document.getElementById('decisionsList');
const resultContent = document.getElementById('resultContent');
const closeButtons = document.querySelectorAll('.close');
const closeResultBtn = document.getElementById('closeResult');

// Metrics spans
const currentCost = document.getElementById('currentCost');
const currentTime = document.getElementById('currentTime');
const currentQuality = document.getElementById('currentQuality');
const currentMorale = document.getElementById('currentMorale');
const currentSatisfaction = document.getElementById('currentSatisfaction');

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    checkBackend();
});

// ============ EVENT LISTENERS ============

// Show register form
showRegisterBtn.addEventListener('click', () => {
    authSection.style.display = 'none';
    registerSection.style.display = 'block';
});

// Back to login
backToLoginBtn.addEventListener('click', () => {
    registerSection.style.display = 'none';
    authSection.style.display = 'block';
    registerForm.reset();
});

// Login form submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.user;
            userNameSpan.textContent = currentUser.name;
            userRoleSpan.textContent = currentUser.role;
            
            authSection.style.display = 'none';
            appSection.style.display = 'block';
            
            loadScenarios(currentUser.role);
            loginForm.reset();
        } else {
            alert('Login failed: ' + (data.error || 'Invalid credentials'));
        }
    } catch (error) {
        alert('Error connecting to server. Make sure the backend is running.');
        console.error('Login error:', error);
    }
});

// Register form submit
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        role: document.getElementById('regRole').value
    };

    // Validate role selected
    if (!userData.role) {
        alert('Please select a role');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (data.success) {
            alert('Registration successful! Please login.');
            registerSection.style.display = 'none';
            authSection.style.display = 'block';
            registerForm.reset();
        } else {
            alert('Registration failed: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Error connecting to server. Make sure the backend is running.');
        console.error('Registration error:', error);
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    appSection.style.display = 'none';
    authSection.style.display = 'block';
    scenariosList.innerHTML = '';
});

// Close modals
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        decisionModal.style.display = 'none';
        resultModal.style.display = 'none';
    });
});

closeResultBtn.addEventListener('click', () => {
    resultModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === decisionModal) {
        decisionModal.style.display = 'none';
    }
    if (e.target === resultModal) {
        resultModal.style.display = 'none';
    }
});

// ============ API FUNCTIONS ============

// Check if backend is available
async function checkBackend() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            console.log('✅ Backend is running');
        } else {
            console.warn('⚠️ Backend returned error');
        }
    } catch (error) {
        console.error('❌ Backend is not running');
        alert('⚠️ Backend server is not running!\n\nPlease start the backend first:\n1. Open terminal\n2. Navigate to backend folder\n3. Run: node server.js');
    }
}

// Load scenarios for a role
async function loadScenarios(role) {
    try {
        const response = await fetch(`${API_URL}/scenarios/${encodeURIComponent(role)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const scenarios = await response.json();
        displayScenarios(scenarios);
    } catch (error) {
        console.error('Error loading scenarios:', error);
        scenariosList.innerHTML = '<p style="color: red;">❌ Error loading scenarios. Make sure the backend is running.</p>';
    }
}

// Display scenarios in grid
function displayScenarios(scenarios) {
    if (!scenarios || scenarios.length === 0) {
        scenariosList.innerHTML = '<p>📭 No scenarios available for your role yet. Check back later!</p>';
        return;
    }

    scenariosList.innerHTML = scenarios.map(scenario => `
        <div class="scenario-card" onclick="openScenario('${scenario._id}')">
            <h4>${scenario.title}</h4>
            <p>${scenario.description.substring(0, 100)}${scenario.description.length > 100 ? '...' : ''}</p>
            <div class="decisions-count">📋 ${scenario.decisions.length} decision options</div>
        </div>
    `).join('');
}

// Open scenario
window.openScenario = async (scenarioId) => {
    if (!currentUser) {
        alert('Please login first');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/scenarios/${encodeURIComponent(currentUser.role)}`);
        const scenarios = await response.json();
        
        currentScenario = scenarios.find(s => s._id === scenarioId);
        
        if (currentScenario) {
            modalTitle.textContent = currentScenario.title;
            modalDescription.textContent = currentScenario.description;
            
            // Reset metrics to 100
            currentMetrics = {
                cost: 100,
                time: 100,
                quality: 100,
                morale: 100,
                satisfaction: 100
            };
            
            updateMetricsDisplay();
            displayDecisions(currentScenario.decisions);
            
            decisionModal.style.display = 'block';
        } else {
            alert('Scenario not found');
        }
    } catch (error) {
        console.error('Error loading scenario:', error);
        alert('Error loading scenario details');
    }
};

// Display decisions
function displayDecisions(decisions) {
    decisionsList.innerHTML = decisions.map((decision, index) => `
        <div class="decision-option" onclick="makeDecision(${index})">
            <h4>${decision.option}</h4>
            <div>
                ${Object.entries(decision.impacts).map(([key, value]) => {
                    const impactClass = value >= 0 ? 'impact-positive' : 'impact-negative';
                    const sign = value > 0 ? '+' : '';
                    return `
                        <span class="impact-badge ${impactClass}">
                            ${key}: ${sign}${value}
                        </span>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

// Make decision
window.makeDecision = (decisionIndex) => {
    if (!currentScenario) return;
    
    const decision = currentScenario.decisions[decisionIndex];
    
    // Apply impacts to metrics
    Object.entries(decision.impacts).forEach(([key, value]) => {
        if (currentMetrics.hasOwnProperty(key)) {
            currentMetrics[key] += value;
            // Keep metrics between 0 and 200
            currentMetrics[key] = Math.max(0, Math.min(200, currentMetrics[key]));
        }
    });
    
    updateMetricsDisplay();
    showDecisionResults(decision);
};

// Update metrics display
function updateMetricsDisplay() {
    currentCost.textContent = Math.round(currentMetrics.cost);
    currentTime.textContent = Math.round(currentMetrics.time);
    currentQuality.textContent = Math.round(currentMetrics.quality);
    currentMorale.textContent = Math.round(currentMetrics.morale);
    currentSatisfaction.textContent = Math.round(currentMetrics.satisfaction);
}

// Show decision results
function showDecisionResults(decision) {
    // Create impact badges
    const impacts = Object.entries(decision.impacts)
        .map(([key, value]) => {
            const impactClass = value >= 0 ? 'impact-positive' : 'impact-negative';
            const sign = value > 0 ? '+' : '';
            return `
                <span class="impact-badge ${impactClass}">
                    ${key}: ${sign}${value}
                </span>
            `;
        }).join('');

    // Create new metrics display
    const newMetrics = Object.entries(currentMetrics)
        .map(([key, value]) => `
            <div class="metric">
                ${key.charAt(0).toUpperCase() + key.slice(1)}: ${Math.round(value)}
            </div>
        `).join('');

    resultContent.innerHTML = `
        <h4 style="margin-bottom: 15px;">✅ You chose: ${decision.option}</h4>
        
        <div style="margin: 20px 0;">
            <strong>📊 Impacts Applied:</strong>
            <div style="margin-top: 10px;">${impacts}</div>
        </div>
        
        <div style="margin-top: 20px;">
            <strong>📈 Updated Metrics:</strong>
            <div class="metrics" style="margin-top: 10px;">${newMetrics}</div>
        </div>
    `;
    
    decisionModal.style.display = 'none';
    resultModal.style.display = 'block';
}

// ============ UTILITY FUNCTIONS ============

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show loading spinner (optional enhancement)
function showLoading(element) {
    element.innerHTML = '<div class="loading">Loading...</div>';
}

// Hide loading spinner
function hideLoading(element) {
    // Implementation if needed
}

// ============ EXPORT FUNCTIONS FOR GLOBAL USE ============
// (Functions are already global through window object)