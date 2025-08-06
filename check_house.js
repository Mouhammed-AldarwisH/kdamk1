// دالة للتحقق من وجود بيت بالاسم في قاعدة البيانات (Supabase)
async function checkHouse(houseName) {
    if (!houseName || typeof houseName !== 'string' || !houseName.trim()) {
        return { status: 'error', message: 'لم يتم إدخال اسم البيت' };
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
                const houseId = data[0]?.id ?? null;
                return { status: 'success', houseId, message: 'البيت موجود!' };
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

// مثال استخدام:
// checkHouse('اسم البيت').then(console.log);

// اجعل الدالة متاحة في window
window.checkHouse = checkHouse;
