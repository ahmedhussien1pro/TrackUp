import State from '../../state.js';
import { StorageService } from '../../services/storage.service.js';

const TYPE_META = {
  roadmap: { color: '#6366f1', bg: '#6366f114', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="8 7 3 12 8 17"/><line x1="21" y1="6" x2="21" y2="18"/></svg>` },
  mentor:  { color: '#ec4899', bg: '#ec489914', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>` },
  result:  { color: '#10b981', bg: '#10b98114', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>` },
  course:  { color: '#f59e0b', bg: '#f59e0b14', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>` },
  system:  { color: '#64748b', bg: '#64748b14', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>` },
};

const DEFAULT_NOTIFS = [
  { id: 'n1', type: 'roadmap', textKey: 'notif.roadmap', group: 'today',     read: false },
  { id: 'n2', type: 'mentor',  textKey: 'notif.mentor',  group: 'today',     read: false },
  { id: 'n3', type: 'result',  textKey: 'notif.results', group: 'yesterday', read: true  },
  { id: 'n4', type: 'course',  textKey: 'notif.course',  group: 'earlier',   read: true  },
];

const NOTIF_TEXTS = {
  en: {
    'notif.roadmap': 'Your roadmap step "HTML Foundations" is ready to start.',
    'notif.mentor':  'New mentor Karim Saad is available for Frontend sessions.',
    'notif.results': 'You completed your career assessment. Check your results.',
    'notif.course':  'Course "JavaScript Zero to Hero" has been updated.',
  },
  ar: {
    'notif.roadmap': 'خطوة "أساسيات HTML" في مسارك جاهزة للبدء.',
    'notif.mentor':  'المرشد الجديد كريم سعد متاح لجلسات الواجهة الأمامية.',
    'notif.results': 'أكملت تقييم مسارك المهني. تحقق من نتائجك.',
    'notif.course':  'تم تحديث دورة "جافاسكريبت من الصفر إلى الاحتراف".',
  },
};

const GROUP_LABELS = {
  en: { today: 'Today', yesterday: 'Yesterday', earlier: 'Earlier' },
  ar: { today: 'اليوم', yesterday: 'أمس', earlier: 'سابقاً' },
};

function _isAr() {
  return document.documentElement.getAttribute('lang') === 'ar';
}

function _getText(key) {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  return NOTIF_TEXTS[lang]?.[key] ?? NOTIF_TEXTS.en[key] ?? key;
}

function _getNotifs() {
  if (!State.getState('notifications')) {
    const saved = StorageService.get('notifications') || DEFAULT_NOTIFS;
    State.setState('notifications', saved);
  }
  return State.getState('notifications');
}

function _save(notifs) {
  State.setState('notifications', notifs);
  StorageService.set('notifications', notifs);
  const unread = notifs.filter(n => !n.read).length;

  // Update topbar badge
  const topbarBtn = document.getElementById('topbar-notif-btn');
  if (topbarBtn) {
    let badge = topbarBtn.querySelector('.topbar__badge');
    if (unread === 0) { badge?.remove(); }
    else {
      if (!badge) { badge = document.createElement('span'); badge.className = 'topbar__badge'; badge.setAttribute('aria-hidden','true'); topbarBtn.appendChild(badge); }
      badge.textContent = unread;
    }
  }
  // Update sidebar badge
  const sidebarLink = document.querySelector('.sidebar__link[data-path="/notifications"] .sidebar__badge');
  if (sidebarLink) {
    if (unread === 0) sidebarLink.remove();
    else sidebarLink.textContent = unread;
  }
}

function _renderItem(n, isAr) {
  const meta = TYPE_META[n.type] || TYPE_META.system;
  return `
    <div class="notif-item${n.read ? '' : ' notif-item--unread'}" data-id="${n.id}">
      <div class="notif-item__icon" style="color:${meta.color};background:${meta.bg}">${meta.icon}</div>
      <div class="notif-item__body">
        <p class="notif-item__text">${_getText(n.textKey)}</p>
        <span class="notif-item__group">${GROUP_LABELS[isAr ? 'ar' : 'en'][n.group] || n.group}</span>
      </div>
      <div class="notif-item__actions">
        ${!n.read ? `
          <button class="notif-read-btn" data-id="${n.id}" aria-label="${isAr ? 'تم القراءة' : 'Mark read'}" title="${isAr ? 'تم القراءة' : 'Mark read'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </button>` : `
          <span class="notif-item__read-dot" aria-hidden="true"></span>`
        }
        <button class="notif-delete-btn" data-id="${n.id}" aria-label="${isAr ? 'حذف' : 'Delete'}" title="${isAr ? 'حذف' : 'Delete'}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>`;
}

function _render(filter = 'all') {
  const isAr  = _isAr();
  const notifs = _getNotifs();
  const unread = notifs.filter(n => !n.read).length;
  const list   = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;
  const groups = ['today', 'yesterday', 'earlier'];
  const byGroup = groups
    .map(g => ({ g, items: list.filter(n => n.group === g) }))
    .filter(({ items }) => items.length > 0);

  return `
    <div class="notifications-screen fade-in">

      <div class="notif-header">
        <div>
          <h1 class="notif-header__title">${isAr ? 'الإشعارات' : 'Notifications'}</h1>
          <p class="notif-header__sub">${unread > 0
            ? (isAr ? `لديك ${unread} غير مقروءة` : `${unread} unread`)
            : (isAr ? 'كل شيء تم قراءته' : 'All caught up')
          }</p>
        </div>
        <div class="notif-header__actions">
          <div class="notif-filter" role="tablist">
            <button role="tab" class="notif-filter__btn${filter === 'all' ? ' notif-filter__btn--active' : ''}" data-filter="all">
              ${isAr ? 'الكل' : 'All'} <span class="notif-filter__total">${notifs.length}</span>
            </button>
            <button role="tab" class="notif-filter__btn${filter === 'unread' ? ' notif-filter__btn--active' : ''}" data-filter="unread">
              ${isAr ? 'غير مقروءة' : 'Unread'}
              ${unread > 0 ? `<span class="notif-filter__count">${unread}</span>` : ''}
            </button>
          </div>
          ${unread > 0
            ? `<button class="btn btn--ghost btn--sm" id="notif-mark-all">${isAr ? 'قراءة الكل' : 'Mark all read'}</button>`
            : ''}
        </div>
      </div>

      <div class="notif-list">
        ${list.length === 0
          ? `<div class="empty-state"><p>${isAr ? 'لا توجد إشعارات' : 'No notifications'}</p></div>`
          : byGroup.map(({ g, items }) => `
              <div class="notif-group slide-up">
                <div class="notif-group__label">${GROUP_LABELS[isAr ? 'ar' : 'en'][g] || g}</div>
                ${items.map(n => _renderItem(n, isAr)).join('')}
              </div>`).join('')
        }
      </div>
    </div>`;
}

export function Notifications() { return _render(); }

export function NotificationsEvents() {
  let currentFilter = 'all';

  const _rerender = () => {
    const outlet = document.getElementById('app-outlet');
    if (outlet) { outlet.innerHTML = _render(currentFilter); _bind(); }
  };

  const _bind = () => {
    // Filter tabs
    document.querySelectorAll('.notif-filter__btn').forEach(btn => {
      btn.addEventListener('click', () => { currentFilter = btn.dataset.filter; _rerender(); });
    });

    // Mark all
    document.getElementById('notif-mark-all')?.addEventListener('click', () => {
      _save(_getNotifs().map(n => ({ ...n, read: true })));
      _rerender();
    });

    // Mark single read
    document.querySelectorAll('.notif-read-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        _save(_getNotifs().map(n => n.id === btn.dataset.id ? { ...n, read: true } : n));
        _rerender();
      });
    });

    // Delete single
    document.querySelectorAll('.notif-delete-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const item = btn.closest('.notif-item');
        if (item) {
          item.style.opacity = '0';
          item.style.transform = 'translateX(20px)';
          item.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
        }
        setTimeout(() => {
          _save(_getNotifs().filter(n => n.id !== btn.dataset.id));
          _rerender();
        }, 180);
      });
    });

    // Click item row → mark read
    document.querySelectorAll('.notif-item--unread').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.closest('.notif-read-btn') || e.target.closest('.notif-delete-btn')) return;
        _save(_getNotifs().map(n => n.id === item.dataset.id ? { ...n, read: true } : n));
        _rerender();
      });
    });
  };

  _bind();
}
