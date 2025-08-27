// Navegação entre "telas"
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const telas = document.querySelectorAll('.tela');

  function mostrar(id){
    telas.forEach(sec => sec.classList.add('hidden'));
    document.getElementById(id)?.classList.remove('hidden');
    tabs.forEach(b => b.classList.toggle('ativo', b.dataset.target === id));
    localStorage.setItem('rota', id);
    document.getElementById('app')?.focus({preventScroll:true});
  }

  // rota inicial
  mostrar(localStorage.getItem('rota') || 'tela-inicio');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => mostrar(btn.dataset.target));
  });

  // Quiz
  const form = document.getElementById('quiz-form');
  const resEl = document.getElementById('quiz-resultado');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const marcada = form.querySelector('input[name="q1"]:checked');
      if(!marcada){
        resEl.textContent = 'Selecione uma alternativa.';
        resEl.style.color = 'var(--warn)';
        return;
      }
      const correta = '2';
      if(marcada.value === correta){
        resEl.innerHTML = '✅ Correto! A <strong>Lei 10.639/2003</strong> tornou obrigatório o ensino da história e cultura afro-brasileira.';
        resEl.style.color = 'var(--ok)';
      }else{
        resEl.innerHTML = '❌ Não foi dessa vez. Resposta correta: <strong>Lei 10.639/2003</strong>.';
        resEl.style.color = 'var(--err)';
      }
    });
  }

  // PWA: registrar Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  }
});
