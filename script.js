// Database of Products
const products = [
    {
        id: 1,
        title: "Oversized Streetwear Tee",
        category: "Tops",
        price: 25.00,
        badge: "Hot",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        title: "Loose Fit Denim Jeans",
        category: "Bottoms",
        price: 45.00,
        badge: "New",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        title: "Classic Canvas Jacket",
        category: "Outerwear",
        price: 65.00,
        badge: "Sale",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        title: "Minimalist Beanie Hat",
        category: "Accessories",
        price: 15.00,
        badge: "",
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        title: "Linen Casual Shirt",
        category: "Tops",
        price: 35.00,
        badge: "",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        title: "Slim Fit Chino Pants",
        category: "Bottoms",
        price: 40.00,
        badge: "Hot",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&q=80"
    }
];

// WhatsApp Number configuration (Replace with your actual phone number with country code)
const WHATSAPP_PHONE = "6281234567890";

// LocalStorage helpers for persistent Cart
function getCart() {
    return JSON.parse(localStorage.getItem('cart_dxcloset')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart_dxcloset', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badgeEl = document.getElementById('cart-count');
    if (badgeEl) badgeEl.innerText = count;
}

function addToCart(id) {
    let cart = getCart();
    const product = products.find(p => p.id === id);
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    alert(`${product.title} added to cart!`);
}

// Global initialization across all pages
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // 1. Home Page Logic (Featured Products)
    const featuredGrid = document.getElementById('featured-products');
    if (featuredGrid) {
        renderProductCards(products.slice(0, 4), featuredGrid);
    }

    // 2. Shop Page Logic (Filtering & Search)
    const shopGrid = document.getElementById('shop-products');
    if (shopGrid) {
        renderProductCards(products, shopGrid);

        // Search Input
        const searchInput = document.getElementById('shop-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase();
                const filtered = products.filter(p => p.title.toLowerCase().includes(keyword));
                renderProductCards(filtered, shopGrid);
            });
        }

        // Category Buttons
        const categoryBtns = document.querySelectorAll('.cat-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.category;
                if (cat === 'all') {
                    renderProductCards(products, shopGrid);
                } else {
                    const filtered = products.filter(p => p.category === cat);
                    renderProductCards(filtered, shopGrid);
                }
            });
        });
    }

    // 3. Cart Page Logic
    const cartTableBody = document.getElementById('cart-table-body');
    if (cartTableBody) {
        renderCartPage();
    }
});

// Render Product Cards
function renderProductCards(items, container) {
    container.innerHTML = "";
    if (items.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No products found.</p>`;
        return;
    }

    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render Cart Table
function renderCartPage() {
    const cartTableBody = document.getElementById('cart-table-body');
    const totalPriceEl = document.getElementById('cart-total-price');
    const cart = getCart();

    cartTableBody.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">Your cart is empty!</td></tr>`;
        totalPriceEl.innerText = "$0.00";
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.title}">
                    <span>${item.title}</span>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        cartTableBody.appendChild(tr);
    });

    totalPriceEl.innerText = `$${total.toFixed(2)}`;
}

function updateQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    saveCart(cart);
    renderCartPage();
}

function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
}

// Checkout via WhatsApp
function checkoutWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = `Hello *The DX Closet*, I'd like to place an order:\n\n`;
    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `${index + 1}. *${item.title}* (${item.qty}x) - $${subtotal.toFixed(2)}\n`;
    });

    message += `\n*Total Order:* $${total.toFixed(2)}\n\n`;
    message += `Please confirm availability and shipping details. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${+85292426287}?text=${encoded}`, '_blank');
                                                       }
