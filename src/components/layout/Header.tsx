"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/#prizes", label: "PRIZES" },
  { href: "/#timeline", label: "TIMELINE" },
  { href: "/#committee", label: "COMMITTEE" },
  { href: "/#contact", label: "CONTACT US" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleScroll();
    handleResize();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isHomePage = pathname === "/";
  const shouldShowHeader = isMobile || !isHomePage || scrollY > 300;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        shouldShowHeader
          ? "bg-[#001233]/90 backdrop-blur-xl border-b border-[#003599]/30 shadow-[0_4px_30px_rgba(0,8,30,0.6)] pointer-events-auto"
          : "bg-transparent pointer-events-none"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Logo with official Project Nova image */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={`flex items-center transition-all duration-500 transform cursor-pointer ${
              shouldShowHeader
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
            aria-label="Project Nova Home"
          >
            <img
              src="/images/project_nova_logo.png"
              alt="Project Nova"
              className="h-7 sm:h-9 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(255,184,27,0.4)]"
            />
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
                  {index > 0 && <span className="text-[#ffb81b]/30 text-xs select-none">·</span>}
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === "/" && pathname === "/") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className="text-[11px] font-bold uppercase tracking-widest text-[#cbd5e0] transition-colors hover:text-[#FFB81B]"
                  >
                    {link.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>

            {/* Vertical Separator */}
            <div className="h-4 w-[1px] bg-[#003599]/50 mx-1" />

            <div className="flex items-center gap-3">
              <Link href="/#rules">
                <button className="border border-[#ffb81b]/25 hover:border-[#ffb81b]/60 hover:bg-[#ffb81b]/5 text-[#f7fafc] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                  DELEGATE BOOKLET
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-[#FFB81B] hover:brightness-105 text-[#001233] text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-[0_0_18px_rgba(255,184,27,0.35)] hover:shadow-[0_0_24px_rgba(255,184,27,0.5)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                  REGISTER
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 text-[#cbd5e0] hover:text-[#FFB81B] transition-all duration-500 transform cursor-pointer ${
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
            isMobileMenuOpen ? "max-h-[320px] opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-3 pt-3 font-space">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#cbd5e0] hover:text-[#FFB81B] transition-colors py-1"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (link.href === "/" && pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2.5 pt-3 border-t border-[#003599]/40">
              <Link href="/#rules" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center border border-[#ffb81b]/25 text-[#f7fafc] text-[10px] sm:text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-full cursor-pointer">
                  DELEGATE BOOKLET
                </button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full text-center bg-[#FFB81B] text-[#001233] text-[10px] sm:text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-full shadow-[0_0_15px_rgba(255,184,27,0.35)] cursor-pointer">
                  REGISTER
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}