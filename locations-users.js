// ملف عرض اللوكيشنات والمستخدمين: يعرض شبكة أماكن التوصيل وشبكة المستخدمين ويجهز أزرار العودة

let selectedLocationId = null;
let selectedUserIdMaid = null;

// دالة رئيسية لعرض شبكة اللوكيشنات
async function showLocationsGrid() {
    const summaryDiv = document.getElementById('selected-items-summary');
    if (summaryDiv) summaryDiv.style.display = 'none';
    const topBackBtn = document.getElementById('cart-back-btn-top');
    if (topBackBtn) topBackBtn.style.display = 'none';
    const deliveryBtn = document.getElementById('choose-delivery-location-btn');
    if (deliveryBtn) deliveryBtn.style.display = 'none';

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

    const lang = localStorage.getItem('lang') || 'ar';
    locationsDiv.innerHTML = `<h2 style="margin-bottom:24px; font-size:22px; font-weight:700;">${window.translations?.[lang]?.chooseDeliveryLocation || "اختر مكان التوصيل"}</h2>`;

    const locations = await fetchLocations();
    if (!locations || locations.length === 0) {
        locationsDiv.innerHTML += `<div style="color:#888; font-size:18px;">${window.translations?.[lang]?.noLocations || "لا توجد أماكن توصيل متاحة."}</div>`;
        return;
    }

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
        card.onclick = function() {
            selectedLocationId = location.id;
            localStorage.setItem('selectedLocationId', location.id);
            grid.querySelectorAll('.location-card').forEach(c => c.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)');
            card.style.boxShadow = '0 0 0 3px #35e549ff';
            setTimeout(() => {
                showUsersGrid();
            }, 200);
        };
        grid.appendChild(card);
    });

    locationsDiv.appendChild(grid);
    setupLocationBackButton();
    updateLocationsCardsTheme();
}

// دالة رئيسية لعرض شبكة المستخدمين
async function showUsersGrid() {
    const locationsDiv = document.getElementById('locations-grid');
    if (locationsDiv) locationsDiv.style.display = 'none';
    const locationsBackBtn = document.getElementById('locations-back-btn');
    if (locationsBackBtn) locationsBackBtn.style.display = 'none';

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

    const lang = localStorage.getItem('lang') || 'ar';
    usersDiv.innerHTML = `<h2 style="margin-bottom:24px; font-size:22px; font-weight:700;">${window.translations?.[lang]?.chooseServer || "اختر الشخص"}</h2>`;

    const users = await fetchHouseUsers();
    if (!users || users.length === 0) {
        usersDiv.innerHTML += `<div style="color:#888; font-size:18px;">${window.translations?.[lang]?.noUsers || "لا يوجد مستخدمين في هذا البيت."}</div>`;
        return;
    }

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
        card.onclick = function() {
            grid.querySelectorAll('.user-card').forEach(c => c.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)');
            card.style.boxShadow = '0 0 0 3px #35e549ff';
            selectedUserIdMaid = user.id;
            localStorage.setItem('selectedUserIdMaid', user.id);
        };
        grid.appendChild(card);
    }); 

    usersDiv.appendChild(grid);
    setupUserBackButton();
    setupSendOrderButton();
    updateUsersCardsTheme();
}

// لا حاجة لتعديل لأن الدوال تستخدم window.fetchLocations و window.fetchHouseUsers المعدلة بالفعل

// دوال مساعدة لإعداد أزرار العودة وزر إرسال الطلب
function setupLocationBackButton() {
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

    const lang = localStorage.getItem('lang') || 'ar';
    locationsBackBtn.textContent = window.translations?.[lang]?.back || 'عودة';

    locationsBackBtn.onclick = function() {
        const locationsDiv = document.getElementById('locations-grid');
        if (locationsDiv) locationsDiv.style.display = 'none';
        locationsBackBtn.style.display = 'none';
        const summaryDiv = document.getElementById('selected-items-summary');
        if (summaryDiv) summaryDiv.style.display = 'block';
        const topBackBtn = document.getElementById('cart-back-btn-top');
        if (topBackBtn) topBackBtn.style.display = 'block';
        const deliveryBtn = document.getElementById('choose-delivery-location-btn');
        if (deliveryBtn) deliveryBtn.style.display = 'block';
    };
}

function setupUserBackButton() {
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

    const lang = localStorage.getItem('lang') || 'ar';
    usersBackBtn.textContent = window.translations?.[lang]?.back || 'عودة';

    usersBackBtn.onclick = function() {
        const usersDiv = document.getElementById('users-grid');
        if (usersDiv) usersDiv.style.display = 'none';
        usersBackBtn.style.display = 'none';
        const sendOrderBtn = document.getElementById('send-order-btn');
        if (sendOrderBtn) sendOrderBtn.style.display = 'none';
        const locationsDiv = document.getElementById('locations-grid');
        if (locationsDiv) locationsDiv.style.display = 'block';
        const locationsBackBtn = document.getElementById('locations-back-btn');
        if (locationsBackBtn) locationsBackBtn.style.display = 'block';
    };
}

function setupSendOrderButton() {
    let sendOrderBtn = document.getElementById('send-order-btn');
    if (!sendOrderBtn) {
        sendOrderBtn = document.createElement('button');
        sendOrderBtn.id = 'send-order-btn';
        sendOrderBtn.textContent = 'ارسال الطلب';
        sendOrderBtn.style.position = 'fixed';
        sendOrderBtn.style.bottom = '30px';
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

        const lang = localStorage.getItem('lang') || 'ar';
        sendOrderBtn.textContent = window.translations?.[lang]?.sendOrder || 'ارسال الطلب';

        sendOrderBtn.onclick = function() {
            sendOrderToDatabase();
        }; 
    }
    sendOrderBtn.style.display = 'block';
}

// دوال لضبط ألوان الكروت حسب النمط
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
}

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
}

window.showLocationsGrid = showLocationsGrid;
window.showUsersGrid = showUsersGrid;
window.selectedLocationId = selectedLocationId;
window.selectedUserIdMaid = selectedUserIdMaid;
