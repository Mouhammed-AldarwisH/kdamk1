// جلب بيانات مستخدم من Supabase باستخدام جافاسكريبت للمتصفح

(function() {
    const SUPABASE_URL = 'https://akvyhsmobalbqfcjupdq.supabase.co';
    const SUPABASE_API_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrdnloc21vYmFsYnFmY2p1cGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4OTc4MzksImV4cCI6MjA2NzQ3MzgzOX0.aYKPcM2sPZLsVmQLOvsI454RSVlIzNMK24sv_QHHErQ';
  
    // userId يمكن أن يؤخذ من localStorage أو من متغير
    async function getUser(userId) {
        if (!userId) {
            return { status: 'error', message: 'لم يتم إرسال معرف المستخدم' };
        } 
        const url = `${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(userId)}`;
        try {
            const res = await fetch(url, {
                headers: {
                    'apikey': SUPABASE_API_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            if (res.status === 200) {
                const data = await res.json();
                if (data && data.length > 0) {
                    const user = {
                        id: data[0].id,
                        name: data[0].name,
                        role: data[0].role
                    };
                    return { status: 'success', user };
                } else {
                    return { status: 'error', message: 'المستخدم غير موجود' };
                }
            } else {
                return { status: 'error', message: 'خطأ في الاتصال' };
            }
        } catch (e) {
            return { status: 'error', message: 'خطأ في الاتصال' };
        }
    } 

    // اجعل الدالة متاحة في window
    window.getUser = getUser;
})();
    
