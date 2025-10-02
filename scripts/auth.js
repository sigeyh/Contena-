// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Basic validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [
        { id: 1, email: 'admin@freelancepro.com', password: 'admin123', name: 'Admin User' }
    ];
    
    // Check if user is admin
    const adminUser = adminUsers.find(user => user.email === email && user.password === password);
    if (adminUser) {
        // Login as admin
        const userData = {
            id: adminUser.id,
            name: adminUser.name,
            email: adminUser.email,
            role: 'admin',
            isActivated: true
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        hideLoginModal();
        showAdminPanel();
        showToast('Admin login successful!', 'success');
        return;
    }
    
    // Check if user exists
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Login successful
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: 'user',
            isActivated: user.isActivated || false,
            balance: user.balance || 0
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        hideLoginModal();
        showDashboard();
        showToast('Login successful!', 'success');
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.find(user => user.email === email)) {
        showToast('Email already registered', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        isActivated: false,
        balance: 0,
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: 'user',
        isActivated: false,
        balance: 0
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    hideRegisterModal();
    showDashboard();
    showToast('Registration successful!', 'success');
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    showWelcomePage();
    showToast('You have been logged out', 'info');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function loadUserData() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
    }
}

function updateUserActivation() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].isActivated = true;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current user
            currentUser.isActivated = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
}