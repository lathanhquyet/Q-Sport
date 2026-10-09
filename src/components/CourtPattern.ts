export function renderCourtHeroPattern(): string {
  return `
    <div style="position: absolute; inset: 0; pointer-events: none; overflow: hidden; opacity: 0.35; z-index: 0;">
      <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="400" fill="var(--color-mint)" />
        <!-- Court Outer Border -->
        <rect x="40" y="30" width="720" height="340" fill="none" stroke="var(--color-mint-line)" stroke-width="2" />
        <!-- Center Net Line -->
        <line x1="400" y1="30" x2="400" y2="370" stroke="var(--color-court)" stroke-width="2.5" stroke-dasharray="6,4" />
        <!-- Service Lines Left & Right -->
        <line x1="160" y1="30" x2="160" y2="370" stroke="var(--color-mint-line)" stroke-width="1.5" />
        <line x1="640" y1="30" x2="640" y2="370" stroke="var(--color-mint-line)" stroke-width="1.5" />
        <!-- Center Line Left & Right -->
        <line x1="40" y1="200" x2="160" y2="200" stroke="var(--color-mint-line)" stroke-width="1.5" />
        <line x1="640" y1="200" x2="760" y2="200" stroke="var(--color-mint-line)" stroke-width="1.5" />
        <!-- Singles Side Lines -->
        <line x1="40" y1="60" x2="760" y2="60" stroke="var(--color-mint-line)" stroke-width="1.5" />
        <line x1="40" y1="340" x2="760" y2="340" stroke="var(--color-mint-line)" stroke-width="1.5" />
      </svg>
    </div>
  `;
}
