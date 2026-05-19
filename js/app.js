// ========================================
// JLF FIREWORKS - MAIN APPLICATION
// ========================================

// Page loading state
let currentPage = 'home';
let isLoading = false;

// Page rendering mapping
const pageRenderers = {
    home: renderHomePage,
    shop: renderShopPage,
    featured: renderFeaturedPage,
    orders: renderOrdersPage,
    help: renderHelpPage,
    recharge: renderRechargePage,
    withdraw: renderWithdrawPage,
    account: renderAccountPage
};

// Page initializers mapping
const pageInitializers = {
    shop: initShopPage,
    featured: initFeaturedPage,
    orders: initOrdersPage,
    recharge: initRechargePage,
    withdraw: initWithdrawPage,
    account: initAccountPage
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing JLF Fireworks App...');
    
    // Load state from localStorage
    loadState();
    
    // Initialize UI components
    initHamburgerMenu();
    initBalanceVisibility();
    initAutocomplete();
    initSessionMonitoring();
    initHeaderButtons();
    initNavigation();
    
    // Load products data
    await loadProducts();
    
    // Load active sales
    await loadActiveSales();
    
    // Load stock data
    await loadStockData();
    
    // Load announcements
    await fetchAnnouncements();
    
    // Start polling for balance if logged in
    if (currentUser) {
        startBalancePolling();
        startNotificationPolling();
        await loadUserLoyalty();
        updateBalanceDisplay();
    }
    
    // Request push notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => requestNotificationPermission(), 5000);
    }
    
    // Render initial page
    await switchPage('home');
    
    console.log('App initialized successfully!');
});

// ========================================
// PAGE SWITCHING
// ========================================

async function switchPage(page) {
    if (isLoading) return;
    isLoading = true;
    
    currentPage = page;
    updateLastActivity();
    
    // Update navigation
    updateNavigationActiveState(page);
    
    const container = document.getElementById('pageContainer');
    if (!container) {
        isLoading = false;
        return;
    }
    
    showPageSkeleton();
    
    try {
        const renderer = pageRenderers[page];
        if (!renderer) {
            console.error(`No renderer for page: ${page}`);
            container.innerHTML = renderHomePage();
        } else {
            container.innerHTML = renderer();
        }
        
        // Initialize page-specific functionality
        const initializer = pageInitializers[page];
        if (initializer) {
            setTimeout(initializer, 100);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
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

function showPageSkeleton() {
    const container = document.getElementById('pageContainer');
    if (container) {
        container.innerHTML = `
            <div class="skeleton-page">
                <div class="skeleton skeleton-header"></div>
                <div class="skeleton skeleton-text" style="height: 200px"></div>
                <div class="skeleton-grid">
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                </div>
            </div>
        `;
    }
}

function updateNavigationActiveState(page) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
    
    // Update header buttons visibility
    const rechargeBtn = document.getElementById('rechargeBtn');
    const balanceDisplay = document.getElementById('balanceDisplay');
    const withdrawBtn = document.getElementById('withdrawBtn');
    
    if (page === 'recharge' || page === 'withdraw' || page === 'account') {
        if (rechargeBtn) rechargeBtn.style.display = 'none';
        if (withdrawBtn) withdrawBtn.style.display = 'none';
        if (balanceDisplay) balanceDisplay.style.display = 'none';
    } else {
        if (rechargeBtn && currentUser) rechargeBtn.style.display = 'flex';
        if (withdrawBtn && currentUser) withdrawBtn.style.display = 'flex';
        if (balanceDisplay && currentUser) balanceDisplay.style.display = 'flex';
    }
}

// ========================================
// NAVIGATION INITIALIZATION
// ========================================

function initNavigation() {
    // Desktop navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                switchPage(page);
            }
        });
    });
    
    // Mobile navigation links (inside hamburger menu)
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                switchPage(page);
                closeMobileMenu();
            }
        });
    });
}

// ========================================
// HEADER BUTTONS INITIALIZATION
// ========================================

function initHeaderButtons() {
    // Recharge button
    const rechargeBtn = document.getElementById('rechargeBtn');
    if (rechargeBtn) {
        rechargeBtn.addEventListener('click', () => {
            if (!currentUser) {
                showToast('Please login first', 'warning');
                switchPage('account');
                return;
            }
            switchPage('recharge');
        });
    }
    
    // Withdraw button
    const withdrawBtn = document.getElementById('withdrawBtn');
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', () => {
            if (!currentUser) {
                showToast('Please login first', 'warning');
                switchPage('account');
                return;
            }
            switchPage('withdraw');
        });
    }
    
    // Account button
    const accountBtn = document.getElementById('accountBtn');
    if (accountBtn) {
        accountBtn.addEventListener('click', () => {
            switchPage('account');
        });
    }
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            openCartDrawer();
        });
    }
    
    // Notifications button
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', () => {
            openAnnouncementModal();
        });
    }
    
    // Search button (mobile)
    const searchBtn = document.getElementById('searchBtn');
    const mobileSearch = document.getElementById('mobileSearch');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    
    if (searchBtn && mobileSearch) {
        searchBtn.addEventListener('click', () => {
            mobileSearch.classList.toggle('active');
            if (mobileSearch.classList.contains('active')) {
                const searchInput = document.getElementById('mobileSearchInput');
                if (searchInput) searchInput.focus();
            }
        });
    }
    
    if (closeSearchBtn && mobileSearch) {
        closeSearchBtn.addEventListener('click', () => {
            mobileSearch.classList.remove('active');
        });
    }
}

// ========================================
// BALANCE DISPLAY & POLLING
// ========================================

let balanceInterval = null;

function updateBalanceDisplay() {
    const balanceElement = document.getElementById('userBalance');
    const profileBalanceElement = document.getElementById('profileBalance');
    const rechargeBalanceElement = document.getElementById('rechargeCurrentBalance');
    const withdrawBalanceElement = document.getElementById('withdrawCurrentBalance');
    
    const balance = currentUser?.balance || 0;
    const formattedBalance = formatCurrency(balance);
    
    if (balanceElement) balanceElement.textContent = formattedBalance;
    if (profileBalanceElement) profileBalanceElement.textContent = formattedBalance;
    if (rechargeBalanceElement) rechargeBalanceElement.textContent = formattedBalance;
    if (withdrawBalanceElement) withdrawBalanceElement.textContent = formattedBalance;
}

function startBalancePolling() {
    if (balanceInterval) clearInterval(balanceInterval);
    
    balanceInterval = setInterval(async () => {
        if (currentUser && !isAdmin) {
            await refreshUserBalance();
        }
    }, APP_CONFIG.balancePollInterval);
}

function stopBalancePolling() {
    if (balanceInterval) {
        clearInterval(balanceInterval);
        balanceInterval = null;
    }
}

async function refreshUserBalance() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getUsers`);
        const users = await response.json();
        const updatedUser = users.find(u => u.phone === currentUser.phone);
        
        if (updatedUser && updatedUser.balance !== currentUser.balance) {
            currentUser.balance = updatedUser.balance;
            saveState();
            updateBalanceDisplay();
            
            // Show subtle notification for balance change
            const badge = document.getElementById('balanceBadge');
            if (badge) {
                badge.classList.add('pulse');
                setTimeout(() => badge.classList.remove('pulse'), 1000);
            }
        }
    } catch (error) {
        console.error('Balance refresh error:', error);
    }
}

// ========================================
// NOTIFICATION POLLING
// ========================================

let notificationInterval = null;

function startNotificationPolling() {
    if (notificationInterval) clearInterval(notificationInterval);
    
    notificationInterval = setInterval(async () => {
        await fetchAnnouncements();
        updateNotificationBadge();
    }, APP_CONFIG.notificationPollInterval);
}

function stopNotificationPolling() {
    if (notificationInterval) {
        clearInterval(notificationInterval);
        notificationInterval = null;
    }
}

function updateNotificationBadge() {
    const unreadCount = getUnreadCount();
    const badge = document.getElementById('notificationBadge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// ========================================
// CART FUNCTIONS
// ========================================

let cart = [];

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('jlf_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartBadge();
    }
}

function saveCartToStorage() {
    localStorage.setItem('jlf_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        showToast('Please login to add items to cart', 'warning');
        switchPage('account');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check stock
    const stock = stockData[productId] || product.stock || 99;
    if (stock < quantity) {
        showToast(`Sorry, only ${stock} left in stock`, 'warning');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity + quantity > stock) {
            showToast(`Cannot add more. Only ${stock} available.`, 'warning');
            return;
        }
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            category: product.category
        });
    }
    
    saveCartToStorage();
    showToast(`${product.name} added to cart!`, 'success');
    
    // Haptic feedback if available
    if (navigator.vibrate) navigator.vibrate(50);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    renderCartDrawer();
    showToast('Item removed from cart', 'info');
}

function updateQuantity(index, delta) {
    if (cart[index]) {
        const newQuantity = cart[index].quantity + delta;
        if (newQuantity <= 0) {
            cart.splice(index, 1);
        } else {
            // Check stock
            const product = products.find(p => p.id === cart[index].id);
            const stock = stockData[product?.id] || product?.stock || 99;
            if (newQuantity > stock) {
                showToast(`Only ${stock} available in stock`, 'warning');
                return;
            }
            cart[index].quantity = newQuantity;
        }
        saveCartToStorage();
        renderCartDrawer();
    }
}

function openCartDrawer() {
    renderCartDrawer();
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('open');
}

function closeCartDrawer() {
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.getElementById('cartOverlay')?.classList.remove('open');
}

function renderCartDrawer() {
    const container = document.getElementById('cartItemsList');
    const totalElement = document.getElementById('cartTotalPrice');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn-primary" onclick="switchPage('shop')">Start Shopping</button>
            </div>
        `;
        if (totalElement) totalElement.textContent = formatCurrency(0);
        return;
    }
    
    let total = 0;
    let itemsHtml = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${escapeHtml(item.name)}</div>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = itemsHtml;
    if (totalElement) totalElement.textContent = formatCurrency(total);
}

// ========================================
// CHECKOUT FUNCTIONS
// ========================================

async function proceedToCheckout() {
    if (!currentUser) {
        showToast('Please login to checkout', 'warning');
        switchPage('account');
        return;
    }
    
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (total > (currentUser.balance || 0)) {
        showToast(`Insufficient balance. Need ${formatCurrency(total)}`, 'error');
        return;
    }
    
    // Show PIN verification
    const pinVerified = await showPinModal();
    if (!pinVerified) return;
    
    // Show 2FA verification
    const twoFactorVerified = await showTwoFactorModal({
        action: 'checkout',
        amount: total
    });
    if (!twoFactorVerified) return;
    
    // Process checkout
    await processCheckout();
}

async function processCheckout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderList = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    
    const btn = document.querySelector('.checkout-btn');
    const originalText = btn?.innerHTML;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    try {
        // Deduct balance
        const balanceFormData = new URLSearchParams();
        balanceFormData.append('action', 'updateBalance');
        balanceFormData.append('phone', currentUser.phone);
        balanceFormData.append('amount', total);
        balanceFormData.append('operation', 'deduct');
        
        const balanceResponse = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: balanceFormData });
        const balanceResult = await balanceResponse.json();
        
        if (!balanceResult.success) {
            showToast(balanceResult.message || 'Insufficient balance', 'error');
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
            return;
        }
        
        // Record order
        const orderFormData = new URLSearchParams();
        orderFormData.append('action', 'addOrder');
        orderFormData.append('timestamp', new Date().toISOString());
        orderFormData.append('fullName', currentUser.name);
        orderFormData.append('accountId', currentUser.id);
        orderFormData.append('phone', currentUser.phone);
        orderFormData.append('orderList', orderList);
        orderFormData.append('totalPrice', total);
        orderFormData.append('status', 'Pending');
        
        const orderResponse = await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: orderFormData });
        const orderResult = await orderResponse.json();
        
        if (orderResult.success) {
            // Update local balance
            currentUser.balance = balanceResult.newBalance;
            saveState();
            updateBalanceDisplay();
            
            // Clear cart
            cart = [];
            saveCartToStorage();
            closeCartDrawer();
            renderCartDrawer();
            
            // Send email confirmation
            await sendOrderConfirmationEmail({
                orderId: generateTransactionId('order'),
                items: orderList,
                total: total,
                date: new Date().toISOString()
            });
            
            showToast(`Order placed successfully! Total: ${formatCurrency(total)}`, 'success');
            
            // Redirect to orders page
            setTimeout(() => {
                switchPage('orders');
            }, 2000);
        } else {
            // Refund if order failed
            const refundFormData = new URLSearchParams();
            refundFormData.append('action', 'updateBalance');
            refundFormData.append('phone', currentUser.phone);
            refundFormData.append('amount', total);
            refundFormData.append('operation', 'add');
            await fetch(GOOGLE_SHEETS_URL, { method: 'POST', body: refundFormData });
            
            showToast('Order failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Checkout failed. Please try again.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
}

// ========================================
// PRODUCTS & DATA LOADING
// ========================================

let products = [];
let stockData = {};
let activeSales = [];

async function loadProducts() {
    try {
        // Products are defined in data/products.js
        if (typeof window.PRODUCTS !== 'undefined') {
            products = window.PRODUCTS;
        }
        
        // Load stock data
        await loadStockData();
        
        // Apply active sales to products
        applyActiveSales();
        
        return products;
    } catch (error) {
        console.error('Failed to load products:', error);
        return [];
    }
}

async function loadStockData() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getProductStock`);
        const data = await response.json();
        if (data && data.length) {
            data.forEach(item => {
                stockData[item.productId] = item.quantity;
            });
        }
    } catch (error) {
        console.error('Failed to load stock data:', error);
    }
}

async function loadActiveSales() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getActiveSales`);
        const data = await response.json();
        if (data && data.length) {
            activeSales = data;
            applyActiveSales();
        }
    } catch (error) {
        console.error('Failed to load sales:', error);
    }
}

function applyActiveSales() {
    products.forEach(product => {
        product.sale = null;
        product.originalPrice = null;
        
        const sale = activeSales.find(s => 
            s.products.includes(product.id) || s.products.includes('all')
        );
        
        if (sale && new Date(sale.endDate) > new Date()) {
            product.sale = sale.discount;
            product.originalPrice = product.price;
            product.price = product.price * (1 - sale.discount / 100);
        }
    });
}

// ========================================
// ANNOUNCEMENTS
// ========================================

let announcements = [];
let readAnnouncements = [];

async function fetchAnnouncements() {
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getAnnouncements`);
        announcements = await response.json();
        updateNotificationBadge();
        return announcements;
    } catch (error) {
        console.error('Failed to fetch announcements:', error);
        return [];
    }
}

function getUnreadCount() {
    return announcements.filter(ann => !readAnnouncements.includes(ann.timestamp)).length;
}

function openAnnouncementModal() {
    // Implementation for announcement modal
    console.log('Opening announcements');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateTransactionId(type) {
    const timestamp = new Date();
    const dateStr = timestamp.getFullYear().toString().slice(-2) +
                    String(timestamp.getMonth() + 1).padStart(2, '0') +
                    String(timestamp.getDate()).padStart(2, '0') +
                    String(timestamp.getHours()).padStart(2, '0') +
                    String(timestamp.getMinutes()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    const prefixes = {
        order: 'ORD',
        recharge: 'RCH',
        withdrawal: 'WDL',
        investment: 'INV',
        redemption: 'RDM'
    };
    
    const prefix = prefixes[type] || 'TXN';
    return `JLF-${prefix}-${dateStr}${random}`;
}

async function sendOrderConfirmationEmail(orderData) {
    // Email sending logic
    console.log('Sending order confirmation:', orderData);
}

// ========================================
// EXPORT GLOBALS
// ========================================

window.switchPage = switchPage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.proceedToCheckout = proceedToCheckout;
window.refreshUserBalance = refreshUserBalance;
window.updateBalanceDisplay = updateBalanceDisplay;
window.generateTransactionId = generateTransactionId;
window.openAnnouncementModal = openAnnouncementModal;
window.showToast = showToast;
window.formatCurrency = formatCurrency;
window.copyToClipboard = copyToClipboard;
window.escapeHtml = escapeHtml;