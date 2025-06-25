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
          <h3 class="card-title">Schedule Availability</h3>
        </div>
        <div class="schedule-grid" id="scheduleGrid">
          <!-- Schedule will be loaded dynamically -->
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
    this.renderSchedulingData();
    this.renderAnalyticsData(assignedStudents);
    this.renderFeedbackTemplatesData(assignedStudents);
  }

  renderAssignedStudentsData(students) {
    const studentList = document.getElementById('studentList');
    
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
            <div style="font-weight: 600; color: #667eea;">${Math.round(avgProgress)}%</div>
            <div style="color: #666; font-size: 0.8rem;">Avg Progress</div>
          </div>
        </li>
      `;
    }).join('');
  }

  renderSchedulingData() {
    const scheduleGrid = document.getElementById('scheduleGrid');
    const user = auth.currentUser;
    const availability = MockData.teacherAvailability[user.username] || [];
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['09:00-11:00', '11:00-13:00', '14:00-16:00', '16:00-18:00'];
    
    let scheduleHTML = '<div style="grid-column: 1 / -1; text-align: center; font-weight: bold; margin-bottom: 0.5rem;">Time Slots</div>';
    
    days.forEach(day => {
      scheduleHTML += `<div style="text-align: center; font-weight: bold; padding: 0.5rem;">${day}</div>`;
    });
    
    timeSlots.forEach(timeSlot => {
      scheduleHTML += `<div style="text-align: center; font-weight: bold; padding: 0.5rem;">${timeSlot}</div>`;
      
      days.forEach(day => {
        const slot = availability.find(s => s.day === day && s.time === timeSlot);
        const isAvailable = slot ? slot.available : false;
        const className = isAvailable ? 'available' : 'unavailable';
        const text = isAvailable ? 'Available' : 'Busy';
        
        scheduleHTML += `
          <div class="schedule-slot ${className}" 
               onclick="teacherDashboard.toggleSlot('${day}', '${timeSlot}')"
               title="${day} ${timeSlot}">
            ${text}
          </div>
        `;
      });
    });
    
    scheduleGrid.innerHTML = scheduleHTML;
  }

  renderAnalyticsData(students) {
    const statsGrid = document.getElementById('statsGrid');
    
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
    const ctx = document.getElementById('analyticsChart').getContext('2d');
    
    const labels = students.map(s => s.name);
    const progressData = students.map(s => {
      return s.performance.subjects.reduce((sum, sub) => sum + sub.progress, 0) / s.performance.subjects.length;
    });
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average Progress (%)',
          data: progressData,
          backgroundColor: '#667eea',
          borderColor: '#5a6fd8',
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
    
    if (students.length === 0) {
      feedbackContainer.innerHTML = '<p style="text-align: center; color: #666;">No students assigned for feedback.</p>';
      return;
    }
    
    feedbackContainer.innerHTML = students.map(student => `
      <div class="feedback-template">
        <h4>Feedback for ${student.name}</h4>
        <form class="feedback-form" onsubmit="teacherDashboard.submitFeedback(event, '${student.username}')">
          <textarea 
            placeholder="Provide feedback on performance, areas for improvement, and recommendations..."
            required
          ></textarea>
          <button type="submit" class="submit-btn">Submit Feedback</button>
        </form>
      </div>
    `).join('');
  }

  toggleSlot(day, time) {
    const user = auth.currentUser;
    const availability = MockData.teacherAvailability[user.username] || [];
    
    let slot = availability.find(s => s.day === day && s.time === time);
    if (!slot) {
      slot = { day, time, available: false };
      availability.push(slot);
    }
    
    slot.available = !slot.available;
    
    // Update localStorage
    const teacherSchedules = Utils.getFromStorage('teacherSchedules') || {};
    teacherSchedules[user.username] = availability;
    Utils.saveToStorage('teacherSchedules', teacherSchedules);
    
    // Refresh schedule display
    this.renderSchedulingData();
    
    Utils.showNotification(
      `Slot ${slot.available ? 'marked as available' : 'marked as busy'}`,
      'success'
    );
  }

  submitFeedback(event, studentUsername) {
    event.preventDefault();
    
    const form = event.target;
    const textarea = form.querySelector('textarea');
    const feedback = textarea.value.trim();
    
    if (!feedback) {
      Utils.showNotification('Please enter feedback.', 'error');
      return;
    }

    const feedbackData = {
      id: Utils.generateId(),
      teacher: auth.currentUser.username,
      student: studentUsername,
      feedback,
      date: new Date().toISOString()
    };

    // Save feedback to localStorage
    const feedbacks = Utils.getFromStorage('teacherFeedbacks') || [];
    feedbacks.push(feedbackData);
    Utils.saveToStorage('teacherFeedbacks', feedbacks);

    // Clear form
    textarea.value = '';
    
    Utils.showNotification('Feedback submitted successfully!', 'success');
  }

  setupEventListeners() {
    // Additional event listeners can be added here
  }
}

// Initialize teacher dashboard
const teacherDashboard = new TeacherDashboard(); 