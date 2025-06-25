// Student Dashboard Functionality
class StudentDashboard {
  constructor() {
    this.init();
  }

  init() {
    // Check authentication and approval
    if (!auth.requireAuth('student')) {
      return;
    }

    // Check if student is approved
    if (!auth.isApproved()) {
      this.showPendingApproval();
      return;
    }

    this.setupUserInfo();
    this.loadDashboard();
    this.setupEventListeners();
  }

  setupUserInfo() {
    const user = auth.currentUser;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userAvatar').textContent = user.name.charAt(0);
  }

  showPendingApproval() {
    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
      <div class="pending-approval">
        <h2>Account Pending Approval</h2>
        <p>Your account is currently pending approval from the administrator. You will be able to access the dashboard once your account has been approved.</p>
        <p>Please contact the administration if you have any questions.</p>
      </div>
    `;
  }

  loadDashboard() {
    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
      <div class="dashboard-grid">
        ${this.renderPerformanceMetrics()}
        ${this.renderSubjectProgress()}
        ${this.renderBookingCalendar()}
        ${this.renderResources()}
        ${this.renderFeedbackForm()}
      </div>
    `;

    this.loadStudentData();
  }

  renderPerformanceMetrics() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Performance Overview</h3>
        </div>
        <div class="performance-metrics" id="performanceMetrics">
          <!-- Metrics will be loaded dynamically -->
        </div>
      </div>
    `;
  }

  renderSubjectProgress() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Subject Progress</h3>
        </div>
        <ul class="subject-list" id="subjectList">
          <!-- Subjects will be loaded dynamically -->
        </ul>
      </div>
    `;
  }

  renderBookingCalendar() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Book a Session</h3>
        </div>
        <div id="bookingSlots">
          <!-- Booking slots will be loaded dynamically -->
        </div>
      </div>
    `;
  }

  renderResources() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Learning Resources</h3>
        </div>
        <div id="resourceList">
          <!-- Resources will be loaded dynamically -->
        </div>
      </div>
    `;
  }

  renderFeedbackForm() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Submit Feedback</h3>
        </div>
        <form class="feedback-form" id="feedbackForm">
          <textarea 
            placeholder="Share your feedback about classes, teachers, or any suggestions for improvement..."
            required
          ></textarea>
          <button type="submit" class="submit-btn">Submit Feedback</button>
        </form>
      </div>
    `;
  }

  loadStudentData() {
    const user = auth.currentUser;
    const performance = MockData.studentPerformance[user.username] || {
      subjects: [],
      attendance: 0,
      assignments: 0,
      completedAssignments: 0
    };

    this.renderPerformanceMetricsData(performance);
    this.renderSubjectProgressData(performance.subjects);
    this.renderBookingSlots();
    this.renderResourcesList();
  }

  renderPerformanceMetricsData(performance) {
    const metricsContainer = document.getElementById('performanceMetrics');
    metricsContainer.innerHTML = `
      <div class="metric">
        <div class="metric-value">${performance.attendance}%</div>
        <div class="metric-label">Attendance</div>
      </div>
      <div class="metric">
        <div class="metric-value">${performance.completedAssignments}/${performance.assignments}</div>
        <div class="metric-label">Assignments</div>
      </div>
      <div class="metric">
        <div class="metric-value">${performance.subjects.length}</div>
        <div class="metric-label">Subjects</div>
      </div>
    `;
  }

  renderSubjectProgressData(subjects) {
    const subjectList = document.getElementById('subjectList');
    subjectList.innerHTML = subjects.map(subject => `
      <li class="subject-item">
        <div>
          <strong>${subject.name}</strong>
          <div style="color: #666; font-size: 0.9rem;">Grade: ${subject.grade}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${subject.progress}%"></div>
          </div>
          <span style="font-weight: 600; color: #667eea;">${subject.progress}%</span>
        </div>
      </li>
    `).join('');
  }

  renderBookingSlots() {
    const bookingContainer = document.getElementById('bookingSlots');
    const allSlots = [];
    
    // Combine all teacher availability
    Object.entries(MockData.teacherAvailability).forEach(([teacher, slots]) => {
      slots.forEach(slot => {
        if (slot.available) {
          allSlots.push({
            teacher,
            day: slot.day,
            time: slot.time
          });
        }
      });
    });

    if (allSlots.length === 0) {
      bookingContainer.innerHTML = '<p>No available slots at the moment. Please check back later.</p>';
      return;
    }

    bookingContainer.innerHTML = allSlots.map(slot => `
      <div class="booking-slot">
        <div>
          <strong>${slot.teacher}</strong>
          <div style="color: #666; font-size: 0.9rem;">${slot.day} - ${slot.time}</div>
        </div>
        <button class="book-btn" onclick="studentDashboard.bookSlot('${slot.teacher}', '${slot.day}', '${slot.time}')">
          Book
        </button>
      </div>
    `).join('');
  }

  renderResourcesList() {
    const resourceContainer = document.getElementById('resourceList');
    const savedProgress = Utils.getFromStorage('resourceProgress') || {};
    
    resourceContainer.innerHTML = MockData.resources.map(resource => {
      const isCompleted = savedProgress[resource.id] || resource.completed;
      return `
        <div class="resource-item">
          <div>
            <input 
              type="checkbox" 
              class="resource-checkbox" 
              id="resource-${resource.id}"
              ${isCompleted ? 'checked' : ''}
              onchange="studentDashboard.updateResourceProgress(${resource.id}, this.checked)"
            >
            <label for="resource-${resource.id}">
              <strong>${resource.title}</strong>
              <div style="color: #666; font-size: 0.9rem;">${resource.type}</div>
            </label>
          </div>
          <a href="${resource.url}" target="_blank" style="color: #667eea; text-decoration: none;">
            View →
          </a>
        </div>
      `;
    }).join('');
  }

  bookSlot(teacher, day, time) {
    const booking = {
      id: Utils.generateId(),
      teacher,
      day,
      time,
      student: auth.currentUser.username,
      date: new Date().toISOString()
    };

    // Save booking to localStorage
    const bookings = Utils.getFromStorage('studentBookings') || [];
    bookings.push(booking);
    Utils.saveToStorage('studentBookings', bookings);

    Utils.showNotification('Session booked successfully!', 'success');
    
    // Refresh booking slots
    this.renderBookingSlots();
  }

  updateResourceProgress(resourceId, completed) {
    const progress = Utils.getFromStorage('resourceProgress') || {};
    progress[resourceId] = completed;
    Utils.saveToStorage('resourceProgress', progress);
    
    Utils.showNotification(
      completed ? 'Resource marked as completed!' : 'Resource marked as incomplete.',
      'success'
    );
  }

  setupEventListeners() {
    // Feedback form submission
    document.getElementById('feedbackForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitFeedback();
    });
  }

  submitFeedback() {
    const textarea = document.querySelector('#feedbackForm textarea');
    const feedback = textarea.value.trim();
    
    if (!feedback) {
      Utils.showNotification('Please enter your feedback.', 'error');
      return;
    }

    const feedbackData = {
      id: Utils.generateId(),
      student: auth.currentUser.username,
      feedback,
      date: new Date().toISOString()
    };

    // Save feedback to localStorage
    const feedbacks = Utils.getFromStorage('studentFeedbacks') || [];
    feedbacks.push(feedbackData);
    Utils.saveToStorage('studentFeedbacks', feedbacks);

    // Clear form
    textarea.value = '';
    
    Utils.showNotification('Feedback submitted successfully!', 'success');
  }
}

// Initialize student dashboard
const studentDashboard = new StudentDashboard(); 