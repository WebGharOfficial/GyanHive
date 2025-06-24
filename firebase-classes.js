// Firebase config (replace with your own from Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let userRole = null;

const loginBtn = document.getElementById('login-btn');
const loginStatus = document.getElementById('login-status');
const calendarDiv = document.getElementById('calendar');
const calendarControls = document.getElementById('calendar-controls');

function showLoginError(msg) {
  loginStatus.textContent = msg;
  calendarDiv.style.display = 'none';
  calendarControls.style.display = 'none';
}

function showCalendar() {
  calendarDiv.style.display = 'block';
  if (userRole === 'teacher') {
    calendarControls.style.display = 'block';
  } else {
    calendarControls.style.display = 'none';
  }
}

loginBtn.onclick = function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      currentUser = result.user;
      checkUserAccess(currentUser.email);
    })
    .catch(error => {
      showLoginError('Login failed. Please try again.');
    });
};

function checkUserAccess(email) {
  db.collection('users').doc(email).get().then(doc => {
    if (doc.exists) {
      userRole = doc.data().role; // 'student' or 'teacher'
      loginStatus.textContent = `Logged in as ${email} (${userRole})`;
      document.getElementById('login-section').style.display = 'none';
      showCalendar();
      loadCalendar();
    } else {
      showLoginError('Access denied. Your email is not registered.');
      auth.signOut();
    }
  });
}

function loadCalendar() {
  db.collection('calendar').onSnapshot(snapshot => {
    const events = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      // Ensure subject and teacher fields exist for each event
      events.push({
        ...data,
        subject: data.subject || 'A-level Subject',
        teacher: data.teacher || 'Gyanhive Teacher'
      });
    });
    renderCalendar(events);
  });
}

function renderCalendar(events) {
  calendarDiv.innerHTML = '';
  const calendar = new FullCalendar.Calendar(calendarDiv, {
    initialView: 'dayGridMonth',
    initialDate: new Date(),
    height: 600,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    events: events,
    editable: userRole === 'teacher',
    selectable: userRole === 'teacher',
    eventDidMount: function(info) {
      // Tooltip for subject and teacher
      const tooltip = document.createElement('div');
      tooltip.className = 'fc-tooltip';
      tooltip.innerHTML = `<strong>Subject:</strong> ${info.event.extendedProps.subject}<br><strong>Teacher:</strong> ${info.event.extendedProps.teacher}`;
      tooltip.style.position = 'absolute';
      tooltip.style.zIndex = '9999';
      tooltip.style.background = 'rgba(255,255,255,0.97)';
      tooltip.style.border = '1.5px solid #bfa100';
      tooltip.style.borderRadius = '10px';
      tooltip.style.boxShadow = '0 2px 12px #ffe06655';
      tooltip.style.padding = '0.7rem 1.1rem';
      tooltip.style.fontSize = '1rem';
      tooltip.style.color = '#4b3c00';
      tooltip.style.display = 'none';
      document.body.appendChild(tooltip);
      info.el.addEventListener('mouseenter', e => {
        tooltip.style.display = 'block';
        const rect = info.el.getBoundingClientRect();
        tooltip.style.left = (rect.left + window.scrollX + rect.width/2 - tooltip.offsetWidth/2) + 'px';
        tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 8) + 'px';
      });
      info.el.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    },
    dateClick: userRole === 'teacher' ? function(info) {
      if (confirm('Add a class on ' + info.dateStr + '?')) {
        const title = prompt('Class Title:');
        const subject = prompt('Subject:');
        const teacher = prompt('Teacher:');
        if (title) {
          db.collection('calendar').add({
            title: title,
            subject: subject || 'A-level Subject',
            teacher: teacher || 'Gyanhive Teacher',
            start: info.dateStr,
            allDay: true
          });
        }
      }
    } : null,
    eventClick: userRole === 'teacher' ? function(info) {
      if (confirm('Delete this class?')) {
        db.collection('calendar').where('title', '==', info.event.title).where('start', '==', info.event.startStr).get().then(snapshot => {
          snapshot.forEach(doc => doc.ref.delete());
        });
      }
    } : null
  });
  calendar.render();
} 