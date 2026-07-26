const fetch = globalThis.fetch || require('node-fetch');
async function run() {
  const base = 'http://127.0.0.1:5000';
  const tests = [
    { name: 'questions', method: 'POST', path: '/api/interview/questions', body: { role: 'Backend', experience: 'Mid', question_type: 'Algorithms', num_questions: 3 } },
    { name: 'evaluate', method: 'POST', path: '/api/interview/evaluate', body: { question: 'What is a REST API?', answer: 'A REST API is an interface that uses HTTP methods to access resources.' } },
    { name: 'improve', method: 'POST', path: '/api/interview/improve', body: { question: 'What is a REST API?', answer: 'It is an API that uses HTTP.' } },
    { name: 'saveSession', method: 'POST', path: '/api/interview/sessions', body: { role: 'Backend', question_type: 'Algorithms', mode: 'practice', experience: 'Mid', company: '', num_questions: 1, avg_score: 8, questions: ['What is HTTP?'], answers: { 0: 'It is the protocol used by web browsers.' }, evaluations: { 0: { score: 8, feedback: 'Good' } } } },
    { name: 'getSessions', method: 'GET', path: '/api/interview/sessions' }
  ];

  for (const test of tests) {
    const opts = { method: test.method, headers: { 'Content-Type': 'application/json' } };
    if (test.body) opts.body = JSON.stringify(test.body);
    const res = await fetch(base + test.path, opts);
    const text = await res.text();
    console.log('---', test.name, res.status);
    console.log(text.slice(0, 1500));
    if (!res.ok) {
      console.error('FAILED', test.name);
      process.exit(1);
    }
  }
}
run().catch((err) => { console.error(err); process.exit(1); });