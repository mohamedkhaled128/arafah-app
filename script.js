// تحديث العد التنازلي
function updateCountdown() {
    // الحصول على الوقت الحالي
    const now = new Date();
    
    // إنشاء وقت المغرب (6:00 PM)
    const maghrib = new Date();
    maghrib.setHours(19, 50, 0, 0);
    
    // حساب الفرق في الوقت
    let timeLeft = maghrib - now;
    
    // إذا كان الوقت الحالي بعد المغرب، نضيف 24 ساعة
    if (timeLeft < 0) {
        timeLeft = timeLeft + (24 * 60 * 60 * 1000);
    }
    
    // تحويل الوقت المتبقي إلى ساعات ودقائق وثواني
    const totalHours = Math.floor(timeLeft / (1000 * 60 * 60));
    const totalMinutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const totalSeconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // تحديث العناصر في الصفحة
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (hoursElement && minutesElement && secondsElement) {
        hoursElement.textContent = totalHours.toString().padStart(2, '0');
        minutesElement.textContent = totalMinutes.toString().padStart(2, '0');
        secondsElement.textContent = totalSeconds.toString().padStart(2, '0');
        
        // إضافة تأثيرات عند اقتراب وقت المغرب
        const countdownSection = document.querySelector('.countdown');
        if (countdownSection) {
            if (totalHours < 1) {
                countdownSection.classList.add('urgent');
            } else {
                countdownSection.classList.remove('urgent');
            }
        }
    }
}

// تشغيل العد التنازلي فوراً
updateCountdown();

// تحديث العد التنازلي كل ثانية
setInterval(updateCountdown, 1000);

// التنقل بين التبويبات
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // إزالة الفئة النشطة من جميع الأزرار
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // إضافة الفئة النشطة للزر المحدد
        button.classList.add('active');

        // إخفاء جميع المحتويات
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            // إعادة تعيين الأنيميشن
            pane.style.opacity = '0';
            pane.style.transform = 'translateY(20px)';
        });

        // إظهار المحتوى المحدد
        const tabId = button.getAttribute('data-tab');
        const targetPane = document.getElementById(tabId);
        targetPane.classList.add('active');
        
        // تفعيل الأنيميشن
        setTimeout(() => {
            targetPane.style.opacity = '1';
            targetPane.style.transform = 'translateY(0)';
        }, 50);
    });
});

// متتبع الصلاة والأذكار
const prayerCheckboxes = document.querySelectorAll('.prayer-item input[type="checkbox"], .dhikr-item input[type="checkbox"]');

// تحميل حالة الصلوات والأذكار
function loadPrayerStates() {
    prayerCheckboxes.forEach(checkbox => {
        const savedState = localStorage.getItem(checkbox.id);
        if (savedState === 'true') {
            checkbox.checked = true;
        }
    });
}

// حفظ حالة الصلوات والأذكار
function savePrayerState(checkbox) {
    localStorage.setItem(checkbox.id, checkbox.checked);
}

// إضافة مستمعي الأحداث للصناديق
prayerCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        savePrayerState(checkbox);
    });
});

// تحميل الحالات المحفوظة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadPrayerStates);

// تحديث أوقات الصلاة
function updatePrayerTimes() {
    const prayerTimes = {
        fajr: '04:21',
        dhuhr: '12:56',
        asr: '04:25',
        maghrib: '07:50',
        isha: '09:18'
    };

    Object.entries(prayerTimes).forEach(([prayer, time]) => {
        const timeElement = document.querySelector(`#${prayer} + label .prayer-time`);
        if (timeElement) {
            timeElement.textContent = time;
        }
    });
}

// تحديث أوقات الصلاة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updatePrayerTimes);

// التمرير السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// تأثيرات الظهور عند التمرير
function checkScroll() {
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.prayer-card, .fatwa-card, .video-item, .dua-card');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('visible');
        }
    });

    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < windowHeight * 0.85) {
            card.classList.add('visible');
        }
    });
}

// تفعيل تأثيرات التمرير
window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

// إدارة الأدعية
let duas = JSON.parse(localStorage.getItem('duas')) || [];

// تحميل الأدعية عند بدء التطبيق
function loadDuas() {
    const savedDuas = document.getElementById('saved-duas');
    savedDuas.innerHTML = '';
    
    // ترتيب الأدعية: المثبتة أولاً
    const sortedDuas = [...duas].sort((a, b) => b.pinned - a.pinned);
    
    sortedDuas.forEach(dua => {
        addDuaToDOM(dua);
    });
}

// حفظ الأدعية في التخزين المحلي
function saveDuas() {
    localStorage.setItem('duas', JSON.stringify(duas));
}

// إضافة دعاء جديد
function addDua(e) {
    e.preventDefault();
    
    const textarea = document.getElementById('dua-text');
    const pinCheckbox = document.getElementById('pin-dua');
    
    if (!textarea.value.trim()) return;
    
    const newDua = {
        id: Date.now(),
        text: textarea.value.trim(),
        pinned: pinCheckbox.checked,
        date: new Date().toLocaleDateString('ar-SA')
    };
    
    duas.push(newDua);
    saveDuas();
    addDuaToDOM(newDua);
    
    // إظهار إشعار
    showNotification('تم حفظ الدعاء بنجاح');
    
    // إعادة تعيين النموذج
    textarea.value = '';
    pinCheckbox.checked = false;
}

// إضافة دعاء إلى DOM
function addDuaToDOM(dua) {
    const savedDuas = document.getElementById('saved-duas');
    const duaCard = document.createElement('div');
    duaCard.className = `dua-card ${dua.pinned ? 'pinned' : ''}`;
    duaCard.dataset.id = dua.id;
    
    duaCard.innerHTML = `
        <div class="dua-text">${dua.text}</div>
        <div class="dua-actions">
            <button class="pin-btn" title="${dua.pinned ? 'إلغاء التثبيت' : 'تثبيت الدعاء'}">
                <i class="fas fa-thumbtack"></i>
            </button>
            <button class="delete-btn" title="حذف الدعاء">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    savedDuas.appendChild(duaCard);
    
    // إضافة مستمعي الأحداث
    const pinBtn = duaCard.querySelector('.pin-btn');
    const deleteBtn = duaCard.querySelector('.delete-btn');
    
    pinBtn.addEventListener('click', () => togglePin(dua.id));
    deleteBtn.addEventListener('click', () => deleteDua(dua.id));
}

// تبديل حالة التثبيت
function togglePin(id) {
    const dua = duas.find(d => d.id === id);
    if (dua) {
        dua.pinned = !dua.pinned;
        saveDuas();
        loadDuas(); // إعادة تحميل الأدعية لترتيبها
        showNotification(dua.pinned ? 'تم تثبيت الدعاء' : 'تم إلغاء تثبيت الدعاء');
    }
}

// حذف دعاء
function deleteDua(id) {
    duas = duas.filter(d => d.id !== id);
    saveDuas();
    loadDuas();
    showNotification('تم حذف الدعاء');
}

// إظهار إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // إخفاء الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// إضافة مستمعي الأحداث
document.addEventListener('DOMContentLoaded', () => {
    // تحميل الأدعية المحفوظة
    loadDuas();
    
    // إضافة مستمع لزر حفظ الدعاء
    const duaForm = document.getElementById('dua-form');
    duaForm.addEventListener('submit', addDua);

    // تسجيل زيارة الصفحة
    logPageVisit();

    const hamburgerBtn = document.querySelector('.hamburger-btn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleHamburgerMenu);
    }
});

// تسجيل زيارة الصفحة
function logPageVisit() {
    // أرسل طلب إلى نقطة النهاية /log_visit على الخادم الخاص بك
    // تأكد من تحديث الرابط إذا كان الخادم يعمل على عنوان مختلف في الإنتاج
    fetch('/log_visit')
        .then(response => {
            if (response.ok) {
                console.log('Visit logged successfully!');
            } else {
                console.error('Failed to log visit.');
            }
        })
        .catch(error => {
            console.error('Error logging visit:', error);
        });
}

// تبديل قائمة الهامبرغر في الشاشات الصغيرة
function toggleHamburgerMenu() {
    const navLinksContainer = document.querySelector('.nav-links-container');
    navLinksContainer.classList.toggle('open');
} 