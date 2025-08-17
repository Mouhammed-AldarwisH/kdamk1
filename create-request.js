// الملف الرئيسي - مختصر ومبسط

// إضافة CSS للجوال
(function injectMobileResponsiveCSS() {
    if (!document.getElementById('mobile-responsive-style')) {
        const style = document.createElement('style');
        style.id = 'mobile-responsive-style';
        style.textContent = `
        @media (max-width: 600px) {
            html, body { max-width: 100vw !important; overflow-x: hidden !important; }
            #items-container { width: 100vw !important; margin-top: 120px !important; }
            .items-row { width: 100vw !important; gap: 10px !important; overflow-x: auto !important; }
            .item-card { width: 150px !important; min-width: 140px !important; }
            #home-btn { top: 12px !important; right: 12px !important; width: 44px !important; height: 44px !important; }
        }
        @keyframes shake-badge {
            0% { transform: translateX(-50%) translateY(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-50%) translateY(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(-50%) translateY(2px); }
            100% { transform: translateX(-50%) translateY(0); }
        }
        #cart-count-badge.shake { animation: shake-badge 0.5s; }
        `;
        document.head.appendChild(style);
    }
    
    if (window.innerWidth <= 600) {
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
    }
})();

// مستمعات النقر
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-btn')) {
        const id = Number(e.target.dataset.id);
        cart[id] = 1;
        updateItemControls(id);
    }
    if (e.target.classList.contains('qty-btn')) {
        const id = Number(e.target.dataset.id);
        if (e.target.classList.contains('plus')) {
            cart[id] = (cart[id] || 0) + 1;
        } else if (e.target.classList.contains('minus')) {
            cart[id] = (cart[id] || 1) - 1;
            if (cart[id] <= 0) delete cart[id];
        }
        updateItemControls(id);
    }
    
    if (e.target.id === 'send-order-btn') {
        sendOrderToDatabase();
    }
});

// إعداد زر التأكيد
function setupConfirmButton() {
    let btn = document.getElementById('confirm-order-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'confirm-order-btn';
        const lang = localStorage.getItem('lang') || 'ar';
        btn.textContent = translations[lang]?.confirmOrder || translations.ar.confirmOrder;
        btn.style.position = 'fixed';
        btn.style.bottom = '5px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.style.background = '#ffd700';
        btn.style.color = '#222';
        btn.style.fontWeight = '700';
        btn.style.fontSize = '20px';
        btn.style.padding = '16px 40px';
        btn.style.border = 'none';
        btn.style.borderRadius = '32px';
        btn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        btn.style.zIndex = '9999';
        btn.style.display = 'none';
        btn.style.cursor = 'pointer';
        document.body.appendChild(btn);

        btn.addEventListener('click', function() {
            const itemsContainer = document.getElementById('items-container');
            if (itemsContainer) itemsContainer.style.display = 'none';
            btn.style.display = 'none';
            const badge = document.getElementById('cart-count-badge');
            if (badge) badge.style.display = 'none';
            const filterBarWrapper = document.getElementById('type-filter-bar-wrapper');
            if (filterBarWrapper) filterBarWrapper.style.display = 'none';
            const homeBtn = document.getElementById('home-btn');
            if (homeBtn) homeBtn.style.display = 'none';
            
            showSelectedItemsSummary();
        });
    }
}

function updateConfirmButtonVisibility() {
    const btn = document.getElementById('confirm-order-btn');
    if (!btn) return;
    const hasItems = Object.keys(cart).length > 0;
    btn.style.display = hasItems ? 'block' : 'none';
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء زر الهوم
    let homeBtn = document.getElementById('home-btn');
    if (!homeBtn) {
        homeBtn = document.createElement('button');
        homeBtn.id = 'home-btn';
        homeBtn.innerHTML = '<i class="fas fa-home"></i>';
        homeBtn.style = `
            position:fixed;
            top:${window.innerWidth <= 600 ? '12px' : '24px'};
            right:${window.innerWidth <= 600 ? '12px' : '24px'};
            width:${window.innerWidth <= 600 ? '44px' : '56px'};
            height:${window.innerWidth <= 600 ? '44px' : '56px'};
            background:#1976d2;
            color:#fff;
            border:none;
            border-radius:${window.innerWidth <= 600 ? '12px' : '16px'};
            font-size:${window.innerWidth <= 600 ? '22px' : '28px'};
            box-shadow:0 2px 8px rgba(0,0,0,0.12);
            cursor:pointer;
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:1000;
        `;
        homeBtn.onclick = function() {
            window.location.href = 'login.html';
        };
        document.body.appendChild(homeBtn);
    }

    // تحميل البيانات
    loadCartFromStorage();
    loadAudiosFromStorage();
    renderRows('');
    setupConfirmButton();
    updateConfirmButtonVisibility();
    updateCartCountBadge();

    // إعداد اللغة والنمط
    let currentLang = localStorage.getItem('lang') || 'ar';
    applyLang(currentLang);
    document.getElementById('currentLang').value = currentLang;

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    // إخفاء أزرار اللغة والنمط
    const themeBtn = document.getElementById('themeButton');
    if (themeBtn) themeBtn.style.display = 'none';
    const langBtn = document.getElementById('langButton');
    if (langBtn) langBtn.style.display = 'none';

    // مستمعات أزرار اللغة والنمط
    document.getElementById('themeButton').addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark-theme');
        if (isDark) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    document.getElementById('langButton').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('lang-dropdown').style.display = 'block';
    });

    document.querySelectorAll('.lang-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            document.getElementById('currentLang').value = selectedLang;
            localStorage.setItem('lang', selectedLang);
            applyLang(selectedLang);
            document.getElementById('lang-dropdown').style.display = 'none';
        });
    });

    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown && !dropdown.contains(e.target) && e.target.id !== 'langButton') {
            dropdown.style.display = 'none';
        }
    });
});

// إعداد مستمعات الصوت
function setupAudioListeners(card, item) {
    const audioUpload = card.querySelector(`#audioUpload-${item.id}`);
    const audioPlayer = card.querySelector(`#audioPlayer-${item.id}`);
    const uploadAgainBtn = card.querySelector(`#uploadAgainBtn-${item.id}`);

    if (itemAudioUrls[item.id]) {
        audioPlayer.src = itemAudioUrls[item.id];
        audioPlayer.style.display = 'block';
        audioUpload.style.display = 'none';
        uploadAgainBtn.style.display = 'inline-block';
    }

    audioUpload.addEventListener('change', async function(event) {
        const file = event.target.files[0];
        if (file) {
            const url = await fileToBase64(file);
            audioPlayer.src = url;
            audioPlayer.style.display = 'block';
            audioPlayer.load();
            audioUpload.style.display = 'none';
            uploadAgainBtn.style.display = 'inline-block';
            itemAudios[item.id] = file;
            itemAudioUrls[item.id] = url;
            await saveAudiosToStorage();
        } else {
            audioPlayer.src = '';
            audioPlayer.style.display = 'none';
            audioUpload.style.display = 'block';
            uploadAgainBtn.style.display = 'none';
            delete itemAudios[item.id];
            delete itemAudioUrls[item.id];
            await saveAudiosToStorage();
        }
    });

    uploadAgainBtn.addEventListener('click', function() {
        audioPlayer.src = '';
        audioPlayer.style.display = 'none';
        audioUpload.value = '';
        audioUpload.style.display = 'inline-block';
        uploadAgainBtn.style.display = 'none';
        delete itemAudios[item.id];
        delete itemAudioUrls[item.id];
        saveAudiosToStorage();
    });
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء زر الهوم
    let homeBtn = document.getElementById('home-btn');
    if (!homeBtn) {
        homeBtn = document.createElement('button');
        homeBtn.id = 'home-btn';
        homeBtn.innerHTML = '<i class="fas fa-home"></i>';
        homeBtn.style = `
            position:fixed;
            top:${window.innerWidth <= 600 ? '12px' : '24px'};
            right:${window.innerWidth <= 600 ? '12px' : '24px'};
            width:${window.innerWidth <= 600 ? '44px' : '56px'};
            height:${window.innerWidth <= 600 ? '44px' : '56px'};
            background:#1976d2;
            color:#fff;
            border:none;
            border-radius:${window.innerWidth <= 600 ? '12px' : '16px'};
            font-size:${window.innerWidth <= 600 ? '22px' : '28px'};
            box-shadow:0 2px 8px rgba(0,0,0,0.12);
            cursor:pointer;
            display:flex;
            align-items:center;
            justify-content:center;
            z-index:1000;
        `;
        homeBtn.onclick = function() {
            window.location.href = 'login.html';
        };
        document.body.appendChild(homeBtn);
    }

    // تحميل البيانات
    loadCartFromStorage();
    loadAudiosFromStorage();
    renderRows('');
    setupConfirmButton();
    updateConfirmButtonVisibility();
    updateCartCountBadge();

    // إعداد اللغة والنمط
    let currentLang = localStorage.getItem('lang') || 'ar';
    applyLang(currentLang);
    document.getElementById('currentLang').value = currentLang;

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    // إخفاء أزرار اللغة والنمط
    const themeBtn = document.getElementById('themeButton');
    if (themeBtn) themeBtn.style.display = 'none';
    const langBtn = document.getElementById('langButton');
    if (langBtn) langBtn.style.display = 'none';

    // مستمعات أزرار اللغة والنمط
    document.getElementById('themeButton').addEventListener('click', function() {
        const isDark = document.body.classList.contains('dark-theme');
        if (isDark) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    document.getElementById('langButton').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('lang-dropdown').style.display = 'block';
    });

    document.querySelectorAll('.lang-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            document.getElementById('currentLang').value = selectedLang;
            localStorage.setItem('lang', selectedLang);
            applyLang(selectedLang);
            document.getElementById('lang-dropdown').style.display = 'none';
        });
    });

    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown && !dropdown.contains(e.target) && e.target.id !== 'langButton') {
            dropdown.style.display = 'none';
        }
    });

    // إعداد زر التأكيد
    setupConfirmButton();

    // تحديث رؤية زر التأكيد
    updateConfirmButtonVisibility();

    // تحديث عدد العناصر في شارة العربة
    updateCartCountBadge();

    // إعداد مستمعات الصوت لكل عنصر في السلة
    document.querySelectorAll('.item-card').forEach(card => {
        const id = card.getAttribute('data-id');
        const item = { id: Number(id), name: card.getAttribute('data-name'), type: card.getAttribute('data-type'), image: card.getAttribute('data-image') };
        setupAudioListeners(card, item);
    });
});
