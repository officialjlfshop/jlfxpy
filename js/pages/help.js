// ========================================
// HELP PAGE - Customer Support
// ========================================

function renderHelpPage() {
    return `
        <div class="page help-page">
            <div class="page-header">
                <div class="container">
                    <h1><i class="fas fa-headset"></i> Customer Support</h1>
                    <p>We're here to help you 24/7. How can we assist you today?</p>
                </div>
            </div>
            
            <div class="container">
                <!-- Contact Options -->
                <div class="contact-grid">
                    <div class="contact-card" onclick="window.location.href='tel:09633863860'">
                        <div class="contact-icon"><i class="fas fa-phone-alt"></i></div>
                        <h3>Call Us</h3>
                        <p>0963 386 3860</p>
                        <span class="contact-note">Mon-Sat, 8AM-6PM</span>
                    </div>
                    <div class="contact-card" onclick="window.open('https://m.me/jlfworks.official', '_blank')">
                        <div class="contact-icon"><i class="fab fa-facebook-messenger"></i></div>
                        <h3>Messenger</h3>
                        <p>Chat with us</p>
                        <span class="contact-note">Response within 1 hour</span>
                    </div>
                    <div class="contact-card" onclick="window.location.href='mailto:jlfworks.official@gmail.com'">
                        <div class="contact-icon"><i class="fas fa-envelope"></i></div>
                        <h3>Email Support</h3>
                        <p>jlfworks.official@gmail.com</p>
                        <span class="contact-note">24-hour response</span>
                    </div>
                    <div class="contact-card" onclick="openBugReportModal()">
                        <div class="contact-icon"><i class="fas fa-bug"></i></div>
                        <h3>Report a Bug</h3>
                        <p>Help us improve</p>
                        <span class="contact-note">We'll investigate</span>
                    </div>
                </div>
                
                <!-- FAQ Section -->
                <div class="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div class="faq-grid">
                        ${renderFAQs()}
                    </div>
                </div>
                
                <!-- Store Location -->
                <div class="location-card">
                    <h3><i class="fas fa-store"></i> Visit Our Store</h3>
                    <p><strong>JLF Fireworks Store</strong><br>
                    Centro 1, Camansihan<br>
                    Calapan City, Oriental Mindoro</p>
                    <p class="store-hours"><i class="fas fa-clock"></i> 8:00 AM – 6:00 PM Daily</p>
                    <a href="https://maps.google.com/?q=Calapan+City+Oriental+Mindoro" target="_blank" class="btn-outline">
                        <i class="fas fa-directions"></i> Get Directions
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderFAQs() {
    const faqs = [
        {
            q: "How do I place an order?",
            a: "Simply browse our Shop page, add your desired fireworks to the cart, and proceed to checkout. Make sure you have enough credit balance to complete the purchase."
        },
        {
            q: "How do I add credits to my account?",
            a: "Click the wallet icon (💰) next to your profile, choose GCash or Cash payment, follow the instructions, and submit your recharge request. Admin will approve it within 1 hour."
        },
        {
            q: "What is the GCash number?",
            a: "Our GCash number is <strong>0963 386 3860</strong> under the name JE*****L C."
        },
        {
            q: "Do you offer free delivery?",
            a: "Yes! We offer free delivery on all orders ₱1,999 and above around Calapan City."
        },
        {
            q: "What payment methods are accepted?",
            a: "We accept GCash (via QR code or GCash number) and Cash (at our physical store)."
        },
        {
            q: "How does the loyalty program work?",
            a: "Each time you scan your QR code at our store or make a purchase of ₱699+, you earn 1 loyalty mark. 12 marks = ₱99 credit reward!"
        },
        {
            q: "Are your fireworks safe?",
            a: "Yes! All our fireworks are DTI-certified and undergo strict quality control. Please read our <a href='safety.html' target='_blank'>Safety Guide</a> before use."
        },
        {
            q: "How do I withdraw my balance?",
            a: "Click the withdrawal icon (💸) next to your profile, choose GCash or Cash withdrawal method, enter the amount and receiver details, then submit. Admin will process within 24 hours."
        },
        {
            q: "What is the minimum investment?",
            a: "The minimum investment amount is ₱500. You can invest in bonds with returns up to 12% per year."
        },
        {
            q: "How do I track my order?",
            a: "Go to the Transactions page to see all your orders and their current status (Pending, Approved, Completed, or Cancelled)."
        },
        {
            q: "What is Transaction PIN?",
            a: "Transaction PIN is a 6-digit code separate from your login password. It adds an extra layer of security for purchases and withdrawals."
        },
        {
            q: "How do I enable 2FA?",
            a: "2FA is automatically required for all transactions. You'll receive a code via email or SMS to verify each transaction."
        }
    ];
    
    return faqs.map(faq => `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
                <span>${faq.q}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">${faq.a}</div>
        </div>
    `).join('');
}

function toggleFaq(element) {
    const item = element.closest('.faq-item');
    item.classList.toggle('active');
    const icon = element.querySelector('i');
    if (icon) {
        icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
    }
}

// Export
window.renderHelpPage = renderHelpPage;
window.toggleFaq = toggleFaq;