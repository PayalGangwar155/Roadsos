import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --bg: #080a0f;
    --bg2: #0d1018;
    --surface: #111520;
    --surface2: #161b28;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --red: #ff3b3b;
    --red2: #ff6060;
    --red-glow: rgba(255,59,59,0.18);
    --amber: #f59e0b;
    --amber-glow: rgba(245,158,11,0.15);
    --green: #10b981;
    --green-glow: rgba(16,185,129,0.15);
    --blue: #3b82f6;
    --blue-glow: rgba(59,130,246,0.15);
    --text: #f1f5f9;
    --muted: #64748b;
    --muted2: #94a3b8;
  }

  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    background: var(--bg);
    overflow: hidden;
  }

  /* ── Noise texture overlay ── */
  .app::before {
    content:'';
    position:fixed;
    inset:0;
    max-width:430px;
    margin:auto;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events:none;
    z-index:999;
    opacity:.5;
  }

  /* ── Ambient glow ── */
  .ambient {
    position:fixed;
    width:340px; height:340px;
    border-radius:50%;
    filter:blur(90px);
    pointer-events:none;
    transition: all 1.2s ease;
  }
  .ambient-red { background: radial-gradient(circle, rgba(255,59,59,0.13) 0%, transparent 70%); top:-80px; left:-60px; }
  .ambient-blue { background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%); bottom:100px; right:-80px; }

  /* ── Status bar ── */
  .status-bar {
    display:flex; align-items:center; justify-content:space-between;
    padding: 14px 22px 8px;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted2);
    letter-spacing: 0.02em;
  }
  .status-time { font-family:'Syne',sans-serif; font-weight:700; font-size:15px; color:var(--text); }
  .status-icons { display:flex; gap:6px; align-items:center; }

  /* ── Header ── */
  .header {
    padding: 12px 22px 0;
    display:flex; align-items:center; justify-content:space-between;
  }
  .logo-wrap { display:flex; align-items:center; gap:10px; }
  .logo-icon {
    width:36px; height:36px; border-radius:10px;
    background: linear-gradient(135deg, #ff3b3b, #cc0000);
    display:flex; align-items:center; justify-content:center;
    font-size:18px;
    box-shadow: 0 0 18px rgba(255,59,59,0.4);
  }
  .logo-text { font-family:'Syne',sans-serif; font-weight:800; font-size:18px; letter-spacing:-.02em; }
  .logo-text span { color:var(--red); }
  .header-right { display:flex; align-items:center; gap:10px; }
  .notif-btn {
    width:36px; height:36px; border-radius:50%;
    border: 1px solid var(--border2);
    background: var(--surface);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; position:relative;
    transition: all 0.2s;
  }
  .notif-btn:hover { background:var(--surface2); }
  .notif-dot {
    position:absolute; top:7px; right:8px;
    width:7px; height:7px; border-radius:50%;
    background:var(--red);
    box-shadow: 0 0 6px var(--red);
    border: 1.5px solid var(--bg);
  }
  .avatar {
    width:36px; height:36px; border-radius:50%;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-weight:700; font-size:13px;
    border: 2px solid var(--border2);
    cursor:pointer;
  }

  /* ── Greeting ── */
  .greeting-section { padding: 18px 22px 4px; }
  .greeting-sub { font-size:13px; color:var(--muted); font-weight:400; letter-spacing:.02em; }
  .greeting-name { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:var(--text); margin-top:2px; }

  /* ── Live status pill ── */
  .live-pill {
    display: inline-flex; align-items:center; gap:7px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.25);
    border-radius:20px; padding:5px 12px;
    margin-top:12px;
    font-size:12px; color:var(--green); font-weight:500;
  }
  .live-dot {
    width:7px; height:7px; border-radius:50%;
    background:var(--green);
    box-shadow: 0 0 8px var(--green);
    animation: pulse-green 1.5s ease-in-out infinite;
  }
  @keyframes pulse-green {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:.5; transform:scale(1.3); }
  }

  /* ── SOS Card ── */
  .sos-card {
    margin: 18px 22px;
    border-radius: 24px;
    background: linear-gradient(145deg, #1a0505 0%, #120000 100%);
    border: 1px solid rgba(255,59,59,0.25);
    padding: 24px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .sos-card:hover { transform:scale(1.01); box-shadow: 0 8px 40px rgba(255,59,59,0.2); }
  .sos-card:active { transform:scale(0.98); }
  .sos-card-bg {
    position:absolute; inset:0;
    background: radial-gradient(ellipse at 70% 50%, rgba(255,59,59,0.12) 0%, transparent 65%);
    pointer-events:none;
  }
  .sos-card-grid {
    position:absolute; inset:0;
    background-image: linear-gradient(rgba(255,59,59,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,59,59,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events:none;
  }
  .sos-label { font-size:11px; font-weight:600; letter-spacing:.12em; color:var(--red2); text-transform:uppercase; margin-bottom:6px; }
  .sos-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; line-height:1.1; color:white; }
  .sos-desc { font-size:13px; color:rgba(255,255,255,0.45); margin-top:8px; line-height:1.5; max-width:200px; }
  .sos-btn {
    display:inline-flex; align-items:center; gap:8px;
    margin-top:20px;
    background: linear-gradient(135deg, #ff3b3b, #cc0000);
    border:none; border-radius:14px;
    padding: 12px 20px;
    font-family:'Syne',sans-serif; font-size:14px; font-weight:700;
    color:white; cursor:pointer;
    box-shadow: 0 4px 20px rgba(255,59,59,0.45);
    transition: all 0.2s;
  }
  .sos-btn:hover { box-shadow: 0 6px 28px rgba(255,59,59,0.6); transform:translateY(-1px); }
  .sos-illustration {
    position:absolute; right:16px; top:50%; transform:translateY(-50%);
    width:100px; height:100px;
    opacity:0.6;
    font-size:80px;
    display:flex; align-items:center; justify-content:center;
    filter: drop-shadow(0 0 20px rgba(255,59,59,0.5));
  }
  .sos-ring {
    position:absolute; right:8px; top:50%; transform:translateY(-50%);
    width:120px; height:120px; border-radius:50%;
    border: 1px solid rgba(255,59,59,0.2);
    animation: ring-pulse 2s ease-out infinite;
  }
  .sos-ring2 {
    position:absolute; right:-4px; top:50%; transform:translateY(-50%);
    width:144px; height:144px; border-radius:50%;
    border: 1px solid rgba(255,59,59,0.1);
    animation: ring-pulse 2s ease-out 0.5s infinite;
  }
  @keyframes ring-pulse {
    0% { opacity:1; transform:translateY(-50%) scale(0.8); }
    100% { opacity:0; transform:translateY(-50%) scale(1.2); }
  }

  /* ── Quick Actions ── */
  .section-header {
    display:flex; align-items:center; justify-content:space-between;
    padding: 0 22px; margin-top:6px;
  }
  .section-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:var(--text); }
  .section-link { font-size:12px; color:var(--muted); cursor:pointer; transition:color 0.2s; }
  .section-link:hover { color:var(--red2); }

  .quick-grid {
    display:grid; grid-template-columns: repeat(4,1fr);
    gap:10px; padding: 12px 22px;
  }
  .quick-item {
    display:flex; flex-direction:column; align-items:center; gap:8px;
    cursor:pointer;
    transition: transform 0.2s;
  }
  .quick-item:hover { transform:translateY(-2px); }
  .quick-item:hover .quick-icon { box-shadow: var(--qi-glow); }
  .quick-icon {
    width:54px; height:54px; border-radius:16px;
    background: var(--surface);
    border: 1px solid var(--border);
    display:flex; align-items:center; justify-content:center;
    font-size:22px;
    transition: all 0.2s;
    position:relative; overflow:hidden;
  }
  .quick-icon::before {
    content:'';
    position:absolute; inset:0;
    background: var(--qi-color);
    opacity:0.08;
  }
  .quick-label { font-size:11px; color:var(--muted2); font-weight:500; text-align:center; line-height:1.2; }

  /* ── Nearby Services ── */
  .nearby-scroll {
    display:flex; gap:12px;
    padding: 12px 22px;
    overflow-x:auto; scrollbar-width:none;
  }
  .nearby-scroll::-webkit-scrollbar { display:none; }

  .nearby-card {
    flex-shrink:0; width:150px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius:18px;
    padding:14px;
    cursor:pointer;
    transition: all 0.2s;
    position:relative; overflow:hidden;
  }
  .nearby-card:hover { border-color: var(--border2); transform:translateY(-2px); }
  .nearby-card-icon { font-size:26px; margin-bottom:8px; }
  .nearby-card-name { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--text); line-height:1.2; }
  .nearby-card-dist { font-size:11px; color:var(--muted); margin-top:3px; }
  .nearby-card-badge {
    position:absolute; top:10px; right:10px;
    background: rgba(16,185,129,0.15);
    border: 1px solid rgba(16,185,129,0.3);
    border-radius:8px; padding:2px 7px;
    font-size:10px; color:var(--green); font-weight:600;
  }
  .nearby-card-rating { display:flex; align-items:center; gap:4px; margin-top:8px; font-size:11px; color:var(--muted2); }

  /* ── Recent / Activity ── */
  .activity-list { padding: 10px 22px; display:flex; flex-direction:column; gap:10px; }
  .activity-item {
    display:flex; align-items:center; gap:14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius:16px; padding:14px;
    cursor:pointer; transition:all 0.2s;
  }
  .activity-item:hover { border-color:var(--border2); background:var(--surface2); }
  .activity-icon {
    width:42px; height:42px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:18px; flex-shrink:0;
  }
  .activity-info { flex:1; }
  .activity-title { font-size:14px; font-weight:500; color:var(--text); }
  .activity-sub { font-size:12px; color:var(--muted); margin-top:2px; }
  .activity-meta { display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
  .activity-time { font-size:11px; color:var(--muted); }
  .activity-status {
    font-size:10px; font-weight:600; padding:2px 8px; border-radius:8px;
  }

  /* ── Map Teaser ── */
  .map-teaser {
    margin: 6px 22px 4px;
    border-radius:20px; overflow:hidden;
    border: 1px solid var(--border);
    position:relative; height:130px; cursor:pointer;
    transition:all 0.2s;
  }
  .map-teaser:hover { border-color:var(--border2); }
  .map-bg {
    position:absolute; inset:0;
    background: linear-gradient(135deg, #0d1a2e 0%, #0a1520 100%);
  }
  .map-grid {
    position:absolute; inset:0;
    background-image: linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
    background-size: 22px 22px;
  }
  .map-road-h {
    position:absolute; left:0; right:0; height:2px;
    background: rgba(59,130,246,0.2);
  }
  .map-road-v {
    position:absolute; top:0; bottom:0; width:2px;
    background: rgba(59,130,246,0.2);
  }
  .map-pin {
    position:absolute; transform:translate(-50%,-50%);
    display:flex; align-items:center; justify-content:center;
  }
  .map-pin-dot {
    width:12px; height:12px; border-radius:50%;
    background:var(--red);
    box-shadow: 0 0 14px rgba(255,59,59,0.7);
    animation: map-pulse 2s ease-in-out infinite;
  }
  .map-pin-ring {
    position:absolute;
    width:26px; height:26px; border-radius:50%;
    border: 1.5px solid rgba(255,59,59,0.4);
    animation: map-ring 2s ease-out infinite;
  }
  @keyframes map-pulse {
    0%,100% { transform:scale(1); }
    50% { transform:scale(1.15); }
  }
  @keyframes map-ring {
    0% { opacity:1; transform:scale(0.7); }
    100% { opacity:0; transform:scale(1.5); }
  }
  .map-overlay {
    position:absolute; inset:0;
    background: linear-gradient(to right, rgba(8,10,15,0) 0%, rgba(8,10,15,0.6) 100%);
  }
  .map-cta {
    position:absolute; right:16px; top:50%; transform:translateY(-50%);
    background: var(--blue);
    border-radius:12px; padding:10px 14px;
    font-family:'Syne',sans-serif; font-size:12px; font-weight:700;
    color:white; cursor:pointer;
    box-shadow: 0 4px 16px rgba(59,130,246,0.4);
  }
  .map-location-label {
    position:absolute; left:14px; bottom:12px;
    font-size:11px; color:rgba(255,255,255,0.5);
  }
  .map-location-value {
    position:absolute; left:14px; bottom:28px;
    font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:white;
  }

  /* ── Bottom Nav ── */
  .bottom-nav {
    position:sticky; bottom:0;
    background: rgba(8,10,15,0.92);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display:flex; align-items:center; justify-content:space-around;
    padding: 10px 0 20px;
    z-index:100;
  }
  .nav-item {
    display:flex; flex-direction:column; align-items:center; gap:4px;
    cursor:pointer; padding:4px 12px;
    transition:all 0.2s;
  }
  .nav-icon { font-size:20px; transition:transform 0.2s; }
  .nav-item:hover .nav-icon { transform:scale(1.15); }
  .nav-label { font-size:10px; font-weight:500; letter-spacing:.02em; transition:color 0.2s; }
  .nav-item.active .nav-label { color:var(--red); }
  .nav-item.active .nav-icon { filter: drop-shadow(0 0 6px rgba(255,59,59,0.6)); }
  .nav-item:not(.active) .nav-label { color:var(--muted); }

  /* ── Scroll container ── */
  .scroll-content { overflow-y:auto; padding-bottom:10px; }

  /* ── Fade-in animations ── */
  .fade-up {
    animation: fadeUp 0.5s ease both;
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to { opacity:1; transform:translateY(0); }
  }
  .d1 { animation-delay:0.05s; }
  .d2 { animation-delay:0.12s; }
  .d3 { animation-delay:0.19s; }
  .d4 { animation-delay:0.26s; }
  .d5 { animation-delay:0.33s; }
  .d6 { animation-delay:0.40s; }

  /* ── Alert banner ── */
  .alert-banner {
    margin: 0 22px 4px;
    background: rgba(245,158,11,0.08);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius:14px; padding:10px 14px;
    display:flex; align-items:center; gap:10px;
    cursor:pointer; transition:all 0.2s;
    animation: fadeUp 0.5s ease both;
    animation-delay:0.1s;
  }
  .alert-banner:hover { background: rgba(245,158,11,0.12); }
  .alert-icon { font-size:18px; }
  .alert-text { flex:1; font-size:12px; color:rgba(245,158,11,0.9); line-height:1.4; }
  .alert-text strong { font-weight:600; }
  .alert-dismiss { font-size:16px; color:var(--muted); cursor:pointer; }
`;

const QUICK_ACTIONS = [
  { icon:"🔧", label:"Mechanic", color:"rgba(59,130,246,1)", glow:"0 4px 20px rgba(59,130,246,0.3)" },
  { icon:"🚑", label:"Ambulance", color:"rgba(255,59,59,1)", glow:"0 4px 20px rgba(255,59,59,0.3)" },
  { icon:"⛽", label:"Fuel", color:"rgba(245,158,11,1)", glow:"0 4px 20px rgba(245,158,11,0.3)" },
  { icon:"🚔", label:"Police", color:"rgba(139,92,246,1)", glow:"0 4px 20px rgba(139,92,246,0.3)" },
  { icon:"🏥", label:"Hospital", color:"rgba(16,185,129,1)", glow:"0 4px 20px rgba(16,185,129,0.3)" },
  { icon:"🔩", label:"Towing", color:"rgba(236,72,153,1)", glow:"0 4px 20px rgba(236,72,153,0.3)" },
  { icon:"🛞", label:"Tyre", color:"rgba(251,146,60,1)", glow:"0 4px 20px rgba(251,146,60,0.3)" },
  { icon:"📞", label:"Helpline", color:"rgba(99,102,241,1)", glow:"0 4px 20px rgba(99,102,241,0.3)" },
];

const NEARBY = [
  { icon:"🔧", name:"AutoFix Garage", dist:"0.4 km", rating:"4.8", open:true },
  { icon:"⛽", name:"HP Petrol", dist:"0.7 km", rating:"4.5", open:true },
  { icon:"🏥", name:"City Hospital", dist:"1.2 km", rating:"4.9", open:true },
  { icon:"🚔", name:"Police Station", dist:"1.8 km", rating:"4.3", open:false },
];

const ACTIVITY = [
  { icon:"🔧", bg:"rgba(59,130,246,0.12)", title:"Mechanic Requested", sub:"Rajesh Auto — NH-58 near Meerut bypass", time:"2h ago", status:"Resolved", sColor:"#10b981", sBg:"rgba(16,185,129,0.12)" },
  { icon:"⛽", bg:"rgba(245,158,11,0.12)", title:"Emergency Fuel", sub:"GoGas Delivery — Sector 14 Crossing", time:"Yesterday", status:"Delivered", sColor:"#3b82f6", sBg:"rgba(59,130,246,0.12)" },
  { icon:"🚑", bg:"rgba(255,59,59,0.12)", title:"Ambulance Alert", sub:"GTB Hospital — Auto-dispatched", time:"3 days ago", status:"Completed", sColor:"#94a3b8", sBg:"rgba(148,163,184,0.08)" },
];

export default function RoadSOSHome() {
  const [alertVisible, setAlertVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("home");
  const [sosPressing, setSosPressing] = useState(false);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:false });
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <div className="ambient ambient-red" />
        <div className="ambient ambient-blue" />

        {/* Status Bar */}
        <div className="status-bar">
          <span className="status-time">{timeStr}</span>
          <div className="status-icons">
            <span style={{fontSize:12}}>📶</span>
            <span style={{fontSize:12}}>🔋</span>
          </div>
        </div>

        {/* Header */}
        <header className="header fade-up d1">
          <div className="logo-wrap">
            <div className="logo-icon">🚨</div>
            <span className="logo-text">Road<span>SOS</span></span>
          </div>
          <div className="header-right">
            <div className="notif-btn">
              <span style={{fontSize:16}}>🔔</span>
              <div className="notif-dot" />
            </div>
            <div className="avatar">AK</div>
          </div>
        </header>

        {/* Scroll Content */}
        <div className="scroll-content">

          {/* Greeting */}
          <div className="greeting-section fade-up d2">
            <div className="greeting-sub">{greeting},</div>
            <div className="greeting-name">Arjun Kumar 👋</div>
            <div className="live-pill">
              <div className="live-dot" />
              Location Active · NH-58, Ghaziabad
            </div>
          </div>

          {/* Alert Banner */}
          {alertVisible && (
            <div className="alert-banner">
              <span className="alert-icon">⚠️</span>
              <div className="alert-text">
                <strong>Road Closure Ahead</strong> — NH-9 near Dasna tollway. Alternate via Ring Road.
              </div>
              <span className="alert-dismiss" onClick={() => setAlertVisible(false)}>✕</span>
            </div>
          )}

          {/* SOS Card */}
          <div
            className="sos-card fade-up d2"
            onMouseDown={() => setSosPressing(true)}
            onMouseUp={() => setSosPressing(false)}
            onMouseLeave={() => setSosPressing(false)}
            style={{ transform: sosPressing ? "scale(0.97)" : undefined }}
          >
            <div className="sos-card-bg" />
            <div className="sos-card-grid" />
            <div className="sos-ring" />
            <div className="sos-ring2" />
            <div className="sos-label">Emergency Response</div>
            <div className="sos-title">One tap.<br/>Instant help.</div>
            <div className="sos-desc">Real-time dispatch to nearest responders in your area.</div>
            <button className="sos-btn">
              🚨 Send SOS Alert
            </button>
            <div className="sos-illustration">🚗</div>
          </div>

          {/* Quick Actions */}
          <div className="section-header fade-up d3">
            <span className="section-title">Quick Actions</span>
            <span className="section-link">See all →</span>
          </div>
          <div className="quick-grid fade-up d3">
            {QUICK_ACTIONS.map((q, i) => (
              <div className="quick-item" key={i}>
                <div
                  className="quick-icon"
                  style={{ "--qi-color": q.color, "--qi-glow": q.glow }}
                >
                  {q.icon}
                </div>
                <span className="quick-label">{q.label}</span>
              </div>
            ))}
          </div>

          {/* Map Teaser */}
          <div className="section-header fade-up d4">
            <span className="section-title">Live Location</span>
            <span className="section-link">Open Maps →</span>
          </div>
          <div className="map-teaser fade-up d4">
            <div className="map-bg" />
            <div className="map-grid" />
            {/* Roads */}
            <div className="map-road-h" style={{top:"40%"}} />
            <div className="map-road-h" style={{top:"70%"}} />
            <div className="map-road-v" style={{left:"30%"}} />
            <div className="map-road-v" style={{left:"65%"}} />
            {/* Pins */}
            <div className="map-pin" style={{left:"30%", top:"40%"}}>
              <div className="map-pin-ring" />
              <div className="map-pin-dot" />
            </div>
            <div className="map-pin" style={{left:"65%", top:"70%"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#3b82f6",boxShadow:"0 0 10px rgba(59,130,246,0.7)"}} />
            </div>
            <div className="map-overlay" />
            <div className="map-location-value">NH-58, Ghaziabad</div>
            <div className="map-location-label">📍 Current location</div>
            <div className="map-cta">View Map</div>
          </div>

          {/* Nearby Services */}
          <div className="section-header fade-up d4" style={{marginTop:10}}>
            <span className="section-title">Nearby Services</span>
            <span className="section-link">View all →</span>
          </div>
          <div className="nearby-scroll fade-up d4">
            {NEARBY.map((s, i) => (
              <div className="nearby-card" key={i}>
                <div className="nearby-card-icon">{s.icon}</div>
                <div className="nearby-card-name">{s.name}</div>
                <div className="nearby-card-dist">📍 {s.dist} away</div>
                <div className="nearby-card-rating">⭐ {s.rating}</div>
                {s.open && <div className="nearby-card-badge">Open</div>}
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="section-header fade-up d5" style={{marginTop:6}}>
            <span className="section-title">Recent Activity</span>
            <span className="section-link">History →</span>
          </div>
          <div className="activity-list fade-up d5">
            {ACTIVITY.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-icon" style={{background:a.bg}}>{a.icon}</div>
                <div className="activity-info">
                  <div className="activity-title">{a.title}</div>
                  <div className="activity-sub">{a.sub}</div>
                </div>
                <div className="activity-meta">
                  <span className="activity-time">{a.time}</span>
                  <span className="activity-status" style={{color:a.sColor,background:a.sBg}}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div style={{height:16}} />
        </div>

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          {[
            { id:"home", icon:"🏠", label:"Home" },
            { id:"map", icon:"🗺️", label:"Map" },
            { id:"sos", icon:"🚨", label:"SOS" },
            { id:"services", icon:"🔧", label:"Services" },
            { id:"profile", icon:"👤", label:"Profile" },
          ].map(n => (
            <div
              key={n.id}
              className={`nav-item ${activeNav === n.id ? "active" : ""}`}
              onClick={() => setActiveNav(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}