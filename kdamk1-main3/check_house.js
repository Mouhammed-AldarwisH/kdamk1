// دالة لتجزئة كلمة المرور (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// دالة للتحقق من وجود بيت بالاسم وكلمة المرور في قاعدة البيانات (Supabase)
async function checkHouse(houseName, housePassword) {
    if (!houseName || typeof houseName !== 'string' || !houseName.trim()) {
        return { status: 'error', message: 'لم يتم إدخال اسم البيت' };
    }
    if (!housePassword || typeof housePassword !== 'string') {
        return { status: 'error', message: 'يرجى إدخال كلمة المرور' };
    }
    houseName = houseName.trim();
    const apiKey = window.SUPABASE_ANON_KEY;
    const url = 'https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/homes?name=eq.' + encodeURIComponent(houseName);

    try {
        const res = await fetch(url, {
            headers: {
                'apikey': apiKey,
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json'
            }
        });
        if (res.status === 200) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                const house = data[0];
                const houseId = house?.id ?? null;
                const passwordHash = await hashPassword(housePassword);
                if (house.password_hash === passwordHash) {
                    return { status: 'success', houseId, message: 'تم التحقق بنجاح!' };
                } else {
                    return { status: 'error', message: 'كلمة المرور غير صحيحة' };
                }
            } else {
                return { status: 'error', message: 'البيت غير موجود' };
            }
        } else {
            return { status: 'error', message: 'حدث خطأ في الاتصال' };
        }
    } catch (e) {
        return { status: 'error', message: 'حدث خطأ في الاتصال' };
    }
}

// اجعل الدالة متاحة في window
window.checkHouse = checkHouse;
