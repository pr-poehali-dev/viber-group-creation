import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

type AuthStep = "phone" | "code" | "name";
type Section = "chats" | "groups" | "contacts" | "calls" | "video" | "notifications" | "settings" | "profile";

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────

function AuthScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits[0]} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const raw = e.target.value.replace(/\D/g, "");
    setPhone(formatPhone(raw));
  };

  const submitPhone = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 11) { setError("Введите корректный номер телефона"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("code"); codeRefs.current[0]?.focus(); }, 1200);
  };

  const handleCodeInput = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    setError("");
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 5) codeRefs.current[idx + 1]?.focus();
    if (next.every(d => d !== "") && next.join("").length === 6) {
      setTimeout(() => verifyCode(next.join("")), 200);
    }
  };

  const handleCodeKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) codeRefs.current[idx - 1]?.focus();
  };

  const verifyCode = (fullCode: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (fullCode === "000000") { setError("Неверный код. Попробуйте ещё раз."); setCode(["","","","","",""]); codeRefs.current[0]?.focus(); return; }
      setStep("name");
    }, 1000);
  };

  const submitName = () => {
    if (name.trim().length < 2) { setError("Введите ваше имя (минимум 2 символа)"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onDone(); }, 800);
  };

  return (
    <div className="h-screen w-full mesh-bg flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm animate-fade-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 neon-glow">
            <Icon name="Zap" size={30} className="text-white" />
          </div>
          <h1 className="font-montserrat font-bold text-2xl text-foreground">NovaMess</h1>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <Icon name="Shield" size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-golos">Сквозное шифрование E2E</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-6 border border-white/10">

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {(["phone", "code", "name"] as AuthStep[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-montserrat transition-all duration-300 ${step === s ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white neon-glow scale-110" : (["phone","code","name"].indexOf(step) > i ? "bg-purple-600/60 text-white/80" : "glass text-muted-foreground")}`}>
                  {["phone","code","name"].indexOf(step) > i ? <Icon name="Check" size={13} /> : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${["phone","code","name"].indexOf(step) > i ? "bg-purple-500" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          {/* STEP: PHONE */}
          {step === "phone" && (
            <div className="animate-fade-slide-up">
              <h2 className="font-montserrat font-bold text-lg text-foreground mb-1">Введите номер</h2>
              <p className="text-sm text-muted-foreground font-golos mb-5">Мы отправим код подтверждения</p>
              <div className="relative mb-4">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Icon name="Phone" size={16} className="text-purple-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneInput}
                  onKeyDown={e => e.key === "Enter" && submitPhone()}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm font-golos text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-purple-500/50 bg-transparent border-0 transition-all"
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-400 mb-3 font-golos flex items-center gap-1"><Icon name="AlertCircle" size={12} />{error}</p>}
              <button
                onClick={submitPhone}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-montserrat font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform neon-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><Icon name="Loader" size={16} className="animate-spin" />Отправка...</> : <>Получить код <Icon name="ArrowRight" size={16} /></>}
              </button>
              <p className="text-[11px] text-muted-foreground text-center mt-4 font-golos leading-relaxed">
                Продолжая, вы соглашаетесь с<br />
                <span className="text-purple-400 cursor-pointer">Условиями использования</span> и <span className="text-purple-400 cursor-pointer">Политикой конфиденциальности</span>
              </p>
            </div>
          )}

          {/* STEP: CODE */}
          {step === "code" && (
            <div className="animate-fade-slide-up">
              <button onClick={() => { setStep("phone"); setCode(["","","","","",""]); setError(""); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 font-golos">
                <Icon name="ArrowLeft" size={13} /> Назад
              </button>
              <h2 className="font-montserrat font-bold text-lg text-foreground mb-1">Введите код</h2>
              <p className="text-sm text-muted-foreground font-golos mb-1">Код отправлен на номер</p>
              <p className="text-sm font-golos text-purple-400 mb-5">{phone}</p>

              <div className="flex gap-2 justify-between mb-4">
                {code.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { codeRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleCodeInput(e.target.value, i)}
                    onKeyDown={e => handleCodeKey(e, i)}
                    className={`w-11 h-13 text-center text-lg font-montserrat font-bold rounded-xl glass outline-none transition-all duration-200 bg-transparent border-0 text-foreground
                      ${d ? "ring-1 ring-purple-500 bg-purple-500/10" : "focus:ring-1 focus:ring-purple-500/50"}`}
                    style={{ height: "3.25rem" }}
                  />
                ))}
              </div>

              {loading && (
                <div className="flex items-center justify-center gap-2 py-2 mb-2">
                  <Icon name="Loader" size={16} className="animate-spin text-purple-400" />
                  <span className="text-sm text-muted-foreground font-golos">Проверяем код...</span>
                </div>
              )}
              {error && <p className="text-xs text-red-400 mb-3 font-golos flex items-center gap-1"><Icon name="AlertCircle" size={12} />{error}</p>}

              <button className="w-full text-center text-xs text-muted-foreground hover:text-purple-400 transition-colors font-golos py-1" onClick={() => { setCode(["","","","","",""]); setError(""); }}>
                Отправить код повторно
              </button>
            </div>
          )}

          {/* STEP: NAME */}
          {step === "name" && (
            <div className="animate-fade-slide-up">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                  <Icon name="Check" size={26} className="text-white" />
                </div>
              </div>
              <h2 className="font-montserrat font-bold text-lg text-foreground mb-1 text-center">Номер подтверждён!</h2>
              <p className="text-sm text-muted-foreground font-golos mb-5 text-center">Как вас зовут?</p>
              <div className="relative mb-4">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Icon name="User" size={16} className="text-purple-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && submitName()}
                  placeholder="Ваше имя"
                  className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm font-golos text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-purple-500/50 bg-transparent border-0 transition-all"
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-400 mb-3 font-golos flex items-center gap-1"><Icon name="AlertCircle" size={12} />{error}</p>}
              <button
                onClick={submitName}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white font-montserrat font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform neon-glow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Icon name="Loader" size={16} className="animate-spin" />Входим...</> : <>Войти в NovaMess <Icon name="ArrowRight" size={16} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

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

export default function Index() {
  const [authed, setAuthed] = useState(false);
  const [section, setSection] = useState<Section>("chats");
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const [videoActive, setVideoActive] = useState(false);

  if (!authed) return <AuthScreen onDone={() => setAuthed(true)} />;

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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center neon-glow">
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-montserrat font-bold text-base text-foreground leading-none">NovaMess</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Icon name="Shield" size={10} className="text-green-400" />
              <span className="text-[10px] text-green-400 font-golos">E2E шифрование активно</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="Search" size={15} />
          </button>
          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="SquarePen" size={15} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <aside className="w-72 glass border-r border-white/6 flex flex-col min-h-0 flex-shrink-0">
          <div className="px-3 py-2 border-b border-white/6">
            <span className="text-[10px] text-muted-foreground font-golos uppercase tracking-widest">
              {section === "chats" && "Личные чаты"}
              {section === "groups" && "Группы"}
              {section === "contacts" && "Контакты"}
              {section === "calls" && "История звонков"}
              {section === "video" && "Видеозвонки"}
              {section === "notifications" && "Уведомления"}
              {section === "settings" && "Настройки"}
              {section === "profile" && "Мой профиль"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-1">

            {/* CHATS */}
            {section === "chats" && CONTACTS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveChat(c.id)}
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
                      <span className="ml-1 flex-shrink-0 bg-purple-600 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {/* GROUPS */}
            {section === "groups" && GROUPS.map((g, i) => (
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
                      <span className="text-xs text-muted-foreground">{g.members} участников</span>
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

            {/* CONTACTS */}
            {section === "contacts" && CONTACTS.map((c, i) => (
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

            {/* NOTIFICATIONS */}
            {section === "notifications" && NOTIFICATIONS.map((n, i) => (
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
            {section === "calls" && CALL_HISTORY.map((call, i) => (
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
                {CONTACTS.filter(c => c.status === "online").map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setVideoActive(true)}
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

        {/* Main area */}
        <main className="flex-1 flex flex-col min-h-0 min-w-0">

          {section === "chats" && activeContact ? (
            <>
              {/* Chat header */}
              <div className="glass border-b border-white/6 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                <Avatar initials={activeContact.avatar} color={activeContact.color} status={activeContact.status} />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-montserrat font-semibold text-sm text-foreground">{activeContact.name}</span>
                    {activeContact.verified && <Icon name="BadgeCheck" size={14} className="text-purple-400" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeContact.status === "online" ? "bg-green-400" : "bg-gray-500"}`} />
                    <span className="text-xs text-muted-foreground">
                      {activeContact.status === "online" ? "В сети" : "Не в сети"}
                    </span>
                    <span className="text-xs text-muted-foreground mx-1">·</span>
                    <Icon name="Lock" size={10} className="text-green-400" />
                    <span className="text-xs text-green-400">Зашифровано</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSection("calls")}
                    className="w-9 h-9 glass rounded-xl flex items-center justify-center text-green-400 hover:bg-green-400/20 transition-all"
                  >
                    <Icon name="Phone" size={16} />
                  </button>
                  <button
                    onClick={() => { setSection("video"); setVideoActive(true); }}
                    className="w-9 h-9 glass rounded-xl flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-all"
                  >
                    <Icon name="Video" size={16} />
                  </button>
                  <button className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                    <Icon name="MoreVertical" size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                <div className="flex justify-center mb-2">
                  <span className="glass text-[10px] text-muted-foreground px-3 py-1 rounded-full">Сегодня</span>
                </div>
                {messages.map((msg, i) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 animate-fade-slide-up ${msg.from === "me" ? "flex-row-reverse" : ""}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {msg.from !== "me" && (
                      <Avatar initials={activeContact.avatar} color={activeContact.color} size="sm" />
                    )}
                    <div className={`max-w-[65%] ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div className={`px-3.5 py-2.5 ${msg.from === "me" ? "message-bubble-out text-white" : "message-bubble-in text-foreground"}`}>
                        <p className="text-sm font-golos leading-relaxed">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 ${msg.from === "me" ? "flex-row-reverse" : ""}`}>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                        <Icon name="Lock" size={8} className="text-green-400/70" />
                        {msg.from === "me" && <Icon name="CheckCheck" size={12} className="text-purple-400" />}
                      </div>
                    </div>
                  </div>
                ))}
                {/* Typing */}
                <div className="flex gap-2">
                  <Avatar initials={activeContact.avatar} color={activeContact.color} size="sm" />
                  <div className="message-bubble-in px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="glass-strong border-t border-white/6 px-4 py-3 flex items-center gap-2 flex-shrink-0">
                <button className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-purple-400 transition-colors">
                  <Icon name="Paperclip" size={16} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Зашифрованное сообщение..."
                    className="w-full glass rounded-xl px-4 py-2.5 text-sm font-golos text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-purple-500/40 transition-all bg-transparent border-0"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="Lock" size={11} className="text-green-400/60" />
                  </div>
                </div>
                <button className="w-9 h-9 glass rounded-xl flex items-center justify-center text-muted-foreground hover:text-yellow-400 transition-colors">
                  <Icon name="Smile" size={16} />
                </button>
                <button
                  onClick={sendMessage}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white hover:scale-105 transition-transform neon-glow"
                >
                  <Icon name="Send" size={15} />
                </button>
              </div>
            </>
          ) : section === "video" && videoActive ? (
            /* Video call screen */
            <div className="flex-1 flex items-center justify-center animate-fade-in">
              <div className="text-center">
                <div className="relative mb-6 inline-block">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 mx-auto flex items-center justify-center text-4xl font-bold text-white font-montserrat neon-glow animate-pulse">
                    АВ
                  </div>
                  <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/30 animate-pulse-ring" />
                </div>
                <h3 className="font-montserrat font-bold text-xl text-foreground">Александра Волкова</h3>
                <p className="text-muted-foreground mt-1 text-sm font-golos">Видеозвонок...</p>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <Icon name="MicOff" size={22} />
                  </button>
                  <button
                    onClick={() => setVideoActive(false)}
                    className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center text-white hover:bg-red-500 transition-all hover:scale-105"
                  >
                    <Icon name="PhoneOff" size={24} />
                  </button>
                  <button className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-white hover:bg-white/20 transition-all">
                    <Icon name="VideoOff" size={22} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center">
                <Icon name="MessageSquareDot" size={36} className="text-purple-400" />
              </div>
              <div className="text-center">
                <p className="font-montserrat font-semibold text-foreground">Добро пожаловать в NovaMess</p>
                <p className="text-sm text-muted-foreground mt-1 font-golos">Выберите чат или раздел слева</p>
              </div>
              <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                <Icon name="Shield" size={14} className="text-green-400" />
                <span className="text-xs text-green-400 font-golos">Все сообщения защищены E2E шифрованием</span>
              </div>
            </div>
          )}
        </main>
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