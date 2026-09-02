const { useState, useEffect, useRef, Fragment } = React;

/* ---------------------------------------------------------
   Data
--------------------------------------------------------- */
const FEST_DATE = new Date('2027-02-20T18:00:00');

const SCHEDULE = {
  1: {
    date: 'Friday, 20 February',
    events: [
      { time: '4:00 PM', title: 'Inauguration & opening ceremony', venue: 'Main Lawn', desc: "Fest kickoff with the director's address and the flag hoist that opens the three days." },
      { time: '6:00 PM', title: 'Battle of Bands', venue: 'Amphitheatre', desc: 'Inter-college bands go head to head in front of a live judging panel.' },
      { time: '9:00 PM', title: 'Music Night', venue: 'Main Stage', desc: 'Opening night headline set — the first of three big stage nights.' },
    ],
  },
  2: {
    date: 'Saturday, 21 February',
    events: [
      { time: '11:00 AM', title: 'Fashion walk auditions', venue: 'Convocation Hall', desc: "Open auditions for a spot in the evening's Fashion Extravaganza." },
      { time: '3:00 PM', title: 'Street Dance Battle', venue: 'Open Air Theatre', desc: 'Freestyle and crew battles, open floor after the main rounds.' },
      { time: '8:00 PM', title: 'Fashion Extravaganza', venue: 'Main Stage', desc: "The season's biggest student-run runway show, themed and choreographed." },
    ],
  },
  3: {
    date: 'Sunday, 22 February',
    events: [
      { time: '12:00 PM', title: 'Flea market & food trucks', venue: 'Central Lawn', desc: 'Stalls, local vendors, and food trucks running through the afternoon.' },
      { time: '5:00 PM', title: 'Prize distribution', venue: 'Amphitheatre', desc: 'Winners from all three days are called up across every competition.' },
      { time: '8:00 PM', title: 'Star Night', venue: 'Main Stage', desc: 'Closing night headline performance — the biggest crowd of the fest.' },
    ],
  },
};

const EVENT_OPTIONS = ['Battle of Bands', 'Music Night', 'Fashion Extravaganza', 'Street Dance Battle', 'Star Night'];

/* ---------------------------------------------------------
   Header
--------------------------------------------------------- */
function Header({ onRegister }) {
  return (
    <header>
      <nav>
        <div className="brand"><span className="brand-mark"></span>Moksha<span className="brand-badge">NSUT</span></div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#schedule">Schedule</a>
          <a href="#register">Register</a>
          <a href="#contact">Contact</a>
        </div>
        <button className="nav-cta" onClick={onRegister}>Register now</button>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------
   Hero + Countdown
--------------------------------------------------------- */
function getTimeLeft() {
  const diff = Math.max(0, FEST_DATE - new Date());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="countdown">
      <div className="cd-block"><div className="cd-num">{pad(time.days)}</div><div className="cd-label">days</div></div>
      <div className="cd-block"><div className="cd-num">{pad(time.hours)}</div><div className="cd-label">hours</div></div>
      <div className="cd-block"><div className="cd-num">{pad(time.mins)}</div><div className="cd-label">minutes</div></div>
      <div className="cd-block"><div className="cd-num">{pad(time.secs)}</div><div className="cd-label">seconds</div></div>
    </div>
  );
}

function Hero({ onRegister }) {
  return (
    <section className="hero">
      <div className="glow-orb a"></div>
      <div className="glow-orb b"></div>
      <div className="hero-dotgrid"></div>
      <div className="hero-spot"></div>
      <div className="wrap">
        <span className="hero-eyebrow">NSUT Annual Cultural Fest · 20–22 Feb</span>
        <h1>Moksha <em>&rsquo;27</em></h1>
        <p className="hero-sub">Three nights of music, fashion, and dance on campus — headline acts, open floors, and a crowd that shows up for all of it.</p>

        <Countdown />

        <div className="hero-actions">
          <button className="btn-primary" onClick={onRegister}>Register now</button>
          <a href="#schedule" className="btn-ghost">View schedule</a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   About
--------------------------------------------------------- */
function About() {
  return (
    <section className="block" id="about">
      <div className="wrap about-grid">
        <div className="about-copy">
          <div className="section-head" style={{ marginBottom: '20px' }}>
            <h2>What Moksha is</h2>
          </div>
          <p>Moksha is NSUT's annual cultural fest, run entirely by students, for three days every February. It's the one weekend campus fully empties into open lawns and stages — bands you've queued for, a fashion walk the design societies spend months on, and a closing night headliner that fills the amphitheatre.</p>
          <p>Every event on the schedule below is open to registered attendees. Some — the battles, the walk auditions — need a separate sign-up once you're in.</p>
        </div>
        <div className="about-stats">
          <div className="stat-card"><div className="stat-num">3</div><div className="stat-lbl">days on campus</div></div>
          <div className="stat-card"><div className="stat-num">40+</div><div className="stat-lbl">events &amp; competitions</div></div>
          <div className="stat-card"><div className="stat-num">12k</div><div className="stat-lbl">attendees last year</div></div>
          <div className="stat-card"><div className="stat-num">6</div><div className="stat-lbl">stages &amp; venues</div></div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Schedule (tabs + accordion)
--------------------------------------------------------- */
function EventCard({ event }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`event-card${open ? ' open' : ''}`}>
      <div className="event-head" onClick={() => setOpen((o) => !o)}>
        <div className="event-time">{event.time}</div>
        <div className="event-title">{event.title}</div>
        <div className="event-venue">{event.venue}</div>
        <svg className="event-chevron" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="event-body"><div className="event-body-inner">{event.desc}</div></div>
    </div>
  );
}

function ScheduleSection() {
  const [day, setDay] = useState(1);
  const data = SCHEDULE[day];

  return (
    <section className="block" id="schedule">
      <div className="wrap">
        <div className="section-head">
          <h2>Event schedule</h2>
          <p>Pick a day to see what's on. Tap any event for the venue and a short description.</p>
        </div>

        <div className="tabs">
          {[1, 2, 3].map((d) => (
            <button
              key={d}
              className={`tab-btn${day === d ? ' active' : ''}`}
              onClick={() => setDay(d)}
            >
              Day {d}
            </button>
          ))}
        </div>

        <div>
          <div className="day-date">{data.date}</div>
          {data.events.map((ev, i) => <EventCard key={i} event={ev} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Register CTA band
--------------------------------------------------------- */
function RegisterBand({ onRegister }) {
  return (
    <section className="block" id="register">
      <div className="wrap">
        <div className="register-band">
          <h2>Get your pass before gates open</h2>
          <p>Registration takes under a minute and gets you a digital pass with a scannable entry code — no queue at the gate.</p>
          <button className="btn-primary" onClick={onRegister}>Register now</button>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Footer
--------------------------------------------------------- */
function Footer() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="foot-row">
          <div className="brand" style={{ fontSize: '16px' }}>
            <span className="brand-mark" style={{ width: '20px', height: '20px' }}></span>Moksha &rsquo;27
          </div>
          <div className="foot-links">
            <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a>
            <a href="mailto:moksha@nsut.ac.in">moksha@nsut.ac.in</a>
          </div>
        </div>
        <p className="foot-note">Moksha &rsquo;27 · NSUT, Dwarka, New Delhi · This is a starter template — swap in your fest's real dates, lineup, and branding.</p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------
   Registration modal (form -> validated -> QR badge -> download)
--------------------------------------------------------- */
function RegistrationModal({ onClose }) {
  const [view, setView] = useState('form'); // 'form' | 'badge'
  const [form, setForm] = useState({ name: '', email: '', roll: '', event: '' });
  const [errors, setErrors] = useState({});
  const qrRef = useRef(null);
  const canvasRef = useRef(null);

  // Escape key closes the modal
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Render the QR code once the badge view mounts
  useEffect(() => {
    if (view === 'badge' && qrRef.current) {
      qrRef.current.innerHTML = '';
      new window.QRCode(qrRef.current, {
        text: `MOKSHA27|${form.name}|${form.roll.toUpperCase()}|${form.event}`,
        width: 128,
        height: 128,
        colorDark: '#0a0a12',
        colorLight: '#ffffff',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {
      name: form.name.trim().length > 1,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
      roll: form.roll.trim().length >= 6,
      event: form.event !== '',
    };
    setErrors(nextErrors);

    if (Object.values(nextErrors).every(Boolean)) {
      setView('badge');
    }
  };

  const handleDownload = () => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const w = canvas.width, h = canvas.height;

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#14121f');
      grad.addColorStop(1, '#0a0a12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(139,107,255,.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);

      ctx.fillStyle = '#33dde6';
      ctx.font = '600 15px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("MOKSHA '27  ·  ENTRY PASS", w / 2, 56);

      ctx.fillStyle = '#f2f1f6';
      ctx.font = '700 26px "Space Grotesk", sans-serif';
      ctx.fillText(form.name, w / 2, 100);

      ctx.fillStyle = '#9a9aa8';
      ctx.font = '500 15px "JetBrains Mono", monospace';
      ctx.fillText(form.roll.toUpperCase(), w / 2, 128);

      const qrImg = qrRef.current.querySelector('img, canvas');
      const qrSize = 220;
      const qrX = (w - qrSize) / 2;
      const qrY = 165;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 14, qrY - 14, qrSize + 28, qrSize + 28);

      const drawRestAndSave = () => {
        ctx.fillStyle = '#c9c4e8';
        ctx.font = '400 14px Inter, sans-serif';
        ctx.fillText('Registered for', w / 2, qrY + qrSize + 46);
        ctx.fillStyle = '#f2f1f6';
        ctx.font = '600 16px Inter, sans-serif';
        ctx.fillText(form.event, w / 2, qrY + qrSize + 70);

        ctx.fillStyle = '#65656f';
        ctx.font = '400 12px Inter, sans-serif';
        ctx.fillText('NSUT, Dwarka, New Delhi', w / 2, h - 30);

        const link = document.createElement('a');
        link.download = 'moksha-27-pass.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      };

      if (qrImg && qrImg.tagName === 'CANVAS') {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        drawRestAndSave();
      } else if (qrImg && qrImg.tagName === 'IMG') {
        const tmp = new Image();
        tmp.crossOrigin = 'anonymous';
        tmp.onload = () => { ctx.drawImage(tmp, qrX, qrY, qrSize, qrSize); drawRestAndSave(); };
        tmp.src = qrImg.src;
      } else {
        drawRestAndSave();
      }
    }, 50);
  };

  return (
    <div className="modal-overlay show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" aria-label="Close" onClick={onClose}>&times;</button>

        {view === 'form' && (
          <div>
            <h3>Register for Moksha &rsquo;27</h3>
            <p className="modal-sub">Fill this in and we'll generate your entry pass.</p>
            <form noValidate onSubmit={handleSubmit}>
              <div className={`field${errors.name === false ? ' invalid' : ''}`}>
                <label htmlFor="in-name">Full name</label>
                <input type="text" id="in-name" placeholder="Aditi Sharma" autoComplete="name" value={form.name} onChange={handleChange('name')} />
                <div className="field-error">Enter your name.</div>
              </div>

              <div className={`field${errors.email === false ? ' invalid' : ''}`}>
                <label htmlFor="in-email">Email</label>
                <input type="email" id="in-email" placeholder="you@nsut.ac.in" autoComplete="email" value={form.email} onChange={handleChange('email')} />
                <div className="field-error">Enter a valid email.</div>
              </div>

              <div className={`field${errors.roll === false ? ' invalid' : ''}`}>
                <label htmlFor="in-roll">NSUT roll number</label>
                <input type="text" id="in-roll" placeholder="2023UCS1600" autoComplete="off" value={form.roll} onChange={handleChange('roll')} />
                <div className="field-error">Enter your roll number.</div>
              </div>

              <div className={`field${errors.event === false ? ' invalid' : ''}`}>
                <label htmlFor="in-event">Which event are you most excited for?</label>
                <select id="in-event" value={form.event} onChange={handleChange('event')}>
                  <option value="">Select an event</option>
                  {EVENT_OPTIONS.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
                </select>
                <div className="field-error">Pick one event.</div>
              </div>

              <button type="submit" className="modal-submit">Generate my pass</button>
            </form>
          </div>
        )}

        {view === 'badge' && (
          <div className="badge-view show">
            <div className="badge-card">
              <div className="badge-fest">Moksha &rsquo;27 &nbsp;·&nbsp; Entry pass</div>
              <div className="badge-name">{form.name}</div>
              <div className="badge-roll">{form.roll.toUpperCase()}</div>
              <div className="badge-qr" ref={qrRef}></div>
              <div className="badge-event">Registered for <strong>{form.event}</strong></div>
            </div>
            <div className="badge-actions">
              <button className="btn-ghost" style={{ width: '100%' }} onClick={onClose}>Done</button>
              <button className="btn-primary" style={{ width: '100%' }} onClick={handleDownload}>Download pass</button>
            </div>
          </div>
        )}

        {/* Off-screen canvas used to render the downloadable pass PNG */}
        <canvas ref={canvasRef} width="440" height="560" style={{ display: 'none' }}></canvas>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   App
--------------------------------------------------------- */
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <Fragment>
      <Header onRegister={openModal} />
      <Hero onRegister={openModal} />
      <About />
      <ScheduleSection />
      <RegisterBand onRegister={openModal} />
      <Footer />
      {modalOpen && <RegistrationModal onClose={closeModal} />}
    </Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
