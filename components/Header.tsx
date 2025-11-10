"use client";
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import Logo from './Logo';
import SearchModal from './SearchModal';
import CartCounter from './CartCounter';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('Header');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-fetra-olive to-fetra-pink text-white text-center py-2 px-4 text-sm font-medium">
        {t('announcement', { code: t('promoCode') })}
      </div>

      {/* Main header */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md' 
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            {/* Left: Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex-shrink-0 transition-transform hover:scale-[1.02] active:scale-95">
                <Logo />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link
                  href="/product"
                  className="text-gray-700 hover:text-fetra-olive font-medium transition-colors relative group"
                >
                  {t('ritual')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fetra-olive transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/products"
                  className="text-gray-700 hover:text-fetra-olive font-medium transition-colors relative group"
                >
                  {t('catalog')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fetra-olive transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-fetra-olive font-medium transition-colors relative group"
                >
                  {t('ourStory')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fetra-olive transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-700 hover:text-fetra-olive font-medium transition-colors relative group"
                >
                  {t('tips')}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-fetra-olive transition-all group-hover:w-full"></span>
                </Link>
              </nav>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label={t('search')}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Account */}
              <Link
                href="/login"
                aria-label={t('myAccount')}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Language Switcher */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label={t('cart')}
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <CartCounterBadge />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={t('menu')}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-fetra-olive/30"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
              <div className="px-4 py-4 space-y-1">
                <Link
                  href="/product"
                  className="block px-4 py-3 text-gray-700 hover:bg-fetra-olive/5 hover:text-fetra-olive rounded-lg transition-colors font-medium"
                >
                  {t('ritual')}
                </Link>
                <Link
                  href="/products"
                  className="block px-4 py-3 text-gray-700 hover:bg-fetra-olive/5 hover:text-fetra-olive rounded-lg transition-colors font-medium"
                >
                  {t('catalog')}
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-3 text-gray-700 hover:bg-fetra-olive/5 hover:text-fetra-olive rounded-lg transition-colors font-medium"
                >
                  {t('ourStory')}
                </Link>
                <Link
                  href="/blog"
                  className="block px-4 py-3 text-gray-700 hover:bg-fetra-olive/5 hover:text-fetra-olive rounded-lg transition-colors font-medium"
                >
                  {t('tips')}
                </Link>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-fetra-olive/5 hover:text-fetra-olive rounded-lg transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t('myAccount')}
                  </Link>
                  <Link
                    href="/search"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-fetra-olive/5 hover:text-fetra-olive rounded-lg transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t('search')}
                  </Link>
                  <div className="px-4 py-3">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

function CartCounterBadge() {
  const count = CartCounter();
  
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 bg-fetra-pink text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {count}
    </span>
  );
}
