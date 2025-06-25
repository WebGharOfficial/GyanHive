// Authentication and Session Management
class AuthManager {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Check if user has specific role
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  // Check if user is approved (for students) or verified (for teachers)
  isApproved() {
    if (!this.currentUser) return false;
    
    if (this.currentUser.role === 'student') {
      return this.currentUser.adminApproved === true;
    } else if (this.currentUser.role === 'teacher') {
      return this.currentUser.verified === true;
    } else if (this.currentUser.role === 'admin') {
      return true; // Admins are always approved
    }
    
    return false;
  }

  // Logout user
  logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }

  // Redirect if not authorized
  requireAuth(requiredRole = null) {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }

    if (requiredRole && !this.hasRole(requiredRole)) {
      alert('Access denied. You do not have permission to view this page.');
      this.logout();
      return false;
    }

    return true;
  }

  // Update user data in localStorage
  updateUser(userData) {
    this.currentUser = { ...this.currentUser, ...userData };
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  // Refresh current user from localStorage
  refreshCurrentUser() {
    this.currentUser = this.getCurrentUser();
    return this.currentUser;
  }
}

// Mock data for the application
const MockData = {
  // Student performance data
  studentPerformance: {
    'john_student': {
      subjects: [
        { name: 'Mathematics', grade: 'A', progress: 85 },
        { name: 'Physics', grade: 'B+', progress: 78 },
        { name: 'Chemistry', grade: 'A-', progress: 82 }
      ],
      attendance: 92,
      assignments: 15,
      completedAssignments: 12
    },
    'sarah_student': {
      subjects: [
        { name: 'English', grade: 'A+', progress: 90 },
        { name: 'Literature', grade: 'A', progress: 88 },
        { name: 'History', grade: 'B+', progress: 75 }
      ],
      attendance: 88,
      assignments: 12,
      completedAssignments: 10
    }
  },

  // Teacher availability
  teacherAvailability: {
    'dr_brown': [
      { day: 'Monday', time: '09:00-11:00', available: true },
      { day: 'Tuesday', time: '14:00-16:00', available: true },
      { day: 'Wednesday', time: '10:00-12:00', available: false },
      { day: 'Thursday', time: '15:00-17:00', available: true },
      { day: 'Friday', time: '11:00-13:00', available: true }
    ],
    'ms_wilson': [
      { day: 'Monday', time: '13:00-15:00', available: true },
      { day: 'Tuesday', time: '09:00-11:00', available: true },
      { day: 'Wednesday', time: '14:00-16:00', available: true },
      { day: 'Thursday', time: '10:00-12:00', available: false },
      { day: 'Friday', time: '15:00-17:00', available: true }
    ]
  },

  // Resources
  resources: [
    { id: 1, title: 'Mathematics Formula Sheet', type: 'PDF', url: '#', completed: false },
    { id: 2, title: 'Physics Lab Manual', type: 'PDF', url: '#', completed: true },
    { id: 3, title: 'Chemistry Practice Questions', type: 'PDF', url: '#', completed: false },
    { id: 4, title: 'English Essay Guide', type: 'PDF', url: '#', completed: true },
    { id: 5, title: 'History Timeline', type: 'PDF', url: '#', completed: false }
  ],

  // Pending users for admin approval
  pendingUsers: [
    { username: 'sarah_student', role: 'student', name: 'Sarah Johnson', adminApproved: false },
    { username: 'ms_wilson', role: 'teacher', name: 'Ms. Wilson', verified: false }
  ],

  // Mentor-student assignments
  mentorAssignments: [
    { mentor: 'dr_brown', student: 'john_student' },
    { mentor: 'ms_wilson', student: 'sarah_student' }
  ],

  // Platform analytics
  analytics: {
    totalStudents: 45,
    totalTeachers: 8,
    activeSessions: 23,
    resourcesAccessed: 156,
    bookingsThisWeek: 34
  }
};

// Utility functions
const Utils = {
  // Format date
  formatDate(date) {
    return new Date(date).toLocaleDateString();
  },

  // Generate random ID
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  },

  // Save data to localStorage
  saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Get data from localStorage
  getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  // Show notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
      notification.style.background = '#27ae60';
    } else if (type === 'error') {
      notification.style.background = '#e74c3c';
    } else {
      notification.style.background = '#3498db';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
};

// Initialize auth manager globally
const auth = new AuthManager(); 