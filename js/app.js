// ========================================
// JLF FIREWORKS - MAIN APPLICATION
// ========================================

(function() {
    'use strict';
    
    // Page loading state
    let isLoading = false;
    
    // Page renderers
    const pageRenderers = {
        home: window.renderHomePage,
        shop: window.renderShopPage,
        featured: window.renderFeaturedPage,
        orders: window.renderOrdersPage,
        help: window.renderHelpPage,
        recharge: window.renderRechargePage,
        withdraw: window.renderWithdrawPage,
        account: window.renderAccountPage
    };
    
    // Page initializers
    const pageInitializers = {
        shop: window.initShopPage,
        featured: function() { 
            if (typeof window.calculateInvestment === 'function') window.calculateInvestment();
            const redeemBtn = document.getElementById('redeemPromoBtn');
            if (redeemBtn) redeemBtn.addEventListener('click', window.redeemPromoCode);
        },
        orders: function() {
            if (typeof window.loadAllTransactions === 'function') window.loadAllTransactions();
        },
        recharge: function() {
            if (typeof window.initRechargePage === 'function') window.initRechargePage();
        },
        withdraw: function() {
            if (typeof window.initWithdrawPage === 'function') window.initWithdrawPage();
        },
        account: function() {
            // Account page initialized automatically
        }
    };
    
    async function switchPage(page) {
        if (isLoading) return;
        isLoading = true;
        
        window.currentPage = page;
        if (typeof window.updateLastActivity === 'function') window.updateLastActivity();
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(page)) {
                link.classList.add('active');
            }
        });
        
        const container = document.getElementById('pageContainer');
        if (!container) {
            isLoading = false;
            return;
        }
        
        container.innerHTML = '<div class="loading-spinner">Loading...</div>';
        
        try {
            const renderer = pageRenderers[page];
            if (!renderer) {
                console.error('No renderer for page:', page);
                container.innerHTML = '<div class="error-state">Page not found</div>';
            } else {
                container.innerHTML = renderer();
            }
            
            const initializer = pageInitializers[page];
            if (initializer) {
                setTimeout(initializer, 100);
            }
            
            window.scrollTo(0, 0);
            
        } catch (error) {
            console.error('Error rendering page:', error);
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Something went wrong</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="location.reload()">Refresh</button>
                </div>
            `;
        } finally {
            isLoading = false;
        }
    }
    
    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('JLF Fireworks App initializing...');
        
        if (typeof window.loadState === 'function') window.loadState();
        if (typeof window.initHamburgerMenu === 'function') window.initHamburgerMenu();
        if (typeof window.initBalanceVisibility === 'function') window.initBalanceVisibility();
        if (typeof window.initAutocomplete === 'function') window.initAutocomplete();
        if (typeof window.initSessionMonitoring === 'function') window.initSessionMonitoring();
        
        // Initialize header buttons
        const rechargeBtn = document.getElementById('rechargeBtn');
        if (rechargeBtn) {
            rechargeBtn.addEventListener('click', () => {
                if (!window.currentUser) {
                    if (typeof window.showToast === 'function') window.showToast('Please login first', 'warning');
                    switchPage('account');
                    return;
                }
                switchPage('recharge');
            });
        }
        
        const accountBtn = document.getElementById('accountBtn');
        if (accountBtn) {
            accountBtn.addEventListener('click', () => switchPage('account'));
        }
        
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                if (typeof window.openCartDrawer === 'function') window.openCartDrawer();
            });
        }
        
        if (typeof window.loadProducts === 'function') await window.loadProducts();
        if (typeof window.loadActiveSales === 'function') await window.loadActiveSales();
        if (typeof window.fetchAnnouncements === 'function') await window.fetchAnnouncements();
        
        await switchPage('home');
        console.log('App initialized successfully!');
    });
    
    // Expose functions globally
    window.switchPage = switchPage;
    
})();