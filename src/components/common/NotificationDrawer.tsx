import React from 'react';
import { Bell, CheckCheck, Clock, ShoppingBag, Tag, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, orders, openOrderTracking } = useApp();

  if (!isOpen) return null;

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.orderReference) {
      const matched = orders.find((o) => o.orderReference === notif.orderReference);
      if (matched) {
        onClose();
        openOrderTracking(matched.id);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FFF9F3] w-full max-w-md h-full flex flex-col border-l border-stone-200 shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF6B35] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#222222]">Notifications</h2>
              <p className="text-xs text-stone-500">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs font-semibold text-[#FF6B35] hover:text-[#E85924] flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#FFF0EB] transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-[#222222]">No notifications yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                We will notify you here when your meals are accepted, cooking, or on the road!
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white/80 border-stone-200/80 hover:bg-white text-stone-700'
                    : 'bg-white border-[#FF6B35]/40 shadow-xs text-[#222222]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'order'
                        ? 'bg-[#FFF0EB] text-[#FF6B35]'
                        : notif.type === 'promo'
                        ? 'bg-[#E8F7EE] text-[#2E9D63]'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {notif.type === 'order' ? (
                      <ShoppingBag className="w-4 h-4" />
                    ) : notif.type === 'promo' ? (
                      <Tag className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold truncate">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#FF6B35] shrink-0" title="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                      <span>{notif.timestamp}</span>
                      {notif.orderReference && (
                        <span className="text-[#FF6B35] font-semibold hover:underline">Track order →</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
