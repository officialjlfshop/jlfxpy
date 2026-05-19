// ========================================
// HAMBURGER MENU - Mobile Navigation
// ========================================

let mobileMenuOpen = false;

function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    if (!hamburgerBtn || !navMenu) return;
    
    // Create overlay if not exists
    if (!overlay) {
        const newOverlay = document.createElement('div');
        newOverlay.id = 'mobileOverlay';
        newOverlay.className = 'mobile-overlay';
        document.body.appendChild(newOverlay);
        newOverlay.addEventListener('click', closeMobileMenu);
    }
    
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking on a link
    const mobileLinks = navMenu.querySelectorAll('a, button');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    if (mobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    mobileMenuOpen = true;
    hamburgerBtn?.classList.add('active');
    navMenu?.classList.add('active');
    overlay?.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('mobileOverlay');
    
    mobileMenuOpen = false;
    hamburgerBtn?.classList.remove('active');
    navMenu?.classList.remove('active');
    overlay?.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Export for global use
window.initHamburgerMenu = initHamburgerMenu;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;