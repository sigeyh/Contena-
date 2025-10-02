// Main Application Controller
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        if (currentUser.role === 'admin') {
            showAdminPanel();
        } else {
            showDashboard();
        }
    } else {
        showWelcomePage();
    }
    
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Welcome page buttons
    document.getElementById('login-btn').addEventListener('click', showLoginModal);
    document.getElementById('register-btn').addEventListener('click', showRegisterModal);
    document.getElementById('get-started-btn').addEventListener('click', showRegisterModal);
    
    // Auth modal switches
    document.getElementById('switch-to-register').addEventListener('click', function(e) {
        e.preventDefault();
        hideLoginModal();
        showRegisterModal();
    });
    
    document.getElementById('switch-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        hideRegisterModal();
        showLoginModal();
    });
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            hideAllModals();
        });
    });
    
    // Auth forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Dashboard navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showDashboardPage(page);
        });
    });
    
    // User dropdown
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('admin-logout-btn').addEventListener('click', handleLogout);
    
    // Payment methods
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            selectPaymentMethod(this.getAttribute('data-method'));
        });
    });
    
    // Payment confirmation
    document.getElementById('confirm-payment').addEventListener('click', handlePayment);
    
    // Withdrawal request
    document.getElementById('request-withdrawal').addEventListener('click', requestWithdrawal);
    
    // Admin: Add job
    document.getElementById('add-job-btn').addEventListener('click', showAddJobModal);
    document.getElementById('add-job-form').addEventListener('submit', addNewJob);
}

// Page Management
function showWelcomePage() {
    hideAllPages();
    document.getElementById('welcome-page').classList.add('active');
}

function showDashboard() {
    hideAllPages();
    document.getElementById('dashboard').classList.add('active');
    loadUserData();
    showDashboardPage('jobs');
}

function showAdminPanel() {
    hideAllPages();
    document.getElementById('admin-panel').classList.add('active');
    loadAdminData();
    showDashboardPage('admin-users');
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

function showDashboardPage(pageId) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`.nav-link[data-page="${pageId}"]`).classList.add('active');
    
    // Show the selected page
    document.querySelectorAll('.dashboard-page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // Load page-specific data
    switch(pageId) {
        case 'jobs':
            loadJobs();
            break;
        case 'earnings':
            loadEarnings();
            break;
        case 'withdrawals':
            loadWithdrawals();
            break;
        case 'chat':
            loadChat();
            break;
        case 'admin-users':
            loadAdminUsers();
            break;
        case 'admin-jobs':
            loadAdminJobs();
            break;
        case 'admin-payments':
            loadAdminPayments();
            break;
        case 'admin-withdrawals':
            loadAdminWithdrawals();
            break;
        case 'admin-chat':
            loadAdminChat();
            break;
    }
}

// Modal Management
function showLoginModal() {
    hideAllModals();
    document.getElementById('login-modal').classList.add('active');
}

function hideLoginModal() {
    document.getElementById('login-modal').classList.remove('active');
}

function showRegisterModal() {
    hideAllModals();
    document.getElementById('register-modal').classList.add('active');
}

function hideRegisterModal() {
    document.getElementById('register-modal').classList.remove('active');
}

function showUpgradeModal() {
    hideAllModals();
    document.getElementById('upgrade-modal').classList.add('active');
}

function hideUpgradeModal() {
    document.getElementById('upgrade-modal').classList.remove('active');
}

function showPaymentModal() {
    hideAllModals();
    document.getElementById('payment-modal').classList.add('active');
}

function hidePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

function showAddJobModal() {
    hideAllModals();
    document.getElementById('add-job-modal').classList.add('active');
}

function hideAddJobModal() {
    document.getElementById('add-job-modal').classList.remove('active');
}

function hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Utility Functions
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 5000);
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        if (event.target === modal) {
            hideAllModals();
        }
    });
});
// Add these utility functions to app.js
function simulateMpesaPayment(phone, amount) {
    // This would integrate with actual M-Pesa API in production
    console.log(`Simulating M-Pesa payment of $${amount} to phone: ${phone}`);
    
    // Return a promise that simulates API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success 80% of the time
            if (Math.random() > 0.2) {
                resolve({
                    success: true,
                    transactionCode: 'MP' + Date.now().toString().slice(-8),
                    message: 'Payment successful'
                });
            } else {
                reject({
                    success: false,
                    error: 'Payment failed. Please try again.'
                });
            }
        }, 2000);
    });
}

function simulatePayPalPayment(email, amount) {
    // This would integrate with actual PayPal API in production
    console.log(`Simulating PayPal payment of $${amount} to email: ${email}`);
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.1) {
                resolve({
                    success: true,
                    transactionId: 'PAYPAL' + Date.now().toString().slice(-8),
                    message: 'Payment successful'
                });
            } else {
                reject({
                    success: false,
                    error: 'Payment failed. Please check your PayPal account.'
                });
            }
        }, 2000);
    });
}

function simulateStripePayment(cardData, amount) {
    // This would integrate with actual Stripe API in production
    console.log(`Simulating Stripe payment of $${amount}`);
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.15) {
                resolve({
                    success: true,
                    transactionId: 'STRIPE' + Date.now().toString().slice(-8),
                    message: 'Payment successful'
                });
            } else {
                reject({
                    success: false,
                    error: 'Card declined. Please check your card details.'
                });
            }
        }, 2000);
    });
}