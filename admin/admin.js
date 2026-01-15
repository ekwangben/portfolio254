// Check if we're on the login page, dashboard, or profile page
const isLoginPage = window.location.pathname.includes('login');
const isDashboardPage = window.location.pathname.includes('dashboard');
const isProfilePage = window.location.pathname.includes('profile');

// Login functionality
if (isLoginPage) {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to dashboard
                window.location.href = '/admin/dashboard';
            } else {
                errorMessage.textContent = data.message || 'Invalid credentials';
                errorMessage.classList.add('show');
            }
        } catch (error) {
            errorMessage.textContent = 'Login failed. Please try again.';
            errorMessage.classList.add('show');
        }
    });
}

// Dashboard functionality
if (isDashboardPage) {
    let projects = [];
    let editingProjectId = null;
    let projectImages = []; // Array to store multiple images

    // DOM Elements
    const projectsList = document.getElementById('projectsList');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const projectModal = document.getElementById('projectModal');
    const deleteModal = document.getElementById('deleteModal');
    const projectForm = document.getElementById('projectForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const modalTitle = document.getElementById('modalTitle');

    // Load projects on page load
    loadProjects();

    // Event Listeners
    addProjectBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    logoutBtn.addEventListener('click', logout);
    projectForm.addEventListener('submit', saveProject);

    // Image upload event listener
    const imageFileInput = document.getElementById('imageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', handleImageUpload);
    }

    // Close modal when clicking outside
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeModal();
    });

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });

    // Functions
    async function loadProjects() {
        try {
            const response = await fetch('/api/projects');
            projects = await response.json();
            renderProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
            showNotification('Failed to load projects', 'error');
        }
    }

    function renderProjects() {
        if (projects.length === 0) {
            projectsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>No Projects Yet</h3>
                    <p>Click "Add New Project" to create your first project</p>
                </div>
            `;
            return;
        }

        projectsList.innerHTML = projects.map(project => `
            <div class="project-item">
                <img src="/${project.image}" alt="${project.title}" class="project-image" onerror="this.src='https://via.placeholder.com/150x100?text=No+Image'">
                <div class="project-details">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links-info">
                        <a href="${project.liveUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Live</a>
                        <a href="${project.githubUrl}" target="_blank"><i class="fab fa-github"></i> GitHub</a>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="action-btn edit-btn" onclick="editProject('${project.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProject('${project.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }




    function openModal(project = null) {
        editingProjectId = project ? project.id : null;

        // Clear image gallery
        const gallery = document.getElementById('imageGallery');
        gallery.innerHTML = '';
        projectImages = [];

        if (project) {
            // Edit mode
            modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Project';
            document.getElementById('projectId').value = project.id;
            document.getElementById('title').value = project.title;
            document.getElementById('description').value = project.description;
            document.getElementById('technologies').value = project.technologies.join(', ');
            document.getElementById('liveUrl').value = project.liveUrl;
            document.getElementById('githubUrl').value = project.githubUrl;

            // Load existing images
            if (project.images && Array.isArray(project.images)) {
                projectImages = [...project.images];
                project.images.forEach((img, index) => {
                    addImageToGallery(img, index === 0);
                });
            } else if (project.image) {
                // Backward compatibility for single image
                projectImages = [project.image];
                addImageToGallery(project.image, true);
            }

            updateImageInputs();
        } else {
            // Add mode
            modalTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Add New Project';
            projectForm.reset();
        }

        projectModal.classList.add('show');
    }

    function closeModal() {
        projectModal.classList.remove('show');
        projectForm.reset();
        editingProjectId = null;

        // Clear image gallery
        const gallery = document.getElementById('imageGallery');
        gallery.innerHTML = '';
        projectImages = [];
    }

    function closeDeleteModal() {
        deleteModal.classList.remove('show');
        editingProjectId = null;
    }

    async function saveProject(e) {
        e.preventDefault();

        // Validate that at least one image is uploaded
        if (projectImages.length === 0) {
            showNotification('Please upload at least one image', 'error');
            return;
        }

        const formData = new FormData(projectForm);
        const projectData = {
            id: formData.get('id') || Date.now().toString(),
            title: formData.get('title'),
            description: formData.get('description'),
            technologies: formData.get('technologies').split(',').map(t => t.trim()),
            liveUrl: formData.get('liveUrl'),
            githubUrl: formData.get('githubUrl'),
            image: projectImages[0], // First image as main image
            images: projectImages // All images
        };

        try {
            const url = editingProjectId ? '/api/admin/projects/update' : '/api/admin/projects/add';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData)
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.message || 'Project saved successfully!', 'success');
                closeModal();
                loadProjects();
            } else {
                showNotification(data.message || 'Failed to save project', 'error');
            }
        } catch (error) {
            console.error('Error saving project:', error);
            showNotification('Failed to save project', 'error');
        }
    }

    window.editProject = function(id) {
        const project = projects.find(p => p.id === id);
        if (project) {
            openModal(project);
        }
    }

    window.deleteProject = function(id) {
        editingProjectId = id;
        deleteModal.classList.add('show');
    }

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!editingProjectId) return;

        try {
            const response = await fetch('/api/admin/projects/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: editingProjectId })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.message || 'Project deleted successfully!', 'success');
                closeDeleteModal();
                loadProjects();
            } else {
                showNotification(data.message || 'Failed to delete project', 'error');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            showNotification('Failed to delete project', 'error');
        }
    });

    async function logout() {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        } catch (error) {
            window.location.href = '/admin/login';
        }
    }

    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Handle multiple image uploads
    async function handleImageUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const uploadProgress = document.getElementById('uploadProgress');
        uploadProgress.style.display = 'block';

        let uploadedCount = 0;
        let failedCount = 0;

        for (let file of files) {
            // Validate file type
            if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
                showNotification(`${file.name}: Invalid file type`, 'error');
                failedCount++;
                continue;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showNotification(`${file.name}: File too large (max 5MB)`, 'error');
                failedCount++;
                continue;
            }

            // Create FormData and upload
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('/api/admin/upload-image', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    // Add to project images array
                    projectImages.push(data.imagePath);

                    // Add to gallery
                    addImageToGallery(data.imagePath);

                    uploadedCount++;
                } else {
                    showNotification(data.message || `Failed to upload ${file.name}`, 'error');
                    failedCount++;
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                failedCount++;
            }
        }

        uploadProgress.style.display = 'none';
        event.target.value = ''; // Reset file input

        if (uploadedCount > 0) {
            showNotification(`${uploadedCount} image(s) uploaded successfully!`, 'success');
            updateImageInputs();
        }
        if (failedCount > 0) {
            showNotification(`${failedCount} image(s) failed to upload`, 'error');
        }
    }

    // Add image to gallery
    function addImageToGallery(imagePath, isPrimary = false) {
        const gallery = document.getElementById('imageGallery');
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item' + (isPrimary ? ' primary-image' : '');
        galleryItem.dataset.imagePath = imagePath;

        galleryItem.innerHTML = `
            <img src="/${imagePath}" alt="Project Image">
            <div class="gallery-item-overlay">
                <button type="button" class="gallery-item-btn primary-btn" onclick="setAsPrimaryImage('${imagePath}')" title="Set as main image">
                    <i class="fas fa-star"></i>
                </button>
                <button type="button" class="gallery-item-btn delete-btn" onclick="deleteImage('${imagePath}')" title="Delete image">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        gallery.appendChild(galleryItem);
    }

    // Set image as primary
    window.setAsPrimaryImage = function(imagePath) {
        // Remove primary class from all items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.classList.remove('primary-image');
        });

        // Add primary class to selected item
        const selectedItem = document.querySelector(`[data-image-path="${imagePath}"]`);
        if (selectedItem) {
            selectedItem.classList.add('primary-image');
        }

        // Move to first position in array
        const index = projectImages.indexOf(imagePath);
        if (index > -1) {
            projectImages.splice(index, 1);
            projectImages.unshift(imagePath);
        }

        updateImageInputs();
        showNotification('Primary image updated', 'success');
    }

    // Delete image
    window.deleteImage = function(imagePath) {
        if (!confirm('Are you sure you want to delete this image?')) return;

        // Remove from array
        const index = projectImages.indexOf(imagePath);
        if (index > -1) {
            projectImages.splice(index, 1);
        }

        // Remove from gallery
        const galleryItem = document.querySelector(`[data-image-path="${imagePath}"]`);
        if (galleryItem) {
            galleryItem.remove();
        }

        updateImageInputs();
        showNotification('Image deleted', 'success');
    }

    // Update hidden inputs with image data
    function updateImageInputs() {
        document.getElementById('images').value = JSON.stringify(projectImages);
        // Set first image as main image for backward compatibility
        document.getElementById('image').value = projectImages[0] || '';
    }
}


// Profile Page functionality
if (isProfilePage) {
    let profileData = {};

    // Load profile data
    loadProfile();

    // Event Listeners
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const profilePictureInput = document.getElementById('profilePictureInput');
    const logoutBtn = document.getElementById('logoutBtn');

    if (profileForm) {
        profileForm.addEventListener('submit', saveProfile);
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', changePassword);
    }

    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', uploadProfilePicture);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Load profile
    async function loadProfile() {
        try {
            const response = await fetch('/api/admin/profile');
            profileData = await response.json();

            // Populate form
            document.getElementById('fullName').value = profileData.fullName || '';
            document.getElementById('email').value = profileData.email || '';
            document.getElementById('bio').value = profileData.bio || '';
            document.getElementById('username').textContent = profileData.username || 'admin';

            if (profileData.createdAt) {
                const date = new Date(profileData.createdAt);
                document.getElementById('createdAt').textContent = date.toLocaleDateString();
            }

            // Set profile picture
            if (profileData.profilePicture) {
                const pictureSrc = profileData.profilePicture.startsWith('http')
                    ? profileData.profilePicture
                    : '/' + profileData.profilePicture;
                document.getElementById('profilePicture').src = pictureSrc;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            showNotification('Failed to load profile', 'error');
        }
    }

    // Save profile
    async function saveProfile(e) {
        e.preventDefault();

        const formData = new FormData(profileForm);
        const updatedProfile = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            bio: formData.get('bio')
        };

        try {
            const response = await fetch('/api/admin/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile)
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Profile updated successfully!', 'success');
                loadProfile();
            } else {
                showNotification(data.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Failed to update profile', 'error');
        }
    }

    // Change password
    async function changePassword(e) {
        e.preventDefault();

        const formData = new FormData(passwordForm);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }

        // Validate password length
        if (newPassword.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Password changed successfully!', 'success');
                passwordForm.reset();
            } else {
                showNotification(data.message || 'Failed to change password', 'error');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            showNotification('Failed to change password', 'error');
        }
    }

    // Upload profile picture
    async function uploadProfilePicture(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
            showNotification('Please select a valid image file', 'error');
            event.target.value = '';
            return;
        }

        // Validate file size (2MB max for profile picture)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Image size must be less than 2MB', 'error');
            event.target.value = '';
            return;
        }

        const uploadProgress = document.getElementById('uploadProgress');
        uploadProgress.style.display = 'block';

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await fetch('/api/admin/upload-profile-picture', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                const pictureSrc = data.profilePicture.startsWith('http')
                    ? data.profilePicture
                    : '/' + data.profilePicture;
                document.getElementById('profilePicture').src = pictureSrc;
                showNotification('Profile picture updated!', 'success');
            } else {
                showNotification(data.message || 'Failed to upload profile picture', 'error');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            showNotification('Failed to upload profile picture', 'error');
        } finally {
            uploadProgress.style.display = 'none';
            event.target.value = '';
        }
    }

    async function logout() {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        } catch (error) {
            window.location.href = '/admin/login';
        }
    }

    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password i');

    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}
