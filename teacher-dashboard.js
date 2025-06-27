// Teacher Dashboard Functionality
class TeacherDashboard {
  constructor() {
    this.init();
  }

  init() {
    // Check authentication and verification
    if (!auth.requireAuth('teacher')) {
      return;
    }

    // Check if teacher is verified
    if (!auth.isApproved()) {
      this.showPendingVerification();
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

  showPendingVerification() {
    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
      <div class="pending-verification">
        <h2>Account Pending Verification</h2>
        <p>Your account is currently pending verification from the administrator. You will be able to access the dashboard once your account has been verified.</p>
        <p>Please contact the administration if you have any questions.</p>
      </div>
    `;
  }

  loadDashboard() {
    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
      <div class="dashboard-grid">
        ${this.renderAssignedStudents()}
        ${this.renderSchedulingCalendar()}
        ${this.renderStudentAnalytics()}
        ${this.renderFeedbackTemplates()}
      </div>
    `;

    this.loadTeacherData();
  }

  renderAssignedStudents() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Assigned Students</h3>
        </div>
        <ul class="student-list" id="studentList">
          <!-- Students will be loaded dynamically -->
        </ul>
      </div>
    `;
  }

  renderSchedulingCalendar() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">🍯 Schedule Availability</h3>
        </div>
        <div class="compact-calendar" onclick="teacherDashboard.showSchedulePopup()">
          <div class="compact-calendar-header">
            <span>Weekly Schedule</span>
            <i class="fa-solid fa-calendar-check" style="color: var(--honey-amber);"></i>
          </div>
          <div class="compact-schedule-preview" id="compactSchedule">
            <!-- Compact schedule preview will be generated here -->
          </div>
          <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--honey-text);">
            Click to manage your availability
          </div>
        </div>
      </div>
    `;
  }

  renderStudentAnalytics() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Student Analytics</h3>
        </div>
        <div class="stats-grid" id="statsGrid">
          <!-- Stats will be loaded dynamically -->
        </div>
        <div class="analytics-chart">
          <canvas id="analyticsChart"></canvas>
        </div>
      </div>
    `;
  }

  renderFeedbackTemplates() {
    return `
      <div class="dashboard-card">
        <div class="card-header">
          <h3 class="card-title">Student Feedback</h3>
        </div>
        <div id="feedbackTemplates">
          <!-- Feedback templates will be loaded dynamically -->
        </div>
      </div>
    `;
  }

  loadTeacherData() {
    const user = auth.currentUser;
    
    // Get assigned students
    const assignments = MockData.mentorAssignments.filter(a => a.mentor === user.username);
    const assignedStudents = assignments.map(a => {
      const studentData = MockData.studentPerformance[a.student];
      return {
        username: a.student,
        name: a.student === 'john_student' ? 'John Smith' : 'Sarah Johnson',
        performance: studentData
      };
    });

    this.renderAssignedStudentsData(assignedStudents);
    this.renderCompactSchedule();
    this.renderAnalyticsData(assignedStudents);
    this.renderFeedbackTemplatesData(assignedStudents);
  }

  renderCompactSchedule() {
    const scheduleContainer = document.getElementById('compactSchedule');
    if (!scheduleContainer) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const user = auth.currentUser;
    const availability = MockData.teacherAvailability[user.username] || [];
    
    let scheduleHTML = '';
    
    days.forEach(day => {
      const daySlots = availability.filter(s => s.day === day);
      const availableSlots = daySlots.filter(s => s.available).length;
      const totalSlots = 4; // 4 time slots per day
      const availabilityPercentage = Math.round((availableSlots / totalSlots) * 100);
      
      const statusClass = availabilityPercentage > 50 ? 'available' : 
                         availabilityPercentage > 0 ? 'partial' : 'unavailable';
      
      scheduleHTML += `
        <div class="compact-schedule-day ${statusClass}">
          <div class="day-name">${day}</div>
          <div class="availability-indicator">${availableSlots}/${totalSlots}</div>
        </div>
      `;
    });

    scheduleContainer.innerHTML = scheduleHTML;
  }

  showSchedulePopup() {
    const modal = document.createElement('div');
    modal.className = 'calendar-popup-modal';
    modal.innerHTML = `
      <div class="calendar-popup-content">
        <div class="calendar-popup-header">
          <h3>Manage Weekly Schedule</h3>
          <button class="calendar-popup-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="honeycomb-schedule-grid" id="popupScheduleGrid">
          <!-- Popup schedule will be generated here -->
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
        </div>
        <div style="text-align: center; margin-top: 1rem; color: var(--honey-text); font-size: 0.9rem;">
          Click on time slots to toggle availability
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.renderPopupSchedule();
  }

  renderPopupSchedule() {
    const scheduleGrid = document.getElementById('popupScheduleGrid');
    if (!scheduleGrid) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00'];
    const user = auth.currentUser;
    const availability = MockData.teacherAvailability[user.username] || [];
    
    let scheduleHTML = '';
    
    // Add day headers
    days.forEach(day => {
      scheduleHTML += `
        <div class="honeycomb-cell day-header">
          <strong>${day}</strong>
        </div>
      `;
    });
    
    // Add time slots for each day
    timeSlots.forEach(timeSlot => {
      days.forEach(day => {
        const slot = availability.find(s => s.day === day && s.time === timeSlot);
        const isAvailable = slot ? slot.available : false;
        const className = isAvailable ? 'available' : 'unavailable';
        
        scheduleHTML += `
          <div class="honeycomb-cell schedule-slot ${className}" 
               onclick="teacherDashboard.toggleScheduleSlot('${day}', '${timeSlot}')"
               title="${day} ${timeSlot}">
            <div class="slot-time">${timeSlot.split('-')[0]}</div>
            <div class="slot-status">${isAvailable ? '✓' : '✗'}</div>
          </div>
        `;
      });
    });
    
    scheduleGrid.innerHTML = scheduleHTML;
  }

  toggleScheduleSlot(day, time) {
    const user = auth.currentUser;
    const availability = MockData.teacherAvailability[user.username] || [];
    
    // Find existing slot
    let slot = availability.find(s => s.day === day && s.time === time);
    
    if (slot) {
      // Toggle availability
      slot.available = !slot.available;
    } else {
      // Create new slot
      slot = { day, time, available: true };
      availability.push(slot);
    }
    
    // Update mock data
    MockData.teacherAvailability[user.username] = availability;
    
    // Re-render both schedules
    this.renderPopupSchedule();
    this.renderCompactSchedule();
    
    // Show notification
    const status = slot.available ? 'available' : 'unavailable';
    Utils.showNotification(`Marked ${day} ${time} as ${status}`, 'success');
  }

  renderAssignedStudentsData(students) {
    const studentList = document.getElementById('studentList');
    if (!studentList) return;
    
    if (students.length === 0) {
      studentList.innerHTML = '<li style="text-align: center; color: #666; padding: 1rem;">No students assigned yet.</li>';
      return;
    }

    studentList.innerHTML = students.map(student => {
      const avgProgress = student.performance.subjects.reduce((sum, sub) => sum + sub.progress, 0) / student.performance.subjects.length;
      return `
        <li class="student-item">
          <div class="student-info">
            <div class="student-avatar">${student.name.charAt(0)}</div>
            <div>
              <strong>${student.name}</strong>
              <div style="color: #666; font-size: 0.9rem;">${student.performance.subjects.length} subjects</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 600; color: var(--honey-amber);">${Math.round(avgProgress)}%</div>
            <div style="color: #666; font-size: 0.8rem;">Avg Progress</div>
          </div>
        </li>
      `;
    }).join('');
  }

  renderAnalyticsData(students) {
    const statsGrid = document.getElementById('statsGrid');
    if (!statsGrid) return;
    
    const totalStudents = students.length;
    const avgAttendance = students.reduce((sum, s) => sum + s.performance.attendance, 0) / totalStudents || 0;
    const totalAssignments = students.reduce((sum, s) => sum + s.performance.assignments, 0);
    const completedAssignments = students.reduce((sum, s) => sum + s.performance.completedAssignments, 0);
    
    statsGrid.innerHTML = `
      <div class="stat-item">
        <div class="stat-value">${totalStudents}</div>
        <div class="stat-label">Students</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${Math.round(avgAttendance)}%</div>
        <div class="stat-label">Avg Attendance</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${completedAssignments}/${totalAssignments}</div>
        <div class="stat-label">Assignments</div>
      </div>
    `;
    
    // Create chart
    this.createAnalyticsChart(students);
  }

  createAnalyticsChart(students) {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;
    
    const context = ctx.getContext('2d');
    
    const labels = students.map(s => s.name);
    const progressData = students.map(s => {
      return s.performance.subjects.reduce((sum, sub) => sum + sub.progress, 0) / s.performance.subjects.length;
    });
    
    new Chart(context, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average Progress (%)',
          data: progressData,
          backgroundColor: 'var(--honey-amber)',
          borderColor: 'var(--honey-brown)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  renderFeedbackTemplatesData(students) {
    const feedbackContainer = document.getElementById('feedbackTemplates');
    if (!feedbackContainer) return;
    
    if (students.length === 0) {
      feedbackContainer.innerHTML = '<p style="text-align: center; color: #666;">No students assigned for feedback.</p>';
      return;
    }

    feedbackContainer.innerHTML = students.map(student => `
      <div class="feedback-template">
        <h4>Feedback for ${student.name}</h4>
        <form class="feedback-form" onsubmit="teacherDashboard.submitFeedback(event, '${student.username}')">
          <textarea 
            placeholder="Provide constructive feedback for ${student.name}..."
            required
          ></textarea>
          <button type="submit" class="submit-btn">Send Feedback</button>
        </form>
      </div>
    `).join('');
  }

  submitFeedback(event, studentUsername) {
    event.preventDefault();
    const form = event.target;
    const textarea = form.querySelector('textarea');
    const feedback = textarea.value.trim();
    
    if (feedback) {
      // Save feedback to localStorage
      const feedbacks = Utils.getFromStorage('teacherFeedbacks') || [];
      feedbacks.push({
        id: Utils.generateId(),
        teacher: auth.currentUser.username,
        student: studentUsername,
        feedback,
        date: new Date().toISOString()
      });
      Utils.saveToStorage('teacherFeedbacks', feedbacks);
      
      Utils.showNotification('Feedback sent successfully!', 'success');
      textarea.value = '';
    } else {
      Utils.showNotification('Please enter your feedback.', 'error');
    }
  }

  setupEventListeners() {
    // Any additional event listeners can be added here
  }
}

// Initialize teacher dashboard
const teacherDashboard = new TeacherDashboard(); 