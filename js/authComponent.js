// AuthComponent: A reusable authentication UI component
class AuthComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        // Create component elements
        this.createElements();
        // Initialize state
        this.checkAuthState();
        // Set up event listeners
        this.setupEventListeners();
    }

    createElements() {
        // Create the container for our auth elements
        this.authContainer = document.createElement('div');
        this.authContainer.className = 'auth-container';

        // Create sign in button
        this.signInBtn = document.createElement('a');
        this.signInBtn.href = '#';
        this.signInBtn.className = 'signupbtn';
        this.signInBtn.setAttribute('aria-label', 'Sign In');
        this.signInBtn.innerHTML = '&nbsp;Sign In&nbsp;';

        // Create profile icon
        this.profileContainer = document.createElement('div');
        this.profileContainer.className = 'profile-container';

        this.profileIcon = document.createElement('div');
        this.profileIcon.className = 'profile-icon';
        this.profileIcon.setAttribute('aria-label', 'Profile');
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-user';
        this.profileIcon.appendChild(icon);

        // Create dropdown menu
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'profile-dropdown';
        
        // Add dropdown content
        this.dropdown.innerHTML = `
            <div class="profile-info">
                <div class="profile-header">
                    <h3>Profile</h3>
                </div>
                <div class="profile-details">
                    <div class="profile-field">
                        <label>Email</label>
                        <div class="profile-value user-email">user@example.com</div>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>
        `;

        // Assemble the profile container
        this.profileContainer.appendChild(this.profileIcon);
        this.profileContainer.appendChild(this.dropdown);

        // Add elements to auth container
        this.authContainer.appendChild(this.signInBtn);
        this.authContainer.appendChild(this.profileContainer);

        // Add auth container to the main container
        this.container.appendChild(this.authContainer);
    }

    setupEventListeners() {
        // Sign in button click handler
        this.signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                window.location.href = 'loginpg.html';
            } catch (error) {
                console.error('Navigation error:', error);
                alert('An error occurred while trying to navigate to the login page. Please try again later.');
            }
        });

        // Profile icon click handler for dropdown
        this.profileIcon.addEventListener('click', () => {
            this.dropdown.classList.toggle('active');
        });

        // Logout button handler
        const logoutBtn = this.dropdown.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', () => {
            this.logout();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.profileContainer.contains(e.target)) {
                this.dropdown.classList.remove('active');
            }
        });
    }

    checkAuthState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.updateUI(isLoggedIn);
        
        // Update user email if available
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            const emailElement = this.dropdown.querySelector('.user-email');
            if (emailElement) {
                emailElement.textContent = userEmail;
            }
        }
    }

    updateUI(isLoggedIn) {
        if (isLoggedIn) {
            this.signInBtn.style.display = 'none';
            this.profileContainer.style.display = 'block';
        } else {
            this.signInBtn.style.display = 'block';
            this.profileContainer.style.display = 'none';
            this.dropdown.classList.remove('active');
        }
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        this.updateUI(false);
        // Redirect to home page after logout
        window.location.href = 'homepage.html';
    }

    // Public method to set logged in state
    login(userEmail) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', userEmail);
        this.checkAuthState();
    }

    // Add these static methods to the AuthComponent class
    static initializeNavbar() {
        // Check if navbar is already initialized
        if (window.navbarInitialized) return;

        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const signInBtn = document.getElementById('signInBtn');
        const profileIcon = document.getElementById('profileIcon');

        if (!signInBtn || !profileIcon) {
            console.error('Required navbar elements not found');
            return;
        }

        // Update UI based on auth state
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userEmail = localStorage.getItem('userEmail');

        if (isLoggedIn) {
            signInBtn.style.display = 'none';
            profileIcon.style.display = 'flex';
            
            // Update profile icon content
            profileIcon.innerHTML = `
                <i class="fas fa-user"></i>
                <div class="profile-dropdown">
                    <div class="profile-info">
                        <p class="email">${userEmail}</p>
                    </div>
                    <button class="sign-out-btn">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
            `;
        } else {
            signInBtn.style.display = 'flex';
            profileIcon.style.display = 'none';
        }

        // Add event listeners
        signInBtn?.addEventListener('click', () => {
            window.location.href = 'loginpg.html';
        });

        // Sign out handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.sign-out-btn')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                window.location.reload();
            }
        });

        window.navbarInitialized = true;
    }
}

// Export the component
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthComponent;
} 