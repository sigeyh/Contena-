// Jobs Management
function loadJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || getDefaultJobs();
    const categoryFilter = document.getElementById('category-filter').value;
    
    let filteredJobs = jobs;
    if (categoryFilter !== 'all') {
        filteredJobs = jobs.filter(job => job.category === categoryFilter);
    }
    
    displayJobs(filteredJobs);
    
    // Set up category filter
    document.getElementById('category-filter').addEventListener('change', loadJobs);
}

function getDefaultJobs() {
    const defaultJobs = [
        {
            id: 1,
            title: 'Website Redesign for Small Business',
            category: 'web',
            payRate: 450,
            description: 'We need a complete redesign of our small business website. The current site is outdated and not mobile-friendly. Looking for a modern, responsive design with SEO optimization.',
            requirements: 'HTML, CSS, JavaScript, Responsive Design',
            posted: '2023-06-15'
        },
        {
            id: 2,
            title: 'Content Writing for Tech Blog',
            category: 'writing',
            payRate: 120,
            description: 'Looking for a skilled writer to create engaging content for our technology blog. Topics include AI, web development, and digital marketing trends.',
            requirements: 'Tech Writing, SEO Knowledge',
            posted: '2023-06-18'
        },
        {
            id: 3,
            title: 'Logo Design for Startup',
            category: 'design',
            payRate: 200,
            description: 'Our new startup needs a professional logo that represents innovation and trust. Should work well in both digital and print formats.',
            requirements: 'Logo Design, Branding',
            posted: '2023-06-20'
        },
        {
            id: 4,
            title: 'Online Math Tutoring',
            category: 'educational',
            payRate: 35,
            description: 'Seeking qualified math tutor to provide online sessions for high school students. Must be available evenings and weekends.',
            requirements: 'Math Degree, Teaching Experience',
            posted: '2023-06-22'
        },
        {
            id: 5,
            title: 'Social Media Management',
            category: 'others',
            payRate: 300,
            description: 'Manage social media accounts for e-commerce brand. Create content calendar, schedule posts, and engage with followers.',
            requirements: 'Social Media Marketing',
            posted: '2023-06-25'
        },
        {
            id: 6,
            title: 'E-commerce Website Development',
            category: 'web',
            payRate: 1200,
            description: 'Build a complete e-commerce website with product listings, shopping cart, and payment integration. Must be secure and scalable.',
            requirements: 'E-commerce, Payment Gateways',
            posted: '2023-06-28'
        }
    ];
    
    localStorage.setItem('jobs', JSON.stringify(defaultJobs));
    return defaultJobs;
}

function displayJobs(jobs) {
    const jobsContainer = document.getElementById('jobs-container');
    
    if (jobs.length === 0) {
        jobsContainer.innerHTML = '<p class="no-jobs">No jobs available in this category.</p>';
        return;
    }
    
    jobsContainer.innerHTML = jobs.map(job => `
        <div class="job-card" data-job-id="${job.id}">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <span class="job-category">${getCategoryName(job.category)}</span>
                </div>
                <div class="job-pay">$${job.payRate}</div>
            </div>
            <p class="job-description">${job.description}</p>
            <div class="job-actions">
                <button class="btn-outline view-job-btn">View Details</button>
                <button class="btn-primary apply-job-btn">Apply Now</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to job buttons
    document.querySelectorAll('.view-job-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.closest('.job-card').getAttribute('data-job-id');
            viewJobDetails(jobId);
        });
    });
    
    document.querySelectorAll('.apply-job-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.closest('.job-card').getAttribute('data-job-id');
            applyForJob(jobId);
        });
    });
}

function getCategoryName(category) {
    const categories = {
        'web': 'Web Development',
        'educational': 'Educational',
        'writing': 'Writing',
        'design': 'Design',
        'others': 'Others'
    };
    
    return categories[category] || 'Unknown';
}

function viewJobDetails(jobId) {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const job = jobs.find(j => j.id == jobId);
    
    if (job) {
        // In a real app, this would show a detailed modal
        showToast(`Viewing details for: ${job.title}`, 'info');
    }
}

function applyForJob(jobId) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showToast('Please log in to apply for jobs', 'error');
        return;
    }
    
    if (!currentUser.isActivated) {
        showUpgradeModal();
        return;
    }
    
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const job = jobs.find(j => j.id == jobId);
    
    if (job) {
        // In a real app, this would submit an application
        showToast(`Application submitted for: ${job.title}`, 'success');
        
        // Simulate adding to user's active jobs
        const userJobs = JSON.parse(localStorage.getItem('userJobs')) || [];
        userJobs.push({
            id: Date.now(),
            jobId: job.id,
            userId: currentUser.id,
            jobTitle: job.title,
            payRate: job.payRate,
            appliedDate: new Date().toISOString(),
            status: 'applied'
        });
        
        localStorage.setItem('userJobs', JSON.stringify(userJobs));
    }
}

// Admin Job Management
function loadAdminJobs() {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || getDefaultJobs();
    displayAdminJobs(jobs);
}

function displayAdminJobs(jobs) {
    const jobsTableBody = document.getElementById('jobs-table-body');
    
    if (jobs.length === 0) {
        jobsTableBody.innerHTML = '<tr><td colspan="5" class="no-data">No jobs available</td></tr>';
        return;
    }
    
    jobsTableBody.innerHTML = jobs.map(job => `
        <tr>
            <td>${job.title}</td>
            <td>${getCategoryName(job.category)}</td>
            <td>$${job.payRate}</td>
            <td><span class="status-badge status-completed">Active</span></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" data-job-id="${job.id}">Edit</button>
                <button class="action-btn delete-btn" data-job-id="${job.id}">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            editJob(jobId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-job-id');
            deleteJob(jobId);
        });
    });
}

function addNewJob(e) {
    e.preventDefault();
    
    const title = document.getElementById('job-title').value;
    const category = document.getElementById('job-category').value;
    const payRate = parseFloat(document.getElementById('job-pay').value);
    const description = document.getElementById('job-description').value;
    
    if (!title || !category || !payRate || !description) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const newJob = {
        id: Date.now(),
        title,
        category,
        payRate,
        description,
        posted: new Date().toISOString().split('T')[0]
    };
    
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    
    hideAddJobModal();
    loadAdminJobs();
    showToast('Job added successfully!', 'success');
    
    // Reset form
    document.getElementById('add-job-form').reset();
}

function editJob(jobId) {
    // In a real app, this would open an edit form
    showToast('Edit job functionality would open here', 'info');
}

function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
        const updatedJobs = jobs.filter(job => job.id != jobId);
        
        localStorage.setItem('jobs', JSON.stringify(updatedJobs));
        loadAdminJobs();
        showToast('Job deleted successfully', 'success');
    }
}
function applyForJob(jobId) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showToast('Please log in to apply for jobs', 'error');
        return;
    }
    
    if (!currentUser.isActivated) {
        console.log('User not activated, showing upgrade modal');
        showUpgradeModal();
        return;
    }
    
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const job = jobs.find(j => j.id == jobId);
    
    if (job) {
        // Submit application
        showToast(`Application submitted for: ${job.title}`, 'success');
        
        // Add to user's active jobs
        const userJobs = JSON.parse(localStorage.getItem('userJobs')) || [];
        userJobs.push({
            id: Date.now(),
            jobId: job.id,
            userId: currentUser.id,
            jobTitle: job.title,
            payRate: job.payRate,
            appliedDate: new Date().toISOString(),
            status: 'applied'
        });
        
        localStorage.setItem('userJobs', JSON.stringify(userJobs));
    }
}