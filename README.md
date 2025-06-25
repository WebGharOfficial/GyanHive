# Gyanhive A-Levels Institute - Role-Based Access Control System

This project implements a comprehensive role-based access control system for the Gyanhive A-Levels Institute website using only HTML, CSS, and JavaScript with localStorage for data persistence.

## 🚀 Features

### 🔐 Authentication System
- **Login Page**: Role-based login with Student, Teacher, and Admin options
- **Session Management**: Persistent login using localStorage
- **Access Control**: Role-based page access and feature restrictions
- **Logout Functionality**: Secure session termination

### 👨‍🎓 Student Dashboard
- **Performance Metrics**: View attendance, assignments, and subject progress
- **Booking System**: Book sessions with available teachers
- **Resource Management**: Access learning materials with progress tracking
- **Feedback System**: Submit feedback to administration
- **Approval System**: Dashboard access requires admin approval

### 👨‍🏫 Teacher Dashboard
- **Student Management**: View assigned students and their performance
- **Scheduling Calendar**: Set and manage availability slots
- **Analytics**: View student performance charts and statistics
- **Feedback Templates**: Provide structured feedback to students
- **Verification System**: Dashboard access requires admin verification

### 👨‍💼 Admin Dashboard
- **User Approval**: Approve/reject student and teacher registrations
- **Mentor Pairing**: Assign students to teachers
- **Platform Analytics**: View usage statistics and trends
- **Resource Management**: Add, edit, and delete learning resources
- **System Overview**: Complete platform management capabilities

## 🛠️ Technical Implementation

### File Structure
```
gyanhive-static-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── login.html                  # Authentication page
├── student.html                # Student dashboard
├── teacher.html                # Teacher dashboard
├── admin.html                  # Admin dashboard
├── auth.js                     # Authentication and session management
├── student-dashboard.js        # Student dashboard functionality
├── teacher-dashboard.js        # Teacher dashboard functionality
├── admin-dashboard.js          # Admin dashboard functionality
├── style.css                   # Updated styles with dashboard components
├── 404.html                    # Custom error page
├── CNAME                       # Custom domain support
├── package.json                # Project metadata
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── DEPLOYMENT.md               # Deployment guide
└── [existing pages...]         # Original website pages
```

### Data Storage
- **localStorage**: All data persisted in browser storage
- **Mock Data**: Comprehensive mock datasets for testing
- **Session Management**: User sessions and role-based access

### Security Features
- **Role Verification**: Each dashboard checks user role and approval status
- **Access Control**: Unauthorized users redirected to login
- **Session Validation**: Automatic logout on invalid sessions

## 🚀 Quick Deployment to GitHub Pages

### 1. Create GitHub Repository
```bash
# Create a new repository on GitHub named 'gyanhive-static-site'
# Make it PUBLIC (required for free GitHub Pages)
```

### 2. Upload Files
```bash
# Initialize git and push files
git init
git add .
git commit -m "Initial commit: Gyanhive A-Levels Institute"
git remote add origin https://github.com/YOUR_USERNAME/gyanhive-static-site.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "main" → "/ (root)"
4. Save

### 4. Update Configuration
- Replace `YOUR_USERNAME` in `package.json` with your GitHub username
- Update this README with your actual username

**Your site will be live at**: `https://YOUR_USERNAME.github.io/gyanhive-static-site`

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)

## 🎯 Usage Guide

### Getting Started
1. Open `login.html` in your browser (or visit the live demo)
2. Select your role (Student, Teacher, or Admin)
3. Use the provided credentials to log in

### Test Credentials

#### Student Accounts
- **Username**: `john_student` | **Password**: `pass123` (Approved)
- **Username**: `sarah_student` | **Password**: `pass123` (Pending approval)

#### Teacher Accounts
- **Username**: `dr_brown` | **Password**: `teach123` (Verified)
- **Username**: `ms_wilson` | **Password**: `teach123` (Pending verification)

#### Admin Account
- **Username**: `admin` | **Password**: `admin123`

### Dashboard Features

#### Student Dashboard
- View performance metrics and subject progress
- Book sessions with available teachers
- Track resource completion
- Submit feedback to administration

#### Teacher Dashboard
- View assigned students and their performance
- Manage availability schedule
- View student analytics and charts
- Provide feedback to students

#### Admin Dashboard
- Approve or reject pending user registrations
- Create mentor-student pairings
- View platform analytics and usage statistics
- Manage learning resources

## 🔧 Customization

### Adding New Users
1. Update the `mockUsers` object in `login.html`
2. Add corresponding performance data in `auth.js`
3. Update mentor assignments if needed

### Modifying Features
- Each dashboard is modular and can be extended
- Mock data can be replaced with real API calls
- Styling can be customized in `style.css`

### Adding New Roles
1. Add role to login page role selector
2. Create new dashboard HTML file
3. Add corresponding JavaScript functionality
4. Update authentication logic in `auth.js`

## 🎨 Design Features

### Responsive Design
- Mobile-friendly dashboards
- Adaptive layouts for all screen sizes
- Touch-friendly interface elements

### Modern UI/UX
- Clean, professional design
- Intuitive navigation
- Visual feedback and notifications
- Progress indicators and charts

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast elements
- Clear visual hierarchy

## 🔒 Security Considerations

### Client-Side Limitations
- This is a frontend-only implementation
- Data is stored in browser localStorage
- No server-side validation
- Suitable for demonstration and prototyping

### Production Recommendations
- Implement server-side authentication
- Use secure session management
- Add API endpoints for data operations
- Implement proper data encryption
- Add rate limiting and security headers

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🚀 Deployment Options

### GitHub Pages (Recommended)
- Free hosting
- Automatic deployment
- Custom domain support
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

### Other Options
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## 📞 Support

For questions or issues:
- Email: gyanhive74@gmail.com
- Instagram: @gyanhive_alevels
- GitHub Issues: Create an issue in your repository

## 📄 License

MIT License - feel free to use and modify for your projects.

---

**Live Demo**: [https://yourusername.github.io/gyanhive-static-site](https://yourusername.github.io/gyanhive-static-site)

**Note**: This system is designed for demonstration purposes. For production use, implement proper server-side security measures and data validation. 