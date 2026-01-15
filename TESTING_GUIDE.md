# 🧪 Testing Guide - New Features

## 🎯 What to Test

Follow these steps to test all new features:

---

## Test 1: Multiple Images Upload ✅

### Steps:
1. **Login** (if not already logged in)
   - Username: `admin`
   - Password: `admin123`

2. **Click "Add New Project"** button

3. **Fill in project details:**
   - Title: "Test Project with Multiple Images"
   - Description: "Testing the new multiple image feature"
   - Technologies: "React, Node.js, MongoDB"
   - Live URL: "https://example.com"
   - GitHub URL: "https://github.com/test/project"

4. **Upload Multiple Images:**
   - Click "Upload Images" button
   - Select 3-5 images from your computer (hold Ctrl/Cmd to select multiple)
   - Wait for upload progress
   - ✅ **Expected:** All images appear in the gallery below

5. **Verify Gallery Display:**
   - ✅ Images should appear in a grid layout
   - ✅ First image should have "Main" badge
   - ✅ Hover over images to see overlay with buttons

---

## Test 2: Set Primary Image ⭐

### Steps:
1. **Hover over the second or third image** in the gallery

2. **Click the star icon** ⭐

3. **Verify:**
   - ✅ "Main" badge moves to the selected image
   - ✅ Success notification appears
   - ✅ Image is now marked as primary

4. **Try setting different images as primary**
   - ✅ Only one image should have "Main" badge at a time

---

## Test 3: Delete Image 🗑️

### Steps:
1. **Hover over any image** (except the main one)

2. **Click the trash icon** 🗑️

3. **Confirm deletion** in the dialog

4. **Verify:**
   - ✅ Image is removed from gallery
   - ✅ Success notification appears
   - ✅ Other images remain

5. **Try to save project with only 1 image:**
   - Delete all but one image
   - ✅ Should still be able to save

---

## Test 4: Save Project with Multiple Images 💾

### Steps:
1. **Ensure you have 2-3 images** in the gallery

2. **Click "Save Project"** button

3. **Verify:**
   - ✅ Success notification appears
   - ✅ Modal closes
   - ✅ Project appears in the list

4. **Edit the project again:**
   - Click "Edit" on the project you just created
   - ✅ All images should load in the gallery
   - ✅ Primary image should have "Main" badge

---

## Test 5: Profile Management 👤

### Steps:
1. **Click "Admin"** in the top-right corner
   - Or go to: `http://localhost:3000/admin/profile`

2. **Verify Profile Page Loads:**
   - ✅ Profile picture displays (default avatar)
   - ✅ Form fields are populated
   - ✅ Account details show

---

## Test 6: Upload Profile Picture 🖼️

### Steps:
1. **On Profile page, hover over profile picture**

2. **Click "Change Photo"** button

3. **Select an image** (max 2MB)

4. **Verify:**
   - ✅ Upload progress shows
   - ✅ Profile picture updates immediately
   - ✅ Success notification appears

5. **Refresh the page:**
   - ✅ New profile picture should persist

---

## Test 7: Update Profile Information ✏️

### Steps:
1. **Edit the profile fields:**
   - Full Name: "Your Full Name"
   - Email: "your@email.com"
   - Bio: "Full-stack developer and designer"

2. **Click "Save Profile"**

3. **Verify:**
   - ✅ Success notification appears
   - ✅ Changes are saved

4. **Refresh the page:**
   - ✅ Updated information should persist

---

## Test 8: Change Password 🔑

### Steps:
1. **Scroll to "Change Password" section**

2. **Fill in the form:**
   - Current Password: `admin123`
   - New Password: `newpassword123`
   - Confirm Password: `newpassword123`

3. **Click "Change Password"**

4. **Verify:**
   - ✅ Success notification appears
   - ✅ Form resets

5. **Test password validation:**
   - Try mismatched passwords
   - ✅ Should show error
   - Try password < 6 characters
   - ✅ Should show error

6. **Logout and login with new password:**
   - Click "Logout"
   - Login with new password
   - ✅ Should work

⚠️ **Note:** Remember to update your `.env` file with the new password!

---

## Test 9: Password Visibility Toggle 👁️

### Steps:
1. **In password fields, click the eye icon**

2. **Verify:**
   - ✅ Password becomes visible
   - ✅ Icon changes to eye-slash
   - ✅ Click again to hide

---

## Test 10: Navigation Between Pages 🔄

### Steps:
1. **From Dashboard, click "Admin" → Profile**
   - ✅ Should navigate to profile page

2. **From Profile, click "Dashboard"**
   - ✅ Should navigate back to dashboard

3. **Click "Logout"**
   - ✅ Should redirect to login page

4. **Login again**
   - ✅ Should redirect to dashboard

---

## Test 11: Responsive Design 📱

### Steps:
1. **Open browser DevTools** (F12)

2. **Toggle device toolbar** (Ctrl+Shift+M)

3. **Test different screen sizes:**
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

4. **Verify:**
   - ✅ Image gallery is responsive
   - ✅ Forms are usable on mobile
   - ✅ Navigation works on all sizes
   - ✅ Profile page is responsive

---

## Test 12: Error Handling ⚠️

### Test File Upload Errors:

1. **Try uploading a non-image file:**
   - ✅ Should show error notification

2. **Try uploading a file > 5MB:**
   - ✅ Should show error notification

3. **Try uploading profile picture > 2MB:**
   - ✅ Should show error notification

### Test Form Validation:

1. **Try saving project without images:**
   - ✅ Should show error notification

2. **Try changing password with wrong current password:**
   - ✅ Should show error notification

---

## ✅ Testing Checklist

Mark each item as you test:

### Multiple Images:
- [ ] Upload multiple images
- [ ] Images display in gallery
- [ ] Set primary image
- [ ] Delete image
- [ ] Save project with images
- [ ] Edit project loads images

### Profile Management:
- [ ] Profile page loads
- [ ] Upload profile picture
- [ ] Update profile information
- [ ] Change password
- [ ] Password visibility toggle
- [ ] Form validation works

### General:
- [ ] Navigation works
- [ ] Logout/Login works
- [ ] Notifications display
- [ ] Responsive on mobile
- [ ] Error handling works
- [ ] Data persists after refresh

---

## 🐛 Found a Bug?

If you find any issues:

1. **Check browser console** (F12 → Console tab)
2. **Check server terminal** for errors
3. **Note the steps to reproduce**
4. **Check if data persists** after refresh

---

## 📊 Expected Results Summary

After testing, you should have:
- ✅ At least one project with multiple images
- ✅ Updated profile with custom picture
- ✅ Changed admin password
- ✅ All features working smoothly

---

## 🎉 Success Criteria

All features are working if:
- ✅ Can upload and manage multiple images per project
- ✅ Can set and change primary image
- ✅ Can delete individual images
- ✅ Can upload and change profile picture
- ✅ Can update profile information
- ✅ Can change password
- ✅ All data persists after refresh
- ✅ No console errors
- ✅ Responsive on all devices

---

**Happy Testing!** 🚀

If everything works, you're ready to use your enhanced admin dashboard!

