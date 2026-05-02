import { useState } from "react";
import Icon from "@/components/ui/icon";
import AuthScreen from "@/components/messenger/AuthScreen";
import { InviteModal, CreateGroupModal, NewGroup } from "@/components/messenger/Modals";
import Sidebar from "@/components/messenger/Sidebar";
import MainArea from "@/components/messenger/MainArea";

type Section = "chats" | "groups" | "contacts" | "calls" | "video" | "notifications" | "settings" | "profile";

const CONTACTS = [
  { id: 1, name: "Александра Волкова", status: "online", avatar: "АВ", color: "from-purple-500 to-pink-500", lastMsg: "Привет! Как дела?", time: "14:32", unread: 3, verified: true },
  { id: 2, name: "Денис Морозов", status: "online", avatar: "ДМ", color: "from-cyan-500 to-blue-500", lastMsg: "Отправил файлы на проверку", time: "13:15", unread: 0, verified: false },
  { id: 3, name: "Команда дизайна", status: "group", avatar: "КД", color: "from-orange-500 to-red-500", lastMsg: "Новый макет готов!", time: "12:00", unread: 7, verified: false },
  { id: 4, name: "Мария Петрова", status: "away", avatar: "МП", color: "from-green-500 to-teal-500", lastMsg: "Увидимся завтра", time: "11:48", unread: 0, verified: true },
  { id: 5, name: "Игорь Смирнов", status: "offline", avatar: "ИС", color: "from-violet-500 to-purple-500", lastMsg: "Ок, договорились", time: "Вчера", unread: 0, verified: false },
  { id: 6, name: "Алина Козлова", status: "online", avatar: "АК", color: "from-pink-500 to-rose-500", lastMsg: "🔐 Зашифровано", time: "Вчера", unread: 1, verified: true },
];

const MESSAGES = [
  { id: 1, from: "other", text: "Привет! Как дела? Работаешь над новым проектом?", time: "14:28" },
  { id: 2, from: "me", text: "Всё отлично! Да, запускаем новый мессенджер 🚀", time: "14:29" },
  { id: 3, from: "other", text: "О, звучит круто! Там будет шифрование?", time: "14:30" },
  { id: 4, from: "me", text: "Конечно! Сквозное шифрование для всех сообщений. Никто кроме нас не прочитает.", time: "14:31" },
  { id: 5, from: "other", text: "Привет! Как дела?", time: "14:32" },
];

const GROUPS = [
  { id: 1, name: "Команда дизайна", members: 12, avatar: "КД", color: "from-orange-500 to-red-500", lastMsg: "Новый макет готов!", time: "12:00", unread: 7 },
  { id: 2, name: "Разработка v2.0", members: 8, avatar: "РВ", color: "from-blue-500 to-indigo-500", lastMsg: "Deploy прошёл успешно ✅", time: "11:30", unread: 2 },
  { id: 3, name: "Маркетинг Q4", members: 15, avatar: "МК", color: "from-green-500 to-emerald-500", lastMsg: "Дедлайн завтра", time: "10:15", unread: 0 },
  { id: 4, name: "Всеобщий чат", members: 47, avatar: "ВЧ", color: "from-purple-500 to-violet-500", lastMsg: "Хорошие новости!", time: "09:40", unread: 14 },
];

const NOTIFICATIONS = [
  { id: 1, icon: "MessageCircle", color: "text-purple-400", text: "Александра отправила вам сообщение", time: "5 мин назад" },
  { id: 2, icon: "Phone", color: "text-green-400", text: "Пропущенный звонок от Дениса Морозова", time: "20 мин назад" },
  { id: 3, icon: "Users", color: "text-cyan-400", text: "Вас добавили в группу «Разработка v2.0»", time: "1 час назад" },
  { id: 4, icon: "Shield", color: "text-yellow-400", text: "Новый вход с устройства iPhone 15 Pro", time: "2 часа назад" },
  { id: 5, icon: "Video", color: "text-pink-400", text: "Алина приглашает на видеозвонок", time: "Вчера" },
];

const CALL_HISTORY = [
  { id: 1, name: "Денис Морозов", type: "incoming", status: "answered", time: "14:20", duration: "12:34", avatar: "ДМ", color: "from-cyan-500 to-blue-500" },
  { id: 2, name: "Мария Петрова", type: "outgoing", status: "answered", time: "13:05", duration: "03:21", avatar: "МП", color: "from-green-500 to-teal-500" },
  { id: 3, name: "Александра Волкова", type: "incoming", status: "missed", time: "11:48", duration: "", avatar: "АВ", color: "from-purple-500 to-pink-500" },
  { id: 4, name: "Игорь Смирнов", type: "outgoing", status: "declined", time: "Вчера", duration: "", avatar: "ИС", color: "from-violet-500 to-purple-500" },
];

const NavItem = ({ icon, label, active, badge, onClick }: { icon: string; label: string; active: boolean; badge?: number; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 relative ${active ? "nav-active" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
  >
    <div className="relative">
      <Icon name={icon} size={19} />
      {badge && badge > 0 ? (
        <span className="absolute -top-1.5 -right-1.5 bg-[var(--neon-pink)] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </div>
    <span className="text-[9px] font-medium font-golos">{label}</span>
  </button>
);

export default function Index() {
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState<Section>("chats");
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [videoActive, setVideoActive] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groups, setGroups] = useState(GROUPS);

  if (!authed) return <AuthScreen onDone={() => setAuthed(true)} />;

  const handleGroupCreate = (g: NewGroup) => {
    setGroups(prev => [g, ...prev]);
    setSection("groups");
  };

  const activeContact = CONTACTS.find(c => c.id === activeChat);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      from: "me",
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })
    }]);
    setInputValue("");
  };

  const totalUnread = CONTACTS.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="h-screen w-full mesh-bg flex flex-col overflow-hidden">

      {/* Header */}
      <header className="glass-strong border-b border-white/8 px-4 py-3 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center neon-glow">
            <Icon name="MessageCircleHeart" size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-montserrat font-bold text-base text-foreground leading-none tracking-wide">Весток</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Icon name="Shield" size={10} className="text-green-400" />
              <span className="text-[10px] text-green-400 font-golos">Сквозное шифрование</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Search" size={15} />
          </button>
          <button
            onClick={() => setInviteOpen(true)}
            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-purple-400 transition-colors"
            title="Пригласить из записной книжки"
          >
            <Icon name="BookUser" size={15} />
          </button>
          <button
            onClick={() => setCreateGroupOpen(true)}
            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-cyan-400 transition-colors"
            title="Создать группу"
          >
            <Icon name="UsersRound" size={15} />
          </button>
          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="SquarePen" size={15} />
          </button>
        </div>
      </header>

      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
      {createGroupOpen && <CreateGroupModal onClose={() => setCreateGroupOpen(false)} onCreate={handleGroupCreate} />}

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        <Sidebar
          section={section}
          activeChat={activeChat}
          contacts={CONTACTS}
          groups={groups}
          notifications={NOTIFICATIONS}
          callHistory={CALL_HISTORY}
          onChatSelect={setActiveChat}
          onCreateGroup={() => setCreateGroupOpen(true)}
          onInvite={() => setInviteOpen(true)}
          onVideoCall={() => setVideoActive(true)}
        />

        <MainArea
          section={section}
          activeContact={activeContact}
          messages={messages}
          inputValue={inputValue}
          videoActive={videoActive}
          onInputChange={setInputValue}
          onSendMessage={sendMessage}
          onCallSection={() => setSection("calls")}
          onVideoCall={() => { setSection("video"); setVideoActive(true); }}
          onStopVideo={() => setVideoActive(false)}
        />
      </div>

      {/* Bottom Navigation */}
      <nav className="glass-strong border-t border-white/8 px-1 py-1.5 flex items-center justify-around flex-shrink-0 z-10">
        <NavItem icon="MessageCircle" label="Чаты" active={section === "chats"} badge={totalUnread} onClick={() => setSection("chats")} />
        <NavItem icon="Users" label="Группы" active={section === "groups"} badge={21} onClick={() => setSection("groups")} />
        <NavItem icon="Contact" label="Контакты" active={section === "contacts"} onClick={() => setSection("contacts")} />
        <NavItem icon="Phone" label="Звонки" active={section === "calls"} onClick={() => setSection("calls")} />
        <NavItem icon="Video" label="Видео" active={section === "video"} onClick={() => setSection("video")} />
        <NavItem icon="Bell" label="Уведом." active={section === "notifications"} badge={NOTIFICATIONS.length} onClick={() => setSection("notifications")} />
        <NavItem icon="Settings" label="Настройки" active={section === "settings"} onClick={() => setSection("settings")} />
        <NavItem icon="UserCircle" label="Профиль" active={section === "profile"} onClick={() => setSection("profile")} />
      </nav>
    </div>
  );
}
