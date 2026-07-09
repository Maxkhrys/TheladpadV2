export default function SectionLabel({ number, children, tone = 'dark' }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {number && (
        <span className={`text-xs font-sans tracking-widest2 ${tone === 'dark' ? 'text-copper' : 'text-copper-deep'}`}>
          {number}
        </span>
      )}
      <span
        className={`font-sans uppercase tracking-widest2 text-xs font-medium ${
          tone === 'dark' ? 'text-copper' : 'text-copper-deep'
        }`}
      >
        {children}
      </span>
    </div>
  );
}
