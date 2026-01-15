# Admin Dashboard Guide

## 🎯 Overview
Your portfolio now has a complete admin dashboard for managing projects without editing code!

## 🔐 Access

### Local Development
- **Portfolio**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials in `.env` file before deploying to production!

## 📝 How to Use

### 1. Login
1. Go to `http://localhost:3000/admin`
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click "Login"

### 2. Add a New Project
1. Click the "Add New Project" button
2. Fill in the form:
   - **Project Title**: Name of your project
   - **Description**: Brief description of what it does
   - **Technologies**: Comma-separated list (e.g., React, Node.js, MongoDB)
   - **Live URL**: Link to the deployed project
   - **GitHub URL**: Link to the GitHub repository
   - **Project Image**: Path to image (e.g., `images/my-project.png`)
3. Click "Save Project"
4. Your project will instantly appear on your portfolio!

### 3. Edit a Project
1. Find the project in the list
2. Click the "Edit" button
3. Update the fields you want to change
4. Click "Save Project"

### 4. Delete a Project
1. Find the project in the list
2. Click the "Delete" button
3. Confirm the deletion
4. The project will be removed from your portfolio

### 5. Logout
- Click the "Logout" button in the top right corner

## 📁 File Structure

```
portfolio254/
├── admin/
│   ├── login.html       # Admin login page
│   ├── dashboard.html   # Admin dashboard
│   ├── admin.css        # Admin styles
│   └── admin.js         # Admin functionality
├── projects.json        # Projects data storage
├── server.js            # Backend with admin routes
└── .env                 # Environment variables (credentials)
```

## 🔒 Security Features

- ✅ Password-protected admin area
- ✅ Session-based authentication
- ✅ Unauthorized access blocked
- ✅ Credentials stored in environment variables
- ✅ Auto-logout on session expiry (24 hours)

## 🚀 Deployment to Render

### Step 1: Update .env on Render
When deploying to Render, add these environment variables:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_USERNAME=your-chosen-username
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=random-long-string-here
PORT=3000
```

### Step 2: Access Your Admin
After deployment, your admin will be at:
```
https://your-app.onrender.com/admin
```

## 💡 Tips

### Adding Project Images
1. Upload your project screenshot to the `images/` folder
2. In the admin form, enter the path: `images/your-image.png`
3. Make sure the image exists before saving

### Best Practices
- Use descriptive project titles
- Keep descriptions concise (2-3 sentences)
- List 3-5 key technologies
- Always test your live URLs before adding them
- Use high-quality project screenshots (recommended: 800x600px)

## 🛠️ Troubleshooting

### Can't Login?
- Check that the server is running (`node server.js`)
- Verify credentials in `.env` file
- Clear browser cookies and try again

### Projects Not Showing?
- Check that `projects.json` exists
- Verify the JSON format is valid
- Check browser console for errors

### Server Not Starting?
- Make sure port 3000 is not in use
- Run `npm install` to install dependencies
- Check for syntax errors in `server.js`

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12)
2. Check the server terminal for errors
3. Verify all files are in the correct locations
4. Make sure all dependencies are installed

## 🎨 Customization

### Change Admin Credentials
Edit `.env` file:
```env
ADMIN_USERNAME=your-new-username
ADMIN_PASSWORD=your-new-password
```

### Change Session Duration
Edit `server.js` line ~22:
```javascript
cookie: { 
    maxAge: 24 * 60 * 60 * 1000 // Change this (in milliseconds)
}
```

---

**Congratulations! You now have a professional admin dashboard for your portfolio!** 🎉

