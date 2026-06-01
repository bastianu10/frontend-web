'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Home, Search, User, LogOut, CheckSquare, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/auth/logout';

const links = [
  { href: '/home',    label: 'Home',    icon: Home },
  { href: '/search',  label: 'Search',  icon: Search },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to sign out?')) return;
    await logout();
    router.replace('/login');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 min-h-screen bg-card border-r border-border flex-col fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
              <CheckSquare size={18} color="white" />
            </div>
            <span className="text-primary font-bold text-lg">TodoApp</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                isActive(href) ? 'bg-accent/15 text-accent' : 'text-secondary hover:bg-card-2 hover:text-primary'
              }`}
            >
              <Icon size={18} />{label}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-border">
          <p className="text-xs text-muted truncate px-4 mb-2">{user?.email}</p>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={18} />Log Out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <CheckSquare size={16} color="white" />
          </div>
          <span className="text-primary font-bold">TodoApp</span>
        </div>
        <button onClick={() => setMobileOpen(v => !v)}
          className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-card-2 transition-colors">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
          <div className="md:hidden fixed top-14 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 space-y-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive(href) ? 'bg-accent/15 text-accent' : 'text-secondary hover:bg-card-2 hover:text-primary'
                }`}
              >
                <Icon size={18} />{label}
              </Link>
            ))}
            <div className="h-px bg-border my-1" />
            <p className="text-xs text-muted px-4 py-1 truncate">{user?.email}</p>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={18} />Log Out
            </button>
          </div>
        </>
      )}

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors ${
              isActive(href) ? 'text-accent' : 'text-muted'
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
