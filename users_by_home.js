// جلب المستخدمين بناءً على homeId من Supabase
const SUPABASE_URL = 'https://akvyhsmobalbqfcjupdq.supabase.co';
const SUPABASE_API_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrdnloc21vYmFsYnFmY2p1cGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTc4MzksImV4cCI6MjA2NzQ3MzgzOX0.aYKPcM2sPZLsVmQLOvsI454RSVlIzNMK24sv_QHHErQ';

// دالة جلب المستخدمين حسب معرف البيت
async function fetchUsersByHomeId(houseId) {
    if (!houseId) {
        return { status: 'error', message: 'لم يتم إرسال معرف البيت' };
    }
    const url = `${SUPABASE_URL}/rest/v1/users?home_id=eq.${encodeURIComponent(houseId)}`;
    try {
        const res = await fetch(url, {
            headers: {
                apikey: SUPABASE_API_KEY,
                Authorization: `Bearer ${SUPABASE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            return { status: 'error', message: 'خطأ في الاتصال' };
        }
        const data = await res.json();
        const users = Array.isArray(data)
            ? data.map(user => ({
                id: user.id,
                name: user.name
            }))
            : [];
        return { status: 'success', users };
    } catch (e) {
        return { status: 'error', message: 'خطأ في الاتصال' };
    }
}

// مثال على الاستخدام (مثلاً عند الضغط على زر أو حدث ما)
async function showUsersForHome(houseId) {
    const result = await fetchUsersByHomeId(houseId);
    console.log(result);
    // يمكنك هنا تحديث واجهة المستخدم حسب الحاجة
}

// مثال: showUsersForHome('123');
