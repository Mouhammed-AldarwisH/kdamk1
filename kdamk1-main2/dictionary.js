const globalDictionary = {
    hello: {
        ar: "مرحبا",
        en: "Hello",
        ph: "Kumusta",
        ur: "سلام"
    }, 
    goodbye: {
        ar: "وداعا",
        en: "Goodbye",
        ph: "Paalam",
        ur: "خدا حافظ"
    },
    please: {
        ar: "من فضلك",
        en: "Please",
        ph: "Pakiusap",
        ur: "براہ مہربانی"
    },
    thank_you: {
        ar: "شكرا",
        en: "Thank you",
        ph: "Salamat",
        ur: "شکریہ"
    },
    yes: {
        ar: "نعم",
        en: "Yes",
        ph: "Oo",
        ur: "جی ہاں"
    },
    no: {
        ar: "لا",
        en: "No",
        ph: "Hindi",
        ur: "نہیں"
    },
    ok: {
        ar: "حسنا",
        en: "OK",
        ph: "Sige",
        ur: "ٹھیک ہے"
    },
    cancel: {
        ar: "إلغاء",
        en: "Cancel",
        ph: "Kanselahin",
        ur: "منسوخ کریں"
    },
    error: {
        ar: "خطأ",
        en: "Error",
        ph: "Error",
        ur: "خرابی"
    },
    success: {
        ar: "نجاح",
        en: "Success",
        ph: "Tagumpay",
        ur: "کامیابی"
    },
    loading: {
        ar: "جار التحميل",
        en: "Loading",
        ph: "Naglo-load",
        ur: "لوڈ ہو رہا ہے"
    },
    home: {
        ar: "الرئيسية",
        en: "Home",
        ph: "Bahay",
        ur: "گھر"
    },
    user: {
        ar: "مستخدم",
        en: "User",
        ph: "User",
        ur: "صارف"
    },
    password: {
        ar: "كلمة المرور",
        en: "Password",
        ph: "Password",
        ur: "پاس ورڈ"
    },
    login: {
        ar: "تسجيل الدخول",
        en: "Login",
        ph: "Mag-login",
        ur: "لاگ ان"
    },
    logout: {
        ar: "تسجيل خروج",
        en: "Logout",
        ph: "Mag-logout",
        ur: "لاگ آؤٹ"
    },
    register: {
        ar: "تسجيل",
        en: "Register",
        ph: "Magrehistro",
        ur: "رجسٹر کریں"
    },
    search: {
        ar: "بحث",
        en: "Search",
        ph: "Maghanap",
        ur: "تلاش کریں"
    },
    settings: {
        ar: "الإعدادات",
        en: "Settings",
        ph: "Mga Setting",
        ur: "سیٹنگز"
    },
    language: {
        ar: "اللغة",
        en: "Language",
        ph: "Wika",
        ur: "زبان"
    },
    theme: {
        ar: "النمط",
        en: "Theme",
        ph: "Tema",
        ur: "تھیم"
    },
    save: {
        ar: "حفظ",
        en: "Save",
        ph: "I-save",
        ur: "محفوظ کریں"
    },
    delete: {
        ar: "حذف",
        en: "Delete",
        ph: "Tanggalin",
        ur: "حذف کریں"
    },
    edit: {
        ar: "تعديل",
        en: "Edit",
        ph: "I-edit",
        ur: "ترمیم کریں"
    },
    update: {
        ar: "تحديث",
        en: "Update",
        ph: "I-update",
        ur: "اپ ڈیٹ کریں"
    },
    next: {
        ar: "التالي",
        en: "Next",
        ph: "Susunod",
        ur: "اگلا"
    },
    previous: {
        ar: "السابق",
        en: "Previous",
        ph: "Nakaraan",
        ur: "پچھلا"
    },
    send: {
        ar: "إرسال",
        en: "Send",
        ph: "Ipadala",
        ur: "بھیجیں"
    },
    receive: {
        ar: "استلام",
        en: "Receive",
        ph: "Tumanggap",
        ur: "وصول کریں"
    },
    open: {
        ar: "فتح",
        en: "Open",
        ph: "Buksan",
        ur: "کھولیں"
    },
    close: {
        ar: "إغلاق",
        en: "Close",
        ph: "Isara",
        ur: "بند کریں"
    },
    welcome: {
        ar: "أهلاً وسهلاً",
        en: "Welcome",
        ph: "Maligayang pagdating",
        ur: "خوش آمدید"
    },
    friend: {
        ar: "صديق",
        en: "Friend",
        ph: "Kaibigan",
        ur: "دوست"
    },
    family: {
        ar: "عائلة",
        en: "Family",
        ph: "Pamilya",
        ur: "خاندان"
    },
    father: {
        ar: "أب",
        en: "Father",
        ph: "Ama",
        ur: "والد"
    },
    mother: {
        ar: "أم",
        en: "Mother",
        ph: "Ina",
        ur: "والدہ"
    },
    brother: {
        ar: "أخ",
        en: "Brother",
        ph: "Kapatid na lalaki",
        ur: "بھائی"
    },
    sister: {
        ar: "أخت",
        en: "Sister",
        ph: "Kapatid na babae",
        ur: "بہن"
    },
    child: {
        ar: "طفل",
        en: "Child",
        ph: "Bata",
        ur: "بچہ"
    },
    man: {
        ar: "رجل",
        en: "Man",
        ph: "Lalaki",
        ur: "مرد"
    },
    woman: {
        ar: "امرأة",
        en: "Woman",
        ph: "Babae",
        ur: "عورت"
    },
    day: {
        ar: "يوم",
        en: "Day",
        ph: "Araw",
        ur: "دن"
    },
    night: {
        ar: "ليل",
        en: "Night",
        ph: "Gabi",
        ur: "رات"
    },
    morning: {
        ar: "صباح",
        en: "Morning",
        ph: "Umaga",
        ur: "صبح"
    },
    evening: {
        ar: "مساء",
        en: "Evening",
        ph: "Gabi",
        ur: "شام"
    },
    food: {
        ar: "طعام",
        en: "Food",
        ph: "Pagkain",
        ur: "کھانا"
    },
    water: {
        ar: "ماء",
        en: "Water",
        ph: "Tubig",
        ur: "پانی"
    },
    tea: {
        ar: "شاي",
        en: "Tea",
        ph: "Tsaa",
        ur: "چائے"
    },
    coffee: {
        ar: "قهوة",
        en: "Coffee",
        ph: "Kape",
        ur: "کافی"
    },
    bread: {
        ar: "خبز",
        en: "Bread",
        ph: "Tinapay",
        ur: "روٹی"
    },
    rice: {
        ar: "أرز",
        en: "Rice",
        ph: "Bigas",
        ur: "چاول"
    },
    meat: {
        ar: "لحم",
        en: "Meat",
        ph: "Karne",
        ur: "گوشت"
    },
    chicken: {
        ar: "دجاج",
        en: "Chicken",
        ph: "Manok",
        ur: "مرغی"
    },
    fish: {
        ar: "سمك",
        en: "Fish",
        ph: "Isda",
        ur: "مچھلی"
    },
    vegetables: {
        ar: "خضروات",
        en: "Vegetables",
        ph: "Gulay",
        ur: "سبزیاں"
    },
    fruits: {
        ar: "فواكه",
        en: "Fruits",
        ph: "Prutas",
        ur: "پھل"
    },
    car: {
        ar: "سيارة",
        en: "Car",
        ph: "Sasakyan",
        ur: "گاڑی"
    },
    bus: {
        ar: "حافلة",
        en: "Bus",
        ph: "Bus",
        ur: "بس"
    },
    train: {
        ar: "قطار",
        en: "Train",
        ph: "Tren",
        ur: "ٹرین"
    },
    airplane: {
        ar: "طائرة",
        en: "Airplane",
        ph: "Eroplano",
        ur: "جہاز"
    },
    school: {
        ar: "مدرسة",
        en: "School",
        ph: "Paaralan",
        ur: "سکول"
    },
    teacher: {
        ar: "معلم",
        en: "Teacher",
        ph: "Guro",
        ur: "استاد"
    },
    student: {
        ar: "طالب",
        en: "Student",
        ph: "Estudyante",
        ur: "طالب علم"
    },
    hospital: {
        ar: "مستشفى",
        en: "Hospital",
        ph: "Ospital",
        ur: "ہسپتال"
    },
    doctor: {
        ar: "طبيب",
        en: "Doctor",
        ph: "Doktor",
        ur: "ڈاکٹر"
    },
    nurse: {
        ar: "ممرضة",
        en: "Nurse",
        ph: "Nars",
        ur: "نرس"
    },
    police: {
        ar: "شرطة",
        en: "Police",
        ph: "Pulis",
        ur: "پولیس"
    },
    fire: {
        ar: "نار",
        en: "Fire",
        ph: "Apoy",
        ur: "آگ"
    },
    sun: {
        ar: "شمس",
        en: "Sun",
        ph: "Araw",
        ur: "سورج"
    },
    moon: {
        ar: "قمر",
        en: "Moon",
        ph: "Buwan",
        ur: "چاند"
    },
    star: {
        ar: "نجمة",
        en: "Star",
        ph: "Bituin",
        ur: "ستارہ"
    },
    earth: {
        ar: "أرض",
        en: "Earth",
        ph: "Lupa",
        ur: "زمین"
    },
    sky: {
        ar: "سماء",
        en: "Sky",
        ph: "Langit",
        ur: "آسمان"
    },
    rain: {
        ar: "مطر",
        en: "Rain",
        ph: "Ulan",
        ur: "بارش"
    },
    snow: {
        ar: "ثلج",
        en: "Snow",
        ph: "Niyebe",
        ur: "برف"
    },
    wind: {
        ar: "ريح",
        en: "Wind",
        ph: "Hangin",
        ur: "ہوا"
    },
    hot: {
        ar: "حار",
        en: "Hot",
        ph: "Mainit",
        ur: "گرم"
    },
    cold: {
        ar: "بارد",
        en: "Cold",
        ph: "Malamig",
        ur: "سرد"
    },
    happy: {
        ar: "سعيد",
        en: "Happy",
        ph: "Masaya",
        ur: "خوش"
    },
    sad: {
        ar: "حزين",
        en: "Sad",
        ph: "Malungkot",
        ur: "اداس"
    },
    love: {
        ar: "حب",
        en: "Love",
        ph: "Pag-ibig",
        ur: "محبت"
    },
    money: {
        ar: "مال",
        en: "Money",
        ph: "Pera",
        ur: "پیسہ"
    },
    time: {
        ar: "وقت",
        en: "Time",
        ph: "Oras",
        ur: "وقت"
    },
    phone: {
        ar: "هاتف",
        en: "Phone",
        ph: "Telepono",
        ur: "فون"
    },
    computer: {
        ar: "حاسوب",
        en: "Computer",
        ph: "Kompyuter",
        ur: "کمپیوٹر"
    },
    internet: {
        ar: "إنترنت",
        en: "Internet",
        ph: "Internet",
        ur: "انٹرنیٹ"
    },
    book: {
        ar: "كتاب",
        en: "Book",
        ph: "Aklat",
        ur: "کتاب"
    },
    pen: {
        ar: "قلم",
        en: "Pen",
        ph: "Panulat",
        ur: "قلم"
    },
    paper: {
        ar: "ورقة",
        en: "Paper",
        ph: "Papel",
        ur: "کاغذ"
    },
    door: {
        ar: "باب",
        en: "Door",
        ph: "Pinto",
        ur: "دروازہ"
    },
    window: {
        ar: "نافذة",
        en: "Window",
        ph: "Bintana",
        ur: "کھڑکی"
    },
    chair: {
        ar: "كرسي",
        en: "Chair",
        ph: "Upuan",
        ur: "کرسی"
    },
    table: {
        ar: "طاولة",
        en: "Table",
        ph: "Mesa",
        ur: "میز"
    },
    leftovers: {
        ar: "بقايا أكل",
        en: "Leftovers",
        ph: "Tira-tirang pagkain",
        ur: "بچاہوا کھانا"
    },
    tasks: {
        ar: "أوامر",
        en: "Tasks",
        ph: "Mga Gawain",
        ur: "ٹاسک"
    },
    household: {
        ar: "مستلزمات البيت",
        en: "Household",
        ph: "Mga Pangangailangan sa Bahay",
        ur: "گھر کی اشیاء"
    },
    "طلب-مجيء": {
        ar: "طلب مجيء",
        en: "Call Request",
        ph: "Request to Come",
        ur: "آنے کی درخواست"
    },
    "تنظيف": {
        ar: "تنظيف",
        en: "Cleaning",
        ph: "Paglilinis",
        ur: "صفائی"
    },
    "ارسلي-الناقص": {
        ar: "ارسلي الناقص",
        en: "Send Missing",
        ph: "Ipadala ang Kulang",
        ur: "کمی بھیجیں"
    },

    // إضافة كلمات برمجياً (أمثلة فقط، يمكنك توليد المزيد تلقائياً)
};

// إضافة كلمات برمجياً (أمثلة فقط، يمكنك توليد المزيد تلقائياً)
for (let i = 1; i <= 500; i++) {
    globalDictionary[`word${i}`] = {
        ar: `كلمة${i}`,
        en: `Word${i}`,
        ph: `Salita${i}`,
        ur: `لفظ${i}`
    };
}

window.globalDictionary = globalDictionary;
