/* 
SNAPSHOT: 2026-04-26 | Phase 1: Interactive Logic
- Implemented dynamic product rendering.
- Added basic scroll animation handling.
- Initialized cart count state.
- Next: Implement full shopping cart functionality and checkout flow.
*/

const products = [
    {
        id: 1,
        name: "AURA V1 - HyperBlue",
        price: 249,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tag: "Bestseller"
    },
    {
        id: 2,
        name: "AURA V1 - Gold Edition",
        price: 399,
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tag: "Premium"
    },
    {
        id: 3,
        name: "AURA V1 - Stealth Black",
        price: 299,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tag: "Limited"
    },
    {
        id: 4,
        name: "AURA V1 - Solar Flare",
        price: 279,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        tag: "New"
    }
];

let cartCount = 0;

function init() {
    renderProducts();
    setupEventListeners();
    animateOnScroll();
}

function renderProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}">
                <span class="product-tag">${product.tag}</span>
            </div>
            <div class="product-info">
                <h4 class="orbitron">${product.name}</h4>
                <div class="flex-between">
                    <span class="price">$${product.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    cartCount++;
    document.querySelector('.cart-count').textContent = cartCount;
    
    // Simple feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = "Added!";
    btn.style.background = "#fff";
    btn.style.color = "#000";
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.style.color = "";
    }, 1500);
}

function setupEventListeners() {
    // Navigation active state on scroll
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function animateOnScroll() {
    // Simple intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// Additional styles for product grid (added here for simplicity in this step, but usually in CSS)
const style = document.createElement('style');
style.textContent = \`
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 3rem;
    }
    .product-card {
        background: var(--surface);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 12px;
        overflow: hidden;
        transition: var(--transition);
        opacity: 0;
        transform: translateY(30px);
    }
    .product-card.animated {
        opacity: 1;
        transform: translateY(0);
    }
    .product-card:hover {
        transform: translateY(-10px);
        border-color: var(--primary);
        box-shadow: 0 10px 30px rgba(0, 229, 255, 0.1);
    }
    .product-img-wrapper {
        position: relative;
        height: 300px;
        overflow: hidden;
    }
    .product-img-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: var(--transition);
    }
    .product-card:hover .product-img-wrapper img {
        transform: scale(1.1);
    }
    .product-tag {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--primary);
        color: var(--bg-dark);
        padding: 0.3rem 0.8rem;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        border-radius: 4px;
    }
    .product-info {
        padding: 1.5rem;
    }
    .product-info h4 {
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    .price {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--primary);
    }
    .add-to-cart {
        background: transparent;
        border: 1px solid var(--primary);
        color: var(--primary);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: var(--transition);
        font-weight: 600;
    }
    .add-to-cart:hover {
        background: var(--primary);
        color: var(--bg-dark);
    }
    .cart-count {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--secondary);
        color: #000;
        font-size: 0.6rem;
        padding: 2px 5px;
        border-radius: 50%;
        font-weight: 800;
    }
\`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', init);
