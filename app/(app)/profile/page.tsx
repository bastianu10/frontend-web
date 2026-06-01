'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth/logout';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { LogOut, User, Mail, Info, Code, Pencil, Check, X } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const name = user?.displayName ?? 'User';
  const email = user?.email ?? '';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(name);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState('');

  const handleSaveName = async () => {
    if (!nameInput.trim()) { setNameError('Name cannot be empty'); return; }
    setSaving(true);
    setNameError('');
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: nameInput.trim() });
        await auth.currentUser.reload();
      }
      setEditing(false);
    } catch {
      setNameError('Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setNameInput(name);
    setNameError('');
    setEditing(false);
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to log out?')) return;
    await logout();
    router.replace('/login');
  };

  return (
    <>
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary">Profile</h1>
      </div>

      {/* Avatar card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col items-center mb-4 sm:mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-accent/30">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">{initials}</span>
        </div>
        <p className="text-primary font-bold text-lg sm:text-xl text-center break-all">{name}</p>
        <p className="text-secondary text-xs sm:text-sm mt-1 text-center break-all">{email}</p>
      </div>

      {/* Account */}
      <SectionLabel>Account</SectionLabel>
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4 sm:mb-6">
        {/* Name row with edit */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-border rounded-lg flex items-center justify-center text-secondary shrink-0">
            <User size={15} />
          </div>
          <span className="text-secondary text-xs sm:text-sm flex-1">Name</span>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelEdit(); }}
                autoFocus
                className="bg-[#252729] border border-border rounded-lg px-3 py-1.5 text-primary text-xs sm:text-sm focus:outline-none focus:border-accent w-32 sm:w-40"
              />
              <button onClick={handleSaveName} disabled={saving}
                className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center hover:bg-accent/80 transition-colors disabled:opacity-50">
                <Check size={13} className="text-white" />
              </button>
              <button onClick={handleCancelEdit}
                className="w-7 h-7 bg-border rounded-lg flex items-center justify-center hover:bg-[#3a3f43] transition-colors">
                <X size={13} className="text-secondary" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-primary text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-[160px] text-right">{name}</span>
              <button onClick={() => { setNameInput(name); setEditing(true); }}
                className="w-7 h-7 bg-border rounded-lg flex items-center justify-center hover:bg-[#3a3f43] transition-colors">
                <Pencil size={12} className="text-secondary" />
              </button>
            </div>
          )}
        </div>
        {nameError && (
          <p className="text-red-400 text-xs px-5 pb-2">{nameError}</p>
        )}
        <div className="h-px bg-border ml-14" />
        <Row icon={<Mail size={15} />} label="Email" value={email} />
      </div>

      {/* About */}
      <SectionLabel>About</SectionLabel>
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4 sm:mb-6">
        <Row icon={<Info size={15} />} label="Version" value="1.0.0" />
        <div className="h-px bg-border ml-14" />
        <Row icon={<Code size={15} />} label="Built with" value="Next.js + Firebase" />
      </div>

      {/* Log Out */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-400 font-bold py-3 sm:py-3.5 rounded-xl hover:bg-red-500/10 active:scale-[0.98] transition-all text-sm"
      >
        <LogOut size={16} /> Log Out
      </button>
    </>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-widest mb-2 sm:mb-3 ml-1">
      {children}
    </p>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4">
      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-border rounded-lg flex items-center justify-center text-secondary shrink-0">
        {icon}
      </div>
      <span className="text-secondary text-xs sm:text-sm flex-1">{label}</span>
      <span className="text-primary text-xs sm:text-sm font-medium truncate max-w-[50%] text-right">{value}</span>
    </div>
  );
}
