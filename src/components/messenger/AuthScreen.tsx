import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

type AuthStep = "phone" | "code" | "name";

export default function AuthScreen({ onDone }: { onDone: () => void }) {
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
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm animate-fade-slide-up">
        <div className="text-center mb-8">
          <div className="relative mx-auto mb-4 w-16 h-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center neon-glow">
              <Icon name="MessageCircleHeart" size={30} className="text-white" />
            </div>
            <div className="ru-stripe absolute -bottom-1 left-0 right-0 rounded-full" />
          </div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground tracking-wide">Весток</h1>
          <p className="text-sm text-muted-foreground font-golos mt-0.5">Российский защищённый мессенджер</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Icon name="Shield" size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-golos">Сквозное шифрование E2E</span>
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-white/10">
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-montserrat font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform neon-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <><Icon name="Loader" size={16} className="animate-spin" />Отправка...</> : <>Получить код <Icon name="ArrowRight" size={16} /></>}
              </button>
              <p className="text-[11px] text-muted-foreground text-center mt-4 font-golos leading-relaxed">
                Продолжая, вы соглашаетесь с<br />
                <span className="text-purple-400 cursor-pointer">Условиями использования</span> и <span className="text-purple-400 cursor-pointer">Политикой конфиденциальности</span>
              </p>
            </div>
          )}

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
                    className={`w-11 h-13 text-center text-lg font-montserrat font-bold rounded-xl glass outline-none transition-all duration-200 border ${d ? "border-purple-500/70 text-foreground bg-purple-500/10" : "border-white/10 text-foreground"} focus:border-purple-500/60 focus:bg-purple-500/8`}
                  />
                ))}
              </div>
              {loading && (
                <div className="flex items-center justify-center gap-2 py-3">
                  <Icon name="Loader" size={16} className="animate-spin text-purple-400" />
                  <span className="text-sm text-muted-foreground font-golos">Проверяем код...</span>
                </div>
              )}
              {error && <p className="text-xs text-red-400 mb-3 font-golos flex items-center gap-1"><Icon name="AlertCircle" size={12} />{error}</p>}
              <button className="w-full text-center text-sm text-purple-400 hover:text-purple-300 font-golos py-2 transition-colors">
                Отправить код повторно
              </button>
            </div>
          )}

          {step === "name" && (
            <div className="animate-fade-slide-up">
              <h2 className="font-montserrat font-bold text-lg text-foreground mb-1">Ваше имя</h2>
              <p className="text-sm text-muted-foreground font-golos mb-5">Как вас зовут?</p>
              <div className="relative mb-4">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Icon name="User" size={16} className="text-purple-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && submitName()}
                  placeholder="Имя Фамилия"
                  className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm font-golos text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-1 focus:ring-purple-500/50 bg-transparent border-0 transition-all"
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-400 mb-3 font-golos flex items-center gap-1"><Icon name="AlertCircle" size={12} />{error}</p>}
              <button
                onClick={submitName}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-montserrat font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform neon-glow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Icon name="Loader" size={16} className="animate-spin" />Входим...</> : <>Войти в Весток <Icon name="ArrowRight" size={16} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
