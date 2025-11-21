# Makazi Fumigation Admin Panel

Admin website for managing blogs and projects on the Makazi Fumigation public website.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 📝 Blog Management (Create, Edit, Delete, Show/Hide)
- 🏗️ Project Management (Create, Edit, Delete, Show/Hide)
- 🎨 Styling consistent with the public website

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase credentials in `.env.local`. You can find these values in your Firebase Console:
   - Go to Firebase Console → Project Settings → General
   - Scroll down to "Your apps" section
   - Copy the config values

   The `.env.local` file should look like:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. **Important**: Make sure you use the same Firebase project as your public website so the admin panel can manage the same data.

### 3. Set Up Firebase Authentication

1. In Firebase Console, go to Authentication → Sign-in method
2. Enable "Email/Password" authentication
3. Create a user account for admin access (Authentication → Users → Add user)

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the login page.

## Usage

1. **Login**: Navigate to `/login` and sign in with your Firebase email/password credentials
2. **Dashboard**: After login, you'll see the admin dashboard at `/dashboard`
3. **Manage Blogs**: Go to `/dashboard/blogs` to create, edit, delete, or toggle visibility of blog posts
4. **Manage Projects**: Go to `/dashboard/projects` to create, edit, delete, or toggle visibility of projects

## Data Structure

The admin panel writes to the same Firestore collections as the public website reads from:

- **Blogs Collection**: Stores blog posts with fields:
  - `blog_title`, `blog_summary`, `blog_body`, `blog_image`
  - `blog_visibility` (true/false to show/hide on public site)
  - `blog_submitted_time` (timestamp)

- **Projects Collection**: Stores projects with fields:
  - `project_title`, `project_description`, `project_image`, `project_destination`
  - `project_visibility` (true/false to show/hide on public site)
  - `project_submitted_time` (timestamp)

## Security

- Only authenticated users can access the admin panel
- All routes under `/dashboard` are protected
- Unauthenticated users are redirected to `/login`
