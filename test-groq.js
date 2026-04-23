const r = require('https');
const k = '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';
const body = JSON.stringify({
  model: 'llama-3.1-8b-instant',
  input: 'Return ONLY JSON: {"test":"works"}'
});
const req = r.request({
  hostname: 'api.groq.com',
  path: '/openai/v1/responses',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + k,
    'Content-Type': 'application/json',
    'Content-Length': body.length
  }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const j = JSON.parse(d);
    const msg = j.output.find(o => o.type === 'message');
    const txt = msg.content[0].text;
    console.log('Text:', txt);
    try {
      const p = JSON.parse(txt);
      console.log('Parsed OK:', p);
    } catch (e) {
      console.log('Parse error');
    }
  });
});
req.write(body);
req.end();