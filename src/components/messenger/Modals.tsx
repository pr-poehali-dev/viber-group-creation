import { useState } from "react";
import Icon from "@/components/ui/icon";

export type NewGroup = { id: number; name: string; members: number; avatar: string; color: string; lastMsg: string; time: string; unread: number };

const PHONEBOOK = [
  { id: 1, name: "Андрей Козлов", phone: "+7 916 123-45-01", avatar: "АК", color: "from-blue-500 to-indigo-500", inApp: false },
  { id: 2, name: "Виктория Орлова", phone: "+7 985 234-56-02", avatar: "ВО", color: "from-pink-500 to-rose-500", inApp: false },
  { id: 3, name: "Геннадий Фёдоров", phone: "+7 903 345-67-03", avatar: "ГФ", color: "from-orange-500 to-amber-500", inApp: false },
  { id: 4, name: "Дарья Белова", phone: "+7 926 456-78-04", avatar: "ДБ", color: "from-teal-500 to-cyan-500", inApp: true },
  { id: 5, name: "Евгений Карпов", phone: "+7 965 567-89-05", avatar: "ЕК", color: "from-green-500 to-emerald-500", inApp: false },
  { id: 6, name: "Жанна Соколова", phone: "+7 977 678-90-06", avatar: "ЖС", color: "from-purple-500 to-violet-500", inApp: false },
  { id: 7, name: "Захар Новиков", phone: "+7 999 789-01-07", avatar: "ЗН", color: "from-red-500 to-orange-500", inApp: true },
  { id: 8, name: "Ирина Макарова", phone: "+7 910 890-12-08", avatar: "ИМ", color: "from-sky-500 to-blue-500", inApp: false },
];

const ALL_MEMBERS = [
  { id: 1, name: "Александра Волкова", avatar: "АВ", color: "from-purple-500 to-pink-500", status: "online" },
  { id: 2, name: "Денис Морозов", avatar: "ДМ", color: "from-cyan-500 to-blue-500", status: "online" },
  { id: 3, name: "Мария Петрова", avatar: "МП", color: "from-green-500 to-teal-500", status: "away" },
  { id: 4, name: "Игорь Смирнов", avatar: "ИС", color: "from-violet-500 to-purple-500", status: "offline" },
  { id: 5, name: "Алина Козлова", avatar: "АК", color: "from-pink-500 to-rose-500", status: "online" },
  { id: 6, name: "Дарья Белова", avatar: "ДБ", color: "from-teal-500 to-cyan-500", status: "online" },
  { id: 7, name: "Захар Новиков", avatar: "ЗН", color: "from-red-500 to-orange-500", status: "offline" },
];

const GROUP_COLORS = [
  "from-purple-500 to-violet-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-orange-500 to-amber-600",
  "from-green-500 to-emerald-600",
  "from-indigo-500 to-blue-600",
];

export function InviteModal({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [invited, setInvited] = useState<number[]>([]);
  const [sending, setSending] = useState<number | null>(null);

  const filtered = PHONEBOOK.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const sendInvite = (id: number) => {
    if (invited.includes(id)) return;
    setSending(id);
    setTimeout(() => {
      setSending(null);
      setInvited(prev => [...prev, id]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md glass-strong rounded-2xl border border-white/12 animate-fade-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Icon name="BookUser" size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-sm text-foreground">Записная книжка</h3>
              <p className="text-[11px] text-muted-foreground font-golos">Пригласите контакты в NovaMess</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={15} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-white/6">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по имени или номеру..."
              className="w-full glass rounded-xl pl-8 pr-4 py-2 text-sm font-golos text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-purple-500/40 bg-transparent border-0"
              autoFocus
            />
          </div>
        </div>

        <div className="px-4 py-2 flex items-center gap-4 border-b border-white/6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-[11px] text-muted-foreground font-golos">{PHONEBOOK.filter(p => p.inApp).length} уже в приложении</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-[11px] text-muted-foreground font-golos">{PHONEBOOK.filter(p => !p.inApp).length} можно пригласить</span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-80">
          {filtered.length === 0 && (
            <div className="py-10 text-center text-muted-foreground text-sm font-golos">
              Контакты не найдены
            </div>
          )}
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/4 transition-all border-b border-white/4 last:border-0 animate-fade-slide-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-sm font-bold font-montserrat text-white`}>
                  {p.avatar}
                </div>
                {p.inApp && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                    <Icon name="Check" size={8} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-golos font-medium text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.phone}</p>
              </div>
              {p.inApp ? (
                <span className="text-[10px] text-green-400 font-golos glass px-2 py-1 rounded-lg border border-green-500/20">В приложении</span>
              ) : invited.includes(p.id) ? (
                <span className="flex items-center gap-1 text-[10px] text-purple-400 font-golos glass px-2 py-1 rounded-lg border border-purple-500/20">
                  <Icon name="Check" size={10} />Отправлено
                </span>
              ) : (
                <button
                  onClick={() => sendInvite(p.id)}
                  disabled={sending === p.id}
                  className="flex items-center gap-1.5 text-xs font-golos font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending === p.id ? (
                    <><Icon name="Loader" size={12} className="animate-spin" />Отправка</>
                  ) : (
                    <><Icon name="Send" size={12} />Пригласить</>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-white/6 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-golos">
            {invited.length > 0 ? `Приглашено: ${invited.length}` : "Приглашение придёт в SMS"}
          </span>
          <button
            onClick={onClose}
            className="text-xs text-purple-400 font-golos hover:text-purple-300 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateGroupModal({ onClose, onCreate }: { onClose: () => void; onCreate: (g: NewGroup) => void }) {
  const [step, setStep] = useState<"members" | "info">("members");
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupColor, setGroupColor] = useState(GROUP_COLORS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = ALL_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const goNext = () => {
    if (selected.length < 1) { setError("Выберите хотя бы одного участника"); return; }
    setError("");
    setStep("info");
  };

  const create = () => {
    if (!groupName.trim()) { setError("Введите название группы"); return; }
    setLoading(true);
    setTimeout(() => {
      const initials = groupName.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
      onCreate({
        id: Date.now(),
        name: groupName.trim(),
        members: selected.length + 1,
        avatar: initials,
        color: groupColor,
        lastMsg: "Группа создана",
        time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
        unread: 0,
      });
      setLoading(false);
      onClose();
    }, 900);
  };

  const selectedMembers = ALL_MEMBERS.filter(m => selected.includes(m.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md glass-strong rounded-2xl border border-white/12 animate-fade-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === "info" && (
              <button onClick={() => { setStep("members"); setError(""); }} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors mr-1">
                <Icon name="ArrowLeft" size={15} />
              </button>
            )}
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${step === "info" ? groupColor : "from-cyan-500 to-blue-600"} flex items-center justify-center transition-all duration-300`}>
              <Icon name={step === "members" ? "Users" : "Pencil"} size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-sm text-foreground">
                {step === "members" ? "Новая группа" : "Настройка группы"}
              </h3>
              <p className="text-[11px] text-muted-foreground font-golos">
                {step === "members" ? `Выбрано: ${selected.length} из ${ALL_MEMBERS.length}` : `${selected.length + 1} участник${selected.length === 0 ? "" : selected.length < 4 ? "а" : "ов"}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={15} />
          </button>
        </div>

        {step === "members" && (
          <>
            <div className="px-4 py-3 border-b border-white/6">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Поиск контактов..."
                  className="w-full glass rounded-xl pl-8 pr-4 py-2 text-sm font-golos text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-purple-500/40 bg-transparent border-0"
                  autoFocus
                />
              </div>
            </div>

            {selected.length > 0 && (
              <div className="px-4 py-2 border-b border-white/6 flex gap-2 overflow-x-auto">
                {selectedMembers.map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 glass rounded-full px-2 py-1 text-[11px] font-golos text-foreground hover:bg-red-500/10 transition-colors group"
                  >
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-[8px] font-bold text-white`}>{m.avatar[0]}</div>
                    {m.name.split(" ")[0]}
                    <Icon name="X" size={9} className="text-muted-foreground group-hover:text-red-400 transition-colors" />
                  </button>
                ))}
              </div>
            )}

            <div className="overflow-y-auto max-h-64">
              {filtered.map((m, i) => {
                const isSelected = selected.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => { toggle(m.id); setError(""); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-white/5 border-b border-white/4 last:border-0 text-left animate-fade-slide-up ${isSelected ? "bg-purple-500/8" : ""}`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-sm font-bold font-montserrat text-white`}>
                        {m.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${m.status === "online" ? "bg-green-400" : m.status === "away" ? "bg-yellow-400" : "bg-gray-500"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-golos font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.status === "online" ? "В сети" : m.status === "away" ? "Отошёл" : "Не в сети"}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? "bg-purple-600 border-purple-600" : "border-white/20"}`}>
                      {isSelected && <Icon name="Check" size={10} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {error && <p className="text-xs text-red-400 px-4 py-2 flex items-center gap-1 font-golos"><Icon name="AlertCircle" size={12} />{error}</p>}

            <div className="px-4 py-3 border-t border-white/6">
              <button
                onClick={goNext}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-montserrat font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform neon-glow flex items-center justify-center gap-2"
              >
                Далее <Icon name="ArrowRight" size={15} />
              </button>
            </div>
          </>
        )}

        {step === "info" && (
          <>
            <div className="flex flex-col items-center py-5 border-b border-white/6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${groupColor} flex items-center justify-center text-2xl font-bold font-montserrat text-white mb-3 neon-glow transition-all duration-300`}>
                {groupName.trim() ? groupName.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "??"}
              </div>
              <div className="flex gap-2">
                {GROUP_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setGroupColor(c)}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${c} transition-all duration-200 ${groupColor === c ? "scale-125 ring-2 ring-white/40" : "opacity-60 hover:opacity-100"}`}
                  />
                ))}
              </div>
            </div>

            <div className="px-4 py-4 space-y-3">
              <div className="relative">
                <Icon name="Users" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={groupName}
                  onChange={e => { setGroupName(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && create()}
                  placeholder="Название группы..."
                  maxLength={40}
                  className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm font-golos text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-purple-500/50 bg-transparent border-0"
                  autoFocus
                />
              </div>

              <div className="glass rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-muted-foreground font-golos uppercase tracking-wider mb-2">Участники</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">ЮВ</div>
                    <span className="text-xs font-golos text-foreground">Вы (администратор)</span>
                    <span className="ml-auto text-[10px] text-purple-400 glass px-1.5 py-0.5 rounded-md">Адм.</span>
                  </div>
                  {selectedMembers.map(m => (
                    <div key={m.id} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-[10px] font-bold text-white`}>{m.avatar}</div>
                      <span className="text-xs font-golos text-foreground truncate">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs text-red-400 flex items-center gap-1 font-golos"><Icon name="AlertCircle" size={12} />{error}</p>}
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={create}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-montserrat font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform neon-glow disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Icon name="Loader" size={15} className="animate-spin" />Создаём группу...</>
                ) : (
                  <><Icon name="Check" size={15} />Создать группу</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
