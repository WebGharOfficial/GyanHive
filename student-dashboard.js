// Student Dashboard Functionality
class StudentDashboard {
  constructor() {
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
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
    const userInfo = document.querySelector('.user-info');
    userInfo.innerHTML = `
      <div class="user-avatar">${user.name.charAt(0)}</div>
      <div>
        <h3>Welcome, ${user.name}!</h3>
        <p>Student Dashboard</p>
      </div>
    `;
  }

  showPendingApproval() {
    const container = document.querySelector('.dashboard-container');
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem;">
        <h2>🐝 Account Pending Approval</h2>
        <p>Your account is currently being reviewed by our team. You'll receive an email once it's approved.</p>
        <button onclick="auth.logout()" class="logout-btn">Logout</button>
      </div>
    `;
  }

  loadDashboard() {
    const container = document.querySelector('.dashboard-container');
    container.innerHTML = `
      <div class="dashboard-header">
        <div class="user-info">
          <!-- User info will be populated -->
        </div>
        <button onclick="auth.logout()" class="logout-btn">Logout</button>
      </div>
      <div class="dashboard-grid">
        ${this.renderPerformanceMetrics()}
        ${this.renderSubjectProgress()}
        ${this.renderBookingCalendar()}
        ${this.renderResources()}
        ${this.renderFeedbackForm()}
      </div>
    `;
    
    this.setupUserInfo();
    this.loadStudentData();
  }

  renderPerformanceMetrics() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">📊 Performance Metrics</h3>
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
          <h3 class="card-title">📚 Subject Progress</h3>
        </div>
        <ul class="subject-list" id="subjectList">
          <!-- Subject progress will be loaded dynamically -->
        </ul>
      </div>
    `;
  }

  renderBookingCalendar() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">🍯 Book a Session</h3>
        </div>
        <div class="compact-calendar" onclick="studentDashboard.showCalendarPopup()">
          <div class="compact-calendar-header">
            <span>${this.getCurrentMonthName()}</span>
            <i class="fa-solid fa-calendar-plus" style="color: var(--honey-amber);"></i>
          </div>
          <div class="compact-calendar-grid" id="compactCalendar">
            <!-- Compact calendar will be generated here -->
          </div>
          <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--honey-text);">
            Click to view full calendar and book sessions
          </div>
        </div>
      </div>
    `;
  }

  renderResources() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">📖 Learning Resources</h3>
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
          <h3 class="card-title">💬 Submit Feedback</h3>
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
    this.renderCompactCalendar();
    this.renderResourcesList();
  }

  // Calendar functionality
  getCurrentMonthName() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[this.currentMonth]} ${this.currentYear}`;
  }

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.updateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.updateCalendar();
  }

  updateCalendar() {
    this.renderCompactCalendar();
  }

  renderCompactCalendar() {
    const calendarContainer = document.getElementById('compactCalendar');
    if (!calendarContainer) return;

    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const today = new Date();
    const isCurrentMonth = this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();

    let calendarHTML = '';
    
    // Add day headers (Sun, Mon, Tue, etc.)
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayNames.forEach(day => {
      calendarHTML += `<div class="compact-calendar-cell empty" style="font-size: 0.7rem; font-weight: bold;">${day}</div>`;
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarHTML += '<div class="compact-calendar-cell empty"></div>';
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const isAvailable = this.isDayAvailable(day);
      const classes = ['compact-calendar-cell'];
      
      if (isToday) classes.push('today');
      else if (isAvailable) classes.push('available');
      else classes.push('unavailable');

      calendarHTML += `
        <div class="${classes.join(' ')}" 
             title="${this.getCurrentMonthName()} ${day}">
          ${day}
        </div>
      `;
    }

    calendarContainer.innerHTML = calendarHTML;
  }

  showCalendarPopup() {
    const modal = document.createElement('div');
    modal.className = 'calendar-popup-modal';
    modal.innerHTML = `
      <div class="calendar-popup-content">
        <div class="calendar-popup-header">
          <h3>Book a Session - ${this.getCurrentMonthName()}</h3>
          <button class="calendar-popup-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="calendar-header">
          <button class="calendar-nav-btn" onclick="studentDashboard.previousMonthPopup()">‹</button>
          <h4 id="popupCurrentMonth">${this.getCurrentMonthName()}</h4>
          <button class="calendar-nav-btn" onclick="studentDashboard.nextMonthPopup()">›</button>
        </div>
        <div class="calendar-popup-grid" id="popupCalendar">
          <!-- Popup calendar will be generated here -->
        </div>
        <div class="calendar-legend">
          <div class="legend-item">
            <div class="legend-color available"></div>
            <span>Available</span>
          </div>
          <div class="legend-item">
            <div class="legend-color unavailable"></div>
            <span>Unavailable</span>
          </div>
          <div class="legend-item">
            <div class="legend-color today"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.renderPopupCalendar();
  }

  previousMonthPopup() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.updatePopupCalendar();
  }

  nextMonthPopup() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.updatePopupCalendar();
  }

  updatePopupCalendar() {
    document.getElementById('popupCurrentMonth').textContent = this.getCurrentMonthName();
    this.renderPopupCalendar();
    this.renderCompactCalendar(); // Update the compact calendar too
  }

  renderPopupCalendar() {
    const calendarContainer = document.getElementById('popupCalendar');
    if (!calendarContainer) return;

    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const today = new Date();
    const isCurrentMonth = this.currentMonth === today.getMonth() && this.currentYear === today.getFullYear();

    let calendarHTML = '';
    
    // Add day headers (Sun, Mon, Tue, etc.)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
      calendarHTML += `<div class="calendar-popup-cell empty" style="font-size: 0.8rem; font-weight: bold; color: var(--honey-amber);">${day}</div>`;
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarHTML += '<div class="calendar-popup-cell empty"></div>';
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const isAvailable = this.isDayAvailable(day);
      const classes = ['calendar-popup-cell'];
      
      if (isToday) classes.push('today');
      else if (isAvailable) classes.push('available');
      else classes.push('unavailable');

      calendarHTML += `
        <div class="${classes.join(' ')}" 
             onclick="studentDashboard.selectDateFromPopup(${day})"
             title="${this.getCurrentMonthName()} ${day}">
          ${day}
        </div>
      `;
    }

    calendarContainer.innerHTML = calendarHTML;
  }

  selectDateFromPopup(day) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const isAvailable = this.isDayAvailable(day);
    
    if (isAvailable) {
      this.showTimeSlots(selectedDate);
    } else {
      Utils.showNotification('This date is not available for booking.', 'error');
    }
  }

  isDayAvailable(day) {
    // Mock availability logic - in real app, this would check teacher schedules
    const dayOfWeek = new Date(this.currentYear, this.currentMonth, day).getDay();
    // Available on weekdays (Monday = 1, Tuesday = 2, etc.)
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  selectDate(day) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);
    const isAvailable = this.isDayAvailable(day);
    
    if (isAvailable) {
      this.showTimeSlots(selectedDate);
    } else {
      Utils.showNotification('This date is not available for booking.', 'error');
    }
  }

  showTimeSlots(date) {
    const timeSlots = ['09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00'];
    const dateStr = date.toLocaleDateString();
    
    const slotsHTML = timeSlots.map(slot => `
      <div class="time-slot" onclick="studentDashboard.bookSlot('${dateStr}', '${slot}')">
        <span>${slot}</span>
        <button class="book-btn">Book</button>
      </div>
    `).join('');

    const modal = document.createElement('div');
    modal.className = 'time-slots-modal';
    modal.innerHTML = `
      <div class="time-slots-content">
        <h3>Available Times for ${dateStr}</h3>
        <div class="time-slots-list">
          ${slotsHTML}
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="close-btn">Close</button>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  bookSlot(date, time) {
    const booking = {
      id: Utils.generateId(),
      date,
      time,
      student: auth.currentUser.username,
      bookedAt: new Date().toISOString()
    };

    // Save booking to localStorage
    const bookings = Utils.getFromStorage('studentBookings') || [];
    bookings.push(booking);
    Utils.saveToStorage('studentBookings', bookings);

    Utils.showNotification('Session booked successfully!', 'success');
    
    // Close modal
    const modal = document.querySelector('.time-slots-modal');
    if (modal) modal.remove();
  }

  renderPerformanceMetricsData(performance) {
    const metricsContainer = document.getElementById('performanceMetrics');
    if (!metricsContainer) return;
    
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
    if (!subjectList) return;
    
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
          <span style="font-weight: 600; color: var(--honey-amber);">${subject.progress}%</span>
        </div>
      </li>
    `).join('');
  }

  renderResourcesList() {
    const resourceContainer = document.getElementById('resourceList');
    if (!resourceContainer) return;
    
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
          <a href="${resource.url}" target="_blank" style="color: var(--honey-amber); text-decoration: none;">
            View →
          </a>
        </div>
      `;
    }).join('');
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
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitFeedback();
      });
    }
  }

  submitFeedback() {
    const textarea = document.querySelector('#feedbackForm textarea');
    const feedback = textarea.value.trim();
    
    if (feedback) {
      // Save feedback to localStorage
      const feedbacks = Utils.getFromStorage('studentFeedbacks') || [];
      feedbacks.push({
        id: Utils.generateId(),
        student: auth.currentUser.username,
        feedback,
        date: new Date().toISOString()
      });
      Utils.saveToStorage('studentFeedbacks', feedbacks);
      
      Utils.showNotification('Feedback submitted successfully!', 'success');
      textarea.value = '';
    } else {
      Utils.showNotification('Please enter your feedback.', 'error');
    }
  }
}

// Initialize student dashboard
const studentDashboard = new StudentDashboard(); 