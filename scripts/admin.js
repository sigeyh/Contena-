// Admin Functions
function loadAdminData() {
    // This would load all admin data in a real application
    console.log('Loading admin data...');
}

function loadAdminUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    displayAdminUsers(users);
    
    // Set up search
    document.getElementById('user-search').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
        
        displayAdminUsers(filteredUsers);
    });
}

function displayAdminUsers(users) {
    const usersTableBody = document.getElementById('users-table-body');
    
    if (users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="6" class="no-data">No users found</td></tr>';
        return;
    }
    
    usersTableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td><span class="status-badge ${user.isActivated ? 'status-completed' : 'status-pending'}">${user.isActivated ? 'Activated' : 'Pending'}</span></td>
            <td>$${user.balance ? user.balance.toFixed(2) : '0.00'}</td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" data-user-id="${user.id}">Edit</button>
                ${!user.isActivated ? `<button class="action-btn approve-btn" data-user-id="${user.id}">Activate</button>` : ''}
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.approve-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            activateUser(userId);
        });
    });
}

function activateUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.id == userId);
    
    if (userIndex !== -1) {
        users[userIndex].isActivated = true;
        localStorage.setItem('users', JSON.stringify(users));
        
        loadAdminUsers();
        showToast('User activated successfully', 'success');
    }
}