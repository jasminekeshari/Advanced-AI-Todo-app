# ✨ My Tasks - Beautiful To-Do Application

A modern, feature-rich task management application built with Next.js and Supabase. This app combines elegant design with powerful functionality to help users organize their daily tasks efficiently.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Live Demo

https://my-ai-todo-app.netlify.app/

## 📸 Screenshots

### Desktop View
<img width="1366" height="768" alt="Screenshot (132)" src="https://github.com/user-attachments/assets/c180d76e-20a5-4331-88fd-6f3a7b138053" />


### Mobile View
<img width="1366" height="768" alt="Screenshot (133)" src="https://github.com/user-attachments/assets/c0e062d9-1b81-47f3-a76a-ab639b6c63b5" />

### 🔐 Authentication & Security
- **Secure User Authentication** with email/password
- Email verification system
- Password reset functionality
- Row-level security (RLS) in database
- Protected routes and user-specific data

### 📝 Task Management
- **Create, Read, Update, Delete (CRUD)** operations
- Mark tasks as complete/incomplete
- Add detailed notes to tasks
- Real-time updates
- Persistent storage with Supabase

### 🌐 Multilingual Support
- **English & Hindi** language support
- Seamless language switching
- Language preference persistence
- Fully localized user interface

### 🎨 Beautiful UI/UX
- **Modern gradient designs** with smooth animations
- Fully responsive (mobile-first approach)
- Loading states with skeletons
- Toast notifications for user feedback
- Empty states with helpful messages
- Clean, intuitive interface

### 🔍 Advanced Features
- **Search functionality** across task titles and notes
- **Filter tasks** by status (All, Pending, Completed)
- **Dashboard statistics** (Total, Completed, Pending)
- **AI Task Generator** - Get personalized task suggestions based on goals
- Mobile-optimized input fields

### 🎯 Additional Highlights
- Dark text on mobile (iOS/Android optimized)
- Prevents zoom on mobile inputs
- Smooth transitions and micro-interactions
- Accessible design patterns
- SEO-friendly structure

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

### Deployment
- **Netlify** - Continuous deployment
- **GitHub** - Version control

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Git installed

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app

2️⃣ Install Dependencies
bashnpm install
3️⃣ Set Up Supabase

Create a new project at Supabase
Go to Table Editor → Create new table tasks
Add these columns:

ColumnTypeDefaultSettingsiduuidgen_random_uuid()Primary Keytitletext-Not Nullnotestext-NullablecompletedbooleanfalseNot Nulluser_iduuid-Not Nullcreated_attimestamptznow()Not Nullupdated_attimestamptznow()Not Null

4. Set up Row Level Security (RLS) policies:

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT
CREATE POLICY "Users can view their own tasks"
ON tasks FOR SELECT
USING (auth.uid() = user_id);

-- Policy for INSERT
CREATE POLICY "Users can create their own tasks"
ON tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE
CREATE POLICY "Users can update their own tasks"
ON tasks FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE
CREATE POLICY "Users can delete their own tasks"
ON tasks FOR DELETE
USING (auth.uid() = user_id);

4️⃣ Environment Variables
Create a .env.local file in the root directory:
envNEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Get these values from: Supabase Dashboard → Settings → API

5️⃣ Run Development Server
bashnpm run dev
Open http://localhost:3000 in your browser.

6️⃣ Build for Production
bashnpm run build
🚀 Deployment
Deploy to Netlify

Push your code to GitHub
Connect your repository to Netlify
Configure build settings:

Build command: npm run build
Publish directory: out
Add environment variables in Netlify dashboard
Deploy!

Important: Update Supabase Settings
After deployment, add your Netlify URL to:

Supabase → Authentication → URL Configuration
Site URL: https://your-app.netlify.app
Redirect URLs: https://your-app.netlify.app/**

📁 Project Structure

todo-app/
├── app/
│   ├── page.js              # Main entry point
│   ├── layout.js            # Root layout with metadata
│   └── globals.css          # Global styles
├── components/
│   ├── AuthPage.jsx         # Authentication UI
│   └── TasksPage.jsx        # Main task management interface
├── lib/
│   ├── supabase.js          # Supabase client configuration
│   └── translations.js      # Multilingual translations
├── public/                  # Static assets
├── .env.local              # Environment variables (not committed)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── package.json            # Project dependencies
└── README.md               # Project documentation

🎨 Design Philosophy
This application follows modern design principles:

Mobile-First Approach - Optimized for mobile devices first
Progressive Enhancement - Works on all devices and browsers
Accessibility - WCAG compliant color contrasts and keyboard navigation
Performance - Optimized images and lazy loading
User Feedback - Clear loading states and error messages

🔒 Security Features

Row Level Security (RLS) - Users can only access their own data
Environment Variables - Sensitive keys stored securely
Email Verification - Users must verify email before login
Secure Authentication - Powered by Supabase Auth
HTTPS - Encrypted connections in production

🌍 Multilingual Implementation
The app uses a custom translation system stored in lib/translations.js:
javascriptexport const translations = {
  en: { /* English strings */ },
  hi: { /* Hindi strings */ }
}
Language preference is saved in localStorage and persists across sessions.
🤖 AI Task Generator
The AI feature suggests personalized tasks based on user goals. Currently uses a mock implementation that can be easily replaced with:

OpenAI API
Google Gemini
Anthropic Claude
Any LLM API

📱 Mobile Optimization
Special attention to mobile experience:

16px font size to prevent iOS zoom
-webkit-text-fill-color for consistent text rendering
Touch-friendly button sizes (44x44px minimum)
Optimized autocomplete styling
Responsive grid layouts

🧪 Testing Checklist

 User signup with email verification
 User login/logout
 Password reset functionality
 Create new tasks
 Edit existing tasks
 Delete tasks
 Mark tasks as complete/incomplete
 Search functionality
  Filter by status
 Language switching
 Mobile responsiveness
 Toast notifications
 Loading states
 Empty states

🐛 Known Issues & Future Enhancements
Planned Features

 Task categories/tags
 Due dates and reminders
 Dark mode toggle
 Task priority levels
 Drag-and-drop reordering
 Export tasks to CSV/PDF
 Real AI integration (OpenAI/Gemini)
 Collaborative tasks (sharing)
 Task attachments
 Calendar view
 🤝 Contributing
Contributions are welcome! Here's how:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add some AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open a Pull Request

🙏 Acknowledgments

Next.js Documentation
Supabase Documentation
Tailwind CSS
Lucide Icons
Sonner Toast
