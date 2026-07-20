"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaLinkedinIn, FaInstagram, FaYoutube, FaFacebookF } from "react-icons/fa";

const footerLinks = {
  pantheon: [
    { label: "The Gateway", href: "/" },
    { label: "The Odysseys", href: "/#timeline" },
    { label: "The Treasury", href: "/#prizes" },
    { label: "The Guardians", href: "/#committee" },
    { label: "The Allies", href: "/#partners" },
  ],
  trials: [
    { label: "School Track", href: "/register?track=school" },
    { label: "University Track", href: "/register?track=university" },
    { label: "Register", href: "/register" },
    { label: "The Oracle (FAQ)", href: "/#faq" },
    { label: "Rules & Guidelines", href: "/#rules" },
  ],
  alliances: [
    { label: "Become an Ally", href: "/#partners" },
    { label: "Patron Benefits", href: "/#partners" },
    { label: "Contact Us", href: "/#contact" },
  ],
  organizers: [
    { label: "AIESEC in USJ", href: "https://aiesec.lk" },
    { label: "University of Sri Jayewardenepura", href: "https://sjp.ac.lk" },
    { label: "AIESEC Global", href: "https://aiesec.org" },
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
    <footer className="relative border-t border-[#003599]/30 bg-[#001233]/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 font-bold text-xl text-[#f7fafc]">
              <div className="flex items-center gap-2 select-none">
                <svg className="h-7 w-auto text-[#ffb81b]" viewBox="0 0 24 36" fill="currentColor">
                  <path d="M12 0C7.58 0 4 3.58 4 8c0 3.31 2.03 6.14 4.9 7.37L8 16.5c0 .28.22.5.5.5h2v6H6.5c-.28 0-.5.22-.5.5v2c0 .28.22.5.5.5H10.5v10c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5V26h4c.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5H13.5v-6h2c.28 0 .5-.22.5-.5l-.9-1.13C17.97 14.14 20 11.31 20 8c0-4.42-3.58-8-8-8zm0 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                </svg>
                <span className="font-cinzel font-bold text-xl tracking-[0.18em]">NOVA</span>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-[#cbd5e0] text-sm leading-relaxed">
              A dynamic tech-based event designed for school and university students, creating a platform
              where innovation meets opportunity. Organized by AIESEC in University of Sri Jayewardenepura.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[#cbd5e0] transition-all hover:bg-[#ffb81b]/15 hover:text-[#ffb81b] active:scale-95"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-cinzel font-semibold tracking-wide text-[#f7fafc]">The Pantheon</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.pantheon.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#cbd5e0] transition-colors hover:text-[#ffb81b]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-cinzel font-semibold tracking-wide text-[#f7fafc]">The Trials</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.trials.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#cbd5e0] transition-colors hover:text-[#ffb81b]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-cinzel font-semibold tracking-wide text-[#f7fafc]">Alliances</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.alliances.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#cbd5e0] transition-colors hover:text-[#ffb81b]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-cinzel font-semibold tracking-wide text-[#f7fafc]">The Organizers</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.organizers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#cbd5e0] transition-colors hover:text-[#ffb81b]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-[#003599]/30 pt-8 md:flex-row">
          <p className="text-sm text-[#8da2bd]">
            © {new Date().getFullYear()} Project Nova. Organized by AIESEC in University of Sri Jayewardenepura. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#8da2bd]">
            {contactInfo.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                className="flex items-center gap-1.5 transition-colors hover:text-[#ffb81b]"
              >
                <contact.icon className="h-4 w-4" aria-hidden="true" />
                <span>{contact.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-t from-[#003599]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-t from-[#ffb81b]/10 to-transparent blur-3xl" />
      </div>
    </footer>
  );
}