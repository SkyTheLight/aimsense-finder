interface ArchitectureOutput {
  currentFlow: string;
  bottlenecks: { location: string; issue: string; severity: 'high' | 'medium' | 'low' }[];
  improvements: { area: string; suggestion: string; priority: 'high' | 'medium' | 'low' }[];
  intelligenceUpgrades: { type: string; upgrade: string; impact: string }[];
}

export function generateArchitecture(): ArchitectureOutput {
  return {
    currentFlow: 'User Input → Analysis Engine → Coach Decision → Output Display',
    
    bottlenecks: [
      { location: 'Analysis to Coach bridge', issue: 'Manual conversion between analysis output and coach input', severity: 'medium' },
      { location: 'History tracking', issue: 'No persistent session storage for progress tracking', severity: 'high' },
      { location: 'Adaptation loop', issue: 'No feedback mechanism for user to report results', severity: 'high' },
      { location: 'Dashboard mode', issue: 'Not yet integrated into UI', severity: 'medium' },
      { location: 'Learning mode', issue: 'No rule adjustment engine built', severity: 'medium' },
    ],
    
    improvements: [
      { area: 'Backend', suggestion: 'Add session storage API for persistent history', priority: 'high' },
      { area: 'Frontend', suggestion: 'Create progress/dashboard page', priority: 'high' },
      { area: 'UI', suggestion: 'Add feedback buttons on ResultsStep (A/B/C/D options)', priority: 'high' },
      { area: 'Analysis', suggestion: 'Add time-of-day weighting for fatigue detection', priority: 'medium' },
      { area: 'Coach', suggestion: 'Add comparison with previous session in decision output', priority: 'low' },
    ],
    
    intelligenceUpgrades: [
      { type: 'Memory', upgrade: 'Track last 30 sessions with timestamps', impact: 'Enable trend analysis' },
      { type: 'Scoring', upgrade: 'Add weighted consistency score (recent sessions weighted higher)', impact: 'More accurate trend detection' },
      { type: 'Adaptation', upgrade: 'Add user feedback loop - record what user selected from A/B/C/D', impact: 'Self-improving recommendations' },
      { type: 'Multi-modal', upgrade: 'Add video upload for form analysis', impact: 'Posture/grip analysis from clips' },
    ],
  };
}

export function formatArchitecture(output: ArchitectureOutput): string {
  return `🏗 CURRENT SYSTEM FLOW
${output.currentFlow}

🔧 BOTTLENECKS
${output.bottlenecks.map(b => `[${b.severity}] ${b.location}: ${b.issue}`).join('\n')}

🚀 IMPROVEMENTS
${output.improvements.map(i => `[${i.priority}] ${i.area}: ${i.suggestion}`).join('\n')}

🧠 INTELLIGENCE UPGRADES
${output.intelligenceUpgrades.map(u => `${u.type}: ${u.upgrade} → ${u.impact}`).join('\n')}`;
}