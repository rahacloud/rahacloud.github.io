'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { CloseIcon, MenuIcon } from './icons';
import LocaleToggle from './LocaleToggle';
import ThemeToggle from './ThemeToggle';

type NavLink = { href: string; label: string; locale?: boolean };

export default function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [locale]);

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks: NavLink[] = [
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#process', label: t('nav.process') },
    { href: '#projects', label: t('nav.projects') },
    { href: '#team', label: t('nav.team') },
    { href: '#contact', label: t('nav.contact') },
    { href: '/blog', label: t('nav.blog'), locale: true },
  ];

  const renderNavLink = (link: NavLink, onClick?: () => void) =>
    link.locale ? (
      <Link key={link.href} href={link.href} onClick={onClick}>
        {link.label}
      </Link>
    ) : (
      <a key={link.href} href={link.href} onClick={onClick}>
        {link.label}
      </a>
    );

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <a className="brand" href={`/${locale}`}>
          <Image src="/logo.png" alt="Raha Cloud" width={44} height={44} className="brand-mark" />
          <span className="brand-text">
            <strong>{t('brand.name')}</strong>
            <span>{t('brand.tagline')}</span>
          </span>
        </a>

        <nav className="nav nav-desktop" aria-label="Primary">
          {navLinks.map((link) => renderNavLink(link))}
        </nav>

        <div className="header-actions">
          <a className="btn small ghost desktop-only" href="#contact">
            {t('hero.ctaPrimary')}
          </a>
          <ThemeToggle />
          <LocaleToggle />
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          className="mobile-menu-close"
          onClick={closeMenu}
          aria-label="Close menu"
          tabIndex={mobileMenuOpen ? 0 : -1}
        >
          <CloseIcon size={24} />
        </button>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map((link) => renderNavLink(link, closeMenu))}
          {/* biome-ignore lint/a11y/useValidAnchor: anchor navigates to contact section */}
          <a className="btn primary" href="#contact" onClick={closeMenu}>
            {t('hero.ctaPrimary')}
          </a>
        </nav>
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-menu-overlay"
          onClick={closeMenu}
          aria-label="Close menu"
          tabIndex={-1}
        />
      )}
    </header>
  );
}
