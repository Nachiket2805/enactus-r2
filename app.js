const {
  useState,
  useEffect,
  useRef,
  Fragment
} = React;

/* ---------------------------------------------------------
   Data
--------------------------------------------------------- */
const FEST_DATE = new Date('2027-02-20T18:00:00');
const SCHEDULE = {
  1: {
    date: 'Friday, 20 February',
    events: [{
      time: '4:00 PM',
      title: 'Inauguration & opening ceremony',
      venue: 'Main Lawn',
      desc: "Fest kickoff with the director's address and the flag hoist that opens the three days.",
      category: 'Flagship',
      status: 'Open'
    }, {
      time: '6:00 PM',
      title: 'Battle of Bands',
      venue: 'Amphitheatre',
      desc: 'Inter-college bands go head to head in front of a live judging panel.',
      category: 'Music',
      status: 'Filling Fast',
      prizePool: '₹25,000 Pool',
      teamSize: '4–6 members'
    }, {
      time: '9:00 PM',
      title: 'Music Night',
      venue: 'Main Stage',
      desc: 'Opening night headline set — the first of three big stage nights.',
      category: 'Music',
      status: 'Open'
    }]
  },
  2: {
    date: 'Saturday, 21 February',
    events: [{
      time: '11:00 AM',
      title: 'Fashion walk auditions',
      venue: 'Convocation Hall',
      desc: "Open auditions for a spot in the evening's Fashion Extravaganza.",
      category: 'Flagship',
      status: 'Filling Fast',
      teamSize: 'Solo / duo'
    }, {
      time: '3:00 PM',
      title: 'Street Dance Battle',
      venue: 'Open Air Theatre',
      desc: 'Freestyle and crew battles, open floor after the main rounds.',
      category: 'Dance',
      status: 'Open',
      prizePool: '₹15,000 Pool',
      teamSize: '2–8 members'
    }, {
      time: '8:00 PM',
      title: 'Fashion Extravaganza',
      venue: 'Main Stage',
      desc: "The season's biggest student-run runway show, themed and choreographed.",
      category: 'Flagship',
      status: 'Open'
    }]
  },
  3: {
    date: 'Sunday, 22 February',
    events: [{
      time: '12:00 PM',
      title: 'Flea market & food trucks',
      venue: 'Central Lawn',
      desc: 'Stalls, local vendors, and food trucks running through the afternoon.',
      category: 'Informal',
      status: 'Open'
    }, {
      time: '5:00 PM',
      title: 'Prize distribution',
      venue: 'Amphitheatre',
      desc: 'Winners from all three days are called up across every competition.',
      category: 'Informal',
      status: 'Open'
    }, {
      time: '8:00 PM',
      title: 'Star Night',
      venue: 'Main Stage',
      desc: 'Closing night headline performance — the biggest crowd of the fest.',
      category: 'Flagship',
      status: 'Open'
    }]
  }
};
const CATEGORY_COLORS = {
  Music: '#33dde6',
  Dance: '#a78bfa',
  Flagship: '#fb7185',
  Informal: '#fbbf24'
};
const EVENT_OPTIONS = ['Battle of Bands', 'Music Night', 'Fashion Extravaganza', 'Street Dance Battle', 'Star Night'];

/* ---------------------------------------------------------
   Small inline icons (no external icon library)
--------------------------------------------------------- */
function PinIcon(props) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    ...props
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "9.5",
    r: "2.5",
    stroke: "currentColor",
    strokeWidth: "2"
  }));
}
function CalendarPlusIcon(props) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    ...props
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4.5",
    width: "18",
    height: "16",
    rx: "2.5",
    stroke: "currentColor",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9.5h18M8 2.5v4M16 2.5v4M12 12.5v6M9 15.5h6",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }));
}

/* ---------------------------------------------------------
   "Add to calendar" — builds a downloadable .ics file
--------------------------------------------------------- */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function parseEventStart(dayLabel, timeLabel, year) {
  const dm = dayLabel.match(/(\d+)\s+(\w+)/);
  const day = parseInt(dm[1], 10);
  const month = MONTHS.indexOf(dm[2]);
  const tm = timeLabel.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hour = parseInt(tm[1], 10);
  const min = parseInt(tm[2], 10);
  const ampm = tm[3].toUpperCase();
  if (ampm === 'PM' && hour !== 12) hour += 12;
  if (ampm === 'AM' && hour === 12) hour = 0;
  return new Date(year, month, day, hour, min);
}
function pad2(n) {
  return String(n).padStart(2, '0');
}
function formatICSDate(d) {
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
}
function downloadICS(event, dayLabel) {
  const start = parseEventStart(dayLabel, event.time, FEST_DATE.getFullYear());
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Moksha 27//EN', 'BEGIN:VEVENT', `UID:${Date.now()}@moksha27`, `DTSTAMP:${formatICSDate(new Date())}`, `DTSTART:${formatICSDate(start)}`, `DTEND:${formatICSDate(end)}`, `SUMMARY:${event.title}`, `LOCATION:${event.venue}`, `DESCRIPTION:${event.desc}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], {
    type: 'text/calendar'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, '-')}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------
   Header
--------------------------------------------------------- */
function Header({
  onRegister
}) {
  return /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand-mark"
  }), "Moksha", /*#__PURE__*/React.createElement("span", {
    className: "brand-badge"
  }, "NSUT")), /*#__PURE__*/React.createElement("div", {
    className: "nav-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#about"
  }, "About"), /*#__PURE__*/React.createElement("a", {
    href: "#schedule"
  }, "Schedule"), /*#__PURE__*/React.createElement("a", {
    href: "#register"
  }, "Register"), /*#__PURE__*/React.createElement("a", {
    href: "#contact"
  }, "Contact")), /*#__PURE__*/React.createElement("button", {
    className: "nav-cta",
    onClick: onRegister
  }, "Register now")));
}

/* ---------------------------------------------------------
   Hero + Countdown
--------------------------------------------------------- */
function getTimeLeft() {
  const diff = Math.max(0, FEST_DATE - new Date());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff % 86400000 / 3600000),
    mins: Math.floor(diff % 3600000 / 60000),
    secs: Math.floor(diff % 60000 / 1000)
  };
}
function Countdown() {
  const [time, setTime] = useState(getTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  return /*#__PURE__*/React.createElement("div", {
    className: "countdown"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-num"
  }, pad(time.days)), /*#__PURE__*/React.createElement("div", {
    className: "cd-label"
  }, "days")), /*#__PURE__*/React.createElement("div", {
    className: "cd-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-num"
  }, pad(time.hours)), /*#__PURE__*/React.createElement("div", {
    className: "cd-label"
  }, "hours")), /*#__PURE__*/React.createElement("div", {
    className: "cd-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-num"
  }, pad(time.mins)), /*#__PURE__*/React.createElement("div", {
    className: "cd-label"
  }, "minutes")), /*#__PURE__*/React.createElement("div", {
    className: "cd-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cd-num"
  }, pad(time.secs)), /*#__PURE__*/React.createElement("div", {
    className: "cd-label"
  }, "seconds")));
}
function Hero({
  onRegister
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glow-orb a"
  }), /*#__PURE__*/React.createElement("div", {
    className: "glow-orb b"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-dotgrid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-spot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-eyebrow"
  }, "NSUT Annual Cultural Fest · 20–22 Feb"), /*#__PURE__*/React.createElement("h1", null, "Moksha ", /*#__PURE__*/React.createElement("em", null, "’27")), /*#__PURE__*/React.createElement("p", {
    className: "hero-sub"
  }, "Three nights of music, fashion, and dance on campus — headline acts, open floors, and a crowd that shows up for all of it."), /*#__PURE__*/React.createElement(Countdown, null), /*#__PURE__*/React.createElement("div", {
    className: "hero-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: onRegister
  }, "Register now"), /*#__PURE__*/React.createElement("a", {
    href: "#schedule",
    className: "btn-ghost"
  }, "View schedule"))));
}

/* ---------------------------------------------------------
   About
--------------------------------------------------------- */
function About() {
  return /*#__PURE__*/React.createElement("section", {
    className: "block",
    id: "about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap about-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head",
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("h2", null, "What Moksha is")), /*#__PURE__*/React.createElement("p", null, "Moksha is NSUT's annual cultural fest, run entirely by students, for three days every February. It's the one weekend campus fully empties into open lawns and stages — bands you've queued for, a fashion walk the design societies spend months on, and a closing night headliner that fills the amphitheatre."), /*#__PURE__*/React.createElement("p", null, "Every event on the schedule below is open to registered attendees. Some — the battles, the walk auditions — need a separate sign-up once you're in.")), /*#__PURE__*/React.createElement("div", {
    className: "about-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-num"
  }, "3"), /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, "days on campus")), /*#__PURE__*/React.createElement("div", {
    className: "stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-num"
  }, "40+"), /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, "events & competitions")), /*#__PURE__*/React.createElement("div", {
    className: "stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-num"
  }, "12k"), /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, "attendees last year")), /*#__PURE__*/React.createElement("div", {
    className: "stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-num"
  }, "6"), /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, "stages & venues")))));
}

/* ---------------------------------------------------------
   Schedule (tabs + accordion)
--------------------------------------------------------- */
function EventCard({
  event,
  dayLabel
}) {
  const [open, setOpen] = useState(false);
  const color = CATEGORY_COLORS[event.category] || '#33dde6';
  return /*#__PURE__*/React.createElement("div", {
    className: "timeline-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "timeline-node",
    style: {
      '--node-color': color
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: `event-card${open ? ' open' : ''}`,
    style: {
      '--accent': color
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "event-head",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement("div", {
    className: "event-time"
  }, event.time), /*#__PURE__*/React.createElement("div", {
    className: "event-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat-badge",
    style: {
      '--cat-color': color
    }
  }, event.category), /*#__PURE__*/React.createElement("div", {
    className: "event-title"
  }, event.title), /*#__PURE__*/React.createElement("span", {
    className: "venue-chip"
  }, /*#__PURE__*/React.createElement(PinIcon, null), event.venue)), /*#__PURE__*/React.createElement("svg", {
    className: "event-chevron",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "event-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "event-body-inner"
  }, event.desc, /*#__PURE__*/React.createElement("div", {
    className: "event-meta"
  }, event.prizePool && /*#__PURE__*/React.createElement("span", {
    className: "meta-badge"
  }, event.prizePool), event.teamSize && /*#__PURE__*/React.createElement("span", {
    className: "meta-badge"
  }, event.teamSize), event.status && /*#__PURE__*/React.createElement("span", {
    className: `status-badge ${event.status === 'Open' ? 'open' : 'filling'}`
  }, event.status)), /*#__PURE__*/React.createElement("button", {
    className: "cal-btn",
    onClick: e => {
      e.stopPropagation();
      downloadICS(event, dayLabel);
    }
  }, /*#__PURE__*/React.createElement(CalendarPlusIcon, null), "Add to calendar")))));
}
function ScheduleSection() {
  const [day, setDay] = useState(1);
  const data = SCHEDULE[day];
  return /*#__PURE__*/React.createElement("section", {
    className: "block",
    id: "schedule"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Event schedule"), /*#__PURE__*/React.createElement("p", null, "Pick a day to see what's on. Tap any event for the venue and a short description.")), /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, [1, 2, 3].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    className: `tab-btn${day === d ? ' active' : ''}`,
    onClick: () => setDay(d)
  }, "Day ", d))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "day-date"
  }, data.date), /*#__PURE__*/React.createElement("div", {
    className: "timeline"
  }, data.events.map((ev, i) => /*#__PURE__*/React.createElement(EventCard, {
    key: i,
    event: ev,
    dayLabel: data.date
  }))))));
}

/* ---------------------------------------------------------
   Register CTA band
--------------------------------------------------------- */
function RegisterBand({
  onRegister
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "block",
    id: "register"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "register-band"
  }, /*#__PURE__*/React.createElement("h2", null, "Get your pass before gates open"), /*#__PURE__*/React.createElement("p", null, "Registration takes under a minute and gets you a digital pass with a scannable entry code — no queue at the gate."), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    onClick: onRegister
  }, "Register now"))));
}

/* ---------------------------------------------------------
   Footer
--------------------------------------------------------- */
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    id: "contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand",
    style: {
      fontSize: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand-mark",
    style: {
      width: '20px',
      height: '20px'
    }
  }), "Moksha ’27"), /*#__PURE__*/React.createElement("div", {
    className: "foot-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://instagram.com",
    target: "_blank",
    rel: "noopener"
  }, "Instagram"), /*#__PURE__*/React.createElement("a", {
    href: "https://linkedin.com",
    target: "_blank",
    rel: "noopener"
  }, "LinkedIn"), /*#__PURE__*/React.createElement("a", {
    href: "https://facebook.com",
    target: "_blank",
    rel: "noopener"
  }, "Facebook"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:moksha@nsut.ac.in"
  }, "moksha@nsut.ac.in"))), /*#__PURE__*/React.createElement("p", {
    className: "foot-note"
  }, "Moksha ’27 · NSUT, Dwarka, New Delhi · This is a starter template — swap in your fest's real dates, lineup, and branding.")));
}

/* ---------------------------------------------------------
   Registration modal (form -> validated -> QR badge -> download)
--------------------------------------------------------- */
function RegistrationModal({
  onClose
}) {
  const [view, setView] = useState('form'); // 'form' | 'badge'
  const [form, setForm] = useState({
    name: '',
    email: '',
    roll: '',
    event: ''
  });
  const [errors, setErrors] = useState({});
  const qrRef = useRef(null);
  const canvasRef = useRef(null);

  // Escape key closes the modal
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
    };
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
        colorLight: '#ffffff'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);
  const handleChange = field => e => {
    const value = e.target.value;
    setForm(f => ({
      ...f,
      [field]: value
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    const nextErrors = {
      name: form.name.trim().length > 1,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
      roll: form.roll.trim().length >= 6,
      event: form.event !== ''
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
      const w = canvas.width,
        h = canvas.height;
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
        tmp.onload = () => {
          ctx.drawImage(tmp, qrX, qrY, qrSize, qrSize);
          drawRestAndSave();
        };
        tmp.src = qrImg.src;
      } else {
        drawRestAndSave();
      }
    }, 50);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay show",
    onClick: e => {
      if (e.target === e.currentTarget) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal"
  }, /*#__PURE__*/React.createElement("button", {
    className: "modal-close",
    "aria-label": "Close",
    onClick: onClose
  }, "×"), view === 'form' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Register for Moksha ’27"), /*#__PURE__*/React.createElement("p", {
    className: "modal-sub"
  }, "Fill this in and we'll generate your entry pass."), /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: `field${errors.name === false ? ' invalid' : ''}`
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "in-name"
  }, "Full name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "in-name",
    placeholder: "Aditi Sharma",
    autoComplete: "name",
    value: form.name,
    onChange: handleChange('name')
  }), /*#__PURE__*/React.createElement("div", {
    className: "field-error"
  }, "Enter your name.")), /*#__PURE__*/React.createElement("div", {
    className: `field${errors.email === false ? ' invalid' : ''}`
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "in-email"
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    id: "in-email",
    placeholder: "you@nsut.ac.in",
    autoComplete: "email",
    value: form.email,
    onChange: handleChange('email')
  }), /*#__PURE__*/React.createElement("div", {
    className: "field-error"
  }, "Enter a valid email.")), /*#__PURE__*/React.createElement("div", {
    className: `field${errors.roll === false ? ' invalid' : ''}`
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "in-roll"
  }, "NSUT roll number"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "in-roll",
    placeholder: "2023UCS1600",
    autoComplete: "off",
    value: form.roll,
    onChange: handleChange('roll')
  }), /*#__PURE__*/React.createElement("div", {
    className: "field-error"
  }, "Enter your roll number.")), /*#__PURE__*/React.createElement("div", {
    className: `field${errors.event === false ? ' invalid' : ''}`
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "in-event"
  }, "Which event are you most excited for?"), /*#__PURE__*/React.createElement("select", {
    id: "in-event",
    value: form.event,
    onChange: handleChange('event')
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select an event"), EVENT_OPTIONS.map(ev => /*#__PURE__*/React.createElement("option", {
    key: ev,
    value: ev
  }, ev))), /*#__PURE__*/React.createElement("div", {
    className: "field-error"
  }, "Pick one event.")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "modal-submit"
  }, "Generate my pass"))), view === 'badge' && /*#__PURE__*/React.createElement("div", {
    className: "badge-view show"
  }, /*#__PURE__*/React.createElement("div", {
    className: "badge-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "badge-fest"
  }, "Moksha ’27 \xA0·\xA0 Entry pass"), /*#__PURE__*/React.createElement("div", {
    className: "badge-name"
  }, form.name), /*#__PURE__*/React.createElement("div", {
    className: "badge-roll"
  }, form.roll.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    className: "badge-qr",
    ref: qrRef
  }), /*#__PURE__*/React.createElement("div", {
    className: "badge-event"
  }, "Registered for ", /*#__PURE__*/React.createElement("strong", null, form.event))), /*#__PURE__*/React.createElement("div", {
    className: "badge-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-ghost",
    style: {
      width: '100%'
    },
    onClick: onClose
  }, "Done"), /*#__PURE__*/React.createElement("button", {
    className: "btn-primary",
    style: {
      width: '100%'
    },
    onClick: handleDownload
  }, "Download pass"))), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    width: "440",
    height: "560",
    style: {
      display: 'none'
    }
  })));
}

/* ---------------------------------------------------------
   App
--------------------------------------------------------- */
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(Header, {
    onRegister: openModal
  }), /*#__PURE__*/React.createElement(Hero, {
    onRegister: openModal
  }), /*#__PURE__*/React.createElement(About, null), /*#__PURE__*/React.createElement(ScheduleSection, null), /*#__PURE__*/React.createElement(RegisterBand, {
    onRegister: openModal
  }), /*#__PURE__*/React.createElement(Footer, null), modalOpen && /*#__PURE__*/React.createElement(RegistrationModal, {
    onClose: closeModal
  }));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
