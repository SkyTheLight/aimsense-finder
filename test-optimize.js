const r = require('https');
const body = JSON.stringify({
  dpi: 800,
  inGameSens: 0.75,
  playstyle: 'wrist',
  mouseGrip: 'claw',
  game: 'valorant',
  tracking: 75,
  flickPrecision: 55,
  consistency: 68,
  accuracy: 72,
  speed: 65,
  previousSession: {
    tracking: 68,
    flickPrecision: 50,
    consistency: 60,
    sens: 0.80
  }
});
const req = r.request({
  hostname: 'truesens.vercel.app',
  path: '/api/optimize',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': body.length
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const json = JSON.parse(d);
    console.log('=== PERFORMANCE SUMMARY ===');
    console.log('Score:', json.performanceSummary.score);
    console.log('Rank:', json.performanceSummary.rank);
    console.log('Trend:', json.performanceSummary.trend);
    console.log('\n=== AIM ANALYSIS ===');
    console.log('Classification:', json.aimAnalysis.classification);
    console.log('Strength:', json.aimAnalysis.coreStrength);
    console.log('Issues:', json.aimAnalysis.issues.join(', '));
    console.log('\n=== SENSITIVITY OPTIMIZATION ===');
    console.log('Recommended:', json.sensitivityOptimization.recommendedSens);
    console.log('Range:', json.sensitivityOptimization.optimalRange.min, '-', json.sensitivityOptimization.optimalRange.max);
    console.log('Adjustment:', json.sensitivityOptimization.adjustment);
    console.log('Reasoning:', json.sensitivityOptimization.reasoning.join(', '));
    console.log('\n=== TRAINING ===');
    console.log('Focus:', json.trainingPlan.focus);
    console.log('Drills:', json.trainingPlan.drills.join(', '));
    console.log('\n=== AI INSIGHTS ===');
    console.log('Conditional Up:', json.feedback.conditionalUp);
    console.log('Conditional Down:', json.feedback.conditionalDown);
    console.log('Fallback:', json.fallback ? 'YES' : 'NO (AI ACTIVE!)');
  });
});
req.write(body);
req.end();