// منطق صفحة تسجيل بيت جديد

// دالة لتجزئة كلمة المرور (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

$(document).ready(function() {
    $('#registerHomeForm').on('submit', async function(e) {
        e.preventDefault();
        const houseName = $('#newHouseName').val().trim();
        const housePassword = $('#newHousePassword').val();
        const userName = $('#newUserName').val().trim();
        if (!houseName || !housePassword || !userName) {
            $('#register-result-message').text('يرجى تعبئة جميع الحقول.').addClass('error');
            return;
        }
        $('#register-result-message').text('').removeClass('error success');
        // تجزئة كلمة المرور
        const passwordHash = await hashPassword(housePassword);

        // إرسال البيانات إلى Supabase
        const apiKey = window.SUPABASE_ANON_KEY;
        // 1. إضافة البيت
        const homeRes = await fetch('https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/homes', {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation' // هذا الهيدر مهم ليعود السجل الجديد
            },
            body: JSON.stringify({
                name: houseName,
                password_hash: passwordHash
            })
        });
        if (!homeRes.ok) {
            $('#register-result-message').text('فشل في تسجيل البيت.').addClass('error');
            return;
        }
        let homeData = [];
        try {
            homeData = await homeRes.json();
        } catch (err) {
            $('#register-result-message').text('لم يتم إنشاء البيت بشكل صحيح.').addClass('error');
            return;
        }
        if (!Array.isArray(homeData) || homeData.length === 0 || !homeData[0]?.id) {
            $('#register-result-message').text('لم يتم إنشاء البيت بشكل صحيح.').addClass('error');
            return;
        }
        const homeId = homeData[0].id;
        // 2. إضافة المستخدم
        const userRes = await fetch('https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/users', {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userName,
                role: 'sender_receiver',
                home_id: homeId
            })
        });
        if (!userRes.ok) {
            $('#register-result-message').text('تم إنشاء البيت لكن فشل إضافة المستخدم.').addClass('error');
            return;
        }
        $('#register-result-message').text('تم تسجيل البيت والمستخدم بنجاح!').addClass('success');
        // حفظ بيانات الدخول في localStorage
        localStorage.setItem('houseId', homeId);
        // إعادة التوجيه بعد ثواني
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1200);
    });
});
