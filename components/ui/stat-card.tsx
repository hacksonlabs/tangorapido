'use client';

type StatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export const StatCard = ({ label, value, helper }: StatCardProps) => (
  <article className="card-surface flex flex-col gap-3 p-6">
    <span className="text-sm font-semibold uppercase tracking-wide text-brand-accent">{label}</span>
    <span className="text-4xl font-extrabold text-white">{value}</span>
    {helper ? <p className="text-base text-white/70">{helper}</p> : null}
  </article>
);
