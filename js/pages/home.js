// ========================================
// HOME PAGE - Complete Content
// ========================================

function renderHomePage() {
    return `
        <div class="page home-page">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-slider" id="heroSlider">
                    <div class="hero-slide active">
                        <div class="hero-content">
                            <h1>Premium <span class="highlight">Fireworks</span> for Every Celebration</h1>
                            <p>Quality is our top priority. Safe, certified, and spectacular fireworks for all occasions.</p>
                            <div class="hero-buttons">
                                <button onclick="switchPage('shop')" class="btn-primary">Shop Now <i class="fas fa-arrow-right"></i></button>
                                <button onclick="scrollToSection('features')" class="btn-outline">Learn More</button>
                            </div>
                        </div>
                        <div class="hero-visual">
                            <div class="firework-animation">
                                <span class="firework-emoji">🎆</span>
                                <span class="firework-emoji">🧨</span>
                                <span class="firework-emoji">✨</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section id="features" class="features-section">
                <div class="container">
                    <div class="section-header">
                        <span class="badge">Why Choose Us</span>
                        <h2>Everything you need for the <span class="highlight">perfect celebration</span></h2>
                    </div>
                    <div class="features-grid" id="featuresGrid">
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fas fa-truck-fast"></i></div>
                            <h3>Free Express Delivery</h3>
                            <p>Free door-to-door delivery on orders ₱1,999+ around Calapan City.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fas fa-gift"></i></div>
                            <h3>Loyalty Rewards</h3>
                            <p>Earn marks with every purchase. 12 marks = ₱99 credit!</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
                            <h3>Quality Certified</h3>
                            <p>All products undergo strict quality control for safety and performance.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fas fa-headset"></i></div>
                            <h3>24/7 Customer Support</h3>
                            <p>Call or message us anytime at <strong>0963 386 3860</strong></p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fas fa-lock"></i></div>
                            <h3>Secure Checkout</h3>
                            <p>2FA and transaction PIN for complete peace of mind.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
                            <h3>Invest & Earn</h3>
                            <p>5% returns on bond investments. Grow your balance while you save.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Best Sellers Section -->
            <section class="best-sellers">
                <div class="container">
                    <div class="section-header">
                        <span class="badge">Best Sellers</span>
                        <h2>Our most popular <span class="highlight">fireworks</span></h2>
                    </div>
                    <div class="products-grid" id="bestSellersGrid">
                        <div class="skeleton-product"></div>
                        <div class="skeleton-product"></div>
                        <div class="skeleton-product"></div>
                        <div class="skeleton-product"></div>
                    </div>
                </div>
            </section>

            <!-- Mystery Box Section -->
            <section class="mystery-box-section">
                <div class="container">
                    <div class="mystery-card">
                        <div class="mystery-badge">✨ NEW ✨</div>
                        <div class="mystery-icon">🎁</div>
                        <h2>Surprise Me!</h2>
                        <p>Can't decide? Let us pick for you! Get a Mystery Box filled with premium fireworks worth up to ₱799!</p>
                        <div class="mystery-price">₱499</div>
                        <button class="btn-primary" onclick="addMysteryBoxToCart()">
                            <i class="fas fa-dice"></i> Try Your Luck!
                        </button>
                    </div>
                </div>
            </section>

            <!-- How It Works -->
            <section class="how-it-works">
                <div class="container">
                    <div class="section-header">
                        <h2>How It <span class="highlight">Works</span></h2>
                        <p>Get your fireworks in 4 simple steps</p>
                    </div>
                    <div class="steps-grid">
                        <div class="step-card">
                            <div class="step-number">1</div>
                            <i class="fas fa-user-plus"></i>
                            <h3>Create Account</h3>
                            <p>Sign up in seconds with your phone number</p>
                        </div>
                        <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
                        <div class="step-card">
                            <div class="step-number">2</div>
                            <i class="fas fa-shopping-cart"></i>
                            <h3>Shop Fireworks</h3>
                            <p>Choose from 50+ premium products</p>
                        </div>
                        <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
                        <div class="step-card">
                            <div class="step-number">3</div>
                            <i class="fas fa-coins"></i>
                            <h3>Recharge & Checkout</h3>
                            <p>Add credits via GCash or Cash</p>
                        </div>
                        <div class="step-arrow"><i class="fas fa-arrow-right"></i></div>
                        <div class="step-card">
                            <div class="step-number">4</div>
                            <i class="fas fa-fire"></i>
                            <h3>Light Up!</h3>
                            <p>Enjoy your celebration safely</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Stats Section -->
            <section class="stats-section">
                <div class="container">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number" id="customerCount">49+</div>
                            <div class="stat-label">Happy Customers</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">50+</div>
                            <div class="stat-label">Products</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">24/7</div>
                            <div class="stat-label">Support</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="ordersToday">0</div>
                            <div class="stat-label">Orders Today</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Testimonials / Reviews -->
            <section class="reviews-section">
                <div class="container">
                    <div class="section-header">
                        <span class="badge">Customer Reviews</span>
                        <h2>What our <span class="highlight">customers say</span></h2>
                    </div>
                    <div class="reviews-container" id="homeReviews">
                        <div class="skeleton-review"></div>
                        <div class="skeleton-review"></div>
                        <div class="skeleton-review"></div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

// Load best sellers
async function loadBestSellers() {
    const container = document.getElementById('bestSellersGrid');
    if (!container) return;
    
    // Get top selling products (by order frequency)
    const bestSellers = products.slice(0, 4);
    
    container.innerHTML = bestSellers.map(product => `
        <div class="product-card" onclick="openQuickView(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.stock < 10 ? `<span class="product-badge low-stock">Low Stock</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-title">${escapeHtml(product.name)}</div>
                <div class="product-price">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    ${product.originalPrice ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
                </div>
                <button class="btn-small btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Load home page reviews
async function loadHomeReviews() {
    const container = document.getElementById('homeReviews');
    if (!container) return;
    
    try {
        const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getApprovedReviews&limit=3`);
        const reviews = await response.json();
        
        if (reviews && reviews.length > 0) {
            container.innerHTML = reviews.map(review => `
                <div class="review-card">
                    <div class="review-stars">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                    <p class="review-text">"${escapeHtml(review.comment)}"</p>
                    <div class="review-author">
                        <strong>- ${escapeHtml(review.name)}</strong>
                    </div>
                    <div class="review-date">${formatDate(review.timestamp, 'short')}</div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="review-card">
                    <div class="review-stars">★★★★★</div>
                    <p class="review-text">"Ayyy grabe wala ako masabi. The best SAWA! Ang ganda ng putok Quality"</p>
                    <div class="review-author"><strong>- Bobby D.</strong></div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load reviews:', error);
    }
}

// Export functions
window.renderHomePage = renderHomePage;
window.loadBestSellers = loadBestSellers;
window.loadHomeReviews = loadHomeReviews;