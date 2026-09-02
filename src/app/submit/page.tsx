import Link from "next/link";
import Image from "next/image";

// Inline SVG for ArrowRight icon (replaces lucide-react dependency)
const ArrowRightIcon = () => (
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
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

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

export default function CategorySelectionPage() {
  return (
    <div className="relative min-h-screen bg-[#000d21] text-[#f7fafc] flex flex-col justify-between overflow-x-hidden font-space select-none">
      {/* Background blueprint grid and subtle radial lighting */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#0a254015_1px,transparent_1px),linear-gradient(to_bottom,#0a254015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.08)_0%,rgba(0,53,153,0.05)_50%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full z-20 px-4 sm:px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href="/"
          aria-label="Project Nova Home"
          className="flex items-center gap-3 group cursor-pointer"
        >
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
          className="inline-flex items-center gap-2 border border-[#003885]/60 hover:border-[#00e5ff]/60 bg-[#00173d]/60 hover:bg-[#002259] text-xs font-bold uppercase tracking-widest text-[#cbd5e0] hover:text-[#00e5ff] px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)] group"
        >
          <HomeIcon />
          <span>GO TO HOMEPAGE</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 z-10">
        <div className="max-w-5xl w-full text-center space-y-10 sm:space-y-14">

          {/* Main Title */}
          <div className="space-y-3 animate-fade-in">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider text-white filter drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] font-space">
              READY TO BEGIN?
            </h1>
            <p className="text-xs sm:text-sm text-[#cbd5e0]/70 uppercase tracking-[0.25em]">
              Select your competition tier to access the Demo Video submission portal
            </p>
          </div>

          {/* Category Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">

            {/* University Tier Card - Demo Video */}
            <Link
              href="/submit/demo-video?category=university"
              className="group relative bg-[#00173d]/60 backdrop-blur-xl border border-[#003885]/60 hover:border-[#00e5ff]/80 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(0,229,255,0.25)] cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.15),transparent_70%)] pointer-events-none" />

              {/* Badge */}
              <div className="bg-[#002b66]/80 border border-[#00e5ff]/40 text-[#00e5ff] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-8 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                UNIVERSITY TIER
              </div>

              {/* Logo / Graphic */}
              <div className="my-4 relative flex items-center justify-center h-28 w-full">
                <div className="absolute inset-0 bg-[#00e5ff]/10 rounded-full blur-2xl group-hover:bg-[#00e5ff]/20 transition-all" />
                <div className="relative flex flex-col items-center">
                  <Image
                    src="/images/project_nova_logo.png"
                    alt="Project Nova"
                    width={200}
                    height={40}
                    className="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,184,27,0.4)] group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="text-xs sm:text-sm font-bold text-[#00e5ff] tracking-widest mt-2 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#ff0000]">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    Demo Video &amp; LinkedIn
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 mt-4">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider group-hover:text-[#00e5ff] transition-colors">
                  Project Nova
                </h2>
                <p className="text-xs text-[#a0aec0] leading-relaxed max-w-xs font-sans">
                  Submit your YouTube demo video & team LinkedIn post links for the University track
                </p>
              </div>

              {/* Action Prompt */}
              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00e5ff] group-hover:translate-x-1 transition-transform">
                <span>Proceed to Portal</span>
                <ArrowRightIcon />
              </div>
            </Link>

            {/* School Tier Card - Demo Video */}
            <Link
              href="/submit/demo-video?category=school"
              className="group relative bg-[#00173d]/60 backdrop-blur-xl border border-[#003885]/60 hover:border-[#FFB81B]/80 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,184,27,0.25)] cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,184,27,0.15),transparent_70%)] pointer-events-none" />

              {/* Badge */}
              <div className="bg-[#3d2b00]/80 border border-[#FFB81B]/40 text-[#FFB81B] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-8 shadow-[0_0_12px_rgba(255,184,27,0.2)]">
                SCHOOL TIER
              </div>

              {/* Logo / Graphic */}
              <div className="my-4 relative flex items-center justify-center h-28 w-full">
                <div className="absolute inset-0 bg-[#FFB81B]/10 rounded-full blur-2xl group-hover:bg-[#FFB81B]/20 transition-all" />
                <div className="relative flex flex-col items-center">
                  <Image
                    src="/images/project_nova_logo.png"
                    alt="Project Nova Jr."
                    width={200}
                    height={40}
                    className="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,184,27,0.4)] group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="text-xl sm:text-2xl font-black text-[#FFB81B] tracking-widest mt-2">
                    Jr.
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#FFB81B] tracking-widest mt-1 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#ff0000]">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    Demo Video & LinkedIn
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 mt-4">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider group-hover:text-[#FFB81B] transition-colors">
                  Project Nova Jr.
                </h2>
                <p className="text-xs text-[#a0aec0] leading-relaxed max-w-xs font-sans">
                  Submit your YouTube demo video & team LinkedIn post links for the School track
                </p>
              </div>

              {/* Action Prompt */}
              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFB81B] group-hover:translate-x-1 transition-transform">
                <span>Proceed to Portal</span>
                <ArrowRightIcon />
              </div>
            </Link>

            {/* Previous Stages Card - UI/UX & Proposal Closed */}
            <div className="relative bg-[#00112a]/60 backdrop-blur-xl border border-[#001f45]/60 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-between text-center opacity-50 cursor-not-allowed overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(100,100,100,0.1),transparent_70%)] pointer-events-none" />

              {/* Disabled Badge */}
              <div className="bg-[#1a1a2e]/80 border border-[#333]/40 text-[#666] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-8">
                PREVIOUS ROUNDS
              </div>
              <div className="bg-red-900/30 border border-red-800/50 text-red-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-4 shadow-[0_0_12px_rgba(255,0,0,0.1)]">
                SUBMISSIONS CLOSED
              </div>

              {/* Logo / Graphic */}
              <div className="my-4 relative flex items-center justify-center h-28 w-full">
                <div className="absolute inset-0 bg-[#444]/10 rounded-full blur-2xl" />
                <div className="relative flex flex-col items-center opacity-60">
                  <Image
                    src="/images/project_nova_logo.png"
                    alt="Project Nova"
                    width={200}
                    height={40}
                    className="h-10 w-auto object-contain filter grayscale"
                  />
                  <span className="text-xs sm:text-sm font-bold text-[#666] tracking-widest mt-2">
                    UI/UX & Proposal
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 mt-4">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-[#666] tracking-wider">
                  UI/UX & Proposal
                </h2>
                <p className="text-xs text-[#555] leading-relaxed max-w-xs font-sans">
                  Earlier submission rounds have concluded
                </p>
              </div>

              {/* Disabled Action Prompt */}
              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#444]">
                <span>Stage Completed</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>

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