import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submissions Closed - Project Nova",
  description: "Proposal submissions for Project Nova and Project Nova Jr. have officially concluded.",
};

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const BookOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export default function SubmitPage() {
  return (
    <div className="relative min-h-screen bg-[#000d21] text-[#f7fafc] flex flex-col justify-between overflow-x-hidden font-space select-none">
      {/* Background blueprint grid and subtle lighting */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#0a254015_1px,transparent_1px),linear-gradient(to_bottom,#0a254015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(255,184,27,0.12)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full z-20 px-4 sm:px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer" aria-label="Project Nova Home">
          <Image
            src="/images/project_nova_logo.png"
            alt="Project Nova"
            width={160}
            height={32}
            className="h-8 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(255,184,27,0.4)] group-hover:scale-105 transition-transform"
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-[#003885]/60 hover:border-[#00e5ff]/60 bg-[#00173d]/60 hover:bg-[#002259] text-xs font-bold uppercase tracking-widest text-[#cbd5e0] hover:text-[#00e5ff] px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
        >
          <HomeIcon />
          <span>GO TO HOMEPAGE</span>
        </Link>
      </header>

      {/* Main Content Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 z-10">
        <div className="max-w-2xl w-full bg-[#001433]/80 border border-[#003885]/60 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-center space-y-8">
          
          <div className="inline-flex items-center justify-center bg-[#FFB81B]/10 border border-[#FFB81B]/40 text-[#FFB81B] text-xs font-bold uppercase tracking-[0.25em] px-5 py-2 rounded-full shadow-[0_0_15px_rgba(255,184,27,0.2)]">
            SUBMISSION PERIOD CONCLUDED
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-white font-space">
              SUBMISSIONS ARE CLOSED
            </h1>
            <p className="text-xs sm:text-sm text-[#cbd5e0]/80 leading-relaxed font-sans max-w-lg mx-auto">
              Proposal submissions for Project Nova and Project Nova Jr. have officially concluded. Thank you to all the innovators who submitted their project blueprints. Shortlisted teams will be announced soon.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto group bg-gradient-to-r from-[#FFB81B] via-[#ffaa00] to-[#FFB81B] hover:brightness-110 text-[#001233] font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl shadow-[0_0_25px_rgba(255,184,27,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2">
                <HomeIcon />
                <span>GO TO HOMEPAGE</span>
              </button>
            </Link>

            <Link href="/#timeline" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border border-[#003885]/80 hover:border-[#00e5ff]/80 bg-[#00173d]/80 hover:bg-[#002259] text-xs font-bold uppercase tracking-widest text-[#cbd5e0] hover:text-[#00e5ff] py-3.5 px-6 rounded-2xl backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-2">
                <CalendarIcon />
                <span>VIEW TIMELINE</span>
              </button>
            </Link>

            <a
              href="https://drive.google.com/drive/folders/10Yg5WsIpSnFmXDnzNwcMQEpw2uYzn90e?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto border border-[#FFB81B]/30 hover:border-[#FFB81B]/70 bg-[#00173d]/80 hover:bg-[#FFB81B]/10 text-xs font-bold uppercase tracking-widest text-[#cbd5e0] hover:text-[#FFB81B] py-3.5 px-6 rounded-2xl backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-2">
                <BookOpenIcon />
                <span>DELEGATE BOOKLET</span>
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Watermark / Large Graphic Text in Background */}
      <div className="relative w-full overflow-hidden flex justify-center items-center py-4 opacity-10 pointer-events-none">
        <span className="text-[12vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent select-none">
          PROJECT NOVA
        </span>
      </div>
    </div>
  );
}