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

let selectedType = null;
let uploadedImageUrl = null;

// مستمع لاختيار النوع
document.querySelectorAll('.select-type-btn').forEach(btn => {
    btn.onclick = function() {
        selectedType = btn.dataset.type;
        // أظهر زر السهم للرجوع
        document.getElementById('backArrowBtn').style.display = 'inline-block';
        // أخفِ زرين الاختيار
        document.getElementById('type-select').style.display = 'none';
        // أخفِ كل شيء آخر
        document.getElementById('list-container').innerHTML = '';
        document.getElementById('name-section').style.display = 'none';
        document.getElementById('item-type-section').style.display = 'none';
        document.getElementById('card-preview').style.display = 'none';
        document.getElementById('uploadBtn').style.display = 'none';
        // تعديل: أظهر خانة رفع الصورة وامسح أي بيانات سابقة
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('imageInput').style.display = 'block';
        document.getElementById('imageInput').value = '';
        document.getElementById('changeImageBtn').style.display = 'none';
        document.getElementById('uploadMsg').textContent = '';
    };
});

// زر السهم للرجوع للاختيار الأول
document.getElementById('backArrowBtn').onclick = function() {
    // أظهر زرين الاختيار
    document.getElementById('type-select').style.display = 'block';
    // أخفِ زر السهم
    document.getElementById('backArrowBtn').style.display = 'none';
    // أخفِ باقي الحقول
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('card-preview').style.display = 'none';
    document.getElementById('changeImageBtn').style.display = 'none';
    document.getElementById('name-section').style.display = 'none';
    document.getElementById('item-type-section').style.display = 'none';
    document.getElementById('uploadBtn').style.display = 'none';
    document.getElementById('uploadMsg').textContent = '';
    document.getElementById('imageInput').value = '';
    document.getElementById('nameInput').value = '';
    if (document.getElementById('itemTypeSelect')) {
        document.getElementById('itemTypeSelect').value = '';
    }
    selectedType = null;
}

// عند اختيار صورة، اعرضها في كارد ثم أظهر الحقول التالية
document.getElementById('imageInput').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        // اعرض الصورة في كارد
        const cardDiv = document.getElementById('card-preview');
        cardDiv.innerHTML = `
            <div style="border:1px solid #ccc; border-radius:12px; padding:18px 8px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.07); text-align:center; margin-bottom:12px;">
                <img src="${ev.target.result}" alt="preview" style="width:80px; height:80px; object-fit:cover; border-radius:10px; margin-bottom:10px;">
            </div>
        `;
        cardDiv.style.display = 'block';
        // أخفِ حقل رفع الصورة وأظهر زر تغيير الصورة
        document.getElementById('imageInput').style.display = 'none';
        document.getElementById('changeImageBtn').style.display = 'inline-block';
        // أظهر حقل الاسم
        document.getElementById('name-section').style.display = 'block';
        // أخفِ زر الإرسال مؤقتًا
        document.getElementById('uploadBtn').style.display = 'none';
        // إذا كان منتج، أخفِ التايب مؤقتًا
        if (selectedType === 'item') {
            document.getElementById('item-type-section').style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
};

// زر تغيير الصورة: يرجع للخطوة الأولى (إدراج صورة)
document.getElementById('changeImageBtn').onclick = function() {
    // أخفِ الكارد وزر تغيير الصورة
    document.getElementById('card-preview').style.display = 'none';
    document.getElementById('changeImageBtn').style.display = 'none';
    // أظهر حقل رفع الصورة
    document.getElementById('imageInput').value = '';
    document.getElementById('imageInput').style.display = 'block';
    // أخفِ باقي الحقول وزر الإرسال
    document.getElementById('name-section').style.display = 'none';
    document.getElementById('item-type-section').style.display = 'none';
    document.getElementById('uploadBtn').style.display = 'none';
    document.getElementById('uploadMsg').textContent = '';
};

// عند إدخال الاسم، أظهر حقل النوع إذا كان منتج، ثم زر الإرسال
document.getElementById('nameInput').oninput = function() {
    const nameVal = this.value.trim();
    if (nameVal) {
        if (selectedType === 'item') {
            document.getElementById('item-type-section').style.display = 'block';
            document.getElementById('uploadBtn').style.display = 'none';
        } else {
            document.getElementById('item-type-section').style.display = 'none';
            document.getElementById('uploadBtn').style.display = 'block';
        }
    } else {
        document.getElementById('item-type-section').style.display = 'none';
        document.getElementById('uploadBtn').style.display = 'none';
    }
};

// عند اختيار النوع، أظهر زر الإرسال
document.getElementById('itemTypeSelect').onchange = function() {
    if (this.value) {
        document.getElementById('uploadBtn').style.display = 'block';
    } else {
        document.getElementById('uploadBtn').style.display = 'none';
    }
};

// رفع الصورة وربطها بالعنصر أو المكان
document.getElementById('uploadBtn').onclick = async function() {
    const fileInput = document.getElementById('imageInput');
    const msgDiv = document.getElementById('uploadMsg');
    const uploadBtn = document.getElementById('uploadBtn');
    const itemTypeSelect = document.getElementById('itemTypeSelect');
    msgDiv.textContent = '';
    uploadBtn.disabled = true; // تعطيل الزر أثناء الرفع
    // استخدم الاسم المدخل بدلًا من selectedId
    const nameInput = document.getElementById('nameInput');
    const enteredName = nameInput.value.trim();
    if (!selectedType || !enteredName) {
        msgDiv.textContent = 'يرجى اختيار النوع وكتابة الاسم أولاً.';
        msgDiv.className = 'error-msg';
        uploadBtn.disabled = false; // إعادة تفعيل الزر بعد الانتهاء
        return;
    }
    const file = fileInput.files[0];
    if (!file) {
        msgDiv.textContent = 'يرجى اختيار صورة.';
        msgDiv.className = 'error-msg';
        uploadBtn.disabled = false; // إعادة تفعيل الزر بعد الانتهاء
        return;
    }
    // إذا كان غرض، تحقق من اختيار النوع
    let itemTypeValue = null;
    if (selectedType === 'item') {
        itemTypeValue = document.getElementById('itemTypeSelect').value;
        if (!itemTypeValue) {
            msgDiv.textContent = 'يرجى اختيار نوع الغرض.';
            msgDiv.className = 'error-msg';
            uploadBtn.disabled = false; // إعادة تفعيل الزر بعد الانتهاء
            return;
        }
    }
    try {
        // رفع الصورة إلى Supabase Storage
        const sanitizeFileName = (name) => name.replace(/\s+/g, '_').replace(/[^\w.]/gi, '');
        const safeFileName = sanitizeFileName(file.name);
        const folder = selectedType === 'item' ? 'items' : 'locations';
        const filePath = `${folder}/${Date.now()}_${safeFileName}`;
        const { data: uploadData, error: uploadError } = await client.storage
            .from('public-images')
            .upload(filePath, file);
        if (uploadError) throw uploadError;
        // الحصول على الرابط العام
        const { data: urlData } = client.storage
            .from('public-images')
            .getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;
        // إضافة سجل جديد في الجدول المناسب
        const table = selectedType === 'item' ? 'items' : 'locations';
        let insertObj = { name: enteredName, image: publicUrl };
        if (selectedType === 'item') {
            insertObj.type = itemTypeValue;
        }
        // إضافة home_id إذا كان موجود في localStorage
        const homeId = localStorage.getItem('houseId');
        if (homeId) insertObj.home_id = homeId;
        // لا تضف id هنا أبداً!
        const { error: insertError } = await client
            .from(table)
            .insert([insertObj]);
        if (insertError) throw insertError;
        msgDiv.textContent = 'تم رفع الصورة وإضافة البيانات بنجاح!';
        msgDiv.className = 'success-msg';
        fileInput.style.display = 'none';
        nameInput.style.display = 'none';
        itemTypeSelect.style.display = 'none';
        uploadBtn.style.display = 'none';
        if (selectedType === 'item') {
            document.getElementById('itemTypeSelect').value = '';
        }
    setTimeout(() => {
        window.location.reload(); // إعادة تحميل الصفحة

        }, 1000); //  بعد 3 ثواني إعادة تحميل الصفحة
            } catch (err) {
        msgDiv.textContent = 'حدث خطأ أثناء رفع الصورة.';
        msgDiv.className = 'error-msg';
        console.error(err);
    }
    uploadBtn.disabled = false; // إعادة تفعيل الزر بعد الانتهاء
};

// يمكنك استخدام الترجمة من localStorage['lang'] إذا احتجت في الرسائل البرمجية

