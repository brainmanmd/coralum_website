export default function MedicareBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-coralum-navy/10 bg-[#ebf5f2] px-3 py-2">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-coralum-blue">
        <span className="font-body text-[10px] font-bold text-white opacity-90">M</span>
      </span>
      <span className="font-body text-sm text-coralum-navy">
        Covered by Medicare and other health plans. No hidden fees.
      </span>
    </span>
  );
}
