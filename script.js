// Database of Products
const products = [
    {
        id: 1,
        title: "Front Button Knitted Pullover / Sleeveless",
        category: "Tops",
        price: 20.00,
        badge: "New",
        image: "1790653743515.jpg"
    },
    {
        id: 2,
        title: "V-neck Crop Polo Shirt",
        category: "Tops",
        price: 25.00,
        badge: "Hot",
        image: "1790734962153.jpg"
    },
    {
        id: 3,
        title: "Short-sleeve Knit Cardigan",
        category: "Tops",
        price: 20.00,
        image: "1790743368793.jpg"
    },
    {
        id: 4,
        title: "Tie-Front Ruffle Blouse",
        category: "Tops",
        price: 20.00,
        image: "1790744079252.jpg"
    },
    {
        id: 5,
        title: "Camisole Peplum Top",
        category: "Tops",
        price: 20.00,
        image: "1790747501017.jpg"
    },
{
        id: 6,
        title: "Scoop Neck Tank Top",
        category: "Tops",
        price: 10.00,
        image: "1790762356251.jpg"
},
    {
        id: 7,
        title: "Jelly Bra",
        category: "Innerwear",
        price: 10.00,
        image: "1790762880899.jpg"
    }
];

const WHATSAPP_PHONE = "85292426287";

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

    // 1. Home Page Logic (Featured Products - Max 4 items)
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
                <div class="product-price">HK$ ${product.price.toFixed(2)}</div>
                <button class="add-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render Cart Table with Automatic Tiered Discounts
function renderCartPage() {
    const cartTableBody = document.getElementById('cart-table-body');
    const totalPriceEl = document.getElementById('cart-total-price');
    const cart = getCart();

    if (!cartTableBody) return;

    cartTableBody.innerHTML = "";

    if (cart.length === 0) {
        cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;">Your cart is empty!</td></tr>`;
        if (totalPriceEl) totalPriceEl.innerText = "HK$ 0.00";
        return;
    }

    let rawTotal = 0;
    let totalQty = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        rawTotal += itemTotal;
        totalQty += item.qty;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.title}">
                    <span>${item.title}</span>
                </div>
            </td>
            <td>HK$ ${item.price.toFixed(2)}</td>
            <td>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>HK$ ${itemTotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        cartTableBody.appendChild(tr);
    });

    // Discount Calculation Logic (Tiered Discount Strategy)
    let discountPercent = 0;
    if (totalQty === 1) {
        discountPercent = 5;
    } else if (totalQty >= 2 && totalQty <= 3) {
        discountPercent = 10;
    } else if (totalQty >= 4 && totalQty <= 5) {
        discountPercent = 15;
    } else if (totalQty > 5) {
        discountPercent = 20;
    }

    const discountAmount = rawTotal * (discountPercent / 100);
    const finalTotal = rawTotal - discountAmount;

    if (totalPriceEl) {
        totalPriceEl.innerHTML = `
            <div style="text-align: right; font-size: 0.95rem; line-height: 1.6;">
                <div>Subtotal (${totalQty} pcs): <strong>HK$ ${rawTotal.toFixed(2)}</strong></div>
                ${discountPercent > 0 ? `<div style="color: #e74c3c;">Discount (${discountPercent}%): <strong>-HK$ ${discountAmount.toFixed(2)}</strong></div>` : ''}
                <div style="font-size: 1.25rem; font-weight: 700; margin-top: 5px; color: #111;">
                    Total: HK$ ${finalTotal.toFixed(2)}
                </div>
            </div>
        `;
    }
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

// Checkout via WhatsApp with Discount Included
function checkoutWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let rawTotal = 0;
    let totalQty = 0;
    let message = `Hello *The DX Closet*, I'd like to place an order:\n\n`;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        rawTotal += subtotal;
        totalQty += item.qty;
        message += `${index + 1}. *${item.title}* (${item.qty}x) - HK$ ${subtotal.toFixed(2)}\n`;
    });

    // Calculate Discount
    let discountPercent = 0;
    if (totalQty === 1) {
        discountPercent = 5;
    } else if (totalQty >= 2 && totalQty <= 3) {
        discountPercent = 10;
    } else if (totalQty >= 4 && totalQty <= 5) {
        discountPercent = 15;
    } else if (totalQty > 5) {
        discountPercent = 20;
    }

    const discountAmount = rawTotal * (discountPercent / 100);
    const finalTotal = rawTotal - discountAmount;

    message += `\n------------------------------`;
    message += `\n*Subtotal (${totalQty} pcs):* HK$ ${rawTotal.toFixed(2)}`;
    if (discountPercent > 0) {
        message += `\n*Discount (${discountPercent}%):* -HK$ ${discountAmount.toFixed(2)}`;
    }
    message += `\n*Grand Total:* HK$ ${finalTotal.toFixed(2)}`;
    message += `\n------------------------------\n\n`;
    message += `Please confirm availability and shipping details. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');
}

// Contact Form WhatsApp Redirection
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const userMessage = document.getElementById('contact-message').value;

        let message = `Hello *The DX Closet*,\n\n`;
        message += `You have a new inquiry from your website:\n`;
        message += `👤 *Name:* ${name}\n`;
        message += `✉️ *Email:* ${email}\n\n`;
        message += `💬 *Message:*\n${userMessage}`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`, '_blank');
    });
            }
