// ملف إدارة اللغة والنمط: ترجمة النصوص وتغيير النمط

const translations = {
    ar: {
        confirmOrder: "اضغط لتأكيد الطلب",
        cart: "السلة",
        chooseDeliveryLocation: "اختر مكان التوصيل",
        back: "عودة",
        uploadAudioSuccess: "تم رفع الملف الصوتي",
        uploadAudioError: "حدث خطأ في رفع الملف الصوتي",
        orderSentSuccess: "تم إرسال طلبك بنجاح!",
        orderWillBeProcessed: "سيتم معالجة طلبك في أقرب وقت.",
        backToMain: "العودة للرئيسية",
        noItems: "لا توجد عناصر متاحة لهذا البيت.",
        noLocations: "لا توجد أماكن توصيل متاحة.",
        noUsers: "لا يوجد مستخدمين في هذا البيت.",
        chooseServer: "اختر الشخص",
        sendOrder: "ارسال الطلب",
        delivered: "تم التسليم",
        cannotDo: "لا يمكنني فعله",
        orderDate: "تاريخ الطلب",
        deliveryLocation: "مكان التوصيل",
        playAudio: "تشغيل الصوت",
        stopAudio: "إيقاف",
        status_new: "جديد",
        status_in_progress: "قيد التنفيذ",
        status_done: "تم التنفيذ",
        status_rejected: "مرفوض",
        pendingRequests: "هناك طلبات لم تقبلها بعد!",
        noReceivedRequests: "لا توجد طلبات مستلمة.",
        myRequests: "طلباتك السابقة",
        receivedRequests: "الطلبات المرسلة إليك",
        logRequests: "سجل الطلبات",
        addHouseImages: "إضافة صور للبيت",
        logout: "تسجيل خروج",
        houseVerification: "التحقق من البيت",
        houseName: "اسم البيت",
        verify: "تحقق",
        theme: "النمط",
        language: "اللغة",
        enterHouseName: "الرجاء إدخال اسم البيت",
        wrongHouseName: "اسم البيت غير صحيح",
        chooseUser: "اختر أحد المستخدمين",
        fetchError: "خطأ في جلب المستخدمين",
        userFetchError: "تعذر جلب بيانات المستخدم",
        connectionError: "خطأ في الاتصال",
        hello: "أهلاً يا",
        itemTypes: {
            cups: "كاسات",
            plates: "صحون",
            spices: "بهارات",
            spoons: "ملاعق",
            forks: "شوك",
            food: "أكل",
            drink: "مشروبات",
            leftovers: "بقايا أكل",
            tasks: "أوامر",
            household: "مستلزمات البيت",
            vegetables: "خضروات",
            fruits: "فواكه"
        },
        allTypes: "الكل",
        audioNoteOptional: "سجل ملاحظة صوتية (اختياري)"
    },
    en: {
        confirmOrder: "Click to confirm order",
        cart: "Cart",
        chooseDeliveryLocation: "Choose Delivery Location",
        back: "Back",
        uploadAudioSuccess: "Audio uploaded",
        uploadAudioError: "Error uploading audio",
        orderSentSuccess: "Your request has been sent successfully!",
        orderWillBeProcessed: "Your request will be processed soon.",
        backToMain: "Back to main",
        noItems: "No items available for this house.",
        noLocations: "No delivery locations available.",
        noUsers: "No users for this house.",
        chooseServer: "Choose Person",
        sendOrder: "Send Request",
        delivered: "Delivered",
        cannotDo: "Cannot do it",
        orderDate: "Order Date",
        deliveryLocation: "Delivery Location",
        playAudio: "Play Audio",
        stopAudio: "Stop",
        status_new: "New",
        status_in_progress: "In Progress",
        status_done: "Done",
        status_rejected: "Rejected",
        pendingRequests: "There are requests you haven't accepted yet!",
        noReceivedRequests: "No received requests.",
        myRequests: "Your Previous Requests",
        receivedRequests: "Requests Sent To You",
        logRequests: "Requests Log",
        addHouseImages: "Add House Images",
        logout: "Logout",
        houseVerification: "House Verification",
        houseName: "House Name",
        verify: "Verify",
        theme: "Theme",
        language: "Language",
        enterHouseName: "Please enter house name",
        wrongHouseName: "Wrong house name",
        chooseUser: "Choose a user",
        fetchError: "Error fetching users",
        userFetchError: "Failed to fetch user data",
        connectionError: "Connection error",
        hello: "Hello",
        itemTypes: {
            cups: "Cups",
            plates: "Plates",
            spices: "Spices",
            spoons: "Spoons",
            forks: "Forks",
            food: "Food",
            drink: "Drinks",
            leftovers: "Leftovers",
            tasks: "Tasks",
            household: "Household",
            vegetables: "Vegetables",
            fruits: "Fruits"
        },
        allTypes: "All",
        audioNoteOptional: "Record an audio note (optional)"
    },
    ph: {
        confirmOrder: "I-click para kumpirmahin ang order",
        cart: "Basket",
        chooseDeliveryLocation: "Pumili ng lokasyon ng paghahatid",
        back: "Bumalik",
        uploadAudioSuccess: "Na-upload ang audio",
        uploadAudioError: "May error sa pag-upload ng audio",
        orderSentSuccess: "Matagumpay na naipadala ang iyong request!",
        orderWillBeProcessed: "Ipoprocess ang iyong request sa lalong madaling panahon.",
        backToMain: "Bumalik sa main",
        noItems: "Walang item para sa bahay na ito.",
        noLocations: "Walang lokasyon ng paghahatid.",
        noUsers: "Walang user para sa bahay na ito.",
        chooseServer: "Pumili ng tao",
        sendOrder: "Ipadala ang request",
        delivered: "Na-deliver na",
        cannotDo: "Hindi ko magawa",
        orderDate: "Petsa ng request",
        deliveryLocation: "Lokasyon ng paghahatid",
        playAudio: "I-play ang audio",
        stopAudio: "I-stop",
        status_new: "Bago",
        status_in_progress: "Ginagawa",
        status_done: "Tapos na",
        status_rejected: "Tinanggihan",
        pendingRequests: "May mga request na hindi mo pa tinatanggap!",
        noReceivedRequests: "Walang natanggap na request.",
        myRequests: "Mga Nakaraang Request Mo",
        receivedRequests: "Mga Request na Ipinadala sa Iyo",
        logRequests: "Log ng mga Request",
        addHouseImages: "Magdagdag ng mga Larawan ng Bahay",
        logout: "Mag-logout",
        houseVerification: "Beripikasyon ng Bahay",
        houseName: "Pangalan ng Bahay",
        verify: "Beripika",
        theme: "Tema",
        language: "Wika",
        enterHouseName: "Ilagay ang pangalan ng bahay",
        wrongHouseName: "Maling pangalan ng bahay",
        chooseUser: "Pumili ng user",
        fetchError: "Error sa pagkuha ng mga user",
        userFetchError: "Hindi makuha ang user data",
        connectionError: "Error sa koneksyon",
        hello: "Kumusta",
        itemTypes: {
            cups: "Basong",
            plates: "Plato",
            spices: "Pampalasa",
            spoons: "Kutsara",
            forks: "Tinidor",
            food: "Pagkain",
            drink: "Inumin",
            leftovers: "Tira-tirang pagkain",
            tasks: "Mga Gawain",
            household: "Mga Pangangailangan sa Bahay",
            vegetables: "Gulay",
            fruits: "Prutas"
        },
        allTypes: "Lahat",
        audioNoteOptional: "Mag-record ng audio note (opsyonal)"
    },
    ur: {
        confirmOrder: "آرڈر کی تصدیق کے لیے دبائیں",
        cart: "ٹوکری",
        chooseDeliveryLocation: "ڈیلیوری مقام منتخب کریں",
        back: "واپس",
        uploadAudioSuccess: "آڈیو اپلوڈ ہوگیا",
        uploadAudioError: "آڈیو اپلوڈ میں خرابی",
        orderSentSuccess: "آپ کا آرڈر کامیابی سے بھیج دیا گیا!",
        orderWillBeProcessed: "آپ کا آرڈر جلد پروسیس کیا جائے گا۔",
        backToMain: "مرکزی صفحہ پر واپس جائیں",
        noItems: "اس گھر کے لیے کوئی آئٹمز دستیاب نہیں۔",
        noLocations: "کوئی ڈیلیوری مقام دستیاب نہیں۔",
        noUsers: "اس گھر کے لیے کوئی صارف نہیں۔",
        chooseServer: "شخص منتخب کریں",
        sendOrder: "آرڈر بھیجیں",
        delivered: "ڈیلیور ہوگیا",
        cannotDo: "میں نہیں کر سکتا",
        orderDate: "آرڈر کی تاریخ",
        deliveryLocation: "ڈیلیوری مقام",
        playAudio: "آڈیو چلائیں",
        stopAudio: "روکیں",
        status_new: "نیا",
        status_in_progress: "جاری ہے",
        status_done: "مکمل",
        status_rejected: "مسترد",
        pendingRequests: "ایسے آرڈرز ہیں جنہیں آپ نے قبول نہیں کیا!",
        noReceivedRequests: "کوئی وصول شدہ آرڈر نہیں۔",
        myRequests: "آپ کے پچھلے آرڈرز",
        receivedRequests: "آپ کو بھیجے گئے آرڈرز",
        logRequests: "آرڈر لاگ",
        addHouseImages: "گھر کی تصاویر شامل کریں",
        logout: "لاگ آؤٹ",
        houseVerification: "گھر کی تصدیق",
        houseName: "گھر کا نام",
        verify: "تصدیق کریں",
        theme: "تھیم",
        language: "زبان",
        enterHouseName: "براہ کرم گھر کا نام درج کریں",
        wrongHouseName: "غلط گھر کا نام",
        chooseUser: "صارف منتخب کریں",
        fetchError: "صارفین حاصل کرنے میں خرابی",
        userFetchError: "صارف کا ڈیٹا حاصل نہیں ہوا",
        connectionError: "کنکشن میں خرابی",
        hello: "خوش آمدید",
        itemTypes: {
            cups: "کپ",
            plates: "پلیٹیں",
            spices: "مصالحہ جات",
            spoons: "چمچ",
            forks: "کانٹے",
            food: "کھانا",
            drink: "مشروبات",
            leftovers: "بچاہوا کھانا",
            tasks: "ٹاسک",
            household: "گھر کی اشیاء",
            vegetables: "سبزیاں",
            fruits: "پھل"
        },
        allTypes: "سب",
        audioNoteOptional: "آڈیو نوٹ ریکارڈ کریں (اختیاری)"
    }
};

function getTypeLabel(type) {
    const lang = localStorage.getItem('lang') || 'ar';
    return translations[lang]?.itemTypes?.[type] || type;
}

function applyLang(lang) {
    if (lang === 'en' || lang === 'ph') {
        document.documentElement.setAttribute('dir', 'ltr');
    } else {
        document.documentElement.setAttribute('dir', 'rtl');
    }  
    
    const btn = document.getElementById('confirm-order-btn');
    if (btn) {
        btn.textContent = translations[lang]?.confirmOrder || translations.ar.confirmOrder;
    }
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.querySelector('#themeButton i');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.background = '#333';
            card.style.color = '#fff';
            card.style.borderColor = '#555';
        });
        
        document.body.style.background = '#222';
        updateSelectedCardsTheme();
    } else {
        document.body.classList.remove('dark-theme');
        const icon = document.querySelector('#themeButton i');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.background = '#fff';
            card.style.color = '#000';
            card.style.borderColor = '#ccc';
        });
        
        document.body.style.background = '#f9f6e7';
        updateSelectedCardsTheme();
    }
}

function updateSelectedCardsTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    document.querySelectorAll('.selected-item-card').forEach(card => {
        if (isDark) {
            card.style.background = '#333';
            card.style.color = '#fff';
            card.style.borderColor = '#555';
        } else {
            card.style.background = '#f9f6e7';
            card.style.color = '#222';
            card.style.borderColor = '#ccc';
        }
    });
    
    const summaryDiv = document.getElementById('selected-items-summary');
    if (summaryDiv) {
        const title = summaryDiv.querySelector('h2');
        if (title) {
            title.style.color = isDark ? '#ffd700' : '#222';
        }
    }
}

window.getTypeLabel = getTypeLabel;
window.applyLang = applyLang;
window.applyTheme = applyTheme;
window.updateSelectedCardsTheme = updateSelectedCardsTheme;
window.translations = translations;
