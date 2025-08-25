// ملف التعامل مع التسجيلات الصوتية: حفظ واسترجاع ومسح الملفات الصوتية

const itemAudios = {};
const itemAudioUrls = {};
 
// تحويل ملف إلى Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// تحويل Base64 إلى Blob
function base64ToBlob(base64, contentType = '') {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}

// حفظ التسجيلات الصوتية في localStorage
async function saveAudiosToStorage() {
    const audioData = {};
    for (const [id, file] of Object.entries(itemAudios)) {
        if (file) {
            audioData[id] = {
                name: file.name,
                data: await fileToBase64(file)
            };
        }
    }
    localStorage.setItem('itemAudios', JSON.stringify(audioData));
}

// استرجاع التسجيلات الصوتية من localStorage
function loadAudiosFromStorage() {
    const savedAudios = localStorage.getItem('itemAudios');
    if (savedAudios) {
        try {
            const parsed = JSON.parse(savedAudios);
            for (const [id, audio] of Object.entries(parsed)) {
                const blob = base64ToBlob(audio.data, 'audio/mpeg');
                itemAudios[id] = new File([blob], audio.name);
                itemAudioUrls[id] = audio.data;
            }
        } catch (e) {
            console.error('Error loading audio files:', e);
        }
    }
}
 
// مسح التسجيلات الصوتية
function clearAudios() {
    for (const id in itemAudios) {
        delete itemAudios[id];
        delete itemAudioUrls[id];
    }
    localStorage.removeItem('itemAudios');
}

// تصدير المتغيرات والدوال
window.itemAudios = itemAudios;
window.itemAudioUrls = itemAudioUrls;
window.fileToBase64 = fileToBase64;
window.saveAudiosToStorage = saveAudiosToStorage;
window.loadAudiosFromStorage = loadAudiosFromStorage;
window.clearAudios = clearAudios;
window.clearAudios = clearAudios;
