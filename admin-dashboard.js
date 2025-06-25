// Admin Dashboard Functionality
class AdminDashboard {
  constructor() {
    this.init();
  }

  init() {
    // Refresh auth state in case there's a timing issue
    if (auth && typeof auth.refreshCurrentUser === 'function') {
      auth.refreshCurrentUser();
    }
    
    // Check authentication
    if (!auth.requireAuth('admin')) {
      return;
    }

    this.setupUserInfo();
    this.loadDashboard();
    this.setupEventListeners();
  }

  setupUserInfo() {
    const user = auth.currentUser;
    if (user) {
      document.getElementById('userName').textContent = user.name;
      document.getElementById('userAvatar').textContent = user.name.charAt(0);
    } else {
      document.getElementById('userName').textContent = 'Administrator';
      document.getElementById('userAvatar').textContent = 'A';
    }
  }

  loadDashboard() {
    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
      <div class="dashboard-grid">
        ${this.renderPendingUsers()}
        ${this.renderMentorPairing()}
        ${this.renderPlatformAnalytics()}
        ${this.renderResourceManagement()}
      </div>
    `;

    this.loadAdminData();
  }

  renderPendingUsers() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Pending User Approvals</h3>
        </div>
        <div id="pendingUsersList">
          <!-- Pending users will be loaded dynamically -->
        </div>
      </div>
    `;
  }

  renderMentorPairing() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Mentor-Student Pairing</h3>
        </div>
        <form class="pairing-form" id="pairingForm">
          <div class="form-row">
            <div class="form-group">
              <label for="mentorSelect">Select Mentor</label>
              <select id="mentorSelect" required>
                <option value="">Choose a teacher...</option>
              </select>
            </div>
            <div class="form-group">
              <label for="studentSelect">Select Student</label>
              <select id="studentSelect" required>
                <option value="">Choose a student...</option>
              </select>
            </div>
            <button type="submit" class="pair-btn">Assign</button>
          </div>
        </form>
        <div id="currentAssignments">
          <!-- Current assignments will be loaded dynamically -->
        </div>
      </div>
    `;
  }

  renderPlatformAnalytics() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Platform Analytics</h3>
        </div>
        <div class="analytics-grid" id="analyticsGrid">
          <!-- Analytics will be loaded dynamically -->
        </div>
        <div class="analytics-chart">
          <canvas id="analyticsChart"></canvas>
        </div>
      </div>
    `;
  }

  renderResourceManagement() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Resource Management</h3>
        </div>
        <div id="resourceList">
          <!-- Resources will be loaded dynamically -->
        </div>
        <form class="add-resource-form" id="addResourceForm">
          <input type="text" id="resourceTitle" placeholder="Resource title" required>
          <input type="text" id="resourceType" placeholder="Type (PDF, Video, etc.)" required>
          <input type="text" id="resourceUrl" placeholder="URL" required>
          <button type="submit" class="add-btn">Add Resource</button>
        </form>
      </div>
    `;
  }

  loadAdminData() {
    this.renderPendingUsersData();
    this.renderMentorPairingData();
    this.renderAnalyticsData();
    this.renderResourceManagementData();
  }

  renderPendingUsersData() {
    const pendingContainer = document.getElementById('pendingUsersList');
    const pendingUsers = MockData.pendingUsers;
    
    if (pendingUsers.length === 0) {
      pendingContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">No pending approvals.</p>';
      return;
    }

    pendingContainer.innerHTML = pendingUsers.map(user => `
      <div class="pending-user">
        <div class="user-details">
          <div class="user-avatar-small">${user.name.charAt(0)}</div>
          <div>
            <strong>${user.name}</strong>
            <div style="color: #666; font-size: 0.9rem;">${user.role}</div>
          </div>
        </div>
        <div class="approval-buttons">
          <button class="approve-btn" onclick="adminDashboard.approveUser('${user.username}', '${user.role}')">
            Approve
          </button>
          <button class="reject-btn" onclick="adminDashboard.rejectUser('${user.username}')">
            Reject
          </button>
        </div>
      </div>
    `).join('');
  }

  renderMentorPairingData() {
    // Populate mentor select
    const mentorSelect = document.getElementById('mentorSelect');
    const teachers = [
      { username: 'dr_brown', name: 'Dr. Brown' },
      { username: 'ms_wilson', name: 'Ms. Wilson' }
    ];
    
    mentorSelect.innerHTML = '<option value="">Choose a teacher...</option>' +
      teachers.map(teacher => `<option value="${teacher.username}">${teacher.name}</option>`).join('');
    
    // Populate student select
    const studentSelect = document.getElementById('studentSelect');
    const students = [
      { username: 'john_student', name: 'John Smith' },
      { username: 'sarah_student', name: 'Sarah Johnson' }
    ];
    
    studentSelect.innerHTML = '<option value="">Choose a student...</option>' +
      students.map(student => `<option value="${student.username}">${student.name}</option>`).join('');
    
    // Show current assignments
    this.renderCurrentAssignments();
  }

  renderCurrentAssignments() {
    const assignmentsContainer = document.getElementById('currentAssignments');
    const assignments = MockData.mentorAssignments;
    
    if (assignments.length === 0) {
      assignmentsContainer.innerHTML = '<p style="text-align: center; color: #666; margin-top: 1rem;">No assignments yet.</p>';
      return;
    }

    assignmentsContainer.innerHTML = `
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f0f0f0;">
        <h4 style="margin-bottom: 1rem;">Current Assignments</h4>
        ${assignments.map(assignment => {
          const mentor = assignment.mentor === 'dr_brown' ? 'Dr. Brown' : 'Ms. Wilson';
          const student = assignment.student === 'john_student' ? 'John Smith' : 'Sarah Johnson';
          return `
            <div class="assignment-item">
              <div>
                <strong>${mentor}</strong> → <strong>${student}</strong>
              </div>
              <button class="remove-btn" onclick="adminDashboard.removeAssignment('${assignment.mentor}', '${assignment.student}')">
                Remove
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderAnalyticsData() {
    const analyticsGrid = document.getElementById('analyticsGrid');
    const analytics = MockData.analytics;
    
    analyticsGrid.innerHTML = `
      <div class="analytics-item">
        <div class="analytics-value">${analytics.totalStudents}</div>
        <div class="analytics-label">Total Students</div>
      </div>
      <div class="analytics-item">
        <div class="analytics-value">${analytics.totalTeachers}</div>
        <div class="analytics-label">Total Teachers</div>
      </div>
      <div class="analytics-item">
        <div class="analytics-value">${analytics.activeSessions}</div>
        <div class="analytics-label">Active Sessions</div>
      </div>
      <div class="analytics-item">
        <div class="analytics-value">${analytics.resourcesAccessed}</div>
        <div class="analytics-label">Resources Accessed</div>
      </div>
      <div class="analytics-item">
        <div class="analytics-value">${analytics.bookingsThisWeek}</div>
        <div class="analytics-label">Bookings This Week</div>
      </div>
    `;
    
    // Create analytics chart
    this.createAnalyticsChart();
  }

  createAnalyticsChart() {
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Student Registrations',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4
        }, {
          label: 'Teacher Registrations',
          data: [2, 3, 1, 4, 2, 3],
          borderColor: '#27ae60',
          backgroundColor: 'rgba(39, 174, 96, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  renderResourceManagementData() {
    const resourceContainer = document.getElementById('resourceList');
    
    resourceContainer.innerHTML = MockData.resources.map(resource => `
      <div class="resource-item">
        <div>
          <strong>${resource.title}</strong>
          <div style="color: #666; font-size: 0.9rem;">${resource.type}</div>
        </div>
        <div class="resource-actions">
          <button class="edit-btn" onclick="adminDashboard.editResource(${resource.id})">
            Edit
          </button>
          <button class="delete-btn" onclick="adminDashboard.deleteResource(${resource.id})">
            Delete
          </button>
        </div>
      </div>
    `).join('');
  }

  approveUser(username, role) {
    // Update user approval status
    const pendingUsers = MockData.pendingUsers.filter(u => u.username !== username);
    MockData.pendingUsers = pendingUsers;
    
    // Update localStorage
    Utils.saveToStorage('pendingUsers', pendingUsers);
    
    // Update user data based on role
    if (role === 'student') {
      // Update student approval
      const students = Utils.getFromStorage('students') || [];
      const student = students.find(s => s.username === username);
      if (student) {
        student.adminApproved = true;
        Utils.saveToStorage('students', students);
      }
    } else if (role === 'teacher') {
      // Update teacher verification
      const teachers = Utils.getFromStorage('teachers') || [];
      const teacher = teachers.find(t => t.username === username);
      if (teacher) {
        teacher.verified = true;
        Utils.saveToStorage('teachers', teachers);
      }
    }
    
    Utils.showNotification('User approved successfully!', 'success');
    this.renderPendingUsersData();
  }

  rejectUser(username) {
    // Remove user from pending list
    const pendingUsers = MockData.pendingUsers.filter(u => u.username !== username);
    MockData.pendingUsers = pendingUsers;
    
    // Update localStorage
    Utils.saveToStorage('pendingUsers', pendingUsers);
    
    Utils.showNotification('User rejected.', 'success');
    this.renderPendingUsersData();
  }

  setupEventListeners() {
    // Mentor pairing form
    document.getElementById('pairingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createMentorAssignment();
    });
    
    // Add resource form
    document.getElementById('addResourceForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addResource();
    });
  }

  createMentorAssignment() {
    const mentor = document.getElementById('mentorSelect').value;
    const student = document.getElementById('studentSelect').value;
    
    if (!mentor || !student) {
      Utils.showNotification('Please select both mentor and student.', 'error');
      return;
    }
    
    // Check if assignment already exists
    const existingAssignment = MockData.mentorAssignments.find(
      a => a.mentor === mentor && a.student === student
    );
    
    if (existingAssignment) {
      Utils.showNotification('This assignment already exists.', 'error');
      return;
    }
    
    // Add new assignment
    const newAssignment = { mentor, student };
    MockData.mentorAssignments.push(newAssignment);
    
    // Update localStorage
    Utils.saveToStorage('mentorAssignments', MockData.mentorAssignments);
    
    // Reset form
    document.getElementById('pairingForm').reset();
    
    Utils.showNotification('Mentor assignment created successfully!', 'success');
    this.renderCurrentAssignments();
  }

  removeAssignment(mentor, student) {
    MockData.mentorAssignments = MockData.mentorAssignments.filter(
      a => !(a.mentor === mentor && a.student === student)
    );
    
    // Update localStorage
    Utils.saveToStorage('mentorAssignments', MockData.mentorAssignments);
    
    Utils.showNotification('Assignment removed successfully!', 'success');
    this.renderCurrentAssignments();
  }

  addResource() {
    const title = document.getElementById('resourceTitle').value.trim();
    const type = document.getElementById('resourceType').value.trim();
    const url = document.getElementById('resourceUrl').value.trim();
    
    if (!title || !type || !url) {
      Utils.showNotification('Please fill in all fields.', 'error');
      return;
    }
    
    const newResource = {
      id: MockData.resources.length + 1,
      title,
      type,
      url,
      completed: false
    };
    
    MockData.resources.push(newResource);
    
    // Update localStorage
    Utils.saveToStorage('resources', MockData.resources);
    
    // Reset form
    document.getElementById('addResourceForm').reset();
    
    Utils.showNotification('Resource added successfully!', 'success');
    this.renderResourceManagementData();
  }

  editResource(resourceId) {
    const resource = MockData.resources.find(r => r.id === resourceId);
    if (!resource) return;
    
    const newTitle = prompt('Enter new title:', resource.title);
    if (newTitle === null) return;
    
    const newType = prompt('Enter new type:', resource.type);
    if (newType === null) return;
    
    const newUrl = prompt('Enter new URL:', resource.url);
    if (newUrl === null) return;
    
    resource.title = newTitle.trim();
    resource.type = newType.trim();
    resource.url = newUrl.trim();
    
    // Update localStorage
    Utils.saveToStorage('resources', MockData.resources);
    
    Utils.showNotification('Resource updated successfully!', 'success');
    this.renderResourceManagementData();
  }

  deleteResource(resourceId) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    MockData.resources = MockData.resources.filter(r => r.id !== resourceId);
    
    // Update localStorage
    Utils.saveToStorage('resources', MockData.resources);
    
    Utils.showNotification('Resource deleted successfully!', 'success');
    this.renderResourceManagementData();
  }
}

// Initialize admin dashboard
const adminDashboard = new AdminDashboard(); 