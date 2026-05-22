import { useState, useEffect } from "react";

const STORAGE_KEY = "form_submissions";

const themes = {
  light: {
    bg: "#F5F4EF",
    surface: "#FFFFFF",
    surfaceAlt: "#F0EEE8",
    text: "#1A1917",
    textMuted: "#6B6A66",
    border: "rgba(0,0,0,0.12)",
    accent: "#3B3ADE",
    accentText: "#FFFFFF",
    accentHover: "#2928B5",
    danger: "#C0392B",
    success: "#1D6A45",
    successBg: "#EAF3DE",
    inputBg: "#FFFFFF",
    cardShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
    toggleBg: "#E0DED8",
    toggleThumb: "#FFFFFF",
    toggleActive: "#3B3ADE",
    tag: "#E8E7FF",
    tagText: "#3B3ADE",
  },
  dark: {
    bg: "#111110",
    surface: "#1C1C1A",
    surfaceAlt: "#242422",
    text: "#F0EDEA",
    textMuted: "#9A9892",
    border: "rgba(255,255,255,0.1)",
    accent: "#6C6BFF",
    accentText: "#FFFFFF",
    accentHover: "#5857E0",
    danger: "#E05555",
    success: "#5DCAA5",
    successBg: "#0B2B20",
    inputBg: "#242422",
    cardShadow: "0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
    toggleBg: "#3A3A38",
    toggleThumb: "#F0EDEA",
    toggleActive: "#6C6BFF",
    tag: "#2A2960",
    tagText: "#9190FF",
  },
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');`;

function SunIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ size = 20, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function TrashIcon({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function ChevronIcon({ size = 16, color, up }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" style={{ transform: up ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const initialForm = {
  nombre: "",
  email: "",
  telefono: "",
  categoria: "",
  mensaje: "",
  prioridad: "media",
  aceptaTerminos: false,
};

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submissions, setSubmissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  const t = themes[mode];

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Email inválido";
    if (form.telefono && !form.telefono.match(/^[\d\s+\-()]{7,15}$/)) e.telefono = "Teléfono inválido";
    if (!form.categoria) e.categoria = "Selecciona una categoría";
    if (!form.mensaje.trim()) e.mensaje = "El mensaje es requerido";
    else if (form.mensaje.trim().length < 10) e.mensaje = "Mínimo 10 caracteres";
    if (!form.aceptaTerminos) e.aceptaTerminos = "Debes aceptar los términos";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const entry = { ...form, id: Date.now(), fecha: new Date().toLocaleString("es-CL") };
    const updated = [entry, ...submissions];
    setSubmissions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSubmitted(true);
    setForm(initialForm);
    setErrors({});
    setTimeout(() => setSubmitted(false), 3500);
  };

  const deleteEntry = (id) => {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: `1.5px solid ${errors[field] ? t.danger : t.border}`,
    background: t.inputBg,
    color: t.text,
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  });

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: t.textMuted,
    marginBottom: 6,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  };

  const errorStyle = { color: t.danger, fontSize: 12, marginTop: 4 };

  const priorities = [
    { value: "baja", label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta", label: "Alta" },
  ];

  const priorityColors = {
    baja: { bg: "#EAF3DE", text: "#3B6D11", darkBg: "#173404", darkText: "#97C459" },
    media: { bg: "#FAEEDA", text: "#854F0B", darkBg: "#412402", darkText: "#EF9F27" },
    alta: { bg: "#FCEBEB", text: "#A32D2D", darkBg: "#501313", darkText: "#F09595" },
  };

  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        input::placeholder, textarea::placeholder { color: ${t.textMuted}; opacity: 0.7; }
        input:focus, textarea:focus, select:focus { border-color: ${t.accent} !important; }
        select option { background: ${t.inputBg}; color: ${t.text}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .form-field { animation: slideIn 0.25s ease both; }
        .success-banner { animation: fadeIn 0.3s ease; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: t.bg, color: t.text, transition: "background 0.25s, color 0.2s", padding: "24px 16px 48px" }}>

        {/* Header */}
        <div style={{ maxWidth: 560, margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: t.text, lineHeight: 1.2 }}>
              Mi Formulario
            </h1>
            <p style={{ color: t.textMuted, fontSize: 14, marginTop: 4 }}>Completa y guarda tu información</p>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setMode(m => m === "light" ? "dark" : "light")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 100, padding: "8px 14px",
              cursor: "pointer", color: t.text, fontSize: 13, fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: t.cardShadow, transition: "all 0.2s",
            }}
            title="Cambiar tema"
          >
            {mode === "light" ? <MoonIcon size={16} color={t.textMuted} /> : <SunIcon size={16} color={t.textMuted} />}
            <span style={{ color: t.textMuted }}>{mode === "light" ? "Dark" : "Light"}</span>
          </button>
        </div>

        {/* Success banner */}
        {submitted && (
          <div className="success-banner" style={{
            maxWidth: 560, margin: "0 auto 20px",
            background: t.successBg, border: `1px solid ${t.success}33`,
            borderRadius: 10, padding: "12px 16px",
            color: t.success, fontSize: 14, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>✓</span>
            Formulario guardado exitosamente en el almacenamiento local.
          </div>
        )}

        {/* Form card */}
        <div style={{
          maxWidth: 560, margin: "0 auto",
          background: t.surface, borderRadius: 16,
          border: `1px solid ${t.border}`,
          boxShadow: t.cardShadow,
          padding: "28px 28px",
          transition: "background 0.25s",
        }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Nombre */}
            <div className="form-field" style={{ animationDelay: "0ms" }}>
              <label style={labelStyle}>Nombre completo *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => handleChange("nombre", e.target.value)}
                placeholder="Ej: María González"
                style={inputStyle("nombre")}
              />
              {errors.nombre && <p style={errorStyle}>{errors.nombre}</p>}
            </div>

            {/* Email + Teléfono */}
            <div className="form-field" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animationDelay: "40ms" }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => handleChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  style={inputStyle("email")}
                />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
              </div>
              <div>
                <label style={labelStyle}>Teléfono</label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={e => handleChange("telefono", e.target.value)}
                  placeholder="+56 9 1234 5678"
                  style={inputStyle("telefono")}
                />
                {errors.telefono && <p style={errorStyle}>{errors.telefono}</p>}
              </div>
            </div>

            {/* Categoría */}
            <div className="form-field" style={{ animationDelay: "80ms" }}>
              <label style={labelStyle}>Categoría *</label>
              <select
                value={form.categoria}
                onChange={e => handleChange("categoria", e.target.value)}
                style={{ ...inputStyle("categoria"), appearance: "none", cursor: "pointer" }}
              >
                <option value="">Selecciona una categoría...</option>
                <option value="consulta">Consulta general</option>
                <option value="soporte">Soporte técnico</option>
                <option value="ventas">Ventas</option>
                <option value="reclamo">Reclamo</option>
                <option value="otro">Otro</option>
              </select>
              {errors.categoria && <p style={errorStyle}>{errors.categoria}</p>}
            </div>

            {/* Prioridad */}
            <div className="form-field" style={{ animationDelay: "100ms" }}>
              <label style={labelStyle}>Prioridad</label>
              <div style={{ display: "flex", gap: 10 }}>
                {priorities.map(p => {
                  const pc = priorityColors[p.value];
                  const isSelected = form.prioridad === p.value;
                  return (
                    <button
                      key={p.value}
                      onClick={() => handleChange("prioridad", p.value)}
                      style={{
                        flex: 1, padding: "9px 0",
                        borderRadius: 8,
                        border: isSelected ? `2px solid ${t.accent}` : `1.5px solid ${t.border}`,
                        background: isSelected ? (mode === "dark" ? pc.darkBg : pc.bg) : t.surfaceAlt,
                        color: isSelected ? (mode === "dark" ? pc.darkText : pc.text) : t.textMuted,
                        fontWeight: isSelected ? 600 : 400,
                        fontSize: 13, cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s",
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mensaje */}
            <div className="form-field" style={{ animationDelay: "120ms" }}>
              <label style={labelStyle}>Mensaje *</label>
              <textarea
                value={form.mensaje}
                onChange={e => handleChange("mensaje", e.target.value)}
                placeholder="Describe tu consulta o comentario..."
                rows={4}
                style={{ ...inputStyle("mensaje"), resize: "vertical", lineHeight: 1.6 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {errors.mensaje ? <p style={errorStyle}>{errors.mensaje}</p> : <span />}
                <span style={{ fontSize: 12, color: t.textMuted }}>{form.mensaje.length} caracteres</span>
              </div>
            </div>

            {/* Términos */}
            <div className="form-field" style={{ animationDelay: "140ms" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.aceptaTerminos}
                  onChange={e => handleChange("aceptaTerminos", e.target.checked)}
                  style={{ marginTop: 2, accentColor: t.accent, width: 16, height: 16, cursor: "pointer", flexShrink: 0 }}
                />
                <span style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.5 }}>
                  Acepto los <span style={{ color: t.accent, textDecoration: "underline", cursor: "pointer" }}>términos y condiciones</span> y la política de privacidad *
                </span>
              </label>
              {errors.aceptaTerminos && <p style={{ ...errorStyle, marginTop: 6 }}>{errors.aceptaTerminos}</p>}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              style={{
                width: "100%", padding: "12px",
                background: t.accent, color: t.accentText,
                border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer", letterSpacing: "0.01em",
                transition: "background 0.15s, transform 0.1s",
                marginTop: 4,
              }}
              onMouseEnter={e => e.target.style.background = t.accentHover}
              onMouseLeave={e => e.target.style.background = t.accent}
              onMouseDown={e => e.target.style.transform = "scale(0.98)"}
              onMouseUp={e => e.target.style.transform = "scale(1)"}
            >
              Guardar formulario
            </button>
          </div>
        </div>

        {/* History section */}
        {submissions.length > 0 && (
          <div style={{ maxWidth: 560, margin: "24px auto 0" }}>
            <button
              onClick={() => setShowHistory(h => !h)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "14px 20px",
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: showHistory ? "12px 12px 0 0" : 12,
                color: t.text, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 500,
                boxShadow: t.cardShadow,
                transition: "border-radius 0.2s",
              }}
            >
              <span>Formularios guardados</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  background: t.tag, color: t.tagText,
                  fontSize: 12, fontWeight: 600,
                  padding: "2px 8px", borderRadius: 100,
                }}>
                  {submissions.length}
                </span>
                <ChevronIcon size={16} color={t.textMuted} up={showHistory} />
              </div>
            </button>

            {showHistory && (
              <div style={{
                background: t.surfaceAlt,
                border: `1px solid ${t.border}`,
                borderTop: "none",
                borderRadius: "0 0 12px 12px",
                padding: 16,
                display: "flex", flexDirection: "column", gap: 12,
                boxShadow: t.cardShadow,
              }}>
                {submissions.map((s) => (
                  <div key={s.id} style={{
                    background: t.surface,
                    border: `1px solid ${t.border}`,
                    borderRadius: 10, padding: "14px 16px",
                    animation: "fadeIn 0.2s ease",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 15 }}>{s.nombre}</p>
                        <p style={{ color: t.textMuted, fontSize: 13, marginTop: 2 }}>{s.email}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100,
                          background: mode === "dark" ? priorityColors[s.prioridad].darkBg : priorityColors[s.prioridad].bg,
                          color: mode === "dark" ? priorityColors[s.prioridad].darkText : priorityColors[s.prioridad].text,
                        }}>
                          {s.prioridad.charAt(0).toUpperCase() + s.prioridad.slice(1)}
                        </span>
                        <button
                          onClick={() => deleteEntry(s.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}
                          title="Eliminar"
                        >
                          <TrashIcon size={15} color={t.danger} />
                        </button>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${t.border}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {s.categoria && (
                        <span style={{ fontSize: 12, color: t.textMuted }}>
                          <strong style={{ color: t.text }}>Categoría:</strong> {s.categoria}
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: t.textMuted }}>
                        <strong style={{ color: t.text }}>Fecha:</strong> {s.fecha}
                      </span>
                    </div>
                    {s.mensaje && (
                      <p style={{ marginTop: 8, fontSize: 13, color: t.textMuted, lineHeight: 1.5, fontStyle: "italic" }}>
                        "{s.mensaje.length > 80 ? s.mensaje.substring(0, 80) + "..." : s.mensaje}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
