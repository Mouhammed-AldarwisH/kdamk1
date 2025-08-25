// ملف إدارة السلة: حفظ واسترجاع السلة، تحديث دائرة العد، التحكم في العناصر

const cart = {};

// استرجاع السلة من localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('selectedItems');
    if (savedCart) { 
        try {
            const parsed = JSON.parse(savedCart);
            Object.assign(cart, parsed);
        } catch (e) {
            // تجاهل الخطأ إذا كان التخزين غير صالح
        }
    }
}

// حفظ السلة في localStorage
function saveCartToStorage() {
    localStorage.setItem('selectedItems', JSON.stringify(cart));
    const itemIds = Object.keys(cart).map(Number);
    localStorage.setItem('selectedItemIds', JSON.stringify(itemIds));
}

// رسم أزرار التحكم للعنصر
function renderItemControls(itemId, count) {
    if (count === 0) {
        return `<button class="add-btn" data-id="${itemId}" style="font-size:24px; background:#ffd700; border:none; border-radius:50%; width:48px; height:48px; cursor:pointer;">&#43;</button>`;
    } else {
        return `<div style="display:flex; align-items:center; justify-content:center;">
                <button class="qty-btn minus" data-id="${itemId}" style="font-size:24px; background:#eee; border:none; border-radius:50%; width:44px; height:44px; cursor:pointer; order:1;">&#8722;</button>
                <span style="font-size:20px; font-weight:600; margin:0 15px; order:2;">${count}</span>
                <button class="qty-btn plus" data-id="${itemId}" style="font-size:24px; background:#ffd700; border:none; border-radius:50%; width:44px; height:44px; cursor:pointer; order:3;">&#43;</button>
                </div>`;
    }
}

// تحديث تحكم العنصر
function updateItemControls(itemId) {
    const count = cart[itemId] || 0;
    const controlsContainer = document.getElementById(`controls-${itemId}`);
    if (controlsContainer) {
        controlsContainer.innerHTML = renderItemControls(itemId, count);
    }
    saveCartToStorage();
    updateConfirmButtonVisibility();
    updateCartCountBadge();
}

// تحديث دائرة عد العناصر
function updateCartCountBadge() {
    let badge = document.getElementById('cart-count-badge');
    const count = Object.keys(cart).length;
    
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'cart-count-badge';
        badge.style.position = 'fixed';
        badge.style.bottom = '20px';
        badge.style.left = '22%';
        badge.style.transform = 'translateX(-50%)';
        badge.style.background = '#e53935';
        badge.style.color = '#fff';
        badge.style.fontWeight = '700';
        badge.style.fontSize = '16px';
        badge.style.width = '32px';
        badge.style.height = '32px';
        badge.style.borderRadius = '50%';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        badge.style.zIndex = '9999';
        document.body.appendChild(badge);

        setInterval(() => {
            if (badge.style.display !== 'none') {
                badge.classList.add('shake');
                setTimeout(() => badge.classList.remove('shake'), 500);
            }
        }, 1000);
    }
    
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}
 
// مسح السلة
function clearCart() {
    Object.keys(cart).forEach(id => delete cart[id]);
    saveCartToStorage();
    updateCartCountBadge();
    updateConfirmButtonVisibility();
}

// تصدير المتغيرات والدوال
window.cart = cart;
window.loadCartFromStorage = loadCartFromStorage;
window.saveCartToStorage = saveCartToStorage;
window.renderItemControls = renderItemControls;
window.updateItemControls = updateItemControls;
window.updateCartCountBadge = updateCartCountBadge;
window.clearCart = clearCart;
window.clearCart = clearCart;
