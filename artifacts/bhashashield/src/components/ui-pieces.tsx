import { AlertTriangle, Check, CheckCircle2, Info, LoaderCircle, LockKeyhole, XCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[.2em] text-primary">{eyebrow}</p><h1 className="text-[28px] font-extrabold tracking-[-.045em] text-foreground md:text-[34px]">{title}</h1><p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{description}</p></div>{action}</div>;
}

export function Skeleton({ className = '' }: { className?: string }) { return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />; }
export function ErrorState({ message = 'We could not load this view.' }: { message?: string }) { return <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-8 text-center"><XCircle className="mx-auto mb-3 text-destructive" size={22} /><p className="text-sm font-semibold">{message}</p><p className="mt-1 text-xs text-muted-foreground">Check your connection and try again.</p></div>; }
export function EmptyState({ title, body, icon: Icon = Info }: { title: string; body: string; icon?: typeof Info }) { return <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center"><Icon className="mx-auto mb-3 text-primary/70" size={25} /><p className="text-sm font-bold">{title}</p><p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{body}</p></div>; }

export function RiskBadge({ level }: { level: string }) {
  const lower = level.toLowerCase();
  const risk = lower.includes('high') || lower.includes('critical');
  const safe = lower.includes('low') || lower.includes('safe');
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[.08em] ${risk ? 'bg-[#f8e2dd] text-[#a54635]' : safe ? 'bg-[#dceee8] text-[#237464]' : 'bg-[#f5ead0] text-[#896b24]'}`}><span className="size-1.5 rounded-full bg-current" />{level}</span>;
}

export function MetricCard({ label, value, note, accent = 'teal' }: { label: string; value: string | number; note: string; accent?: 'teal' | 'orange' | 'navy' }) {
  return <div className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-5 shadow-[var(--shadow-sm)]"><div className={`absolute left-0 top-0 h-full w-1 ${accent === 'orange' ? 'bg-accent' : accent === 'navy' ? 'bg-sidebar' : 'bg-primary'}`} /><p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">{label}</p><p className="mt-3 text-[27px] font-extrabold tracking-[-.05em]">{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{note}</p></div>;
}

export function ProtectedNote({ children }: { children: ReactNode }) { return <div className="flex items-start gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground"><LockKeyhole size={14} className="mt-0.5 shrink-0 text-primary" />{children}</div>; }
export function LoadingButton({ loading, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) { return <button {...props} disabled={loading || props.disabled} className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[12px] font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${props.className ?? ''}`}>{loading && <LoaderCircle size={15} className="animate-spin" />}{children}</button>; }
export const SuccessIcon = () => <CheckCircle2 size={16} className="text-primary" />;
export const WarningIcon = () => <AlertTriangle size={16} className="text-accent-foreground" />;