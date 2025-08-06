const apiKey = window.SUPABASE_ANON_KEY;
let client;
function initSupabaseClient() {
    if (typeof supabase !== 'undefined') {
        client = supabase.createClient(
            'https://akvyhsmobalbqfcjupdq.supabase.co',
            apiKey
        );
    }
}
initSupabaseClient();

// ترجمة حالة الطلب
function getStatusLabel(status) {
    const labels = {
        new: "جديد",
        in_progress: "قيد التنفيذ",
        done: "تم التنفيذ",
        rejected: "مرفوض"
    };
    return labels[status] || status;
}

// جلب الطلبات التي يكون المستخدم الحالي هو المستلم
async function fetchReceivedRequests() {
    const receiverId = localStorage.getItem('selectedUserId');
    if (!receiverId) return [];
    // جلب الطلبات مع معلومات المرسل، اللوكيشن، والعناصر
    const { data: requests, error } = await client
        .from('requests')
        .select(`
            id, sender_id, location_id, status, created_at,
            sender:users!requests_sender_id_fkey(name),
            location:locations(name, image),
            request_items:request_item_audio(request_id, item_id, quantity, audio_url, item:items(name, image, type))
        `)
        .eq('receiver_id', receiverId)
        .eq('is_seen_by_receiver', true) // فقط الطلبات التي تمت رؤيتها
        .order('created_at', { ascending: false });

    if (error) {
        console.error('خطأ في جلب الطلبات:', error);
        return [];
    }
    return requests;
}

// تحديث حالة الطلب في قاعدة البيانات
async function updateRequestStatus(requestId, newStatus) {
    if (!requestId || !newStatus) return;
    const { error } = await client
        .from('requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', requestId);
    if (error) {
        alert('حدث خطأ أثناء تحديث حالة الطلب');
        return false;
    }
    return true;
}

// تحقق من وجود طلبات غير مرئية للمستخدم الحالي
async function hasUnseenRequests() {
    const receiverId = localStorage.getItem('selectedUserId');
    if (!receiverId) return false;
    const { count, error } = await client
        .from('requests')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', receiverId)
        .eq('is_seen_by_receiver', false);
    if (error) return false;
    return count > 0;
}

// رسم الطلبات في كروت
async function renderRequests() {
    // زر الهوم مربع وفوق يمين
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

    const container = document.getElementById('requests-list');
    container.innerHTML = '<div style="text-align:center; color:#888; font-size:18px;">جاري تحميل الطلبات...</div>';
    const requests = await fetchReceivedRequests();

    // ترتيب الطلبات: الجديد أولاً، ثم المنفذ أو المرفوض
    const activeRequests = [];
    const finishedRequests = [];
    if (requests && requests.length > 0) {
        requests.forEach(req => {
            if (req.status === 'done' || req.status === 'rejected') {
                finishedRequests.push(req);
            } else {
                activeRequests.push(req);
            }
        });
    }
    const sortedRequests = [...activeRequests, ...finishedRequests];

    // تحقق من وجود طلبات غير مرئية وأظهر الزر إذا وجدت
    let pendingBtn = document.getElementById('pending-requests-btn');
    if (!pendingBtn) {
        pendingBtn = document.createElement('button');
        pendingBtn.id = 'pending-requests-btn';
        pendingBtn.textContent = 'هناك طلبات لم تقبلها بعد!';
        pendingBtn.style = `
            position:fixed;
            left:50%;
            transform:translateX(-50%);
            bottom:24px;
            z-index:999;
            background:#1976d2;
            color:#fff;
            font-weight:700;
            border:none;
            border-radius:16px;
            padding:14px 32px;
            font-size:18px;
            box-shadow:0 2px 8px rgba(0,0,0,0.15);
            display:none;
        `;
        // عند الضغط على الزر، اجعل جميع الطلبات غير المرئية مرئية
        pendingBtn.onclick = async function() {
            const receiverId = localStorage.getItem('selectedUserId');
            if (!receiverId) return;
            await client
                .from('requests')
                .update({ is_seen_by_receiver: true })
                .eq('receiver_id', receiverId)
                .eq('is_seen_by_receiver', false);
            renderRequests();
        };
        document.body.appendChild(pendingBtn);
    }
    // تحقق من الطلبات غير المرئية وأظهر الزر إذا وجدت
    const unseen = await hasUnseenRequests();
    pendingBtn.style.display = unseen ? 'block' : 'none';

    if (!sortedRequests || sortedRequests.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#888; font-size:18px;">لا توجد طلبات مستلمة.</div>';
        return;
    }
    container.innerHTML = '';
    sortedRequests.forEach(req => {
        // عناصر الطلب
        let itemsHtml = '';
        if (req.request_items && req.request_items.length > 0) {
            itemsHtml = '<div class="request-items-list">';
            req.request_items.forEach(ri => {
                const item = ri.item;
                if (!item) return;
                // استخدم معرف فريد لكل عنصر صوتي
                const audioId = `hiddenVideo_${ri.request_id}_${ri.item_id}`;
                itemsHtml += `
                    <div class="request-item">
                        <img src="${item.image}" alt="item">
                        <div>
                            <div style="font-weight:600; display:flex; align-items:center; gap:8px;">
                                ${item.name}
                                ${
                                    ri.audio_url
                                    ? `
                                        <video controls preload="none" style="display:none;" id="${audioId}">
                                            <source src="${ri.audio_url}" type="video/quicktime" />
                                        </video>
                                        <button style="padding:2px 8px; font-size:12px; border-radius:6px; margin-right:2px;" onclick="document.getElementById('${audioId}').play()">تشغيل الصوت</button>
                                        <button style="padding:2px 8px; font-size:12px; border-radius:6px;" onclick="document.getElementById('${audioId}').pause()">إيقاف</button>
                                    `
                                    : ''
                                }
                            </div>
                            <div style="font-size:12px;">${ri.quantity} ×</div>
                        </div>
                    </div>
                `;
            });
            itemsHtml += '</div>';
        }

        // كارت الطلب
        const card = document.createElement('div');
        card.className = 'request-card';
        card.innerHTML = `
            <div class="request-header">
                <span>من: ${req.sender?.name || 'غير معروف'}</span>
            </div>
            <div class="request-status status-${req.status}">
                ${getStatusLabel(req.status)}
            </div>
            ${itemsHtml}
            <div style="margin-bottom:6px;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; justify-content:flex-end;">
                    <i class="fas fa-map-marker-alt" style="color:#e53935; font-size:22px;"></i>
                    <span style="font-size:15px; font-weight:600;">مكان التوصيل</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px; justify-content:center; margin-top:12px;">
                    <span>${req.location?.name || 'غير محدد'}</span>
                    ${req.location?.image ? `<img src="${req.location.image}" alt="location" class="request-location-img">` : ''}
                </div>
            </div>
            <div class="request-footer">
                <span>تاريخ الطلب: ${new Date(req.created_at).toLocaleString('ar-EG')}</span>
            </div>
        `;

        // إضافة زرين إذا كانت حالة الطلب ليست "done" أو "rejected"
        if (req.status !== 'done' && req.status !== 'rejected') {
            const btnsDiv = document.createElement('div');
            btnsDiv.style = "display:flex; gap:12px; margin-top:8px; justify-content:flex-end;";
            // زر تم التسليم
            const doneBtn = document.createElement('button');
            doneBtn.textContent = 'تم التسليم';
            doneBtn.style = "background:#4caf50; color:#fff; font-weight:700; border:none; border-radius:12px; padding:8px 18px; cursor:pointer;";
            doneBtn.onclick = async function() {
                doneBtn.disabled = true;
                rejectBtn.disabled = true;
                const ok = await updateRequestStatus(req.id, 'done');
                if (ok) {
                    renderRequests();
                } else {
                    doneBtn.disabled = false;
                    rejectBtn.disabled = false;
                }
            };
            btnsDiv.appendChild(doneBtn);

            // زر لا يمكنني فعله
            const rejectBtn = document.createElement('button');
            rejectBtn.textContent = 'لا يمكنني فعله';
            rejectBtn.style = "background:#e53935; color:#fff; font-weight:700; border:none; border-radius:12px; padding:8px 18px; cursor:pointer;";
            rejectBtn.onclick = async function() {
                doneBtn.disabled = true;
                rejectBtn.disabled = true;
                const ok = await updateRequestStatus(req.id, 'rejected');
                if (ok) {
                    renderRequests();
                } else {
                    doneBtn.disabled = false;
                    rejectBtn.disabled = false;
                }
            };
            btnsDiv.appendChild(rejectBtn);

            card.appendChild(btnsDiv);
        }

        container.appendChild(card);
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    renderRequests();
    // تطبيق النمط الداكن إذا كان مفعل
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // تحقق ديناميكي من الطلبات الجديدة كل 3 ثوانٍ
    let lastUnseen = null;
    setInterval(async () => {
        const unseen = await hasUnseenRequests();
        // إذا تغيرت حالة الطلبات غير المرئية من لا يوجد إلى يوجد، فقط أظهر الزر
        if (!lastUnseen && unseen) {
            lastUnseen = unseen;
            const pendingBtn = document.getElementById('pending-requests-btn');
            if (pendingBtn) pendingBtn.style.display = 'block';
        } else if (lastUnseen && !unseen) {
            lastUnseen = unseen;
            // إذا اختفت الطلبات غير المرئية، أعد تحميل الطلبات
            renderRequests();
        }
        // إذا لم تتغير الحالة، لا تفعل شيء
    }, 3000); // كل 3 ثوانٍ
});
