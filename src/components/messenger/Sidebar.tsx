import Icon from "@/components/ui/icon";

type Section = "chats" | "groups" | "contacts" | "calls" | "video" | "notifications" | "settings" | "profile";

const StatusDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { online: "bg-green-400", away: "bg-yellow-400", offline: "bg-gray-500", group: "bg-cyan-400" };
  return <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${colors[status] || "bg-gray-500"}`} />;
};

const Avatar = ({ initials, color, status, size = "md" }: { initials: string; color: string; status?: string; size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-11 h-11 text-sm", lg: "w-16 h-16 text-xl" };
  return (
    <div className={`relative flex-shrink-0 ${sizes[size]}`}>
      <div className={`w-full h-full rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold font-montserrat text-white`}>
        {initials}
      </div>
      {status && <StatusDot status={status} />}
    </div>
  );
};

type Contact = { id: number; name: string; status: string; avatar: string; color: string; lastMsg: string; time: string; unread: number; verified: boolean };
type Group = { id: number; name: string; members: number; avatar: string; color: string; lastMsg: string; time: string; unread: number };
type Notification = { id: number; icon: string; color: string; text: string; time: string };
type CallRecord = { id: number; name: string; type: string; status: string; time: string; duration: string; avatar: string; color: string };

interface SidebarProps {
  section: Section;
  activeChat: number | null;
  contacts: Contact[];
  groups: Group[];
  notifications: Notification[];
  callHistory: CallRecord[];
  onChatSelect: (id: number) => void;
  onCreateGroup: () => void;
  onInvite: () => void;
  onVideoCall: () => void;
}

export default function Sidebar({
  section,
  activeChat,
  contacts,
  groups,
  notifications,
  callHistory,
  onChatSelect,
  onCreateGroup,
  onInvite,
  onVideoCall,
}: SidebarProps) {
  const sectionLabel: Record<Section, string> = {
    chats: "Личные чаты",
    groups: "Группы",
    contacts: "Контакты",
    calls: "История звонков",
    video: "Видеозвонки",
    notifications: "Уведомления",
    settings: "Настройки",
    profile: "Мой профиль",
  };

  return (
    <aside className="w-72 glass border-r border-white/6 flex flex-col min-h-0 flex-shrink-0">
      <div className="px-3 py-2 border-b border-white/6">
        <span className="text-[10px] text-muted-foreground font-golos uppercase tracking-widest">
          {sectionLabel[section]}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-1">

        {/* CHATS */}
        {section === "chats" && contacts.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onChatSelect(c.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-200 hover:bg-white/5 text-left animate-fade-slide-up ${activeChat === c.id ? "bg-white/8 border-r-2 border-purple-500" : ""}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Avatar initials={c.avatar} color={c.color} status={c.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm font-golos text-foreground truncate">{c.name}</span>
                <span className="text-[10px] text-muted-foreground ml-1 flex-shrink-0">{c.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-muted-foreground truncate flex-1">{c.lastMsg}</span>
                {c.unread > 0 && (
                  <span className="ml-1 flex-shrink-0 bg-blue-600 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}

        {/* GROUPS */}
        {section === "groups" && (
          <>
            <div className="p-3 pb-1">
              <button
                onClick={onCreateGroup}
                className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-cyan-600/10 border border-purple-500/30 text-purple-400 hover:from-purple-600/30 hover:border-purple-500/50 transition-all font-golos text-sm font-medium"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                  <Icon name="Plus" size={14} className="text-white" />
                </div>
                Создать новую группу
              </button>
            </div>
            {groups.map((g, i) => (
              <div
                key={g.id}
                className="flex items-center gap-3 px-3 py-2.5 transition-all hover:bg-white/5 animate-fade-slide-up border-b border-white/4 cursor-pointer"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Avatar initials={g.avatar} color={g.color} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm font-golos text-foreground truncate">{g.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{g.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={10} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{g.members} участник{g.members === 1 ? "" : g.members < 5 ? "а" : "ов"}</span>
                    </div>
                    {g.unread > 0 && (
                      <span className="ml-1 bg-cyan-600 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {g.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* CONTACTS */}
        {section === "contacts" && contacts.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-3 px-3 py-2.5 transition-all hover:bg-white/5 animate-fade-slide-up border-b border-white/4"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Avatar initials={c.avatar} color={c.color} status={c.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm font-golos text-foreground">{c.name}</span>
                {c.verified && <Icon name="BadgeCheck" size={13} className="text-purple-400 flex-shrink-0" />}
              </div>
              <span className="text-xs text-muted-foreground">
                {c.status === "online" ? "В сети" : c.status === "away" ? "Отошёл" : "Не в сети"}
              </span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-7 h-7 glass rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-colors cursor-pointer">
                <Icon name="Phone" size={13} />
              </div>
              <div className="w-7 h-7 glass rounded-lg flex items-center justify-center text-purple-400 hover:bg-purple-400/20 transition-colors cursor-pointer">
                <Icon name="MessageCircle" size={13} />
              </div>
            </div>
          </div>
        ))}

        {section === "contacts" && (
          <div className="p-3">
            <button
              onClick={onInvite}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all font-golos text-sm font-medium"
            >
              <Icon name="BookUser" size={15} />
              Пригласить из записной книжки
            </button>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {section === "notifications" && notifications.map((n, i) => (
          <div
            key={n.id}
            className="flex items-start gap-3 px-3 py-3 transition-all hover:bg-white/5 animate-fade-slide-up border-b border-white/4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="w-9 h-9 glass rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name={n.icon} size={16} className={n.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground font-golos leading-snug">{n.text}</p>
              <span className="text-xs text-muted-foreground mt-1 block">{n.time}</span>
            </div>
          </div>
        ))}

        {/* CALLS */}
        {section === "calls" && callHistory.map((call, i) => (
          <div
            key={call.id}
            className="flex items-center gap-3 px-3 py-2.5 transition-all hover:bg-white/5 animate-fade-slide-up border-b border-white/4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Avatar initials={call.avatar} color={call.color} />
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm font-golos text-foreground">{call.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon
                  name={call.type === "incoming" ? "PhoneIncoming" : "PhoneOutgoing"}
                  size={11}
                  className={call.status === "missed" ? "text-red-400" : call.status === "declined" ? "text-orange-400" : "text-green-400"}
                />
                <span className={`text-xs ${call.status === "missed" ? "text-red-400" : call.status === "declined" ? "text-orange-400" : "text-muted-foreground"}`}>
                  {call.status === "missed" ? "Пропущен" : call.status === "declined" ? "Отклонён" : call.type === "incoming" ? "Входящий" : "Исходящий"}
                  {call.duration && ` · ${call.duration}`}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">{call.time}</span>
              <button className="mt-1 w-7 h-7 flex items-center justify-center glass rounded-lg text-green-400 hover:bg-green-400/20 transition-colors ml-auto">
                <Icon name="Phone" size={13} />
              </button>
            </div>
          </div>
        ))}

        {/* VIDEO */}
        {section === "video" && (
          <div className="p-4 animate-fade-slide-up">
            <div className="glass rounded-2xl p-4 mb-3 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center neon-glow">
                <Icon name="Video" size={26} className="text-white" />
              </div>
              <p className="text-sm font-golos text-foreground font-medium">Начать видеозвонок</p>
              <p className="text-xs text-muted-foreground mt-1">Выберите контакт для звонка</p>
            </div>
            {contacts.filter(c => c.status === "online").map((c, i) => (
              <button
                key={c.id}
                onClick={onVideoCall}
                className="w-full flex items-center gap-3 px-3 py-2.5 glass rounded-xl mb-2 hover:bg-white/8 transition-all"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Avatar initials={c.avatar} color={c.color} status={c.status} size="sm" />
                <span className="flex-1 text-left text-sm font-golos font-medium">{c.name}</span>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Icon name="Video" size={13} className="text-white" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {section === "profile" && (
          <div className="p-4 animate-fade-slide-up">
            <div className="text-center mb-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white font-montserrat mx-auto neon-glow">
                  ЮВ
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-600 border-2 border-background flex items-center justify-center">
                  <Icon name="Camera" size={13} className="text-white" />
                </button>
              </div>
              <h3 className="font-montserrat font-bold text-base mt-3 text-foreground">Юрий Воронов</h3>
              <p className="text-xs text-muted-foreground">@yvoronov</p>
              <div className="flex items-center justify-center gap-1 mt-1.5">
                <Icon name="Shield" size={12} className="text-green-400" />
                <span className="text-xs text-green-400">Аккаунт защищён</span>
              </div>
            </div>
            {[
              { icon: "User", label: "Имя", value: "Юрий Воронов" },
              { icon: "AtSign", label: "Username", value: "@yvoronov" },
              { icon: "Phone", label: "Телефон", value: "+7 999 123-45-67" },
              { icon: "Mail", label: "Email", value: "yurii@example.com" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-xl px-3 py-2.5 mb-2 flex items-center gap-3">
                <Icon name={item.icon} size={15} className="text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-golos text-foreground">{item.value}</p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground ml-auto" />
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS */}
        {section === "settings" && (
          <div className="p-3 animate-fade-slide-up">
            {[
              { icon: "Bell", label: "Уведомления", desc: "Звуки и вибрация", color: "text-yellow-400" },
              { icon: "Shield", label: "Конфиденциальность", desc: "E2E шифрование", color: "text-green-400" },
              { icon: "Palette", label: "Тема оформления", desc: "Тёмная / Светлая", color: "text-purple-400" },
              { icon: "Globe", label: "Язык", desc: "Русский", color: "text-cyan-400" },
              { icon: "Lock", label: "Безопасность", desc: "2FA, блокировка", color: "text-pink-400" },
              { icon: "Database", label: "Хранилище", desc: "2.4 ГБ использовано", color: "text-orange-400" },
              { icon: "Wifi", label: "Сеть", desc: "Авто-подключение", color: "text-blue-400" },
              { icon: "HelpCircle", label: "Поддержка", desc: "FAQ и чат", color: "text-teal-400" },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full glass rounded-xl px-3 py-2.5 mb-2 flex items-center gap-3 hover:bg-white/8 transition-all text-left"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="w-8 h-8 rounded-lg glass flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size={16} className={item.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-golos font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

      </div>
    </aside>
  );
}
