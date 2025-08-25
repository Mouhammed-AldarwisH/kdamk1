// ملف API للتعامل مع قاعدة البيانات: جلب العناصر، الأماكن، المستخدمين، وتهيئة Supabase

const apiKey = window.SUPABASE_ANON_KEY;
let client; 

function initSupabaseClient() {
    if (typeof supabase !== 'undefined') {
        client = supabase.createClient(
            'https://akvyhsmobalbqfcjupdq.supabase.co',
            apiKey
        ); 
        console.log('Supabase client initialized');
    } else {
        console.error('Supabase library not loaded');
    }
} 

async function fetchItems() {
    const homeId = localStorage.getItem('houseId');
    // جلب عناصر البيت الحالي والبيت رقم 2
    if (!homeId) return [];
    const ids = [homeId, '2'].filter((v, i, arr) => arr.indexOf(v) === i); // تفادي التكرار
    const url = `https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/items?home_id=in.(${ids.join(',')})&select=*`;
    console.log('fetch url:', url);

    const resp = await fetch(url, {
        headers: {
            apikey: apiKey,
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        }
    });
    console.log('fetch status:', resp.status);
    if (!resp.ok) return [];
    const data = await resp.json();
    console.log('items from supabase:', data);
    return data;
}

async function fetchLocations() {
    const homeId = localStorage.getItem('houseId');
    if (!homeId) return [];
    const ids = [homeId, '2'].filter((v, i, arr) => arr.indexOf(v) === i);
    const url = `https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/locations?home_id=in.(${ids.join(',')})&select=*`;

    const resp = await fetch(url, {
        headers: {
            apikey: apiKey,
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        }
    });
    
    if (!resp.ok) return [];
    return await resp.json();
}

async function fetchHouseUsers() {
    const homeId = localStorage.getItem('houseId');
    if (!homeId) return [];
    const ids = [homeId, '2'].filter((v, i, arr) => arr.indexOf(v) === i);
    const url = `https://akvyhsmobalbqfcjupdq.supabase.co/rest/v1/users?home_id=in.(${ids.join(',')})&select=*`;
    
    const resp = await fetch(url, {
        headers: {
            apikey: apiKey,
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        }
    });
    
    if (!resp.ok) return [];
    return await resp.json();
}

initSupabaseClient();

window.apiClient = client;
window.fetchItems = fetchItems;
window.fetchLocations = fetchLocations;
window.fetchHouseUsers = fetchHouseUsers;
// تصدير المتغيرات والدوال العامة
window.apiClient = client;
window.fetchItems = fetchItems;
window.fetchLocations = fetchLocations;
window.fetchHouseUsers = fetchHouseUsers;
