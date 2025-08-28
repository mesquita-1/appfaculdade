// Navegação entre "telas"
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const telas = document.querySelectorAll('.tela');

  function mostrar(id) {
    telas.forEach(sec => sec.classList.add('hidden'));
    document.getElementById(id)?.classList.remove('hidden');

    tabs.forEach(b => {
      const isActive = b.dataset.target === id;
      b.classList.toggle('ativo', isActive);
      b.setAttribute('aria-pressed', isActive);
    });

    localStorage.setItem('rota', id);
    document.getElementById('app')?.focus({ preventScroll: true });
  }

  // rota inicial
  mostrar(localStorage.getItem('rota') || 'tela-inicio');
  tabs.forEach(btn => btn.addEventListener('click', () => mostrar(btn.dataset.target)));

  // QUIZ (3 perguntas)
  const form = document.getElementById('quiz-form');
  const resEl = document.getElementById('quiz-resultado');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const gabarito = { q1: 'B', q2: 'A', q3: 'B' };
      const respostas = {
        q1: form.querySelector('input[name="q1"]:checked')?.value || null,
        q2: form.querySelector('input[name="q2"]:checked')?.value || null,
        q3: form.querySelector('input[name="q3"]:checked')?.value || null,
      };

      if (!respostas.q1 || !respostas.q2 || !respostas.q3) {
        resEl.textContent = 'Responda todas as perguntas antes de enviar.';
        resEl.style.color = 'var(--warn)';
        resEl.style.borderLeftColor = 'var(--warn)';
        return;
      }

      let score = 0;
      Object.keys(gabarito).forEach(k => { if (respostas[k] === gabarito[k]) score++; });

      const msgs = {
        3: '✅ Excelente! Você acertou todas.',
        2: '👍 Muito bom! Você acertou 2 de 3.',
        1: '🟡 Você acertou 1 de 3. Revise a seção “Base legal e um marco recente”.',
        0: '❌ Não foi desta vez. Releia o conteúdo e tente novamente!',
      };
      resEl.innerHTML = `<strong>Resultado:</strong> ${score}/3<br>${msgs[score]}`;

      const color = score === 3 ? 'var(--ok)' : score === 0 ? 'var(--err)' : 'var(--warn)';
      resEl.style.color = color;
      resEl.style.borderLeftColor = color;
    });
  }

  // PWA — registrar Service Worker (somente HTTPS/localhost)
  if ('serviceWorker' in navigator) {
    const isLocalhost = ['localhost', '127.0.0.1'].includes(location.hostname);
    const isHttps = location.protocol === 'https:';
    if (isHttps || isLocalhost) {
      navigator.serviceWorker.register('./sw.js').catch(console.error);
    } else {
      console.info('SW desativado: use HTTPS ou localhost.');
    }
  }
});
