export default function ProgressBar({ steps, currentStep }) {
  const pct = (currentStep / (steps.length - 1)) * 100;

  return (
    <div>
      <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
        <div
          className="h-full bg-copper transition-all duration-500 ease-confident"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-3">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`text-[10px] uppercase tracking-widest2 ${i <= currentStep ? 'text-copper' : 'text-text-muted'}`}
          >
            {String(i + 1).padStart(2, '0')}
            <span className="hidden sm:inline"> {label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
