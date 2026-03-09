import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, CreditCard, ShieldCheck, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NotificationType } from "@/types/notification";
import { ClientLayout } from "@/components/client/ClientLayout";

const iconMap: Record<string, typeof Bell> = {
  APPOINTMENT_REQUESTED: Calendar,
  APPOINTMENT_CONFIRMED: CheckCircle,
  PAYMENT_PENDING: CreditCard,
  PAYMENT_CONFIRMED: CreditCard,
  APPOINTMENT_REMINDER_24H: Bell,
  APPOINTMENT_REMINDER_2H: Bell,
  APPOINTMENT_CANCELED: Calendar,
  APPOINTMENT_COMPLETED_REVIEW_REQUEST: CheckCircle,
  KYC_STATUS_CHANGED: ShieldCheck,
};

const NotificationsPage = () => {
  const { userNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (id: string, linkUrl: string) => {
    markAsRead(id);
    navigate(linkUrl);
  };

  return (
    <ClientLayout
      title="Notificações"
      subtitle={unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` : undefined}
    >
      <div className="max-w-2xl">
        {unreadCount > 0 && (
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          </div>
        )}

        {userNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma notificação ainda</p>
          </div>
        ) : (
          <div className="space-y-2">
            {userNotifications.map((n) => {
              const Icon = iconMap[n.type] || Bell;
              return (
                <button
                  key={n.id}
                  onClick={() => handleClick(n.id, n.linkUrl)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors hover:bg-accent ${
                    !n.isRead ? "bg-primary/5 border-primary/20" : "border-border"
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-lg ${!n.isRead ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default NotificationsPage;
