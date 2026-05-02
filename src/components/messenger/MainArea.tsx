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
type Message = { id: number; from: string; text: string; time: string };

interface MainAreaProps {
  section: Section;
  activeContact: Contact | undefined;
  messages: Message[];
  inputValue: string;
  videoActive: boolean;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  onCallSection: () => void;
  onVideoCall: () => void;
  onStopVideo: () => void;
}

export default function MainArea({
  section,
  activeContact,
  messages,
  inputValue,
  videoActive,
  onInputChange,
  onSendMessage,
  onCallSection,
  onVideoCall,
  onStopVideo,
}: MainAreaProps) {
  return (
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
                onClick={onCallSection}
                className="w-9 h-9 glass rounded-xl flex items-center justify-center text-green-400 hover:bg-green-400/20 transition-all"
              >
                <Icon name="Phone" size={16} />
              </button>
              <button
                onClick={onVideoCall}
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
                onChange={e => onInputChange(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onSendMessage()}
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
              onClick={onSendMessage}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white hover:scale-105 transition-transform neon-glow"
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
                onClick={onStopVideo}
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
  );
}
