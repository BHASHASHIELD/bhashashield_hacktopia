import { Activity, BookOpenCheck, ChevronRight, CircleHelp, Menu, ShieldCheck, UsersRound, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState, type ReactNode } from 'react';

const navigation = [
  { href: '/', label: 'Live workspace', icon: Activity },
  { href: '/trusted', label: 'Trusted people', icon: UsersRound },
  { href: '/directory', label: 'Verify a number', icon: BookOpenCheck },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="noise min-h-[100dvh] bg-background">
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-[246px] flex-col bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between px-2">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3" data-testid="link-brand">
            <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"><ShieldCheck size={20} strokeWidth={2.5} /></span>
            <span><span className="block text-[15px] font-extrabold tracking-[-.03em] text-sidebar-accent-foreground">BhashaShield</span><span className="font-mono text-[9px] uppercase tracking-[.2em] text-sidebar-foreground/60">command center</span></span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-sidebar-foreground/70 lg:hidden" data-testid="button-close-navigation"><X size={18} /></button>
        </div>
        <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[.16em] text-sidebar-foreground/45">Navigate</p>
        <nav className="space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition-colors ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'}`}>
              <Icon size={17} className={active ? 'text-sidebar-primary' : 'text-sidebar-foreground/55'} /><span>{label}</span>{active && <ChevronRight size={14} className="ml-auto text-sidebar-primary" />}
            </Link>;
          })}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-3.5">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold text-sidebar-accent-foreground"><span className="size-2 rounded-full bg-sidebar-primary animate-pulse-soft" />Protection active</div>
            <p className="text-[11px] leading-relaxed text-sidebar-foreground/60">Your decisions stay on this device when offline.</p>
          </div>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground" data-testid="button-help"><CircleHelp size={16} /> How BhashaShield works</button>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-sidebar/40 lg:hidden" onClick={() => setMobileOpen(false)} data-testid="button-navigation-backdrop" />}
      <div className="lg:pl-[246px]">
        <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur-md md:px-8">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden" data-testid="button-open-navigation"><Menu size={20} /></button>
          <div className="hidden items-center gap-2 text-[12px] text-muted-foreground lg:flex"><span className="font-mono text-[10px] uppercase tracking-[.14em]">Protected session</span><span className="size-1 rounded-full bg-accent" /><span>Private workspace</span></div>
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" /> Offline-ready</div>
            <div className="grid size-8 place-items-center rounded-full bg-secondary font-mono text-[11px] font-medium text-secondary-foreground">AR</div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-5 py-7 md:px-8 md:py-9">{children}</main>
      </div>
    </div>
  );
}