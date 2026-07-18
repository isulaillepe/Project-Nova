"use client";

import * as React from "react";
import { Mail } from "lucide-react";

/* Inline LinkedIn icon — lucide-react in this project doesn't export Linkedin */
function LinkedInIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Committee member data
   • image: path relative to /public (optional)
   • linkedin: full LinkedIn profile URL (optional)
───────────────────────────────────────────── */
const COMMITTEE: {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar: string;
  image?: string;
  linkedin?: string;
}[] = [
  {
    id: "CM-01",
    name: "Niyoma Bodinie",
    title: "Organizing Committee President",
    email: "niyomabodinie@aiesec.net",
    avatar: "NB",
    linkedin: "https://linkedin.com",
  },
  {
    id: "CM-02",
    name: "Dinuki Masakorala",
    title: "VP Business Development",
    email: "dinuki.masakorala@aiesec.net",
    avatar: "DM",
    linkedin: "https://linkedin.com",
  },
  {
    id: "CM-03",
    name: "Dinuka Wimalagunasekara",
    title: "VP Partnership Development",
    email: "diw02@aiesec.net",
    avatar: "DW",
    linkedin: "https://linkedin.com",
  },
  {
    id: "CM-04",
    name: "Pahanma Kumarasiri",
    title: "VP Partnership Development",
    email: "pahanmakumarasiri@aiesec.net",
    avatar: "PK",
    linkedin: "https://linkedin.com",
  },
  {
    id: "CM-05",
    name: "Manaal Zainab",
    title: "VP Partnership Development",
    email: "manaalzainab@aiesec.net",
    avatar: "MZ",
    linkedin: "https://linkedin.com",
  },
  {
    id: "CM-06",
    name: "Tharsigan Gnanasekar",
    title: "VP Partnership Development",
    email: "tharsigan2004@aiesec.net",
    avatar: "TG",
    linkedin: "https://linkedin.com",
  },
];

/* ─────────────────────────────────────────────
   Individual member card — fixed 220 × 360 px
───────────────────────────────────────────── */
function MemberCard({ member }: { member: (typeof COMMITTEE)[number] }) {
  return (
    <div className="cm-card">
      {/* ── Photo area ────────────────────────── */}
      <div className="cm-photo">
        {member.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.image} alt={member.name} className="cm-photo-img" />
        ) : (
          <div className="cm-photo-fallback">
            <span>{member.avatar}</span>
          </div>
        )}
        {/* Gradient overlay at bottom of photo */}
        <div className="cm-photo-overlay" />
      </div>

      {/* ── Info area ─────────────────────────── */}
      <div className="cm-info">
        <h3 className="cm-name">{member.name}</h3>
        <p className="cm-title">{member.title}</p>

        {/* ── Action buttons ────────────────── */}
        <div className="cm-actions">
          <a
            href={`mailto:${member.email}`}
            className="cm-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail size={13} />
            Email
          </a>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="cm-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <LinkedInIcon size={13} />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Duplicate list for seamless infinite scroll
───────────────────────────────────────────── */
const TRACK = [...COMMITTEE, ...COMMITTEE, ...COMMITTEE];

/* ─────────────────────────────────────────────
   Section component
───────────────────────────────────────────── */
export default function OrganizingCommittee() {
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <>
      {/* ── Scoped CSS ──────────────────────────── */}
      <style>{`
        /* ── Section ──────────────────────────────── */
        .cm-section {
          position: relative;
          padding: 6rem 0 7rem;
          background: var(--nova-bg);
          overflow: hidden;
        }

        .cm-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          translate: -50% 0;
          width: 800px;
          height: 350px;
          background: radial-gradient(
            ellipse,
            rgba(0, 53, 153, 0.16) 0%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── Header ───────────────────────────────── */
        .cm-header {
          position: relative;
          z-index: 1;
          text-align: center;
          margin-bottom: 3.5rem;
          padding: 0 1.5rem;
        }

        .cm-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(0, 53, 153, 0.15);
          border: 1px solid rgba(0, 53, 153, 0.35);
          border-radius: 9999px;
          padding: 0.3rem 0.95rem;
          font-size: 0.67rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6eb3ff;
          margin-bottom: 1.25rem;
        }

        .cm-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6eb3ff;
          animation: cmPulse 2s ease-in-out infinite;
        }

        @keyframes cmPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.75); }
        }

        .cm-heading {
          font-size: clamp(1.9rem, 4.5vw, 3.1rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 0.85rem;
        }

        .cm-heading-accent {
          background: linear-gradient(90deg, var(--nova-primary), #6eb3ff, #00d4ff);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cm-subtitle {
          font-size: 1rem;
          color: #94a3b8;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* ── Marquee wrapper ──────────────────────── */
        .cm-marquee-outer {
          overflow: hidden;
          width: 100%;
          position: relative;
          z-index: 1;
          /* Soft fade on edges */
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 6%,
            black 94%,
            transparent 100%
          );
        }

        /* Vertical padding so card hover lift isn't clipped */
        .cm-marquee-inner {
          padding: 1.5rem 0 2rem;
        }

        .cm-marquee-track {
          display: flex;
          width: max-content;
          animation: cmScroll 30s linear infinite;
        }

        @keyframes cmScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100% / 3)); }
        }

        /* ── Card ─────────────────────────────────── */
        /* Every card is EXACTLY the same fixed size */
        .cm-card {
          flex-shrink: 0;
          width: 220px;
          height: 360px;
          margin: 0 12px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: #0d1526;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: default;
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cm-card:hover {
          border-color: rgba(0, 53, 153, 0.65);
          box-shadow:
            0 0 0 1px rgba(0, 53, 153, 0.3),
            0 24px 50px -12px rgba(0, 53, 153, 0.35);
          transform: translateY(-8px);
        }

        /* ── Photo area (top 65% of card) ─────────── */
        .cm-photo {
          position: relative;
          width: 220px;
          height: 234px;       /* fixed — 65% of 360px */
          flex-shrink: 0;
          background: linear-gradient(160deg, #1e293b 0%, #0f172a 100%);
          overflow: hidden;
        }

        .cm-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        /* Initials fallback — same fixed size */
        .cm-photo-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #003599 0%, #1e40af 60%, #0f172a 100%);
        }

        .cm-photo-fallback span {
          font-size: 3rem;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: -0.04em;
        }

        /* Soft gradient blending photo into info area */
        .cm-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(13, 21, 38, 0.9) 100%
          );
        }

        /* ── Info area (bottom 35%) ────────────────── */
        .cm-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 0.85rem 1rem 1rem;
          background: #0d1526;
          text-align: center;
        }

        .cm-name {
          font-size: 0.93rem;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .cm-title {
          font-size: 0.66rem;
          font-weight: 500;
          color: #6eb3ff;
          letter-spacing: 0.04em;
          margin-bottom: 0.5rem;
        }

        /* ── Action buttons row ───────────────────── */
        .cm-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: auto;
        }

        .cm-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: #cbd5e1;
          font-size: 0.68rem;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
        }

        .cm-btn:hover {
          background: rgba(0, 53, 153, 0.25);
          border-color: rgba(0, 53, 153, 0.55);
          color: #93c5fd;
        }
      `}</style>

      <section id="committee" className="cm-section">
        {/* ── Header ───────────────────────────────── */}
        <div className="cm-header">
          <div className="cm-badge">
            <span className="cm-badge-dot" />
            Mission Control
          </div>
          <h2 className="cm-heading">
            Meet the Team Behind&nbsp;
            <span className="cm-heading-accent">Project Nova</span>
          </h2>
          <p className="cm-subtitle">
            A dedicated team of student leaders driving innovation and creating
            opportunities for the next generation of tech innovators.
          </p>
        </div>

        {/* ── Scrolling carousel ───────────────────── */}
        <div className="cm-marquee-outer">
          <div className="cm-marquee-inner">
            <div
              className="cm-marquee-track"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {TRACK.map((member, idx) => (
                <MemberCard key={`${member.id}-${idx}`} member={member} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
