// ملف عرض ملخص السلة: يعرض العناصر المختارة بعد التأكيد ويجهز أزرار العودة والتوصيل

// عرض العناصر المختارة بعد التأكيد
async function showSelectedItemsSummary() {
    const lang = localStorage.getItem('lang') || 'ar';
    const items = await fetchItems();
    let summaryDiv = document.getElementById('selected-items-summary');
    
    if (summaryDiv) {
        summaryDiv.style.display = 'block';
        summaryDiv.innerHTML = `<h2 style="margin-bottom:24px; font-size:22px; font-weight:700;">${window.translations?.[lang]?.cart || "السلة"}</h2>`;
    } else {
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
            display: block;
        `;
        summaryDiv.innerHTML = `<h2 style="margin-bottom:24px; font-size:22px; font-weight:700;">${window.translations?.[lang]?.cart || "السلة"}</h2>`;
        document.body.appendChild(summaryDiv);
    }
    
    const selectedIds = Object.keys(cart).map(Number);
    const selectedItems = items.filter(item => selectedIds.includes(item.id));

    if (selectedItems.length === 0) {
        summaryDiv.innerHTML += `<div style="color:#888; font-size:18px;">${window.translations?.[lang]?.noSelectedItems || "لم يتم اختيار أي عنصر."}</div>`;
        return;
    }

    const confirmBtn = document.getElementById('confirm-order-btn');
    if (confirmBtn) confirmBtn.style.display = 'none';
    const badge = document.getElementById('cart-count-badge');
    if (badge) badge.style.display = 'none';

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
                 ${window.translations?.[lang]?.audioNoteOptional || "سجل ملاحظة صوتية (اختياري)"}
                </span>
                <input type="file" id="audioUpload-${item.id}" accept="audio/*" style="margin-top:2px;">
                <audio id="audioPlayer-${item.id}" controls style="display:none; margin-top:2px; width:110px; height:28px;"></audio>
                <button id="uploadAgainBtn-${item.id}" style="display:none; margin-top:2px; font-size:10px; padding:2px 8px; border-radius:8px;">احذف وبدل</button>
            </div>
        `;
        summaryDiv.appendChild(card);

        setupAudioControls(item.id, card);
        setupQuantityControls(item.id, card);
    }

    setupBackButtons(lang);
    setupDeliveryButton(lang);
    updateSelectedCardsTheme();
}

// دالة لإعداد مستمعات الصوت لكل عنصر في السلة
function setupAudioControls(itemId, card) {
    const audioUpload = card.querySelector(`#audioUpload-${itemId}`);
    const audioPlayer = card.querySelector(`#audioPlayer-${itemId}`);
    const uploadAgainBtn = card.querySelector(`#uploadAgainBtn-${itemId}`);

    if (itemAudioUrls[itemId]) {
        audioPlayer.src = itemAudioUrls[itemId];
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
            itemAudios[itemId] = file;
            itemAudioUrls[itemId] = url;
            await saveAudiosToStorage();
        } else {
            audioPlayer.src = '';
            audioPlayer.style.display = 'none';
            audioUpload.style.display = 'block';
            uploadAgainBtn.style.display = 'none';
            delete itemAudios[itemId];
            delete itemAudioUrls[itemId];
            await saveAudiosToStorage();
        }
    });

    uploadAgainBtn.addEventListener('click', function() {
        audioPlayer.src = '';
        audioPlayer.style.display = 'none';
        audioUpload.value = '';
        audioUpload.style.display = 'inline-block';
        uploadAgainBtn.style.display = 'none';
        delete itemAudios[itemId];
        delete itemAudioUrls[itemId];
        saveAudiosToStorage();
    });
}

// دالة لإعداد مستمعات تعديل العدد لكل عنصر في السلة
function setupQuantityControls(itemId, card) {
    card.querySelector(`.summary-qty-btn.plus`).addEventListener('click', function() {
        cart[itemId] = (cart[itemId] || 0) + 1;
        card.querySelector(`#summary-count-${itemId}`).textContent = cart[itemId] + ' ×';
        saveCartToStorage();
    });
    
    card.querySelector(`.summary-qty-btn.minus`).addEventListener('click', function() {
        cart[itemId] = (cart[itemId] || 1) - 1;
        if (cart[itemId] <= 0) {
            delete cart[itemId];
            card.remove();
        } else {
            card.querySelector(`#summary-count-${itemId}`).textContent = cart[itemId] + ' ×';
        }
        saveCartToStorage();
    });
}

// دالة لإعداد زر العودة أعلى ملخص السلة
function setupBackButtons(lang) {
    let topBackBtn = document.getElementById('cart-back-btn-top');
    if (!topBackBtn) {
        topBackBtn = document.createElement('button');
        topBackBtn.id = 'cart-back-btn-top';
        topBackBtn.textContent = window.translations?.[lang]?.back || 'عودة';
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
            const summaryDiv = document.getElementById('selected-items-summary');
            if (summaryDiv) summaryDiv.style.display = 'none';
            const itemsContainer = document.getElementById('items-container');
            if (itemsContainer) itemsContainer.style.display = '';
            
            const confirmBtn = document.getElementById('confirm-order-btn');
            if (confirmBtn) confirmBtn.style.display = Object.keys(cart).length > 0 ? 'block' : 'none';
            
            const badge = document.getElementById('cart-count-badge');
            if (badge) badge.style.display = Object.keys(cart).length > 0 ? 'flex' : 'none';
            
            topBackBtn.style.display = 'none';
            
            const deliveryBtn = document.getElementById('choose-delivery-location-btn');
            if (deliveryBtn) deliveryBtn.style.display = 'none';
            
            const filterBarWrapper = document.getElementById('type-filter-bar-wrapper');
            if (filterBarWrapper) filterBarWrapper.style.display = 'flex';
            
            const homeBtn = document.getElementById('home-btn');
            if (homeBtn) homeBtn.style.display = 'block';
        };
    }
    topBackBtn.style.display = 'block';
}

// دالة لإعداد زر اختيار مكان التوصيل
function setupDeliveryButton(lang) {
    let deliveryBtn = document.getElementById('choose-delivery-location-btn');
    if (!deliveryBtn) {
        deliveryBtn = document.createElement('button');
        deliveryBtn.id = 'choose-delivery-location-btn';
        deliveryBtn.textContent = window.translations?.[lang]?.chooseDeliveryLocation || 'اختر مكان التوصيل';
        deliveryBtn.style.position = 'fixed';
        deliveryBtn.style.bottom = '30px';
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

    deliveryBtn.onclick = function() {
        const summaryDiv = document.getElementById('selected-items-summary');
        if (summaryDiv) summaryDiv.style.display = 'none';
        const topBackBtn = document.getElementById('cart-back-btn-top');
        if (topBackBtn) topBackBtn.style.display = 'none';
        deliveryBtn.style.display = 'none';
        showLocationsGrid();
    };
}

// لا حاجة لتعديل لأن showSelectedItemsSummary يستخدم fetchItems المعدلة بالفعل

window.showSelectedItemsSummary = showSelectedItemsSummary;
