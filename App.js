import React, { useState, useEffect, useRef } from "react";

// --- Farben, Themes, Backgrounds ---
const asklepiosTheme = {
  name: "Asklepios",
  bg: "#f6fefa",
  primary: "#0b9444",
  accent: "#69c86a",
  font: "'Poppins', Arial, sans-serif",
  dark: false,
};
const themes = [
  asklepiosTheme,
  {
    name: "Classic",
    bg: "#ffffff",
    primary: "#2a6b3d",
    accent: "#9acaaa",
    font: "'Roboto', Arial, sans-serif",
    dark: false,
  },
  {
    name: "Night",
    bg: "#22252a",
    primary: "#b1ffbb",
    accent: "#12b985",
    font: "'Share Tech Mono', monospace",
    dark: true,
  },
];
const backgrounds = [
  { name: "Clean", url: "" },
  {
    name: "Grün Verlauf",
    url: "https://images.unsplash.com/photo-1465101178521-c1a9136a01b2?auto=format&fit=crop&w=800&q=60",
  },
];

// --- Skills, Hilfe-Websites, Textbausteine etc. ---
const skillsList = [
  "Atemübung: 4-7-8",
  "Dankbarkeitstagebuch",
  "Achtsamkeitsübung (Bodyscan)",
  "Stretch & Move",
  "10min Handy aus",
  "Meditation",
  "Kreativ zeichnen",
  "Self-Care Snack",
  "Online-Freundschaft pflegen",
];
const vorlagen = [
  "Ich bin heute stolz auf mich, weil...",
  "Heute habe ich etwas Neues ausprobiert: ...",
  "Ich habe mir Zeit für mich genommen, indem ich...",
  "Ich habe jemandem geholfen und mich dabei gut gefühlt.",
];
const emojiList = [
  { emoji: "😃", label: "Glücklich" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😢", label: "Traurig" },
  { emoji: "😡", label: "Wütend" },
  { emoji: "😱", label: "Ängstlich" },
  { emoji: "🤩", label: "Aufgeregt" },
  { emoji: "🥱", label: "Müde" },
  { emoji: "😞", label: "Enttäuscht" },
];
const hilfeWebsites = [
  { name: "Nummer gegen Kummer", url: "https://www.nummergegenkummer.de/" },
  {
    name: "KJP Harburg (Asklepios)",
    url: "https://www.asklepios.com/harburg/abteilungen-spezialistinnen/abteilungen/kjpp",
  },
  { name: "JugendNotmail", url: "https://jugendnotmail.de/" },
  { name: "krisenchat.de", url: "https://krisenchat.de/" },
];
const dsHinweis =
  "Hey! Alles, was du hier machst, bleibt auf deinem Gerät. Keine Cloud, kein Tracking, keine Werbung. Dein Kompass = deine Daten. 🚀";

// --- Onboarding-Modal (Anleitung beim 1. Start) ---
function OnboardingModal({ onClose }) {
  return (
    <div className="ds-modal">
      <div className="ds-box" style={{ maxWidth: 500, textAlign: "left" }}>
        <h2>Willkommen bei Kompass!</h2>
        <ul style={{ lineHeight: 1.6 }}>
          <li>
            <b>„Mein Kompass“:</b> Digitales Tagebuch, Ziele, Erfolge,
            Symptomtagebuch & Stimmungskalender.
          </li>
          <li>
            <b>Skills:</b> Viele Ideen, wie du dich beruhigen oder stärken
            kannst – du kannst eigene Word-Dateien hochladen.
          </li>
          <li>
            <b>Designs:</b> Passe Farben & Aussehen an, wie du willst.
          </li>
          <li>
            <b>Notfall:</b> Soforthilfe, Telefonnummern & Links – du bist nie
            allein.
          </li>
          <li>
            <b>Guide:</b> Tipps, wie du nach der Klinik eine:n
            Psychotherapeut:in findest.
          </li>
          <li>
            <b>Chatbot:</b> Hier kannst du anonym schreiben & ausprobieren (Demo
            – kein echter Mensch!)
          </li>
          <li>
            Über die Sidebar wechselst du Funktionen. Du kannst die wichtigsten
            als „Kachel“ direkt auf den Homescreen holen.
          </li>
        </ul>
        <button onClick={onClose}>Los geht’s!</button>
      </div>
    </div>
  );
}

// --- Sidebar ---
function Sidebar({ items, current, setCurrent, isOpen, setIsOpen }) {
  return (
    <nav aria-label="Hauptmenü" className={`sidebar${isOpen ? " open" : ""}`}>
      <button
        className="sidebar-toggle-mobile"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menü öffnen/schließen"
      >
        {isOpen ? "✖" : "☰"}
      </button>
      <div>
        {isOpen &&
          items.map((item) => (
            <button
              key={item.key}
              className={current === item.key ? "active" : ""}
              onClick={() => {
                setCurrent(item.key);
                setIsOpen(false);
              }}
              aria-label={item.label}
            >
              <span className="icon-gradient">{item.icon}</span>
              <span className="txt">{item.label}</span>
            </button>
          ))}
      </div>
    </nav>
  );
}

// --- QuickAccess/Kacheln auf Homescreen ---
function QuickAccess({ items, quickItems, setCurrent }) {
  return (
    <div className="quickaccess">
      {quickItems.map((key) => {
        const item = items.find((i) => i.key === key);
        if (!item) return null;
        return (
          <button
            key={key}
            className="quick-btn"
            onClick={() => setCurrent(item.key)}
            aria-label={item.label}
          >
            <span className="icon-gradient">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// --- HomeScreen ---
function HomeScreen({
  username,
  setUsername,
  quickItems,
  setQuickEdit,
  allItems,
  setCurrent,
}) {
  const [editName, setEditName] = useState(false);
  const [inputName, setInputName] = useState(username || "");
  function handleSaveName() {
    setUsername(inputName.trim());
    setEditName(false);
    localStorage.setItem("kompass_username", inputName.trim());
  }
  return (
    <div className="card homecard">
      <div className="moving-bg" />
      <div style={{ position: "relative", zIndex: 2 }}>
        <h1 style={{ fontSize: "2.2em", marginBottom: 10 }}>
          Willkommen bei Kompass
        </h1>
        <div style={{ marginBottom: 12, fontSize: "1.14em", color: "#2a6b3d" }}>
          Deine App für den Alltag nach der Klinik.
          <br />
          Skills, Pläne, Chatbot & Hilfe bei Krisen – immer für dich da.
          <br />
          <b>Dein digitaler Kompass – bleib auf Kurs!</b>
        </div>
        <div style={{ marginBottom: 16 }}>
          {username ? (
            <span style={{ fontSize: "1.13em" }}>
              Hey <b>{username}</b>!{" "}
              <button
                className="edit-name"
                onClick={() => setEditName(true)}
                title="Namen ändern"
              >
                ✏️
              </button>
            </span>
          ) : (
            <button className="edit-name" onClick={() => setEditName(true)}>
              Namen eingeben?
            </button>
          )}
        </div>
        {editName && (
          <div className="name-modal">
            <input
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              maxLength={16}
              autoFocus
              placeholder="Dein Vorname"
            />
            <button onClick={handleSaveName}>Speichern</button>
          </div>
        )}
        <QuickAccess
          items={allItems}
          quickItems={quickItems}
          setCurrent={setCurrent}
        />
        <div style={{ marginTop: 18 }}>
          <button onClick={() => setQuickEdit(true)}>
            Funktionen für Homescreen auswählen
          </button>
        </div>
      </div>
    </div>
  );
}

// --- QuickEdit: Homescreen-Kacheln wählen ---
function QuickEdit({ quickItems, setQuickItems, allItems, onBack }) {
  function toggleQuick(key) {
    setQuickItems(
      quickItems.includes(key)
        ? quickItems.filter((f) => f !== key)
        : [...quickItems, key]
    );
  }
  return (
    <div className="card" style={{ maxWidth: 500, margin: "0 auto" }}>
      <button className="back-btn" onClick={onBack}>
        ←
      </button>
      <h2>Funktionen für Home auswählen</h2>
      <ul>
        {allItems
          .filter((i) => i.key !== "home" && i.key !== "quickedit")
          .map((item) => (
            <li key={item.key}>
              <label>
                <input
                  type="checkbox"
                  checked={quickItems.includes(item.key)}
                  onChange={() => toggleQuick(item.key)}
                />
                {item.icon} {item.label}
              </label>
            </li>
          ))}
      </ul>
      <button onClick={onBack}>Zurück</button>
    </div>
  );
}

// --- Kompass: Digitales Tagebuch, Ziele, Erfolge, Symptomtagebuch ---
function DeinWeg({
  goals,
  setGoals,
  achievements,
  setAchievements,
  calendarNotes,
  setCalendarNotes,
  symptome,
  setSymptome,
  shareErfolg,
  showReminder,
}) {
  const [goalInput, setGoalInput] = useState("");
  const [erfolgInput, setErfolgInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [emoji, setEmoji] = useState("");
  const [noteText, setNoteText] = useState("");
  const [symptomScore, setSymptomScore] = useState(
    () => symptome[selectedDate] || 0
  );

  const addGoal = () => {
    if (goalInput.trim())
      setGoals([...goals, { text: goalInput, done: false }]);
    setGoalInput("");
  };
  const toggleGoal = (i) =>
    setGoals(goals.map((g, idx) => (idx === i ? { ...g, done: !g.done } : g)));
  const addErfolg = () => {
    if (erfolgInput.trim())
      setAchievements([
        { text: erfolgInput, date: new Date().toISOString().split("T")[0] },
        ...achievements,
      ]);
    setErfolgInput("");
  };

  useEffect(() => {
    const note = calendarNotes[selectedDate] || { emoji: "", text: "" };
    setEmoji(note.emoji);
    setNoteText(note.text);
    setSymptomScore(symptome[selectedDate] || 0);
  }, [selectedDate, calendarNotes, symptome]);
  const saveNote = () => {
    const u = { ...calendarNotes, [selectedDate]: { emoji, text: noteText } };
    setCalendarNotes(u);
    localStorage.setItem("kompass_calendar_notes", JSON.stringify(u));
    const us = { ...symptome, [selectedDate]: symptomScore };
    setSymptome(us);
    localStorage.setItem("kompass_symptome", JSON.stringify(us));
  };

  return (
    <div className="card">
      <h2>Mein Kompass</h2>
      {showReminder && (
        <div className="reminder">
          Ziel für heute: Was möchtest du schaffen? 🚩
        </div>
      )}
      <div className="section">
        <h3>Symptom-Tagebuch</h3>
        <label>
          Datum:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <div style={{ margin: "7px 0 10px 0" }}>
          <label>
            Wie stark waren deine Symptome heute? (0=gar nicht, 10=sehr stark)
          </label>
          <br />
          <input
            type="range"
            min={0}
            max={10}
            value={symptomScore}
            onChange={(e) => setSymptomScore(Number(e.target.value))}
            style={{ width: "90%" }}
          />{" "}
          <span style={{ minWidth: 30, display: "inline-block" }}>
            {symptomScore}
          </span>
        </div>
        <div className="emoji-row">
          {emojiList.map((em) => (
            <span
              key={em.emoji}
              className={emoji === em.emoji ? "active" : ""}
              onClick={() => setEmoji(em.emoji)}
              title={em.label}
              aria-label={em.label}
            >
              {em.emoji}
            </span>
          ))}
        </div>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Wie ging es dir heute? Was war auffällig?"
        />
        <button onClick={saveNote}>Speichern</button>
      </div>
      <div className="section">
        <h3>Ziele</h3>
        <div className="form-row">
          <input
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="Neues Ziel..."
          />
          <button aria-label="Ziel hinzufügen" onClick={addGoal}>
            +
          </button>
        </div>
        <ul>
          {goals.map((g, i) => (
            <li key={i} className={g.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={g.done}
                onChange={() => toggleGoal(i)}
              />{" "}
              {g.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h3>
          Erfolge <span style={{ fontSize: "80%" }}>(teilen möglich)</span>
        </h3>
        <div className="templates">
          {vorlagen.map((v, i) => (
            <button
              key={i}
              className="template-btn"
              onClick={() => setErfolgInput(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="form-row">
          <input
            value={erfolgInput}
            onChange={(e) => setErfolgInput(e.target.value)}
            placeholder="Erfolg heute?"
          />
          <button onClick={addErfolg}>+</button>
        </div>
        <ul>
          {achievements.map((a, i) => (
            <li key={i}>
              {a.date}: {a.text}{" "}
              <button className="share-btn" onClick={() => shareErfolg(a)}>
                Teilen
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- Skills inkl. Achtsamkeit & Word-Upload ---
function Skills({ shareSkill, wordFiles, setWordFiles }) {
  const [done, setDone] = useState(
    () => JSON.parse(localStorage.getItem("kompass_skills_done")) || {}
  );
  useEffect(() => {
    localStorage.setItem("kompass_skills_done", JSON.stringify(done));
  }, [done]);
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setWordFiles([
      ...wordFiles,
      { name: file.name, url: URL.createObjectURL(file) },
    ]);
  }
  return (
    <div className="card">
      <h2>Skills & Achtsamkeit</h2>
      <ul>
        {skillsList.map((s, i) => (
          <li
            key={i}
            className={done[i] ? "done" : ""}
            onClick={() => setDone((prev) => ({ ...prev, [i]: !prev[i] }))}
          >
            {s}{" "}
            <button className="share-btn" onClick={() => shareSkill(s)}>
              Teilen
            </button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 14 }}>
        <label>
          Persönliche Skills/Pläne als Word-Dokument hochladen:
          <input
            type="file"
            accept=".doc,.docx,application/msword"
            onChange={handleFile}
            style={{ display: "block", marginTop: 7 }}
          />
        </label>
        <ul>
          {wordFiles.map((f, i) => (
            <li key={i}>
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                {f.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// --- Designs & Themes ---
function Designs({ theme, setTheme, background, setBackground }) {
  return (
    <div className="card info-card">
      <h2>Designs & Themes</h2>
      <div className="control-group">
        <label>Theme:</label>
        <select
          value={theme.name}
          onChange={(e) =>
            setTheme(themes.find((t) => t.name === e.target.value))
          }
        >
          {themes.map((t) => (
            <option key={t.name}>{t.name}</option>
          ))}
        </select>
      </div>
      <div className="control-group">
        <label>Hintergrund:</label>
        <div className="bg-options">
          {backgrounds.map((bg) => (
            <button
              key={bg.name}
              className={background.name === bg.name ? "selected" : ""}
              style={{ backgroundImage: bg.url ? `url(${bg.url})` : "none" }}
              onClick={() => setBackground(bg)}
              title={bg.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Notfall inkl. Websites ---
function Notfall() {
  return (
    <div className="card notfall-card">
      <h2>Notfall / Hilfe</h2>
      <div className="contact-list">
        <a href="tel:116111">📞 116111 Jugendtelefon</a>
        <a href="tel:08001110111">📞 0800 111 0 111 Telefonseelsorge</a>
        <a href="tel:112">🚑 112 Notruf</a>
      </div>
      <div
        style={{
          margin: "18px 0 10px 0",
          fontWeight: "bold",
          color: "#0b9444",
        }}
      >
        Websites & Hilfe:
      </div>
      <ul>
        {hilfeWebsites.map((h) => (
          <li key={h.url}>
            <a href={h.url} target="_blank" rel="noopener noreferrer">
              {h.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="invite-friends">
        <p>
          Freunde einladen:{" "}
          <input
            readOnly
            value={window.location.href}
            onFocus={(e) => e.target.select()}
            style={{ width: "80%" }}
          />{" "}
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            📋
          </button>
        </p>
      </div>
    </div>
  );
}

// --- Guide: Therapeuten finden ---
function Guide({ onBack }) {
  return (
    <div className="card info-card">
      <button className="back-btn" onClick={onBack}>
        ←
      </button>
      <h2>Psychotherapeut:in finden (nach der Klinik)</h2>
      <ol>
        <li>
          <b>Online-Suche:</b> Portale wie{" "}
          <a
            href="https://www.therapie.de/psychotherapie/"
            target="_blank"
            rel="noopener noreferrer"
          >
            therapie.de
          </a>{" "}
          oder{" "}
          <a
            href="https://www.kbv.de/html/arztsuche.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            KBV-Arztsuche
          </a>
          .
        </li>
        <li>
          Bei deiner Krankenkasse nachfragen (viele haben Listen & Hotlines).
        </li>
        <li>
          Direkt Praxen anrufen und nach freien Plätzen & Wartelisten fragen.
        </li>
        <li>
          Sprich mit dem Sozialdienst der Klinik, ob es Empfehlungen gibt.
        </li>
        <li>
          Nutze Notfall-Angebote, falls du schnell Unterstützung brauchst!
        </li>
      </ol>
      <p>
        Wenn du Hilfe brauchst, sprich immer mit Vertrauenspersonen oder melde
        dich in der Klinik.
      </p>
    </div>
  );
}

// --- Chatbot (Dummy-Komponente) ---
function Chatbot({ onBack }) {
  return (
    <div className="card info-card">
      <button className="back-btn" onClick={onBack}>
        ←
      </button>
      <h2>Chatbot (Demo)</h2>
      <p>
        Hier könntest du in einer echten App anonym schreiben oder Skills/Tipps
        bekommen.
        <br />
        In dieser Demo ist der Chat nur eine Platzhalterfunktion.
      </p>
      <p>
        <i>(Für echte Krisen immer mit echten Menschen sprechen!)</i>
      </p>
    </div>
  );
}

// --- Datenschutz-Modal ---
function DatenschutzModal({ onClose }) {
  return (
    <div className="ds-modal">
      <div className="ds-box">
        <p>{dsHinweis}</p>
        <button onClick={onClose}>Alles klar 👍</button>
      </div>
    </div>
  );
}

// --- Styles als Komponente (einmalig ins <head>) ---
function GlobalStyle() {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
      html, body { min-height:100%; }
      body { margin:0; padding:0; transition:background .5s; font-family:'Poppins',Arial,sans-serif; }
      .sidebar { width:220px; background:#f5fdfa; color:#105b2f; padding:8px; position:fixed; height:100vh; top:0; left:-220px; z-index:20; transition:left .33s cubic-bezier(.6,1.6,.4,1); box-shadow:0 2px 18px #0b944422; }
      .sidebar.open { left:0; animation:sidebarPop .2s; }
      .sidebar-toggle-mobile { display:block; position:fixed; top:13px; left:13px; width:44px; height:44px; border-radius:50%; background:#0b9444; color:#fff; border:none; font-size:25px; z-index:101; box-shadow:0 2px 12px #0b944422; }
      .sidebar button { width:100%; margin-bottom:8px; background:transparent; border:none; color:inherit; font-size:18px; text-align:left; cursor:pointer; padding:10px 17px; border-radius:8px; transition:background .13s, transform .12s cubic-bezier(.33,1.5,.68,1);}
      .sidebar button.active, .sidebar button:hover { background:rgba(11,148,68,0.12); color:#0b9444; }
      .main-area { min-height:100vh; min-width:0; transition:background .6s; padding:18px 3vw 34px 3vw; margin-left:0;}
      .card { background:rgba(255,255,255,0.97); border-radius:15px; padding:22px 15px; margin-bottom:26px; box-shadow:0 8px 32px #0b944419; position:relative;}
      .homecard { min-height:340px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:inherit; color:#1d1d1d; position:relative; overflow:hidden;}
      .moving-bg { position:absolute; inset:0; z-index:1; pointer-events:none; background:linear-gradient(120deg, #adf6bb 0%, #0b9444 33%, #e0f7fa 100%); opacity:.11; filter:blur(26px); animation:bgmove 8s ease-in-out infinite alternate;}
      @keyframes bgmove { 0%{background-position:0% 50%;} 100%{background-position:100% 50%;} }
      .edit-name { background:none; border:none; font-size:1em; margin-left:7px; cursor:pointer; }
      .name-modal { background:#fff; border-radius:12px; box-shadow:0 8px 32px #adf6bb33; padding:17px 19px; position:absolute; left:50%; top:65px; transform:translateX(-50%); z-index:5;}
      .quickaccess { display:flex; gap:17px; justify-content:center; margin:19px 0; flex-wrap:wrap;}
      .quick-btn { background:rgba(11,148,68,0.10); border:none; border-radius:14px; padding:11px 14px; font-size:17px; display:flex; flex-direction:column; align-items:center; box-shadow:0 0 10px #0b944417; cursor:pointer; position:relative; transition:box-shadow .15s, transform .12s;}
      .quick-btn:active { transform: scale(1.09);}
      .control-group { margin:15px 0; display:flex; align-items:center; gap:14px;}
      .bg-options { display:flex; gap:8px;}
      .bg-options .selected { border:2px solid #0b9444;}
      .upload-btn { background:rgba(0,0,0,0.03); border-radius:8px; padding:7px; cursor:pointer;}
      .form-row { display:flex; gap:9px; margin-bottom:13px;}
      input, select, textarea { flex:1; padding:10px; border:1px solid #bde4cf; border-radius:8px; font-family:inherit; font-size:1em;}
      button { background:#0b9444; color:#fff; border:none; padding:8px 13px; border-radius:8px; cursor:pointer; font-size:16px; font-family:inherit; transition:background .13s;}
      button:hover { opacity:0.93; }
      .section { margin-bottom:22px;}
      .templates { display:flex; gap:9px; flex-wrap:wrap; margin-bottom:8px;}
      .template-btn { background:#e2f4ea; border:none; padding:7px 11px; border-radius:6px; cursor:pointer; color:#0b9444; }
      ul { padding:0; list-style:none; }
      li { margin-bottom:7px;}
      li.done { text-decoration:line-through; color:#888; }
      .emoji-row { display:flex; gap:9px; margin:9px 0; }
      .emoji-row .active { border:2px solid #0b9444; border-radius:50%; }
      .notfall-card { background:#e9fff4; }
      .contact-list { display:flex; flex-direction:column; gap:9px; }
      .contact-list a { color:#0b9444; font-weight:bold; text-decoration:none; }
      .invite-friends { margin-top:18px; }
      .invite-friends input { font-size:1em; }
      .share-btn { font-size:12px; margin-left:8px; background:#b7ffd0; color:#165b3a; }
      .reminder { background:#e2ffe4; padding:8px 14px; border-radius:10px; font-weight:bold; color:#0b9444; margin-bottom:13px;}
      .ds-modal { position:fixed; inset:0; background:rgba(0,0,0,0.18); display:flex; align-items:center; justify-content:center; z-index:1000;}
      .ds-box { background:#fff; border-radius:18px; padding:29px 23px; box-shadow:0 4px 30px #b7ffd044; max-width:370px; text-align:center;}
      .back-btn { background:#f5fdfa; color:#0b9444; border:1px solid #bde4cf; border-radius:50%; font-size:22px; width:36px; height:36px; position:absolute; left:12px; top:12px; cursor:pointer;}
      /* Focus Accessibility */
      :focus-visible { outline: 3px solid #0b9444; outline-offset: 2px; }
      /* --- MOBILE FIRST --- */
      @media (max-width:900px){
        .main-area { padding:7vw 2vw 36px 2vw; }
        .card { padding:11px 7px; }
        .sidebar { width: 80vw; left: -80vw; }
        .sidebar.open { left: 0; }
      }
      @media (max-width:600px){
        .main-area { padding:4vw 1vw 20vw 1vw; }
        .quick-btn, .fav-tile { font-size: 15px; padding: 9px 6px; min-width: 84px;}
        .sidebar { width:100vw; left: -100vw; }
        .sidebar.open { left: 0; }
      }
      @media (max-width:480px){
        .main-area { padding:2vw 1vw 13vw 1vw; }
        .sidebar-toggle-mobile { left:7px; top:7px; width:39px; height:39px;}
      }
      @keyframes sidebarPop { from { transform: scale(.97);} to { transform: scale(1);}}
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);
  return null;
}

// --- App Root ---
export default function App() {
  // State
  const [sidebarItems] = useState([
    { key: "home", label: "Home", icon: "🏠" },
    { key: "deinweg", label: "Mein Kompass", icon: "🧭" },
    { key: "skills", label: "Skills & Achtsamkeit", icon: "✨" },
    { key: "designs", label: "Designs", icon: "🎨" },
    { key: "notfall", label: "Notfall", icon: "🚨" },
    { key: "guide", label: "Guide", icon: "ℹ️" },
    { key: "chat", label: "Chatbot", icon: "💬" },
    { key: "quickedit", label: "Homescreen anpassen", icon: "🛠️" },
  ]);
  const [theme, setTheme] = useState(() => asklepiosTheme);
  const [background, setBackground] = useState(() => backgrounds[0]);
  const [current, setCurrent] = useState("home");
  const [favorites, setFavorites] = useState(
    () =>
      JSON.parse(localStorage.getItem("kompass_favorites")) || [
        "deinweg",
        "skills",
      ]
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem("kompass_username") || ""
  );
  const [goals, setGoals] = useState(
    () => JSON.parse(localStorage.getItem("kompass_goals")) || []
  );
  const [achievements, setAchievements] = useState(
    () => JSON.parse(localStorage.getItem("kompass_achievements")) || []
  );
  const [calendarNotes, setCalendarNotes] = useState(
    () => JSON.parse(localStorage.getItem("kompass_calendar_notes")) || {}
  );
  const [symptome, setSymptome] = useState(
    () => JSON.parse(localStorage.getItem("kompass_symptome")) || {}
  );
  const [wordFiles, setWordFiles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDS, setShowDS] = useState(
    () => !localStorage.getItem("kompass_ds_accepted")
  );
  const [onboarding, setOnboarding] = useState(
    () => !localStorage.getItem("kompass_onboarding")
  );
  const [showGuide, setShowGuide] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [quickEdit, setQuickEdit] = useState(false);

  // Persistenz
  useEffect(() => {
    localStorage.setItem("kompass_favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem("kompass_username", username);
  }, [username]);
  useEffect(() => {
    localStorage.setItem("kompass_goals", JSON.stringify(goals));
  }, [goals]);
  useEffect(() => {
    localStorage.setItem("kompass_achievements", JSON.stringify(achievements));
  }, [achievements]);
  useEffect(() => {
    localStorage.setItem(
      "kompass_calendar_notes",
      JSON.stringify(calendarNotes)
    );
  }, [calendarNotes]);
  useEffect(() => {
    localStorage.setItem("kompass_symptome", JSON.stringify(symptome));
  }, [symptome]);
  useEffect(() => {
    if (!showDS) localStorage.setItem("kompass_ds_accepted", "1");
  }, [showDS]);
  useEffect(() => {
    if (!onboarding) localStorage.setItem("kompass_onboarding", "1");
  }, [onboarding]);

  // Share
  function shareErfolg(e) {
    if (navigator.share)
      navigator.share({
        title: "Erfolg",
        text: `${e.text} (${e.date})`,
        url: window.location.href,
      });
    else alert("Teilen nicht unterstützt.");
  }
  function shareSkill(s) {
    if (navigator.share)
      navigator.share({ title: "Skill", text: s, url: window.location.href });
    else alert("Teilen nicht unterstützt.");
  }

  // Main Views Logic
  function handleSidebarNav(key) {
    setCurrent(key);
    setIsSidebarOpen(false);
    setShowGuide(key === "guide");
    setShowChat(key === "chat");
    setQuickEdit(key === "quickedit");
  }

  // AppViews: Routing
  const appViews = {
    home: (
      <HomeScreen
        username={username}
        setUsername={setUsername}
        quickItems={favorites}
        setQuickEdit={setQuickEdit}
        allItems={sidebarItems}
        setCurrent={setCurrent}
      />
    ),
    deinweg: (
      <DeinWeg
        goals={goals}
        setGoals={setGoals}
        achievements={achievements}
        setAchievements={setAchievements}
        calendarNotes={calendarNotes}
        setCalendarNotes={setCalendarNotes}
        symptome={symptome}
        setSymptome={setSymptome}
        shareErfolg={shareErfolg}
        showReminder={goals.length > 0 && !goals.some((g) => g.done)}
      />
    ),
    skills: (
      <Skills
        shareSkill={shareSkill}
        wordFiles={wordFiles}
        setWordFiles={setWordFiles}
      />
    ),
    designs: (
      <Designs
        theme={theme}
        setTheme={setTheme}
        background={background}
        setBackground={setBackground}
      />
    ),
    notfall: <Notfall />,
    guide: <Guide onBack={() => setCurrent("home")} />,
    chat: <Chatbot onBack={() => setCurrent("home")} />,
    quickedit: (
      <QuickEdit
        quickItems={favorites}
        setQuickItems={setFavorites}
        allItems={sidebarItems}
        onBack={() => setCurrent("home")}
      />
    ),
  };

  // Theme
  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.fontFamily = theme.font;
    document.body.style.color = theme.dark ? "#fff" : "#222";
  }, [theme]);

  return (
    <div>
      <GlobalStyle />
      <Sidebar
        items={sidebarItems}
        current={current}
        setCurrent={handleSidebarNav}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main
        className="main-area"
        style={{
          background: background.url
            ? `url(${background.url}) center/cover`
            : theme.bg,
          minHeight: "100vh",
        }}
      >
        {quickEdit ? appViews.quickedit : appViews[current]}
      </main>
      {showDS && <DatenschutzModal onClose={() => setShowDS(false)} />}
      {onboarding && <OnboardingModal onClose={() => setOnboarding(false)} />}
    </div>
  );
}
