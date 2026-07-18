"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";

const footerLinks = {
  codeSplash: [
    { label: "About CodeSplash", href: "/#about" },
    { label: "Timeline", href: "/#timeline" },
    { label: "Prize Pool", href: "/#prizes" },
    { label: "Organizing Committee", href: "/#committee" },
    { label: "Corporate Partners", href: "/#partners" },
  ],
  competition: [
    { label: "School Track", href: "/register?track=school" },
    { label: "University Track", href: "/register?track=university" },
    { label: "Registration", href: "/register" },
    { label: "FAQ", href: "/#faq" },
    { label: "Rules & Guidelines", href: "/#rules" },
  ],
  partners: [
    { label: "Become a Partner", href: "/#partners" },
    { label: "Partner Benefits", href: "/#partners" },
    { label: "Contact Us", href: "/#contact" },
  ],
  cssa: [
    { label: "CSSA Website", href: "https://codesplash.lk" },
    { label: "FCT UOK", href: "https://fct.kln.ac.lk" },
    { label: "University of Kelaniya", href: "https://kln.ac.lk" },
  ],
};

const socialLinks = [
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

const contactInfo = [
  { icon: Mail, label: "codesplash.cssa@gmail.com", href: "mailto:codesplash.cssa@gmail.com" },
  { icon: MapPin, label: "University of Kelaniya, Sri Lanka", href: "#" },
  { icon: Phone, label: "+94 77 123 4567", href: "tel:+94771234567" },
];

export function Footer() {
  const pathname = usePathname();

  // Hide the global layout footer on the homepage, since the homepage uses a
  // scroll-driven custom footer within the FAQ sticky register section.
  if (pathname === "/" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="relative border-t border-white/10 bg-[var(--nova-bg)]/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 font-bold text-xl text-white">
              <div className="flex items-center gap-2 select-none">
                <svg className="h-7 w-auto text-white" viewBox="0 0 24 36" fill="currentColor">
                  <path d="M12 0C7.58 0 4 3.58 4 8c0 3.31 2.03 6.14 4.9 7.37L8 16.5c0 .28.22.5.5.5h2v6H6.5c-.28 0-.5.22-.5.5v2c0 .28.22.5.5.5H10.5v10c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5V26h4c.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5H13.5v-6h2c.28 0 .5-.22.5-.5l-.9-1.13C17.97 14.14 20 11.31 20 8c0-4.42-3.58-8-8-8zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                </svg>
                <span className="font-space font-black text-xl tracking-wider">CSSA</span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-slate-400 text-sm leading-relaxed">
              A dynamic tech-based event designed for school and university students, creating a platform
              where innovation meets opportunity. Organized by Faculty of Computing and Technology, University of Kelaniya.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-[var(--nova-primary)]/20 hover:text-[var(--nova-secondary)]"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white">CodeSplash</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.codeSplash.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-[var(--nova-secondary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Competition</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.competition.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-[var(--nova-secondary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">Partners</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.partners.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-[var(--nova-secondary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">CSSA UOK</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.cssa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 transition-colors hover:text-[var(--nova-secondary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CodeSplash. Organized by Faculty of Computing and Technology, University of Kelaniya. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
            {contactInfo.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                className="flex items-center gap-1.5 transition-colors hover:text-[var(--nova-secondary)]"
              >
                <contact.icon className="h-4 w-4" aria-hidden="true" />
                <span>{contact.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-t from-[var(--nova-primary)]/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-t from-indigo-600/10 to-transparent blur-3xl" />
      </div>
    </footer>
  );
}