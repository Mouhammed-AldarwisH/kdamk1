// ملف سير إرسال الطلب

let selectedLocationId = null;
let selectedUserIdMaid = null;

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
            const filterBtn = document.getElementById('show-filter-btn');
            if (filterBtn) filterBtn.style.display = 'none';
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

async function sendOrderToDatabase() {
    const senderId = parseInt(localStorage.getItem('selectedUserId'), 10);
    const receiverId = parseInt(localStorage.getItem('selectedUserIdMaid'), 10);
    const locationId = parseInt(localStorage.getItem('selectedLocationId'), 10);
    const homeId = parseInt(localStorage.getItem('houseId'), 10);
    const itemIds = JSON.parse(localStorage.getItem('selectedItemIds') || '[]');

    if (!senderId || !receiverId || !locationId || itemIds.length === 0 || !homeId) {
        alert('يرجى التأكد من اختيار كل الحقول المطلوبة.');
        return;
    }

    try {
        const { data: requestData, error: requestError } = await window.apiClient
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

        for (const itemId of itemIds) {
            const quantity = cart[itemId] || 1;
            let audioUrl = null;
            
            if (itemAudios[itemId]) {
                try {
                    const file = itemAudios[itemId];
                    const sanitizeFileName = (name) => name.replace(/\s+/g, '_').replace(/[^\w.]/gi, '');
                    const safeFileName = sanitizeFileName(file.name);
                    const filePath = `audio/${Date.now()}_${itemId}_${safeFileName}`;

                    const { data: uploadData, error: uploadError } = await window.apiClient.storage
                        .from('public-images')
                        .upload(filePath, file);
                        
                    if (uploadError) throw uploadError;

                    const { data: urlData } = window.apiClient.storage
                        .from('public-images')
                        .getPublicUrl(filePath);
                        
                    audioUrl = urlData.publicUrl;
                    console.log('تم رفع الملف الصوتي:', audioUrl);
                } catch (uploadErr) {
                    console.error('خطأ في رفع الملف الصوتي:', uploadErr);
                }
            }

            const { error: itemError } = await window.apiClient
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

        clearCart();
        clearAudios();
        localStorage.removeItem('selectedItems');
        localStorage.removeItem('selectedItemIds');
        localStorage.removeItem('selectedLocationId');
        localStorage.removeItem('selectedUserIdMaid');

        const usersDiv = document.getElementById('users-grid');
        if (usersDiv) usersDiv.style.display = 'none';
        const sendOrderBtn = document.getElementById('send-order-btn');
        if (sendOrderBtn) sendOrderBtn.style.display = 'none';
        
        showConfirmationMessage();
        
    } catch (error) {
        console.error('❌ خطأ في إرسال الطلب:', error);
        alert('فشل في إرسال الطلب: ' + (error.message || 'حدث خطأ غير معروف'));
    }
}

function showConfirmationMessage() {
    const elements = [
        'users-grid', 'users-back-btn', 'send-order-btn',
        'locations-grid', 'locations-back-btn', 'choose-server-btn',
        'selected-items-summary', 'cart-back-btn-top'
    ];
    
    elements.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.style.display = 'none';
    });
    
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
    
    confirmDiv.innerHTML = `
        <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">تم إرسال طلبك بنجاح!</h2>
        <p style="font-size: 18px; margin-bottom: 30px;">سيتم معالجة طلبك في أقرب وقت.</p>
        <button id="back-to-main" style="padding: 12px 30px; background: #ffd700; border: none; border-radius: 24px; font-size: 18px; font-weight: 600; cursor: pointer;">العودة للرئيسية</button>
    `;
    
    document.getElementById('back-to-main').addEventListener('click', function() {
        window.location.href = 'create-request.html';
    });
    
    if (document.body.classList.contains('dark-theme')) {
        confirmDiv.style.background = '#333';
        confirmDiv.style.color = '#fff';
    }
}

window.setupConfirmButton = setupConfirmButton;
window.updateConfirmButtonVisibility = updateConfirmButtonVisibility;
window.sendOrderToDatabase = sendOrderToDatabase;
window.showConfirmationMessage = showConfirmationMessage;
window.selectedLocationId = selectedLocationId;
window.selectedUserIdMaid = selectedUserIdMaid;
// تصدير الدوال
window.setupConfirmButton = setupConfirmButton;
window.updateConfirmButtonVisibility = updateConfirmButtonVisibility;
window.sendOrderToDatabase = sendOrderToDatabase;
window.showConfirmationMessage = showConfirmationMessage;
 