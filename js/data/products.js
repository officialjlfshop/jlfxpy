// ========================================
// PRODUCT DATABASE - JLF Fireworks
// Complete product list with real images
// ========================================

const PRODUCTS = [
    // ========== AERIAL FIREWORKS ==========
    {
        id: 1,
        name: "Maribel Kwitis",
        category: "Aerial",
        price: 129,
        originalPrice: null,
        stock: 50,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/maribel-kwitis.jpg",
        video: "https://ik.imagekit.io/0sf7uub8b/JLF/videos/kwitis-demo.mp4",
        description: "Traditional kwitis fireworks. 10 pcs per order. Soars high with loud bang.",
        specs: "10 pieces per pack | Aerial height: 50ft | Sound level: High",
        isNew: false,
        isPopular: true,
        rating: 4.8,
        reviews: 124
    },
    {
        id: 101,
        name: "Sky King Rocket",
        category: "Aerial",
        price: 299,
        originalPrice: 399,
        stock: 30,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/sky-king-rocket.jpg",
        video: "https://ik.imagekit.io/0sf7uub8b/JLF/videos/sky-king.mp4",
        description: "Powerful aerial rocket with colorful burst. Reaches up to 100ft.",
        specs: "Single rocket | Aerial height: 100ft | Colors: Multi-color",
        isNew: true,
        isPopular: true,
        rating: 4.9,
        reviews: 89
    },
    {
        id: 102,
        name: "Dragon Flight",
        category: "Aerial",
        price: 449,
        originalPrice: 599,
        stock: 20,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/dragon-flight.jpg",
        video: "https://ik.imagekit.io/0sf7uub8b/JLF/videos/dragon-flight.mp4",
        description: "Premium aerial display with dragon-shaped trail.",
        specs: "3 shots | Aerial height: 120ft | Colors: Red, Gold",
        isNew: true,
        isPopular: false,
        rating: 5.0,
        reviews: 45
    },
    {
        id: 103,
        name: "Phantom Shot",
        category: "Aerial",
        price: 189,
        originalPrice: null,
        stock: 60,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/phantom-shot.jpg",
        description: "Compact aerial firework with impressive burst.",
        specs: "5 shots | Aerial height: 60ft",
        isNew: false,
        isPopular: false,
        rating: 4.5,
        reviews: 67
    },
    
    // ========== GROUND FIREWORKS ==========
    {
        id: 2,
        name: "TS Pastillas Small",
        category: "Ground",
        price: 29,
        originalPrice: null,
        stock: 200,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/ts-pastillas-small.jpg",
        description: "Small pastillas fireworks. Pack of 10 per order. Classic ground firework.",
        specs: "10 pieces per pack | Sound level: Medium",
        isNew: false,
        isPopular: true,
        rating: 4.6,
        reviews: 234
    },
    {
        id: 3,
        name: "TS Special Pastillas",
        category: "Ground",
        price: 39,
        originalPrice: null,
        stock: 180,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/ts-special-pastillas.jpg",
        description: "Special edition pastillas with enhanced effect. Pack of 10.",
        specs: "10 pieces per pack | Special effect",
        isNew: false,
        isPopular: true,
        rating: 4.7,
        reviews: 189
    },
    {
        id: 4,
        name: "TS Pastillas Big",
        category: "Ground",
        price: 149,
        originalPrice: 199,
        stock: 100,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/ts-pastillas-big.jpg",
        description: "Big size pastillas for louder effect. Pack of 10.",
        specs: "10 pieces per pack | Sound level: High",
        isNew: false,
        isPopular: true,
        rating: 4.8,
        reviews: 156
    },
    {
        id: 5,
        name: "TS Thunder Sawa 500 Rounds",
        category: "Ground",
        price: 749,
        originalPrice: 899,
        stock: 45,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/thunder-sawa-500.jpg",
        video: "https://ik.imagekit.io/0sf7uub8b/JLF/videos/thunder-sawa.mp4",
        description: "500 rounds continuous firing. The ultimate ground firework experience.",
        specs: "500 rounds | Duration: 60 seconds | Sound level: Very High",
        isNew: false,
        isPopular: true,
        rating: 4.9,
        reviews: 312
    },
    {
        id: 6,
        name: "TS Special DK Sawa 500 Rounds",
        category: "Ground",
        price: 789,
        originalPrice: 949,
        stock: 35,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/special-dk-sawa.jpg",
        description: "Special DK edition with enhanced effects. 500 rounds.",
        specs: "500 rounds | Special DK effect",
        isNew: true,
        isPopular: true,
        rating: 5.0,
        reviews: 89
    },
    {
        id: 7,
        name: "TS Super Thunder Sawa 500 Rounds",
        category: "Ground",
        price: 799,
        originalPrice: 999,
        stock: 30,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/super-thunder-sawa.jpg",
        video: "https://ik.imagekit.io/0sf7uub8b/JLF/videos/super-thunder.mp4",
        description: "Super Thunder edition. Louder and more intense. 500 rounds.",
        specs: "500 rounds | Maximum intensity",
        isNew: true,
        isPopular: true,
        rating: 5.0,
        reviews: 156
    },
    {
        id: 8,
        name: "Dreamlight 3 Star",
        category: "Ground",
        price: 149,
        originalPrice: null,
        stock: 80,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/dreamlight-3star.jpg",
        description: "Dreamlight series. Ream of 100 per order.",
        specs: "100 pieces per ream",
        isNew: false,
        isPopular: false,
        rating: 4.5,
        reviews: 67
    },
    {
        id: 9,
        name: "Phoenix Thunder",
        category: "Ground",
        price: 249,
        originalPrice: 299,
        stock: 55,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/phoenix-thunder.jpg",
        description: "Phoenix brand thunder. Ream of 100.",
        specs: "100 pieces per ream",
        isNew: false,
        isPopular: true,
        rating: 4.7,
        reviews: 123
    },
    {
        id: 10,
        name: "Dreamlight Whistle Bomb",
        category: "Ground",
        price: 129,
        originalPrice: null,
        stock: 90,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/whistle-bomb.jpg",
        description: "Whistle bomb effect. Pack of 10.",
        specs: "10 pieces per pack",
        isNew: false,
        isPopular: false,
        rating: 4.4,
        reviews: 45
    },
    {
        id: 11,
        name: "Nation Whistle Bomb",
        category: "Ground",
        price: 129,
        originalPrice: null,
        stock: 85,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/nation-whistle.jpg",
        description: "Nation brand whistle bomb. Pack of 10.",
        specs: "10 pieces per pack",
        isNew: false,
        isPopular: false,
        rating: 4.3,
        reviews: 38
    },
    
    // ========== SPARKLERS ==========
    {
        id: 12,
        name: "Maribel Mabuhay Ordinary",
        category: "Sparklers",
        price: 29,
        originalPrice: null,
        stock: 300,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/mabuhay-sparkler.jpg",
        description: "Classic Mabuhay sparklers. Pack of 10.",
        specs: "10 pieces per pack | Duration: 30 seconds",
        isNew: false,
        isPopular: true,
        rating: 4.5,
        reviews: 278
    },
    {
        id: 13,
        name: "Tiger 1 Minutes Luces w/ Effect",
        category: "Sparklers",
        price: 49,
        originalPrice: null,
        stock: 150,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/tiger-sparkler.jpg",
        description: "Tiger brand sparkler with special effect. Lasts 1 minute.",
        specs: "1 piece per order | Duration: 60 seconds | Special effect",
        isNew: false,
        isPopular: true,
        rating: 4.8,
        reviews: 189
    },
    {
        id: 14,
        name: "Yanco 1 Minute RC Luces",
        category: "Sparklers",
        price: 34,
        originalPrice: null,
        stock: 200,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/yanco-rc.jpg",
        description: "Yanco RC sparklers. 1 minute duration.",
        specs: "1 piece per order | Duration: 60 seconds",
        isNew: false,
        isPopular: false,
        rating: 4.6,
        reviews: 112
    },
    {
        id: 15,
        name: "Yanco 1 Minute Baby Luces",
        category: "Sparklers",
        price: 129,
        originalPrice: 159,
        stock: 120,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/baby-luces.jpg",
        description: "Yanco Baby Luces sparklers. Pack of 10.",
        specs: "10 pieces per pack | Duration: 60 seconds each",
        isNew: false,
        isPopular: true,
        rating: 4.7,
        reviews: 156
    },
    
    // ========== FOUNTAINS ==========
    {
        id: 16,
        name: "Yanco Batibot",
        category: "Fountains",
        price: 99,
        originalPrice: null,
        stock: 75,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/batibot.jpg",
        video: "https://ik.imagekit.io/0sf7uub8b/JLF/videos/batibot.mp4",
        description: "Batibot fountain display. 3 pcs per order.",
        specs: "3 pieces per pack | Duration: 45 seconds",
        isNew: false,
        isPopular: true,
        rating: 4.7,
        reviews: 98
    },
    {
        id: 17,
        name: "Yanco Small Silver",
        category: "Fountains",
        price: 99,
        originalPrice: null,
        stock: 80,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/small-silver.jpg",
        description: "Small silver fountain. 2 pcs per order.",
        specs: "2 pieces per pack | Color: Silver",
        isNew: false,
        isPopular: false,
        rating: 4.5,
        reviews: 67
    },
    {
        id: 104,
        name: "Golden Shower Fountain",
        category: "Fountains",
        price: 149,
        originalPrice: 199,
        stock: 40,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/golden-shower.jpg",
        description: "Spectacular golden fountain display.",
        specs: "Single piece | Duration: 90 seconds | Color: Gold",
        isNew: true,
        isPopular: true,
        rating: 4.9,
        reviews: 56
    },
    {
        id: 105,
        name: "Rainbow Fountain",
        category: "Fountains",
        price: 189,
        originalPrice: null,
        stock: 35,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/rainbow-fountain.jpg",
        description: "Multi-color fountain display.",
        specs: "Single piece | Duration: 75 seconds | Colors: Rainbow",
        isNew: true,
        isPopular: false,
        rating: 4.8,
        reviews: 34
    },
    
    // ========== OTHERS ==========
    {
        id: 18,
        name: "Alp-alp",
        category: "Others",
        price: 169,
        originalPrice: null,
        stock: 60,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/alp-alp.jpg",
        description: "Traditional alp-alp fireworks. Pack of 10.",
        specs: "10 pieces per pack",
        isNew: false,
        isPopular: false,
        rating: 4.4,
        reviews: 45
    },
    {
        id: 19,
        name: "KK Fireworks",
        category: "Others",
        price: 269,
        originalPrice: 299,
        stock: 45,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/kk-fireworks.jpg",
        description: "KK brand special fireworks. Pack of 10.",
        specs: "10 pieces per pack",
        isNew: false,
        isPopular: false,
        rating: 4.6,
        reviews: 78
    },
    {
        id: 20,
        name: "DYN Firecracker",
        category: "Others",
        price: 69,
        originalPrice: null,
        stock: 200,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/dyn.jpg",
        description: "DYN firecracker. Single piece.",
        specs: "1 piece per order",
        isNew: false,
        isPopular: true,
        rating: 4.5,
        reviews: 234
    },
    {
        id: 21,
        name: "KBS Firecracker",
        category: "Others",
        price: 69,
        originalPrice: null,
        stock: 190,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/kbs.jpg",
        description: "KBS firecracker. Single piece.",
        specs: "1 piece per order",
        isNew: false,
        isPopular: false,
        rating: 4.4,
        reviews: 167
    },
    {
        id: 22,
        name: "EL Firecracker",
        category: "Others",
        price: 79,
        originalPrice: null,
        stock: 175,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/el.jpg",
        description: "EL brand firecracker. Single piece.",
        specs: "1 piece per order",
        isNew: false,
        isPopular: false,
        rating: 4.3,
        reviews: 145
    },
    {
        id: 23,
        name: "AL Firecracker",
        category: "Others",
        price: 159,
        originalPrice: 199,
        stock: 85,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/al.jpg",
        description: "AL brand premium firecracker. Single piece.",
        specs: "1 piece per order | Premium quality",
        isNew: false,
        isPopular: true,
        rating: 4.8,
        reviews: 198
    },
    
    // ========== MYSTERY BOX ==========
    {
        id: 9999,
        name: "🎁 Mystery Box",
        category: "Mystery",
        price: 499,
        originalPrice: null,
        stock: 999,
        image: "https://ik.imagekit.io/0sf7uub8b/JLF/products/mystery-box.jpg",
        description: "Random product from our collection worth up to ₱799! The surprise is half the fun.",
        specs: "Random item | Value up to ₱799",
        isNew: true,
        isPopular: true,
        rating: 4.9,
        reviews: 567
    }
];

// Category mapping for display
const CATEGORIES = [
    { id: "all", name: "All", icon: "🎯" },
    { id: "Aerial", name: "Aerial", icon: "🎆" },
    { id: "Ground", name: "Ground", icon: "🧨" },
    { id: "Sparklers", name: "Sparklers", icon: "✨" },
    { id: "Fountains", name: "Fountains", icon: "💧" },
    { id: "Others", name: "Others", icon: "🎯" },
    { id: "Mystery", name: "Mystery Box", icon: "🎁" }
];

// Get product by ID
function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

// Get products by category
function getProductsByCategory(category) {
    if (category === "all") return PRODUCTS;
    return PRODUCTS.filter(p => p.category === category);
}

// Get popular products (for best sellers)
function getPopularProducts(limit = 8) {
    return PRODUCTS.filter(p => p.isPopular).slice(0, limit);
}

// Get new products
function getNewProducts(limit = 8) {
    return PRODUCTS.filter(p => p.isNew).slice(0, limit);
}

// Get products on sale
function getSaleProducts(limit = 8) {
    return PRODUCTS.filter(p => p.originalPrice).slice(0, limit);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
    );
}

// Export for global use
window.PRODUCTS = PRODUCTS;
window.CATEGORIES = CATEGORIES;
window.getProductById = getProductById;
window.getProductsByCategory = getProductsByCategory;
window.getPopularProducts = getPopularProducts;
window.getNewProducts = getNewProducts;
window.getSaleProducts = getSaleProducts;
window.searchProducts = searchProducts;