"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#rules", label: "RULES" },
  { href: "/#timeline", label: "TIMELINE" },
  { href: "/#contact", label: "CONTACT" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const shouldShowHeader = !isHomePage || scrollY > 300;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        shouldShowHeader
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] pointer-events-auto"
          : "bg-transparent pointer-events-none"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo with futuristic brackets */}
          <Link
            href="/"
            className={`flex items-center transition-all duration-500 transform ${
              shouldShowHeader
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
            aria-label="Project Nova Home"
          >
            <div className="relative border-y border-white/10 px-5 py-1.5 font-space font-extrabold tracking-widest text-sm select-none uppercase">
              {/* Left bracket corners */}
              <div className="absolute left-0 top-0 bottom-0 w-2 border-y border-l border-white/20" />
              {/* Right bracket corners */}
              <div className="absolute right-0 top-0 bottom-0 w-2 border-y border-r border-white/20" />
              <span className="text-white">PROJECT</span>
              <span className="text-[#FF5533] ml-1.5">NOVA</span>
            </div>
          </Link>

          {/* Desktop Navigation & Action Buttons */}
          <div
            className={`hidden md:flex md:items-center md:gap-6 transition-all duration-500 delay-100 transform ${
              shouldShowHeader
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-4 font-space">
              {navLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  {index > 0 && <span className="text-white/25 text-xs select-none">·</span>}
                  <Link
                    href={link.href}
                    className="text-[11px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:text-[#FF5533]"
                  >
                    {link.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>

            {/* Vertical Separator */}
            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            <div className="flex items-center gap-3">
              <Link href="/execution-booklet">
                <button className="border border-white/25 hover:border-white/50 hover:bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-300">
                  EXECUTION BOOKLET
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-[#FF5533] hover:bg-[#e04422] text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-[0_0_15px_rgba(255,85,51,0.3)] hover:shadow-[0_0_20px_rgba(255,85,51,0.5)] transition-all duration-300">
                  REGISTER NOW
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 text-slate-300 hover:text-white transition-all duration-500 transform ${
              shouldShowHeader
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 pt-4 font-space">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-wider text-slate-300 hover:text-[#FF5533] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link href="/execution-booklet" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-full">
                  EXECUTION BOOKLET
                </button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center bg-[#FF5533] text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-full shadow-[0_0_15px_rgba(255,85,51,0.3)]">
                  REGISTER NOW
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}