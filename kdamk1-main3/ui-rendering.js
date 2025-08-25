// ملف رسم الواجهات: رسم صفوف العناصر وكروت الفلتر

// تجميع العناصر حسب النوع
function groupItemsByType(items) {
    const groups = {};
    items.forEach(item => {
        if (!groups[item.type]) groups[item.type] = [];
        groups[item.type].push(item);
    });
    return groups;
}

// رسم الصفوف والكروت
async function renderRows(selectedType = '') {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    // ...existing code for container styling...
    container.style.width = window.innerWidth <= 600 ? '100vw' : '100vw';
    container.style.maxWidth = window.innerWidth <= 600 ? '100vw' : '100%';
    container.style.boxSizing = 'border-box';
    container.style.padding = window.innerWidth <= 600 ? '24px 0px 0px 0px' : '40px 0px 0px 0px';
    container.style.marginTop = window.innerWidth <= 600 ? '120px' : '200px';
    container.style.overflowX = window.innerWidth <= 600 ? 'hidden' : '';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center'; 

    const items = await fetchItems();
    if (!items || items.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#888; font-size:18px; margin:40px 0;">لا توجد عناصر متاحة لهذا البيت.</div>';
        const filterBar = document.getElementById('type-filter-bar');
        if (filterBar) filterBar.style.display = 'none';
        return;
    }
    
    const grouped = groupItemsByType(items);
    renderTypeFilterButtons(Object.keys(grouped), selectedType);

    // ترتيب الأنواع: "tasks" أولاً ثم الباقي
    let typesToShow = selectedType ? [selectedType] : Object.keys(grouped);
    if (!selectedType) {
        typesToShow = ['tasks', ...typesToShow.filter(t => t !== 'tasks')];
    }

    typesToShow.forEach(type => {
        const typeTitle = document.createElement('div');
        typeTitle.className = 'item-type-title';
        typeTitle.textContent = getTypeLabel(type);
        typeTitle.style = "font-weight:700; font-size:20px; margin-bottom:8px; margin-right:8px;";
        container.appendChild(typeTitle);

        const rowDiv = document.createElement('div');
        rowDiv.className = 'items-row';
        // ...existing code for row styling...
        rowDiv.style.width = window.innerWidth <= 600 ? '100vw' : '90vw';
        rowDiv.style.maxWidth = window.innerWidth <= 600 ? '100vw' : '100%';
        rowDiv.style.overflowX = window.innerWidth <= 600 ? 'auto' : 'auto';
        rowDiv.style.display = 'flex';
        rowDiv.style.gap = window.innerWidth <= 600 ? '10px' : '18px';
        rowDiv.style.height = window.innerWidth <= 600 ? 'auto' : '300px';
        rowDiv.style.alignItems = 'center';
        rowDiv.style.marginBottom = '32px';
        rowDiv.style.boxSizing = 'border-box';
        rowDiv.style.padding = window.innerWidth <= 600 ? '0 0px' : '0 12px';

        grouped[type].forEach(item => {
            const count = cart[item.id] || 0;
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style = window.innerWidth <= 600
                ? "border:1px solid #ccc; border-radius:12px; padding:10px; width:150px; min-width:140px; max-width:150px; text-align:center; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.07); flex:0 0 auto; box-sizing:border-box; margin:0;"
                : "border:1px solid #ccc; border-radius:12px; padding:24px; width:260px; text-align:center; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,0.07); flex:0 0 auto;";

            // أسماء العناصر التي تحتاج شكل توضيحي
            const iconMap = {
                'ملعقة-كبيرة': 'fa-spoon',
                'ملعقة-صغيرة': 'fa-spoon',
                'ثلج-يكفي-كاس': 'fa-snowflake'
            };

            // ترجمة الأوامر اليدوية
            const lang = localStorage.getItem('lang') || 'ar';
            const manualCommands = {
                'طلب-مجيء': window.translations?.[lang]?.manualCommands?.come || 'طلب مجيء',
                'تنظيف': window.translations?.[lang]?.manualCommands?.clean || 'تنظيف',
                'ارسلي-الناقص': window.translations?.[lang]?.manualCommands?.sendMissing || 'ارسلي الناقص'
            };

            // تحقق من اسم العنصر إذا كان يحتاج شكل توضيحي
            let imageHtml;
            if (item.name === 'شوكه-كبيرة') {
                // شوكة طعام احترافية (SVG fork)
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <svg width="${window.innerWidth <= 600 ? 48 : 72}" height="${window.innerWidth <= 600 ? 48 : 72}" viewBox="0 0 64 64" fill="none">
                            <rect x="29" y="20" width="6" height="34" rx="3" fill="#222"/>
                            <rect x="23" y="6" width="4" height="16" rx="2" fill="#222"/>
                            <rect x="37" y="6" width="4" height="16" rx="2" fill="#222"/>
                            <rect x="30" y="6" width="4" height="16" rx="2" fill="#222"/>
                            <rect x="23" y="20" width="18" height="4" rx="2" fill="#222"/> <!-- الخط الذي يجمع السنون -->
                        </svg>
                    </div>
                `;
            }
            else if (item.name === 'شوكه-صغيرة') {
                // شوكة طعام احترافية (SVG fork)
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <svg width="${window.innerWidth <= 600 ? 48 : 72}" height="${window.innerWidth <= 600 ? 48 : 72}" viewBox="0 0 64 64" fill="none">
                            <rect x="29" y="20" width="6" height="25" rx="3" fill="#222"/>
                            <rect x="23" y="6" width="4" height="16" rx="2" fill="#222"/>
                            <rect x="37" y="6" width="4" height="16" rx="2" fill="#222"/>
                            <rect x="30" y="6" width="4" height="16" rx="2" fill="#222"/>
                            <rect x="23" y="20" width="18" height="4" rx="2" fill="#222"/> <!-- الخط الذي يجمع السنون -->
                        </svg>
                    </div>
                `;
            }
            // إضافة أشكال ملاعق
            else if (item.name === 'ملعقة-كبيرة') {
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <svg width="${window.innerWidth <= 600 ? 48 : 72}" height="${window.innerWidth <= 600 ? 48 : 72}" viewBox="0 0 64 64" fill="none">
                            <ellipse cx="32" cy="18" rx="10" ry="14" fill="#222"/>
                            <rect x="29" y="32" width="6" height="24" rx="3" fill="#222"/>
                        </svg>
                    </div>
                `;
            }
            else if (item.name === 'ملعقة-صغيرة') {
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <svg width="${window.innerWidth <= 600 ? 48 : 72}" height="${window.innerWidth <= 600 ? 48 : 72}" viewBox="0 0 64 64" fill="none">
                            <ellipse cx="32" cy="20" rx="7" ry="10" fill="#222"/>
                            <rect x="30" y="30" width="4" height="18" rx="2" fill="#222"/>
                        </svg>
                    </div>
                `;
            }
            else if (item.name === 'صحن-كبير') {
                // صحن طعام احترافية (SVG plate)
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <svg width="${window.innerWidth <= 600 ? 48 : 72}" height="${window.innerWidth <= 600 ? 48 : 72}" viewBox="0 0 64 64" fill="none">
                            <ellipse cx="32" cy="40" rx="32" ry="22" fill="#0d0d0dff" stroke="#222" stroke-width="3"/>
                            <ellipse cx="32" cy="40" rx="12" ry="6" fill="#ffd700" stroke="#222" stroke-width="2"/>
                            <ellipse cx="32" cy="40" rx="6" ry="3" fill="#030303ff" stroke="#222" stroke-width="1"/>
                        </svg>
                    </div>
                `;
            } else if ( item.name === 'صحن-صغير'){

   // صحن طعام احترافية (SVG plate)
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <svg width="${window.innerWidth <= 600 ? 48 : 72}" height="${window.innerWidth <= 600 ? 48 : 72}" viewBox="0 0 64 64" fill="none">
                            <ellipse cx="32" cy="40" rx="22" ry="12" fill="#0d0d0dff" stroke="#222" stroke-width="3"/>
                            <ellipse cx="32" cy="40" rx="12" ry="6" fill="#ffd700" stroke="#222" stroke-width="2"/>
                            <ellipse cx="32" cy="40" rx="6" ry="3" fill="#030303ff" stroke="#222" stroke-width="1"/>
                        </svg>
                    </div>
                `;
            }
            
            else if (item.name === 'طلب-مجيء') {
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <i class="fas fa-bell" style="font-size:${window.innerWidth <= 600 ? '48px' : '72px'}; color:#222;"></i>
                    </div>
                `;
            } else if (item.name === 'ارسلي-الناقص') {
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <i class="fas fa-exclamation-circle" style="font-size:${window.innerWidth <= 600 ? '48px' : '72px'}; color:#222;"></i>
                    </div>
                `;
            } else if (item.name === 'تنظيف') {
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <i class="fas fa-broom" style="font-size:${window.innerWidth <= 600 ? '48px' : '72px'}; color:#222;"></i>
                    </div>
                `;
            } else if (iconMap[item.name]) {
                imageHtml = `
                    <div style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; display:flex; align-items:center; justify-content:center; background:#ffd700; border-radius:12px;">
                        <i class="fas ${iconMap[item.name]}" style="font-size:${window.innerWidth <= 600 ? '48px' : '72px'}; color:#222;"></i>
                    </div>
                `;
            } else {
                imageHtml = `
                    <img src="${item.image}" alt="Item Image" style="width:${window.innerWidth <= 600 ? '110px' : '160px'}; height:${window.innerWidth <= 600 ? '110px' : '160px'}; object-fit:cover; border-radius:12px;">
                `;
            }

            // اسم العنصر مع الترجمة إذا كان أمر يدوي
            let displayName = manualCommands[item.name] || item.name;

            card.innerHTML = `
                <div style="height:${window.innerWidth <= 600 ? '110px' : '160px'}; margin-bottom:12px; display:flex; align-items:center; justify-content:center;">
                    ${imageHtml}
                </div>
                <div style="font-weight:600; font-size:18px; margin-bottom:16px;">${displayName}</div>
                <div id="controls-${item.id}" class="item-controls">
                    ${renderItemControls(item.id, count)}
                </div>
            `;
            rowDiv.appendChild(card);
        });

        container.appendChild(rowDiv);
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyTheme('dark');
    }
}

// رسم أزرار الفلتر
function renderTypeFilterButtons(types, selectedType = '') {
    // أضف leftovers وtasks وhousehold للأنواع إذا لم تكن موجودة
    if (!types.includes('leftovers')) {
        types.push('leftovers');
    }
    if (!types.includes('tasks')) {
        types.push('tasks');
    }
    if (!types.includes('household')) {
        types.push('household');
    }
    if (!types.includes('vegetables')) {
        types.push('vegetables');
    }
    if (!types.includes('fruits')) {
        types.push('fruits');
    }
    let filterBarWrapper = document.getElementById('type-filter-bar-wrapper');
    if (!filterBarWrapper) {
        filterBarWrapper = document.createElement('div');
        filterBarWrapper.id = 'type-filter-bar-wrapper';
        // ...existing styling code...
        filterBarWrapper.style.display = 'flex';
        filterBarWrapper.style.justifyContent = 'flex-start'; // <-- changed from center to flex-start
        filterBarWrapper.style.alignItems = 'center';
        filterBarWrapper.style.width = window.innerWidth <= 600 ? '100vw' : '100%';
        filterBarWrapper.style.maxWidth = window.innerWidth <= 600 ? '100vw' : '100%';
        filterBarWrapper.style.position = 'absolute';
        filterBarWrapper.style.top = window.innerWidth <= 600 ? '57px' : '128px';
        filterBarWrapper.style.zIndex = '1001';
        filterBarWrapper.style.boxSizing = 'border-box';
        filterBarWrapper.style.padding = window.innerWidth <= 600 ? '0 0px' : '0 24px';
        filterBarWrapper.style.margin = window.innerWidth <= 600 ? '12px 0 0 0' : '24px 0 0 0';
        filterBarWrapper.style.background = '#fff';
        filterBarWrapper.style.borderRadius = '24px';
        filterBarWrapper.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
        filterBarWrapper.style.border = '1px solid #eee';
        filterBarWrapper.style.overflowX = 'auto'; // <-- ensure horizontal scroll
        filterBarWrapper.style.overflowY = 'visible';
        filterBarWrapper.style.scrollBehavior = 'smooth';
        filterBarWrapper.style.transition = 'box-shadow 0.2s';
        
        const homeBtn = document.getElementById('home-btn');
        const itemsContainer = document.getElementById('items-container');
        if (homeBtn && homeBtn.parentNode) {
            homeBtn.parentNode.insertBefore(filterBarWrapper, itemsContainer);
        } else {
            itemsContainer.parentNode.insertBefore(filterBarWrapper, itemsContainer);
        }
    }
    filterBarWrapper.style.display = 'flex';
    filterBarWrapper.style.overflowX = 'auto'; // <-- ensure horizontal scroll

    let filterBar = document.getElementById('type-filter-bar');
    if (!filterBar) {
        filterBar = document.createElement('div');
        filterBar.id = 'type-filter-bar';
        filterBarWrapper.appendChild(filterBar);
    }
    
    // ...existing code for filter bar styling...
    filterBar.style.display = 'flex';
    filterBar.style.flexDirection = 'row';
    filterBar.style.justifyContent = 'flex-start';
    filterBar.style.alignItems = 'center';
    filterBar.style.gap = window.innerWidth <= 600 ? '1px' : '3px';
    filterBar.style.width = 'auto';
    filterBar.style.minWidth = 'fit-content';
    filterBar.style.overflowX = 'auto'; // <-- ensure horizontal scroll
    filterBar.style.overflowY = 'visible';
    filterBar.style.padding = window.innerWidth <= 600 ? '8px 8px' : '12px 18px';
    filterBar.style.boxSizing = 'border-box';

    filterBar.innerHTML = '';

    // زر "الكل" مع ترجمة
    const lang = localStorage.getItem('lang') || 'ar';
    const allLabel = window.translations?.[lang]?.allTypes || 'الكل';
    const allBtn = document.createElement('button');
    allBtn.textContent = allLabel;
    allBtn.className = 'type-filter-btn';
    allBtn.style.padding = '8px 18px';
    allBtn.style.borderRadius = '18px';
    allBtn.style.border = 'none';
    allBtn.style.background = (selectedType === '' ? '#ffd700' : '#eee');
    allBtn.style.fontWeight = '600';
    allBtn.style.cursor = 'pointer';
    allBtn.style.fontSize = '16px';
    allBtn.style.transition = 'background 0.2s';
    allBtn.style.minWidth = '80px'; // <-- make sure it's always visible
    allBtn.dataset.type = '';
    filterBar.appendChild(allBtn);

    types.forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = getTypeLabel(type);
        btn.className = 'type-filter-btn';
        btn.style.padding = window.innerWidth <= 600 ? '6px 12px' : '8px 18px';
        btn.style.borderRadius = '18px';
        btn.style.border = 'none';
        btn.style.background = (selectedType === type ? '#ffd700' : '#eee');
        btn.style.fontWeight = '600';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = window.innerWidth <= 600 ? '14px' : '16px';
        btn.style.transition = 'background 0.2s';
        btn.style.minWidth = '80px'; // <-- make sure it's always visible
        btn.dataset.type = type;
        filterBar.appendChild(btn);
    });

    filterBar.querySelectorAll('.type-filter-btn').forEach(btn => {
        btn.onclick = function() {
            renderRows(btn.dataset.type);
            filterBar.querySelectorAll('.type-filter-btn').forEach(b => {
                b.style.background = (b.dataset.type === btn.dataset.type) ? '#ffd700' : '#eee';
            });
        };
    });

    // Ensure "الكل" button is always visible by scrolling it into view horizontally in the filter bar only
    setTimeout(() => {
        // Only scroll the filter bar horizontally, not the whole page
        const filterBarWrapper = document.getElementById('type-filter-bar-wrapper');
        if (filterBarWrapper && filterBarWrapper.scrollLeft > 0) {
            allBtn.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
    }, 0);
} 

// تصدير الدوال
window.renderRows = renderRows;
window.renderTypeFilterButtons = renderTypeFilterButtons;
window.groupItemsByType = groupItemsByType;

// لا حاجة لتعديل لأن renderRows يستخدم fetchItems المعدلة بالفعل
