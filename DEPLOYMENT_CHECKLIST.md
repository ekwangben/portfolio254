# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Create `.env` file with secure credentials
- [ ] Set strong `ADMIN_PASSWORD` (not default)
- [ ] Set random `SESSION_SECRET` (long random string)
- [ ] Update `ADMIN_USERNAME` if needed

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
SESSION_SECRET=your-very-long-random-secret-key-here
PORT=3000
```

### 2. Directory Structure
- [ ] Verify `images/` directory exists
- [ ] Verify `images/profile/` directory exists
- [ ] Set proper file permissions (read/write for server)
- [ ] Ensure `projects.json` exists
- [ ] Ensure `admin-profile.json` exists

### 3. Dependencies
- [ ] Run `npm install` to install all dependencies
- [ ] Verify Node.js version (14+ required)
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Update packages if needed: `npm update`

### 4. File Permissions
```bash
# Linux/Mac
chmod 755 images/
chmod 755 images/profile/
chmod 644 projects.json
chmod 644 admin-profile.json

# Windows - ensure write permissions for server process
```

### 5. Test All Features
- [ ] Server starts without errors
- [ ] Admin login works
- [ ] Dashboard loads projects
- [ ] Can add new project
- [ ] Can upload multiple images
- [ ] Can set primary image
- [ ] Can delete images
- [ ] Can edit project
- [ ] Can delete project
- [ ] Profile page loads
- [ ] Can update profile info
- [ ] Can upload profile picture
- [ ] Can change password
- [ ] Portfolio page displays correctly
- [ ] Contact form works

---

## 🔒 Security Checklist

### Critical Security Items:
- [ ] Change default admin password
- [ ] Use strong session secret (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set secure cookie options
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Validate file uploads
- [ ] Set proper CORS headers
- [ ] Hide error stack traces in production

### Recommended Security Enhancements:
```javascript
// Add to server.js for production

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// CORS
const cors = require('cors');
app.use(cors({
    origin: 'https://yourdomain.com',
    credentials: true
}));
```

---

## 📦 Production Deployment

### Option 1: Traditional Server (VPS/Dedicated)

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone/Upload Project**
```bash
git clone your-repo-url
cd your-project
npm install
```

3. **Setup PM2 (Process Manager)**
```bash
npm install -g pm2
pm2 start server.js --name "portfolio"
pm2 startup
pm2 save
```

4. **Setup Nginx (Reverse Proxy)**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Option 2: Heroku

1. **Create Heroku App**
```bash
heroku create your-app-name
```

2. **Add Procfile**
```
web: node server.js
```

3. **Set Environment Variables**
```bash
heroku config:set ADMIN_USERNAME=admin
heroku config:set ADMIN_PASSWORD=YourSecurePassword
heroku config:set SESSION_SECRET=your-secret-key
```

4. **Deploy**
```bash
git push heroku main
```

### Option 3: Vercel/Netlify
- Note: These platforms are for static sites
- You'll need to deploy the backend separately
- Consider using serverless functions

---

## 🗄️ Database Migration (Optional)

### Current Setup:
- Projects stored in `projects.json`
- Profile stored in `admin-profile.json`

### Recommended for Production:
Migrate to a real database (MongoDB, PostgreSQL, MySQL)

**Why?**
- Better performance
- Data integrity
- Concurrent access
- Backup/restore
- Scalability

---

## 📊 Monitoring & Maintenance

### Setup Monitoring:
- [ ] Server uptime monitoring (UptimeRobot, Pingdom)
- [ ] Error logging (Sentry, LogRocket)
- [ ] Performance monitoring (New Relic, DataDog)
- [ ] Analytics (Google Analytics)

### Regular Maintenance:
- [ ] Weekly: Check server logs
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review security
- [ ] Quarterly: Backup data
- [ ] Yearly: Review and optimize

---

## 🔄 Backup Strategy

### What to Backup:
1. `projects.json` - All project data
2. `admin-profile.json` - Profile data
3. `images/` - All uploaded images
4. `.env` - Environment variables (store securely!)

### Automated Backup Script:
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$DATE"

mkdir -p $BACKUP_DIR
cp projects.json $BACKUP_DIR/
cp admin-profile.json $BACKUP_DIR/
cp -r images/ $BACKUP_DIR/

echo "Backup created: $BACKUP_DIR"
```

### Schedule with Cron:
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## 🎯 Performance Optimization

### Image Optimization:
- [ ] Compress images before upload
- [ ] Use WebP format
- [ ] Implement lazy loading
- [ ] Add CDN for images

### Caching:
- [ ] Enable browser caching
- [ ] Add Redis for session storage
- [ ] Cache static assets
- [ ] Use CDN for static files

### Code Optimization:
- [ ] Minify CSS/JS
- [ ] Enable gzip compression
- [ ] Remove unused code
- [ ] Optimize database queries

---

## 📝 Post-Deployment

### Immediate Actions:
1. [ ] Test all features in production
2. [ ] Verify SSL certificate
3. [ ] Check mobile responsiveness
4. [ ] Test contact form
5. [ ] Verify image uploads work
6. [ ] Test admin login
7. [ ] Check all links

### Documentation:
1. [ ] Document deployment process
2. [ ] Create admin user guide
3. [ ] Document API endpoints
4. [ ] Create troubleshooting guide

### Share with Team:
1. [ ] Admin credentials (securely)
2. [ ] Server access details
3. [ ] Deployment documentation
4. [ ] Emergency contacts

---

## 🆘 Troubleshooting

### Common Issues:

**Server won't start:**
- Check port 3000 is available
- Verify Node.js is installed
- Check .env file exists
- Review error logs

**Images not uploading:**
- Check directory permissions
- Verify disk space
- Check file size limits
- Review multer configuration

**Can't login:**
- Verify credentials in .env
- Check session configuration
- Clear browser cookies
- Check server logs

**Database errors:**
- Verify JSON files exist
- Check file permissions
- Validate JSON syntax
- Check disk space

---

## ✅ Final Checklist

Before going live:
- [ ] All tests passing
- [ ] Security measures in place
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Documentation complete
- [ ] Team trained
- [ ] Emergency plan ready
- [ ] Performance optimized
- [ ] SSL certificate active
- [ ] Domain configured

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Version:** 2.0.0  
**Status:** ⬜ Ready for Production

