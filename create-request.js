// Script for Create Request page
 
// جلب apiKey من نافذة المتصفح (تم تمريره من السيرفر أو HTML)
const apiKey = window.SUPABASE_ANON_KEY;

// أنشئ Supabase client في بداية الملف
let client;
// تهيئة Supabase client بعد التأكد من وجود المكتبة
function initSupabaseClient() {
    if (typeof supabase !== 'undefined') {
        client = supabase.createClient(
            'https://akvyhsmobalbqfcjupdq.supabase.co',
            apiKey
        );
        console.log('Supabase client initialized');
    } else {
        console.error('Supabase library not loaded');
    }
}

// استدعاء دالة التهيئة مباشرة
initSupabaseClient();

// جلب العناصر من قاعدة البيانات عبر Supabase REST API
async function fetchItems() {

    const homeId = localStorage.getItem('houseId');
    console.log('selectedHouseId:', homeId); // تحقق من قيمة البيت
    if (!homeId) return [];

    const url = `https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/items?home_id=eq.${homeId}&select=*`;

    console.log('fetch url:', url); // تحقق من رابط الاستعلام

    const resp = await fetch(url, {
        headers: {
            apikey: apiKey,
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        }
    });
    console.log('fetch status:', resp.status); // تحقق من حالة الاستجابة
    if (!resp.ok) return [];
    const data = await resp.json();
    console.log('items from supabase:', data); // اطبع العناصر القادمة من قاعدة البيانات
    return data;
}

// تجميع العناصر حسب النوع
function groupItemsByType(items) {
    const groups = {};
    items.forEach(item => {
        if (!groups[item.type]) groups[item.type] = [];
        groups[item.type].push(item);
    });
    return groups;
}

// Temporary cart state
const cart = {}

// استرجاع الكارت من localStorage عند تحميل الصفحة
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

// حفظ الكارت في localStorage
function saveCartToStorage() {
    localStorage.setItem('selectedItems', JSON.stringify(cart));
    // حفظ معرفات العناصر المختارة في localStorage
    const itemIds = Object.keys(cart).map(Number);
    localStorage.setItem('selectedItemIds', JSON.stringify(itemIds));
}

// تحويل ملف إلى Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// حفظ التسجيلات الصوتية في localStorage
async function saveAudiosToStorage() {
    const audioData = {};
    for (const [id, file] of Object.entries(itemAudios)) {
        if (file) {
            audioData[id] = {
                name: file.name,
                data: await fileToBase64(file) // تحويل الملف إلى Base64
            };
        }
    }
    localStorage.setItem('itemAudios', JSON.stringify(audioData));
}

// تحويل Base64 إلى Blob
function base64ToBlob(base64, contentType = '') {
    const byteCharacters = atob(base64.split(',')[1]); // إزالة الجزء "data:...;base64,"
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}

// تخزين روابط أو ملفات الصوت لكل عنصر مختار
const itemAudios = {};
const itemAudioUrls = {}; // روابط Base64 لكل عنصر

// استرجاع التسجيلات الصوتية من localStorage
function loadAudiosFromStorage() {
    const savedAudios = localStorage.getItem('itemAudios');
    if (savedAudios) {
        try {
            const parsed = JSON.parse(savedAudios);
            for (const [id, audio] of Object.entries(parsed)) {
                const blob = base64ToBlob(audio.data, 'audio/mpeg'); // تحويل Base64 إلى Blob
                itemAudios[id] = new File([blob], audio.name); // إنشاء ملف من Blob
                itemAudioUrls[id] = audio.data; // خزّن الرابط مباشرة
            }
        } catch (e) {
            console.error('Error loading audio files:', e);
        }
    }
}

// رسم الصفوف والكروت
async function renderRows(selectedType = '') {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    container.style.width = '100vw';
    container.style.maxWidth = '100%';
    container.style.boxSizing = 'border-box';
    container.style.padding = '60px 0px 0px 0px'; // استخدم padding-top بدل marginTop
    container.style.marginTop = '0'; // أزل أي هوامش علوية قديمة

    const items = await fetchItems();
    if (!items || items.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#888; font-size:18px; margin:40px 0;">لا توجد عناصر متاحة لهذا البيت.</div>';
        return;
    }
    const grouped = groupItemsByType(items);

    // زر الفلتر ثابت أعلى الشاشة ومزاح إلى اليمين
    let filterBtn = document.getElementById('show-filter-btn');
    if (!filterBtn) {
        filterBtn = document.createElement('button');
        filterBtn.id = 'show-filter-btn';
        filterBtn.textContent = 'فلتر';
        filterBtn.style = `
            position: fixed;
            top: 10px;
            right: 332px;
            width: 60px;
            height: 60px;
            border-radius: 16px;
            border: none;
            background: #ffd700;
            font-weight: 700;
            cursor: pointer;
            font-size: 20px;
            z-index: 10001;
            box-shadow: 0 2px 12px rgba(0,0,0,0.10);
            display: block;
        `;
        document.body.appendChild(filterBtn);

        filterBtn.onclick = function() {
            showTypeFilterPopup(Object.keys(grouped));
        };
    }

    // رسم الفلتر كنافذة منبثقة (سيتم رسمه عند الضغط على زر الفلتر فقط)
    // ...لا ترسم الفلتر هنا...

    // إذا تم اختيار نوع، اعرض فقط هذا النوع
    const typesToShow = selectedType ? [selectedType] : Object.keys(grouped);

    typesToShow.forEach(type => {
        // عنوان النوع
        const typeTitle = document.createElement('div');
        typeTitle.className = 'item-type-title';
        typeTitle.textContent = getTypeLabel(type);
        typeTitle.style = "font-weight:700; font-size:20px; margin-bottom:8px; margin-right:8px;";
        container.appendChild(typeTitle);

        // صف جديد لكل نوع
        const rowDiv = document.createElement('div');
        rowDiv.className = 'items-row';
        rowDiv.style.width = '90vw';
        rowDiv.style.maxWidth = '100%';
        rowDiv.style.overflowX = 'auto';
        rowDiv.style.display = 'flex';
        rowDiv.style.gap = '18px';
        rowDiv.style.height = '300px';
        rowDiv.style.alignItems = 'center';
        rowDiv.style.marginBottom = '32px';
        rowDiv.style.boxSizing = 'border-box';
        rowDiv.style.padding = '0 12px';

        // كروت العناصر
        grouped[type].forEach(item => {
            const count = cart[item.id] || 0;
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style = "border:1px solid #ccc; border-radius:12px; padding:24px; width:260px; text-align:center; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.07); flex:0 0 auto;";

            card.innerHTML = `
                <div style="height:160px; margin-bottom:12px; display:flex; align-items:center; justify-content:center;">
                    <img src="${item.image}" alt="Item Image" style="width:160px; height:160px; object-fit:cover; border-radius:12px;">
                </div>
                <div style="font-weight:600; font-size:18px; margin-bottom:16px;">${item.name}</div>
                <div id="controls-${item.id}" class="item-controls">
                    ${renderItemControls(item.id, count)}
                </div>
            `;
            rowDiv.appendChild(card);
        });

        container.appendChild(rowDiv);
    });

    // تطبيق النمط الحالي بعد رسم العناصر
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme('dark');
    }
}

// إضافة كود CSS لهزة زر الفلتر إذا لم يكن موجوداً
(function injectShakeFilterCSS() {
    if (!document.getElementById('filter-btn-shake-style')) {
        const style = document.createElement('style');
        style.id = 'filter-btn-shake-style';
        style.textContent = `
        @keyframes shake-filter-btn {
            0% { transform: scale(1) rotate(0deg);}
            20% { transform: scale(1.05) rotate(-6deg);}
            40% { transform: scale(1.1) rotate(6deg);}
            60% { transform: scale(1.05) rotate(-6deg);}
            80% { transform: scale(1.02) rotate(6deg);}
            100% { transform: scale(1) rotate(0deg);}
        }
        #show-filter-btn.shake {
            animation: shake-filter-btn 0.5s infinite;
        }
        `;
        document.head.appendChild(style);
    }
})();

// نافذة الفلتر المنبثقة
function showTypeFilterPopup(types) {
    let popup = document.getElementById('type-filter-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'type-filter-popup';
        popup.style = `
            position: fixed;
            top: 90px;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.18);
            padding: 24px 18px;
            z-index: 10000;
            min-width: 220px;
            text-align: center;
        `;
        document.body.appendChild(popup);
    }
    popup.innerHTML = '';

    // زر "الكل"
    const allBtn = document.createElement('button');
    allBtn.textContent = 'الكل';
    allBtn.className = 'type-filter-btn';
    allBtn.style = "margin:0 8px 12px 8px; padding:8px 18px; border-radius:18px; border:none; background:#eee; font-weight:600; cursor:pointer; font-size:16px;";
    allBtn.dataset.type = '';
    popup.appendChild(allBtn);

    types.forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = getTypeLabel(type);
        btn.className = 'type-filter-btn';
        btn.style = "margin:0 8px 12px 8px; padding:8px 18px; border-radius:18px; border:none; background:#eee; font-weight:600; cursor:pointer; font-size:16px;";
        btn.dataset.type = type;
        popup.appendChild(btn);
    });

    // تمييز الزر المختار
    // لا تحفظ حالة الفلتر في localStorage
    let selectedType = ''; // دائماً لا يوجد فلتر مفعّل عند فتح النافذة
    popup.querySelectorAll('.type-filter-btn').forEach(btn => {
        btn.style.background = (btn.dataset.type === selectedType) ? '#ffd700' : '#eee';
    });

    // مستمع للأزرار
    popup.querySelectorAll('.type-filter-btn').forEach(btn => {
        btn.onclick = function() {
            renderRows(btn.dataset.type);
            popup.style.display = 'none';

            // تغيير لون زر الفلتر حسب الاختيار
            const filterBtn = document.getElementById('show-filter-btn');
            if (btn.dataset.type && btn.dataset.type !== '') {
                filterBtn.style.background = '#35e549ff'; // أحمر
                filterBtn.classList.add('shake'); // اهتزاز مستمر
            } else {
                filterBtn.style.background = '#ffd700'; // أصفر
                filterBtn.classList.remove('shake');
            }
        };
    });

    // زر إغلاق
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'إغلاق';
    closeBtn.style = "margin-top:16px; padding:6px 18px; border-radius:12px; border:none; background:#e53935; color:#fff; font-weight:600; cursor:pointer; font-size:15px;";
    closeBtn.onclick = function() {
        popup.style.display = 'none';
    };
    popup.appendChild(document.createElement('br'));
    popup.appendChild(closeBtn);

    popup.style.display = 'block';
}

// دالة منفصلة لرسم أزرار التحكم للعنصر
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

// تحديث تحكم العنصر فقط بدلاً من إعادة رسم كل شيء
function updateItemControls(itemId) {
    const count = cart[itemId] || 0;
    const controlsContainer = document.getElementById(`controls-${itemId}`);
    if (controlsContainer) {
        controlsContainer.innerHTML = renderItemControls(itemId, count);
    }
    saveCartToStorage(); // حفظ الكارت بعد كل تحديث
    updateConfirmButtonVisibility(); // تحديث ظهور زر التأكيد
    updateCartCountBadge(); // تحديث دائرة العد
}

// إضافة كود CSS للأنيميشن إذا لم يكن موجوداً
(function injectShakeBadgeCSS() {
    if (!document.getElementById('cart-badge-shake-style')) {
        const style = document.createElement('style');
        style.id = 'cart-badge-shake-style';
        style.textContent = `
        @keyframes shake-badge {
            0% { transform: translateX(-50%) translateY(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-50%) translateY(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(-50%) translateY(2px); }
            100% { transform: translateX(-50%) translateY(0); }
        }
        #cart-count-badge.shake {
            animation: shake-badge 0.5s;
        }
        `;
        document.head.appendChild(style);
    }
})();

// دالة لإنشاء أو تحديث دائرة عد العناصر المختارة
function updateCartCountBadge() {
    let badge = document.getElementById('cart-count-badge');
    const count = Object.keys(cart).length;
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'cart-count-badge';
        badge.style.position = 'fixed';
        badge.style.bottom = '15px'; // فوق زر التأكيد
        badge.style.left = '22%';
        badge.style.transform = 'translateX(-50%)';
        badge.style.background = '#e53935'; // أحمر
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

        // اجعل الدائرة تهتز كل ثانية
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

// ترجمة نوع العنصر (اختياري)
function getTypeLabel(type) {
    const labels = {
        cups: "كاسات",
        plates: "صحون",
        spices: "بهارات",
        spoons: "ملاعق",
        forks: "شوك",
        food: "أكل",
        drink: "مشروبات"
    };
    return labels[type] || type;
}

// ترجمة زر التأكيد حسب اللغة
const translations = {
    ar: { confirmOrder: "اضغط لتأكيد الطلب" },
    en: { confirmOrder: "Click to confirm order" },
    ph: { confirmOrder: "I-click para kumpirmahin ang order" }
};

// تغيير اللغة
function applyLang(lang) {
    if (lang === 'en' || lang === 'ph') {
        document.documentElement.setAttribute('dir', 'ltr');
    } else {
        document.documentElement.setAttribute('dir', 'rtl');
    }
    // تحديث نص زر التأكيد إذا كان موجود
    const btn = document.getElementById('confirm-order-btn');
    if (btn) {
        btn.textContent = translations[lang]?.confirmOrder || translations.ar.confirmOrder;
    }
}

// تغيير النمط
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.querySelector('#themeButton i');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        
        // تطبيق النمط الداكن على العناصر والبطاقات
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.background = '#333';
            card.style.color = '#fff';
            card.style.borderColor = '#555';
        });
        
        // تغيير لون الخلفية للصفحة بالكامل
        document.body.style.background = '#222';
        
        // ضبط ألوان كروت العناصر المختارة
        updateSelectedCardsTheme();
    } else {
        document.body.classList.remove('dark-theme');
        const icon = document.querySelector('#themeButton i');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        
        // إعادة النمط الفاتح على العناصر والبطاقات
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.background = '#fff';
            card.style.color = '#000';
            card.style.borderColor = '#ccc';
        });
        
        // إعادة لون الخلفية للصفحة بالكامل
        document.body.style.background = '#f9f6e7';
        
        // ضبط ألوان كروت العناصر المختارة
        updateSelectedCardsTheme();
    }
}

// دالة لضبط ألوان كروت العناصر المختارة حسب النمط
function updateSelectedCardsTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    document.querySelectorAll('.selected-item-card').forEach(card => {
        if (isDark) {
            card.style.background = '#333';
            card.style.color = '#fff';
            card.style.borderColor = '#555';
        } else {
            card.style.background = '#f9f6e7';
            card.style.color = '#222';
            card.style.borderColor = '#ccc';
        }
    });
    // ضبط لون عنوان "العناصر التي تم اختيارها"
    const summaryDiv = document.getElementById('selected-items-summary');
    if (summaryDiv) {
        const title = summaryDiv.querySelector('h2');
        if (title) {
            title.style.color = isDark ? '#ffd700' : '#222';
        }
    }
}

// تحديث الكارت عند الضغط
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-btn')) {
        const id = Number(e.target.dataset.id);
        cart[id] = 1;
        updateItemControls(id);
        // saveCartToStorage(); // لم يعد مطلوب هنا لأن updateItemControls يحفظ تلقائياً
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
        // saveCartToStorage(); // لم يعد مطلوب هنا لأن updateItemControls يحفظ تلقائياً
    }
});

// إضافة زر التأكيد الثابت أسفل الشاشة
function setupConfirmButton() {
    let btn = document.getElementById('confirm-order-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'confirm-order-btn';
        // استخدم الترجمة حسب اللغة الحالية
        const lang = localStorage.getItem('lang') || 'ar';
        btn.textContent = translations[lang]?.confirmOrder || translations.ar.confirmOrder;
        btn.style.position = 'fixed';
        btn.style.bottom = '0px';
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
        btn.style.display = 'none'; // مخفي افتراضياً
        btn.style.cursor = 'pointer';
        document.body.appendChild(btn);

        btn.addEventListener('click', function() {
            // إخفاء الكروت والعناوين لكل صف بعد التأكيد
            const itemsContainer = document.getElementById('items-container');
            if (itemsContainer) {
                itemsContainer.style.display = 'none';
            }
            // إخفاء زر التأكيد
            btn.style.display = 'none';
            // إخفاء الدائرة الحمراء مع الرقم
            const badge = document.getElementById('cart-count-badge');
            if (badge) {
                badge.style.display = 'none';
            }
            // إخفاء زر الفلتر أيضاً
            const filterBtn = document.getElementById('show-filter-btn');
            if (filterBtn) {
                filterBtn.style.display = 'none';
            }

            // عرض العناصر المختارة فقط مع عددها
            showSelectedItemsSummary();
        });
    }
}

// دالة لإظهار أو إخفاء زر التأكيد حسب حالة الكارت
function updateConfirmButtonVisibility() {
    const btn = document.getElementById('confirm-order-btn');
    if (!btn) return;
    // تحقق إذا كان هناك عنصر واحد على الأقل
    const hasItems = Object.keys(cart).length > 0;
    btn.style.display = hasItems ? 'block' : 'none';
    
}

// أول تحميل
document.addEventListener('DOMContentLoaded', function() {
    let homeBtn = document.getElementById('home-btn');
    if (!homeBtn) {
        homeBtn = document.createElement('button');
        homeBtn.id = 'home-btn';
        homeBtn.innerHTML = '<i class="fas fa-home"></i>';
        homeBtn.style = `
            position:fixed;
            top:24px;
            right:24px;
            width:56px;
            height:56px;
            background:#1976d2;
            color:#fff;
            border:none;
            border-radius:16px;
            font-size:28px;
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

    loadCartFromStorage();
    loadAudiosFromStorage(); // تحميل التسجيلات الصوتية
    // دائماً اعرض الكل عند تحميل الصفحة ولا تستخدم selectedType من التخزين
    renderRows('');
    setupConfirmButton();
    updateConfirmButtonVisibility();
    updateCartCountBadge();

    // إعداد اللغة والنمط من التخزين
    let currentLang = localStorage.getItem('lang') || 'ar';
    applyLang(currentLang);
    document.getElementById('currentLang').value = currentLang;

    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    // إخفاء زر تغيير النمط وزر تغيير اللغة
    const themeBtn = document.getElementById('themeButton');
    if (themeBtn) themeBtn.style.display = 'none';
    const langBtn = document.getElementById('langButton');
    if (langBtn) langBtn.style.display = 'none';

    // مستمع زر النمط
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

    // مستمع زر اللغة
    document.getElementById('langButton').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('lang-dropdown').style.display = 'block';
    });

    // مستمع خيارات اللغة
    document.querySelectorAll('.lang-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            document.getElementById('currentLang').value = selectedLang;
            localStorage.setItem('lang', selectedLang);
            applyLang(selectedLang);
            document.getElementById('lang-dropdown').style.display = 'none';
        });
    });

    // إخفاء القائمة عند الضغط خارجها
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown && !dropdown.contains(e.target) && e.target.id !== 'langButton') {
            dropdown.style.display = 'none';
        }
    });
});

// دالة لعرض العناصر المختارة بعد التأكيد
async function showSelectedItemsSummary() {
    // جلب جميع العناصر من قاعدة البيانات
    const items = await fetchItems();
    // إنشاء حاوية جديدة للعرض
    let summaryDiv = document.getElementById('selected-items-summary');
    
    // نعالج حالة وجود العنصر مسبقًا
    if (summaryDiv) {
        // ضمان أن العنصر مرئي في جميع الأحوال
        summaryDiv.style.display = 'block';
        // إفراغ محتوى السلة للتجنب تكرار العناصر
        summaryDiv.innerHTML = '<h2 style="margin-bottom:24px; font-size:22px; font-weight:700;">السلة</h2>';
        console.log('تم العثور على عنصر السلة الموجود مسبقًا.');
    } else {
        console.log('لم يتم العثور على عنصر السلة الموجود مسبقًا.'); 
        // إنشاء عنصر جديد إذا لم يكن موجودًا
        summaryDiv = document.createElement('div');
        summaryDiv.id = 'selected-items-summary';
        summaryDiv.style = `
            margin: 40px auto;
            max-width: 600px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.10);
            padding: 32px 24px;
            text-align: center;
            display: block; /* تأكيد أن العنصر مرئي */
        `;
        summaryDiv.innerHTML = '<h2 style="margin-bottom:24px; font-size:22px; font-weight:700;">السلة</h2>';
        document.body.appendChild(summaryDiv);
    }
   
    
    // تصفية العناصر المختارة فقط
    const selectedIds = Object.keys(cart).map(Number);
    const selectedItems = items.filter(item => selectedIds.includes(item.id));

    if (selectedItems.length === 0) {
        summaryDiv.innerHTML += '<div style="color:#888; font-size:18px;">لم يتم اختيار أي عنصر.</div>';
        return;
    }

    // دائماً أخفِ زر التأكيد والدائرة الحمراء أثناء عرض السلة
    const confirmBtn = document.getElementById('confirm-order-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';
    const badge = document.getElementById('cart-count-badge');
    if (badge) badge.style.display = 'none';

    // رسم الكروت المختارة
    for (const item of selectedItems) {
        const count = cart[item.id];
        const card = document.createElement('div');
        card.className = 'selected-item-card';
        card.style = `
            border:1px solid #ccc;
            border-radius:10px;
            padding:10px;
            margin-bottom:10px;
            background:#f9f6e7;
            display:flex;
            align-items:center;
            gap:10px;
            box-shadow:0 1px 4px rgba(0,0,0,0.05);
            max-width:350px;
            min-height:70px;
        `;
        card.innerHTML = `
            <img src="${item.image}" alt="Item Image" style="width:48px; height:48px; object-fit:cover; border-radius:8px;">
            <div style="flex:1; text-align:right;">
                <div style="font-weight:600; font-size:14px;">${item.name}</div>
                <div style="font-size:12px; color:#555;">${getTypeLabel(item.type)}</div>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
                <button class="summary-qty-btn minus" data-id="${item.id}" style="font-size:12px; background:#eee; border:none; border-radius:50%; width:18px; height:18px; cursor:pointer; padding:0;">&#8722;</button>
                <span id="summary-count-${item.id}" style="font-size:11px; font-weight:700; color:#e53935; min-width:12px; text-align:center;">${count} ×</span>
                <button class="summary-qty-btn plus" data-id="${item.id}" style="font-size:12px; background:#ffd700; border:none; border-radius:50%; width:18px; height:18px; cursor:pointer; padding:0;">&#43;</button>
            </div>
            <div style="flex:1;">
                <span style="display:block; font-size:10px; color:#888; margin-bottom:2px;">
                 سجل ملاحظة صوتية مع الطلب
                </span>
                <input type="file" id="audioUpload-${item.id}" accept="audio/*" style="margin-top:2px;">
                <audio id="audioPlayer-${item.id}" controls style="display:none; margin-top:2px; width:110px; height:28px;"></audio>
                <button id="uploadAgainBtn-${item.id}" style="display:none; margin-top:2px; font-size:10px; padding:2px 8px; border-radius:8px;">احذف وبدل</button>
            </div>
        `;
        summaryDiv.appendChild(card);

        // إعداد مستمعات رفع الصوت لكل عنصر
        const audioUpload = card.querySelector(`#audioUpload-${item.id}`);
        const audioPlayer = card.querySelector(`#audioPlayer-${item.id}`);
        const uploadAgainBtn = card.querySelector(`#uploadAgainBtn-${item.id}`);

        // إذا كان هناك تسجيل محفوظ، استرجعه
        if (itemAudioUrls[item.id]) {
            audioPlayer.src = itemAudioUrls[item.id]; // استخدم الرابط مباشرة
            audioPlayer.style.display = 'block';
            audioUpload.style.display = 'none';
            uploadAgainBtn.style.display = 'inline-block';
        }

        audioUpload.addEventListener('change', async function(event) {
            const file = event.target.files[0];
            if (file) {
                const url = await fileToBase64(file); // تحويل الملف إلى رابط صالح
                audioPlayer.src = url;
                audioPlayer.style.display = 'block';
                audioPlayer.load();
                audioUpload.style.display = 'none';
                uploadAgainBtn.style.display = 'inline-block';
                itemAudios[item.id] = file; // خزّن الملف مؤقتاً
                itemAudioUrls[item.id] = url; // خزّن الرابط أيضاً
                await saveAudiosToStorage(); // حفظ التسجيلات
            } else {
                audioPlayer.src = '';
                audioPlayer.style.display = 'none';
                audioUpload.style.display = 'block';
                uploadAgainBtn.style.display = 'none';
                delete itemAudios[item.id];
                delete itemAudioUrls[item.id];
                await saveAudiosToStorage(); // تحديث التخزين
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
            saveAudiosToStorage(); // تحديث التخزين
        });

        // مستمعات تعديل العدد
        card.querySelector(`.summary-qty-btn.plus`).addEventListener('click', function() {
            cart[item.id] = (cart[item.id] || 0) + 1;
            card.querySelector(`#summary-count-${item.id}`).textContent = cart[item.id] + ' ×';
            saveCartToStorage();
            // لا تظهر زر التأكيد أو الدائرة الحمراء هنا
        });
        card.querySelector(`.summary-qty-btn.minus`).addEventListener('click', function() {
            cart[item.id] = (cart[item.id] || 1) - 1;
            if (cart[item.id] <= 0) {
                delete cart[item.id];
                card.remove();
            } else {
                card.querySelector(`#summary-count-${item.id}`).textContent = cart[item.id] + ' ×';
            }
            saveCartToStorage();
            // لا تظهر زر التأكيد أو الدائرة الحمراء هنا
        });
    }

    // إزالة زر العودة السفلي نهائياً
    let backBtn = document.getElementById('cart-back-btn');
    if (backBtn) {
        backBtn.style.display = 'none';
    }

    // زر العودة العلوي الثابت
    let topBackBtn = document.getElementById('cart-back-btn-top');
    if (!topBackBtn) {
        topBackBtn = document.createElement('button');
        topBackBtn.id = 'cart-back-btn-top';
        topBackBtn.textContent = 'عودة';
        topBackBtn.style.position = 'fixed';
        topBackBtn.style.top = '50px';
        topBackBtn.style.right = '35px';
        topBackBtn.style.width = '56px';
        topBackBtn.style.height = '56px';
        topBackBtn.style.borderRadius = '12px';
        topBackBtn.style.border = 'none';
        topBackBtn.style.background = '#ffd700';
        topBackBtn.style.color = '#222';
        topBackBtn.style.fontWeight = '700';
        topBackBtn.style.fontSize = '18px';
        topBackBtn.style.cursor = 'pointer';
        topBackBtn.style.zIndex = '10002';
        topBackBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        document.body.appendChild(topBackBtn);

        topBackBtn.onclick = function() {
            // التأكد من إخفاء السلة
            const summaryDiv = document.getElementById('selected-items-summary');
            if (summaryDiv) {
                summaryDiv.style.display = 'none';
            }
            
            const itemsContainer = document.getElementById('items-container');
            if (itemsContainer) itemsContainer.style.display = '';
            
            // عند العودة فقط أعد إظهار زر التأكيد والدائرة الحمراء حسب حالة الكارت
            const confirmBtn = document.getElementById('confirm-order-btn');
            if (confirmBtn) confirmBtn.style.display = Object.keys(cart).length > 0 ? 'block' : 'none';
            
            const filterBtn = document.getElementById('show-filter-btn');
            if (filterBtn) filterBtn.style.display = 'block';
            
            const badge = document.getElementById('cart-count-badge');
            if (badge) badge.style.display = Object.keys(cart).length > 0 ? 'flex' : 'none';
            
            topBackBtn.style.display = 'none';
            
            // أخفِ زر مكان التوصيل عند العودة
            const deliveryBtn = document.getElementById('choose-delivery-location-btn');
            if (deliveryBtn) deliveryBtn.style.display = 'none';
        };
    }
    topBackBtn.style.display = 'block';

    // زر "اختر مكان التوصيل" ثابت أسفل الشاشة
    let deliveryBtn = document.getElementById('choose-delivery-location-btn');
    if (!deliveryBtn) {
        deliveryBtn = document.createElement('button');
        deliveryBtn.id = 'choose-delivery-location-btn';
        deliveryBtn.textContent = 'اختر مكان التوصيل';
        deliveryBtn.style.position = 'fixed';
        deliveryBtn.style.bottom = '0px';
        deliveryBtn.style.left = '50%';
        deliveryBtn.style.transform = 'translateX(-50%)';
        deliveryBtn.style.background = '#35e549ff';
        deliveryBtn.style.color = '#fff';
        deliveryBtn.style.fontWeight = '700';
        deliveryBtn.style.fontSize = '20px';
        deliveryBtn.style.padding = '16px 40px';
        deliveryBtn.style.border = 'none';
        deliveryBtn.style.borderRadius = '32px';
        deliveryBtn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        deliveryBtn.style.zIndex = '10003';
        deliveryBtn.style.cursor = 'pointer';
        document.body.appendChild(deliveryBtn);
    }
    deliveryBtn.style.display = 'block';

    // عند العودة أخفِ زر "اختر مكان التوصيل"
    topBackBtn.onclick = function() {
        summaryDiv.style.display = 'none';
        const itemsContainer = document.getElementById('items-container');
        if (itemsContainer) itemsContainer.style.display = '';
        const confirmBtn = document.getElementById('confirm-order-btn');
        if (confirmBtn) confirmBtn.style.display = Object.keys(cart).length > 0 ? 'block' : 'none';
        const filterBtn = document.getElementById('show-filter-btn');
        if (filterBtn) filterBtn.style.display = 'block';
        const badge = document.getElementById('cart-count-badge');
        if (badge) badge.style.display = Object.keys(cart).length > 0 ? 'flex' : 'none';
        topBackBtn.style.display = 'none';
        // أخفِ زر مكان التوصيل عند العودة
        if (deliveryBtn) deliveryBtn.style.display = 'none';
    };

    // عند الضغط على زر "اختر مكان التوصيل" أخفِ كل ما يتعلق بالسلة
    deliveryBtn.onclick = function() {
        // أخفِ عنصر السلة
        const summaryDiv = document.getElementById('selected-items-summary');
        if (summaryDiv) summaryDiv.style.display = 'none';
        // أخفِ زر العودة العلوي
        const topBackBtn = document.getElementById('cart-back-btn-top');
        if (topBackBtn) topBackBtn.style.display = 'none';
        // أخفِ زر مكان التوصيل نفسه
        deliveryBtn.style.display = 'none';
        // اعرض شبكة اللوكيشنات
        showLocationsGrid();
    };

    // ضبط ألوان الكروت حسب النمط الحالي
    updateSelectedCardsTheme();
}

// جلب أماكن التوصيل من قاعدة البيانات عبر Supabase REST API
async function fetchLocations() {
    const homeId = localStorage.getItem('houseId');
    if (!homeId) return [];
    const url = `https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/locations?home_id=eq.${homeId}&select=*`;

    // أضف لوج للتحقق من الهيدر والرابط
    console.log('fetch locations url:', url);

    const resp = await fetch(url, {
        headers: {
            apikey: apiKey,
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        }
    });
    console.log('fetch locations status:', resp.status);
    if (!resp.ok) return [];
    return await resp.json();
}

// دالة لعرض كروت اللوكيشنات في شبكة 3 في صف
async function showLocationsGrid() {
    // أخفِ أي عناصر أخرى متعلقة بالسلة أو الطلب
    const summaryDiv = document.getElementById('selected-items-summary');
    if (summaryDiv) summaryDiv.style.display = 'none';
    const topBackBtn = document.getElementById('cart-back-btn-top');
    if (topBackBtn) topBackBtn.style.display = 'none';
    const deliveryBtn = document.getElementById('choose-delivery-location-btn');
    if (deliveryBtn) deliveryBtn.style.display = 'none';

    // إزالة شبكة اللوكيشنات السابقة إذا وجدت
    let locationsDiv = document.getElementById('locations-grid');
    if (locationsDiv) {
        locationsDiv.innerHTML = '';
        locationsDiv.style.display = 'block';
    } else {
        locationsDiv = document.createElement('div');
        locationsDiv.id = 'locations-grid';
        locationsDiv.style = `
            margin: 40px auto;
            max-width: 600px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.10);
            padding: 32px 18px;
            text-align: center;
            display: block;
        `;
        document.body.appendChild(locationsDiv);
    }

    locationsDiv.innerHTML = '<h2 style="margin-bottom:24px; font-size:22px; font-weight:700;">اختر مكان التوصيل</h2>';

    const locations = await fetchLocations();
    if (!locations || locations.length === 0) {
        locationsDiv.innerHTML += '<div style="color:#888; font-size:18px;">لا توجد أماكن توصيل متاحة.</div>';
        return;
    }

    // شبكة 3 في صف واحد
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '18px';
    grid.style.justifyItems = 'center';
    grid.style.alignItems = 'center';

    locations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.style = `
            border:1px solid #ccc;
            border-radius:12px;
            padding:18px 8px;
            background:#fff;
            box-shadow:0 2px 8px rgba(0,0,0,0.07);
            text-align:center;
            cursor:pointer;
            transition:box-shadow 0.2s;
        `;
        card.innerHTML = `
            <div style="height:80px; margin-bottom:10px; display:flex; align-items:center; justify-content:center;">
                <img src="${location.image}" alt="Location Image" style="width:80px; height:80px; object-fit:cover; border-radius:10px;">
            </div>
            <div style="font-weight:600; font-size:15px; margin-bottom:6px;">${location.name}</div>
        `;
        // يمكنك هنا إضافة حدث اختيار اللوكيشن
        card.onclick = function() {
            // حفظ مكان التوصيل المختار مؤقتاً
            selectedLocationId = location.id;
            localStorage.setItem('selectedLocationId', location.id);
            // تمييز الكارت المختار
            grid.querySelectorAll('.location-card').forEach(c => c.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)');
            card.style.boxShadow = '0 0 0 3px #35e549ff';
            // تفعيل زر اختيار الخادم
            chooseServerBtn.disabled = false;
            chooseServerBtn.style.opacity = '1';
        };
        grid.appendChild(card);
    });

    locationsDiv.appendChild(grid);

    // زر العودة أعلى شبكة اللوكيشنات (أنشئه مرة واحدة فقط)
    let locationsBackBtn = document.getElementById('locations-back-btn');
    if (!locationsBackBtn) {
        locationsBackBtn = document.createElement('button');
        locationsBackBtn.id = 'locations-back-btn';
        locationsBackBtn.textContent = 'عودة';
        locationsBackBtn.style.position = 'fixed';
        locationsBackBtn.style.top = '50px';
        locationsBackBtn.style.right = '35px';
        locationsBackBtn.style.width = '56px';
        locationsBackBtn.style.height = '56px';
        locationsBackBtn.style.borderRadius = '12px';
        locationsBackBtn.style.border = 'none';
        locationsBackBtn.style.background = '#ffd700';
        locationsBackBtn.style.color = '#222';
        locationsBackBtn.style.fontWeight = '700';
        locationsBackBtn.style.fontSize = '18px';
        locationsBackBtn.style.cursor = 'pointer';
        locationsBackBtn.style.zIndex = '10004';
        locationsBackBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        document.body.appendChild(locationsBackBtn);
    }
    locationsBackBtn.style.display = 'block';

    // حدث زر العودة: أظهر أزرار اللغة والنمط أيضاً
    locationsBackBtn.onclick = function() {
        // أخفِ شبكة اللوكيشنات
        const locationsDiv = document.getElementById('locations-grid');
        if (locationsDiv) locationsDiv.style.display = 'none';
        // أخفِ زر العودة الخاص باللوكيشنات
        locationsBackBtn.style.display = 'none';
        // أخفِ زر اختيار الخادم
        const chooseServerBtn = document.getElementById('choose-server-btn');
        if (chooseServerBtn) chooseServerBtn.style.display = 'none';
        // أظهر السلة وزر العودة العلوي وزر مكان التوصيل
        const summaryDiv = document.getElementById('selected-items-summary');
        if (summaryDiv) summaryDiv.style.display = 'block';
        const topBackBtn = document.getElementById('cart-back-btn-top');
        if (topBackBtn) topBackBtn.style.display = 'block';
        const deliveryBtn = document.getElementById('choose-delivery-location-btn');
        if (deliveryBtn) deliveryBtn.style.display = 'block';
    };

    // زر اختيار الخادم ثابت أسفل شاشة اللوكيشنات
    let chooseServerBtn = document.getElementById('choose-server-btn');
    if (!chooseServerBtn) {
        chooseServerBtn = document.createElement('button');
        chooseServerBtn.id = 'choose-server-btn';
        chooseServerBtn.textContent = 'اختر الخادم';
        chooseServerBtn.style.position = 'fixed';
        chooseServerBtn.style.bottom = '0px';
        chooseServerBtn.style.left = '50%';
        chooseServerBtn.style.transform = 'translateX(-50%)';
        chooseServerBtn.style.background = '#ffd700';
        chooseServerBtn.style.color = '#222';
        chooseServerBtn.style.fontWeight = '700';
        chooseServerBtn.style.fontSize = '20px';
        chooseServerBtn.style.padding = '16px 40px';
        chooseServerBtn.style.border = 'none';
        chooseServerBtn.style.borderRadius = '32px';
        chooseServerBtn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        chooseServerBtn.style.zIndex = '10005';
        chooseServerBtn.style.cursor = 'pointer';
        document.body.appendChild(chooseServerBtn);

        chooseServerBtn.onclick = function() {
            // لا تسمح بالضغط إذا لم يتم اختيار مكان
            if (!selectedLocationId) {
                chooseServerBtn.disabled = true;
                chooseServerBtn.style.opacity = '0.6';
                return;
            }
            // أخفِ كل ما يتعلق بقائمة اللوكيشنات
            const locationsDiv = document.getElementById('locations-grid');
            if (locationsDiv) locationsDiv.style.display = 'none';
            const locationsBackBtn = document.getElementById('locations-back-btn');
            if (locationsBackBtn) locationsBackBtn.style.display = 'none';
            chooseServerBtn.style.display = 'none';
            // اعرض شبكة المستخدمين
            showUsersGrid();
        };
    }
    chooseServerBtn.style.display = 'block';
    chooseServerBtn.disabled = true;
    chooseServerBtn.style.opacity = '0.6';

    // عند العودة من اللوكيشنات أخفِ زر اختيار الخادم
     locationsBackBtn = document.getElementById('locations-back-btn');
    if (locationsBackBtn) {
        locationsBackBtn.onclick = function() {
            // أخفِ شبكة اللوكيشنات
            const locationsDiv = document.getElementById('locations-grid');
            if (locationsDiv) locationsDiv.style.display = 'none';
            // أخفِ زر العودة الخاص باللوكيشنات
            locationsBackBtn.style.display = 'none';
            // أخفِ زر اختيار الخادم
            const chooseServerBtn = document.getElementById('choose-server-btn');
            if (chooseServerBtn) chooseServerBtn.style.display = 'none';
            // أظهر السلة وزر العودة العلوي وزر مكان التوصيل
            const summaryDiv = document.getElementById('selected-items-summary');
            if (summaryDiv) summaryDiv.style.display = 'block';
            const topBackBtn = document.getElementById('cart-back-btn-top');
            if (topBackBtn) topBackBtn.style.display = 'block';
            const deliveryBtn = document.getElementById('choose-delivery-location-btn');
            if (deliveryBtn) deliveryBtn.style.display = 'block';
        };
    }

    // ضبط ألوان الكروت حسب النمط الحالي
    updateLocationsCardsTheme();
}

// دالة لضبط ألوان كروت اللوكيشنات حسب النمط
function updateLocationsCardsTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    document.querySelectorAll('.location-card').forEach(card => {
        if (isDark) {
            card.style.background = '#333';
            card.style.color = '#fff';
            card.style.borderColor = '#555';
        } else {
            card.style.background = '#fff';
            card.style.color = '#222';
            card.style.borderColor = '#ccc';
        }
    });
    // ضبط لون عنوان "اختر مكان التوصيل"
    const locationsDiv = document.getElementById('locations-grid');
    if (locationsDiv) {
        const title = locationsDiv.querySelector('h2');
        if (title) {
            title.style.color = isDark ? '#ffd700' : '#222';
        }
    }
}

// متغير مؤقت لحفظ مكان التوصيل المختار
let selectedLocationId = null;

// دالة لجلب المستخدمين من نفس البيت
async function fetchHouseUsers() {
    const homeId = localStorage.getItem('houseId');
    if (!homeId) return [];
    const url = `https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/users?home_id=eq.${homeId}&select=*`;
    const resp = await fetch(url, {
        headers: {
            apikey: apiKey,
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        }
    });
    if (!resp.ok) return [];
    return await resp.json();
}

// دالة لعرض كروت المستخدمين بنفس طريقة اللوكيشنات
async function showUsersGrid() {
    // أخفِ كل ما يتعلق بقائمة اللوكيشنات
    const locationsDiv = document.getElementById('locations-grid');
    if (locationsDiv) locationsDiv.style.display = 'none';
    const locationsBackBtn = document.getElementById('locations-back-btn');
    if (locationsBackBtn) locationsBackBtn.style.display = 'none';
    const chooseServerBtn = document.getElementById('choose-server-btn');
    if (chooseServerBtn) chooseServerBtn.style.display = 'none';

    // إزالة شبكة المستخدمين السابقة إذا وجدت
    let usersDiv = document.getElementById('users-grid');
    if (usersDiv) {
        usersDiv.innerHTML = '';
        usersDiv.style.display = 'block';
    } else {
        usersDiv = document.createElement('div');
        usersDiv.id = 'users-grid';
        usersDiv.style = `
            margin: 40px auto;
            max-width: 600px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.10);
            padding: 32px 18px;
            text-align: center;
            display: block;
        `;
        document.body.appendChild(usersDiv);
    }

    usersDiv.innerHTML = '<h2 style="margin-bottom:24px; font-size:22px; font-weight:700;">اختر الخادم</h2>';

    // زر العودة أعلى شبكة المستخدمين
    let usersBackBtn = document.getElementById('users-back-btn');
    if (!usersBackBtn) {
        usersBackBtn = document.createElement('button');
        usersBackBtn.id = 'users-back-btn';
        usersBackBtn.textContent = 'عودة';
        usersBackBtn.style.position = 'fixed';
        usersBackBtn.style.top = '50px';
        usersBackBtn.style.right = '35px';
        usersBackBtn.style.width = '56px';
        usersBackBtn.style.height = '56px';
        usersBackBtn.style.borderRadius = '12px';
        usersBackBtn.style.border = 'none';
        usersBackBtn.style.background = '#ffd700';
        usersBackBtn.style.color = '#222';
        usersBackBtn.style.fontWeight = '700';
        usersBackBtn.style.fontSize = '18px';
        usersBackBtn.style.cursor = 'pointer';
        usersBackBtn.style.zIndex = '10006';
        usersBackBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        document.body.appendChild(usersBackBtn);
    }
    usersBackBtn.style.display = 'block';

    usersBackBtn.onclick = function() {
        // أخفِ شبكة المستخدمين وزر العودة الخاص بها
        usersDiv.style.display = 'none';
        usersBackBtn.style.display = 'none';
        // أخفِ زر ارسال الطلب
        const sendOrderBtn = document.getElementById('send-order-btn');
        if (sendOrderBtn) sendOrderBtn.style.display = 'none';
        // أظهر شبكة اللوكيشنات وزر العودة الخاص بها وزر اختيار الخادم
        const locationsDiv = document.getElementById('locations-grid');
        if (locationsDiv) locationsDiv.style.display = 'block';
        const locationsBackBtn = document.getElementById('locations-back-btn');
        if (locationsBackBtn) locationsBackBtn.style.display = 'block';
        const chooseServerBtn = document.getElementById('choose-server-btn');
        if (chooseServerBtn) chooseServerBtn.style.display = 'block';
    };

    const users = await fetchHouseUsers();
    if (!users || users.length === 0) {
        usersDiv.innerHTML += '<div style="color:#888; font-size:18px;">لا يوجد مستخدمين في هذا البيت.</div>';
        return;
    }

    // شبكة 3 في صف واحد
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '18px';
    grid.style.justifyItems = 'center';
    grid.style.alignItems = 'center';

    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.style = `
            border:1px solid #ccc;
            border-radius:12px;
            padding:18px 8px;
            background:#fff;
            box-shadow:0 2px 8px rgba(0,0,0,0.07);
            text-align:center;
            cursor:pointer;
            transition:box-shadow 0.2s;
            font-size:16px;
            font-weight:600;
        `;
        card.innerHTML = `
            <div style="margin-bottom:10px;">
                <span style="font-size:18px;">${user.name}</span>
            </div>
        `;
        // يمكنك هنا إضافة منطق اختيار المستخدم
        card.onclick = function() {
            // تمييز الكارت المختار
            grid.querySelectorAll('.user-card').forEach(c => c.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)');
            card.style.boxShadow = '0 0 0 3px #35e549ff';
            // حفظ المستخدم المختار
            selectedUserIdMaid = user.id;
            localStorage.setItem('selectedUserIdMaid', user.id); // حفظ في localStorage
        };
        grid.appendChild(card);
    });

    usersDiv.appendChild(grid);

    // زر ارسال الطلب أسفل شبكة المستخدمين
    let sendOrderBtn = document.getElementById('send-order-btn');
    if (!sendOrderBtn) {
        sendOrderBtn = document.createElement('button');
        sendOrderBtn.id = 'send-order-btn';
        sendOrderBtn.textContent = 'ارسال الطلب';
        sendOrderBtn.style.position = 'fixed';
        sendOrderBtn.style.bottom = '0px';
        sendOrderBtn.style.left = '50%';
        sendOrderBtn.style.transform = 'translateX(-50%)';
        sendOrderBtn.style.background = '#ffd700';
        sendOrderBtn.style.color = '#222';
        sendOrderBtn.style.fontWeight = '700';
        sendOrderBtn.style.fontSize = '20px';
        sendOrderBtn.style.padding = '16px 40px';
        sendOrderBtn.style.border = 'none';
        sendOrderBtn.style.borderRadius = '32px';
        sendOrderBtn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
        sendOrderBtn.style.zIndex = '10007';
        sendOrderBtn.style.cursor = 'pointer';
        document.body.appendChild(sendOrderBtn);

        sendOrderBtn.onclick = function() {
            // هنا يمكنك إضافة منطق ارسال الطلب
        sendOrderToDatabase()
            // أخفِ زر ارسال الطلب بعد الإرسال
          
            
        };
    }
    sendOrderBtn.style.display = 'block';

    // ضبط ألوان الكروت حسب النمط الحالي
    updateUsersCardsTheme();
}

// دالة لضبط ألوان كروت المستخدمين حسب النمط
function updateUsersCardsTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    document.querySelectorAll('.user-card').forEach(card => {
        if (isDark) {
            card.style.background = '#333';
            card.style.color = '#fff';
            card.style.borderColor = '#555';
        } else {
            card.style.background = '#fff';
            card.style.color = '#222';
            card.style.borderColor = '#ccc';
        }
    });
    // ضبط لون عنوان "اختر الخادم"
    const usersDiv = document.getElementById('users-grid');
    if (usersDiv) {
        const title = usersDiv.querySelector('h2');
        if (title) {
            title.style.color = isDark ? '#ffd700' : '#222';
        }
    }
}

// في دالة showLocationsGrid، عند الضغط على زر "اختر الخادم" اعرض شبكة المستخدمين
chooseServerBtn.onclick = function() {
    if (!selectedLocationId) {
        chooseServerBtn.disabled = true;
        chooseServerBtn.style.opacity = '0.6';
        return;
    }
    // أخفِ كل ما يتعلق بقائمة اللوكيشنات
    const locationsDiv = document.getElementById('locations-grid');
    if (locationsDiv) locationsDiv.style.display = 'none';
    const locationsBackBtn = document.getElementById('locations-back-btn');
    if (locationsBackBtn) locationsBackBtn.style.display = 'none';
    chooseServerBtn.style.display = 'none';
    // اعرض شبكة المستخدمين
    showUsersGrid();
};

// دالة لإرسال الطلب إلى قاعدة البيانات
async function sendOrderToDatabase() {
  // استرجاع البيانات من التخزين
  const senderId = parseInt(localStorage.getItem('selectedUserId'), 10);
  const receiverId = parseInt(localStorage.getItem('selectedUserIdMaid'), 10);
  const locationId = parseInt(localStorage.getItem('selectedLocationId'), 10);
  const homeId = parseInt(localStorage.getItem('houseId'), 10);
  const itemIds = JSON.parse(localStorage.getItem('selectedItemIds') || '[]');

  // تحقق من البيانات
  if (!senderId || !receiverId || !locationId || itemIds.length === 0 || !homeId) {
    alert('يرجى التأكد من اختيار كل الحقول المطلوبة.');
    return;
  }

  try {
    // 1. أولاً، إنشاء طلب جديد
    const { data: requestData, error: requestError } = await client
      .from('requests')
      .insert([{
        sender_id: senderId,
        receiver_id: receiverId,
        location_id: locationId,
        home_id: homeId,
        status: 'new'
      }])
      .select();

    if (requestError) throw requestError;
    
    if (!requestData || requestData.length === 0) {
      throw new Error('لم يتم إنشاء الطلب بشكل صحيح');
    }

    const requestId = requestData[0].id;
    console.log('تم إنشاء طلب جديد برقم:', requestId);

    // 2. ثانياً، إدخال العناصر وتسجيلات الصوت المرتبطة بالطلب
    for (const itemId of itemIds) {
      // الحصول على كمية العنصر من الكارت
      const quantity = cart[itemId] || 1;
      
      // التحقق من وجود تسجيل صوتي للعنصر
      let audioUrl = null;
      if (itemAudios[itemId]) {
        try {
          // تحميل الملف الصوتي إلى Supabase Storage
          const file = itemAudios[itemId];

          const sanitizeFileName = (name) => name.replace(/\s+/g, '_').replace(/[^\w.]/gi, '');
const safeFileName = sanitizeFileName(file.name);
const filePath = `audio/${Date.now()}_${itemId}_${safeFileName}`;

          const { data: uploadData, error: uploadError } = await client.storage
            .from('public-images')
            .upload(filePath, file);
            
          if (uploadError) throw uploadError;

          // الحصول على URL العام للملف الصوتي
          const { data: urlData } = client.storage
            .from('public-images')
            .getPublicUrl(filePath);
            
          audioUrl = urlData.publicUrl;
          console.log('تم رفع الملف الصوتي:', audioUrl);
        } catch (uploadErr) {
          console.error('خطأ في رفع الملف الصوتي:', uploadErr);
          // نستمر في العملية حتى لو فشل رفع الصوت
        }
      }

      // إدخال معلومات العنصر والصوت في جدول الربط
      const { error: itemError } = await client
        .from('request_item_audio')
        .insert([{
          request_id: requestId,
          item_id: itemId,
          audio_url: audioUrl,
          quantity: quantity
        }]);

      if (itemError) {
        console.error('خطأ في إدخال معلومات العنصر:', itemError);
      }
    }

    // 3. إظهار رسالة نجاح
    // 4. إعادة تعيين الكارت
    Object.keys(cart).forEach(id => delete cart[id]);
    saveCartToStorage();
    updateCartCountBadge();
    updateConfirmButtonVisibility();

    // مسح التسجيلات الصوتية
    for (const id in itemAudios) {
      delete itemAudios[id];
      delete itemAudioUrls[id];
    }
    localStorage.removeItem('itemAudios');

    // حذف بيانات الطلب من التخزين
    localStorage.removeItem('selectedItems');
    localStorage.removeItem('selectedItemIds');
    localStorage.removeItem('selectedLocationId');
    localStorage.removeItem('selectedUserIdMaid');
    // يمكنك أيضاً حذف بيانات المستخدم الحالي إذا أردت:
    // localStorage.removeItem('selectedUserId');

    // 5. إخفاء واجهات
    const usersDiv = document.getElementById('users-grid');
    if (usersDiv) usersDiv.style.display = 'none';

    const sendOrderBtn = document.getElementById('send-order-btn');
    if (sendOrderBtn) sendOrderBtn.style.display = 'none';
    
    // 6. عرض رسالة تأكيد
    showConfirmationMessage();
    
  } catch (error) {
    console.error('❌ خطأ في إرسال الطلب:', error);
    alert('فشل في إرسال الطلب: ' + (error.message || 'حدث خطأ غير معروف'));
  }
}

// دالة لعرض رسالة تأكيد بعد إرسال الطلب بنجاح
function showConfirmationMessage() {
  // إخفاء جميع الواجهات
  const elements = [
    'users-grid', 'users-back-btn', 'send-order-btn',
    'locations-grid', 'locations-back-btn', 'choose-server-btn',
    'selected-items-summary', 'cart-back-btn-top'
  ];
  
  elements.forEach(id => {
    const elem = document.getElementById(id);
        if (elem) elem.style.display = 'none';
  });
  
  // إنشاء عنصر رسالة التأكيد
  let confirmDiv = document.getElementById('order-confirmation');
  if (!confirmDiv) {
    confirmDiv = document.createElement('div');
    confirmDiv.id = 'order-confirmation';
    confirmDiv.style = `
      margin: 100px auto;
      max-width: 400px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      padding: 30px 24px;
      text-align: center;
    `;
    document.body.appendChild(confirmDiv);
  }
  
  // رمز النجاح ورسالة التأكيد
  confirmDiv.innerHTML = `
    <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
    <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">تم إرسال طلبك بنجاح!</h2>
    <p style="font-size: 18px; margin-bottom: 30px;">سيتم معالجة طلبك في أقرب وقت.</p>
    <button id="back-to-main" style="padding: 12px 30px; background: #ffd700; border: none; border-radius: 24px; font-size: 18px; font-weight: 600; cursor: pointer;">العودة للرئيسية</button>
  `;
  
  // زر العودة للصفحة الرئيسية
  document.getElementById('back-to-main').addEventListener('click', function() {
    // يمكنك تغيير هذا المسار حسب هيكل موقعك
    window.location.href = 'create-request.html';
  });
  
  // ضبط ألوان النمط
  if (document.body.classList.contains('dark-theme')) {
    confirmDiv.style.background = '#333';
    confirmDiv.style.color = '#fff';
  }
}

// تعديل حدث زر "ارسال الطلب" ليستدعي الدالة المحدثة
document.addEventListener('click', function(e) {
  if (e.target.id === 'send-order-btn') {
    console.log('Send order button clicked');
    sendOrderToDatabase();
  }
});


