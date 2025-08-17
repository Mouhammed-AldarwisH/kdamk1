// تعريف الترجمات
const translations = { 
    ar: {
        confirm: "هل أنت متأكد؟",
        yes: "نعم",
        no: "لا",
        chooseUser: "اختر أحد المستخدمين",
        newRequest: "ارسال طلب جديد",
        myRequests: "طلباتك السابقة",
        receivedRequests: "الطلبات المرسلة إليك",
        logRequests: "سجل الطلبات",
        noUsers: "لا يوجد مستخدمين لهذا البيت",
        fetchError: "خطأ في جلب المستخدمين",
        userFetchError: "تعذر جلب بيانات المستخدم",
        connectionError: "خطأ في الاتصال",
        hello: "أهلاً يا",
        logout: "تسجيل خروج",
        houseVerification: "التحقق من البيت",
        houseName: "اسم البيت",
        verify: "تحقق",
        theme: "النمط",
        language: "اللغة",
        enterHouseName: "الرجاء إدخال اسم البيت",
        wrongHouseName: "اسم البيت غير صحيح",
        addHouseImages: "إضافة صور للبيت"
    }, 
    en: { 
        confirm: "Are you sure?",
        yes: "Yes",
        no: "No",
        chooseUser: "Choose a user",
        newRequest: "Send New Request",
        myRequests: "Your Previous Requests",
        receivedRequests: "Requests Sent To You",
        logRequests: "Requests Log",
        noUsers: "No users for this house",
        fetchError: "Error fetching users",
        userFetchError: "Failed to fetch user data",
        connectionError: "Connection error",
        hello: "Hello",
        logout: "Logout",
        houseVerification: "House Verification",
        houseName: "House Name",
        verify: "Verify",
        theme: "Theme",
        language: "Language",
        enterHouseName: "Please enter house name",
        wrongHouseName: "Wrong house name",
        addHouseImages: "Add House Images"
    },
    ph: {
        confirm: "Sigurado ka ba?",
        yes: "Oo",
        no: "Hindi",
        chooseUser: "Pumili ng user",
        newRequest: "Magpadala ng Bagong Request",
        myRequests: "Mga Nakaraang Request Mo",
        receivedRequests: "Mga Request na Ipinadala sa Iyo",
        logRequests: "Log ng mga Request",
        noUsers: "Walang user para sa bahay na ito",
        fetchError: "Error sa pagkuha ng mga user",
        userFetchError: "Hindi makuha ang user data",
        connectionError: "Error sa koneksyon",
        hello: "Kumusta",
        logout: "Mag-logout",
        houseVerification: "Beripikasyon ng Bahay",
        houseName: "Pangalan ng Bahay",
        verify: "Beripika",
        theme: "Tema",
        language: "Wika",
        enterHouseName: "Ilagay ang pangalan ng bahay",
        wrongHouseName: "Maling pangalan ng bahay",
        addHouseImages: "Magdagdag ng mga Larawan ng Bahay"
    },
    ur: {
        confirm: "کیا آپ کو یقین ہے؟",
        yes: "جی ہاں",
        no: "نہیں",
        chooseUser: "صارف منتخب کریں",
        newRequest: "نیا آرڈر بھیجیں",
        myRequests: "آپ کے پچھلے آرڈرز",
        receivedRequests: "آپ کو بھیجے گئے آرڈرز",
        logRequests: "آرڈر لاگ",
        noUsers: "اس گھر کے لیے کوئی صارف نہیں۔",
        fetchError: "صارفین حاصل کرنے میں خرابی",
        userFetchError: "صارف کا ڈیٹا حاصل نہیں ہوا",
        connectionError: "کنکشن میں خرابی",
        hello: "خوش آمدید",
        logout: "لاگ آؤٹ",
        houseVerification: "گھر کی تصدیق",
        houseName: "گھر کا نام",
        verify: "تصدیق کریں",
        theme: "تھیم",
        language: "زبان",
        enterHouseName: "براہ کرم گھر کا نام درج کریں",
        wrongHouseName: "غلط گھر کا نام",
        addHouseImages: "گھر کی تصاویر شامل کریں"
    }
};

$(document).ready(function() {
    // استرجاع اللغة المحفوظة من localStorage أو الافتراضية
    let currentLang = localStorage.getItem('lang') || 'ar';
    $('#currentLang').val(currentLang);

    // تطبيق اللغة مباشرة بعد تحميل الصفحة
    function applyLang(lang) {
        if (lang === 'en') {
            $('html').attr('dir', 'ltr');
            $('h2').text(translations.en.houseVerification || 'House Verification');
            $('label').text(translations.en.houseName || 'House Name');
            $('button[type="submit"]').text(translations.en.verify || 'Verify');
            $('#themeButton').attr('title', translations.en.theme || 'Theme');
            $('#langButton').attr('title', translations.en.language || 'Language');
            $('.overlay-content h3').text(translations.en.chooseUser);
        } else if (lang === 'ph') {
            $('html').attr('dir', 'ltr');
            $('h2').text(translations.ph.houseVerification || 'Beripikasyon ng Bahay');
            $('label').text(translations.ph.houseName || 'Pangalan ng Bahay');
            $('button[type="submit"]').text(translations.ph.verify || 'Beripika');
            $('#themeButton').attr('title', translations.ph.theme || 'Tema');
            $('#langButton').attr('title', translations.ph.language || 'Wika');
            $('.overlay-content h3').text(translations.ph.chooseUser);
        } else if (lang === 'ur') {
            $('html').attr('dir', 'ltr');
            $('h2').text(translations.ur.houseVerification || 'گھر کی تصدیق');
            $('label').text(translations.ur.houseName || 'گھر کا نام');
            $('button[type="submit"]').text(translations.ur.verify || 'تصدیق کریں');
            $('#themeButton').attr('title', translations.ur.theme || 'تھیم');
            $('#langButton').attr('title', translations.ur.language || 'زبان');
            $('.overlay-content h3').text(translations.ur.chooseUser);
        } else {
            $('html').attr('dir', 'rtl');
            $('h2').text(translations.ar.houseVerification || 'التحقق من البيت');
            $('label').text(translations.ar.houseName || 'اسم البيت');
            $('button[type="submit"]').text(translations.ar.verify || 'تحقق');
            $('#themeButton').attr('title', translations.ar.theme || 'النمط');
            $('#langButton').attr('title', translations.ar.language || 'اللغة');
            $('.overlay-content h3').text(translations.ar.chooseUser);
        }
    }
    applyLang(currentLang);

    // النمط المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark-theme');
        $('#themeButton i').removeClass('fa-moon').addClass('fa-sun');
    }

    $('#themeButton').click(function() {
        const isDark = $('body').hasClass('dark-theme');
        if (isDark) {
            $('body').removeClass('dark-theme');
            $('#themeButton i').removeClass('fa-sun').addClass('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            $('body').addClass('dark-theme');
            $('#themeButton i').removeClass('fa-moon').addClass('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    $('.lang-option').click(function() {
        const selectedLang = $(this).data('lang');
        $('#currentLang').val(selectedLang);
        currentLang = selectedLang;
        localStorage.setItem('lang', selectedLang);
        $('#lang-dropdown').hide();
        applyLang(selectedLang);
    });

    $('#langButton').click(function(e) {
        e.stopPropagation();
        $('#lang-dropdown').toggle();
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('#lang-dropdown, #langButton').length) {
            $('#lang-dropdown').hide();
        }
    });

    // تحقق إذا كان المستخدم مسجل دخول (houseId موجود)
    const savedHouseId = localStorage.getItem('houseId');
    const savedUserId = localStorage.getItem('selectedUserId');
    if (savedHouseId && savedHouseId !== "none") {
        $('.login-container').hide();
        $('#overlay').show();
        if (savedUserId && savedUserId !== "none") {
            $('.options-grid').hide();
            $('.overlay-content h3').hide();
            showUserActions(savedUserId);
        } else {
            $('.options-grid').show();
            $('.overlay-content h3').show();
            fetchUsersByHome(savedHouseId);
        }
    }

    function fetchUsersByHome(houseId) {
        // تأكد من أن قائمة المستخدمين ظاهرة قبل جلب البيانات
        $('.options-grid').show();
        $('.overlay-content h3').show();

        // استدعاء الدالة من ملف users_by_home.js
        fetchUsersByHomeId(houseId).then(function(response) {
            if (response.status === 'success' && Array.isArray(response.users)) {
                var grid = $('.options-grid');
                grid.empty();
                response.users.forEach(function(user) {
                    grid.append('<div class="option-box" data-userid="' + user.id + '">' + user.name + '</div>');
                });
                // إضافة مستمع للنقر على اسم المستخدم
                $('.option-box').click(function() {
                    var userId = $(this).data('userid');
                    localStorage.setItem('selectedUserId', userId);
                    // إزالة أي تأكيد سابق
                    $('.confirm-user').remove();
                    // إضافة خانة التأكيد أسفل قائمة المستخدمين مع ترجمة النصوص
                    grid.after(`
                        <div class="confirm-user" style="margin-top:20px;">
                            <div style="margin-bottom:12px;font-size:16px;">${translations[currentLang].confirm}</div>
                            <button id="confirmYes" style="background:#28a745;color:#fff;padding:10px 24px;border:none;border-radius:8px;margin-right:10px;font-size:15px;cursor:pointer;">${translations[currentLang].yes}</button>
                            <button id="confirmNo" style="background:#dc3545;color:#fff;padding:10px 24px;border:none;border-radius:8px;font-size:15px;cursor:pointer;">${translations[currentLang].no}</button>
                        </div>
                    `);
                    // زر نعم: يبقي الـ id محفوظ فقط
                    $('#confirmYes').click(function() {
                        $('.confirm-user').remove();
                        var userId = localStorage.getItem('selectedUserId');
                        showUserActions(userId); // عرض الأزرار حسب الدور
                        // يمكنك هنا إضافة أي إجراء إضافي بعد التأكيد
                    });
                    // زر لا: يحذف الـ id ويخفي التأكيد
                    $('#confirmNo').click(function() {
                        localStorage.removeItem('selectedUserId');
                        $('.confirm-user').remove();
                    });
                });
            } else {
                $('.options-grid').html('<div>' + translations[currentLang].noUsers + '</div>');
                $('.confirm-user').remove();
            }
        }).catch(function() {
            $('.options-grid').html('<div>' + translations[currentLang].fetchError + '</div>');
            $('.confirm-user').remove();
        });
    }

    function showUserActions(userId) {
        // جلب بيانات المستخدم من قاعدة البيانات
        getUser(userId).then(function(response) {
            if (response.status === 'success' && response.user) {
                var role = response.user.role;
                var userName = response.user.name;
                var t = translations[currentLang];
                // استخدام الترجمة لكلمة "أهلاً يا" وزر تسجيل خروج
                var actionsHtml = `
                    <div style="font-size:22px;font-weight:600;margin-bottom:18px;">${t.hello} ${userName}</div>
                    <div class="user-actions" style="margin-top:0;display:flex;flex-direction:column;gap:18px;">
                `;
                if (role === 'sender_receiver') {
                    actionsHtml += `
                        <button class="action-btn" id="newRequestBtn">
                            <i class="fas fa-plus-circle" style="margin-left:8px;color:#28a745;"></i>
                            <span>${t.newRequest}</span>
                        </button>
                        <button class="action-btn" id="myRequestsBtn">
                            <i class="fas fa-history" style="margin-left:8px;color:#007bff;"></i>
                            <span>${t.myRequests}</span>
                        </button>
                        <button class="action-btn" id="receivedRequestsBtn">
                            <i class="fas fa-inbox" style="margin-left:8px;color:#ffc107;"></i>
                            <span>${t.receivedRequests}</span>
                        </button>
                        <button class="action-btn" id="addHouseImagesBtn">
                            <i class="fas fa-image" style="margin-left:8px;color:#17a2b8;"></i>
                            <span>${t.addHouseImages}</span>
                        </button>
                    `;
                }  else if (role === 'receiver_only') {
                    actionsHtml += `
                        <button class="action-btn" id="newRequestBtn">
                            <i class="fas fa-plus-circle" style="margin-left:8px;color:#28a745;"></i>
                            <span>${t.newRequest}</span>
                        </button>
                        <button class="action-btn" id="receivedRequestsBtn">
                            <i class="fas fa-inbox" style="margin-left:8px;color:#ffc107;"></i>
                            <span>${t.receivedRequests}</span>
                        </button>
                        <button class="action-btn" id="logRequestsBtn">
                            <i class="fas fa-book" style="margin-left:8px;color:#6c757d;"></i>
                            <span>${t.logRequests}</span>
                        </button>
                        <button class="action-btn" id="addHouseImagesBtn">
                            <i class="fas fa-image" style="margin-left:8px;color:#17a2b8;"></i>
                            <span>${t.addHouseImages}</span>
                        </button>
                    `;
                }
                // زر تسجيل خروج في جميع الحالات
                actionsHtml += `
                    <button class="action-btn" id="logoutBtn" style="background:#dc3545;color:#fff;">
                        <i class="fas fa-sign-out-alt" style="margin-left:8px;color:#fff;"></i>
                        <span>${t.logout}</span>
                    </button>
                `;
                actionsHtml += '</div>';
                $('.overlay-content').html(actionsHtml);

                // مستمع زر تسجيل خروج
                $('#logoutBtn').click(function() {
                    localStorage.removeItem('houseId');
                    localStorage.removeItem('selectedUserId');
                    location.reload();
                });

                // مستمع زر ارسال طلب جديد
                $('#newRequestBtn').click(function() {
                    window.location.href = "create-request.html";
                });

                // مستمع زر الطلبات المرسلة إليك
                $('#receivedRequestsBtn').click(function() {
                    window.location.href = "my-requests.html";
                });

                // مستمع زر إضافة صور للبيت
                $('#addHouseImagesBtn').click(function() {
                    window.location.href = "upload-image.html";
                });

            } else {
                $('.overlay-content').html('<div style="color:red;">' + translations[currentLang].userFetchError + '</div>');
            }
        }).catch(function() {
            $('.overlay-content').html('<div style="color:red;">' + translations[currentLang].connectionError + '</div>');
        });
    }

    async function handleCheckHouseForm(event) {
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }

        // حماية honeypot: إذا تم ملء الحقل المخفي، لا ترسل الطلب
        if ($('#website').val().trim() !== '') {
            $('#result-message').text('تم رفض الطلب.').removeClass('success').addClass('error');
            return;
        }

        const houseName = $('#houseName').val().trim(); 
        if (houseName === '') {
            $('#result-message').text(translations[currentLang].enterHouseName || 'الرجاء إدخال اسم البيت').addClass('error');
            return;
        }
        // استدعاء checkHouse من check_house.js
        const response = await window.checkHouse(houseName);
        if (response.status === 'success') {
            $('#result-message').text(response.message).removeClass('error').addClass('success');
            localStorage.setItem('houseId', response.houseId);
            location.reload();
        } else {

            $('#result-message').text(response.message).removeClass('success').addClass('error');
        }
    }

    // اربط الفورم بدالة handleCheckHouseForm لمنع إعادة تحميل الصفحة
    $('#loginForm').on('submit', handleCheckHouseForm);

}); // <-- نهاية $(document).ready
