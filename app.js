/**
 * El contenido principal está en HTML para que los proyectos sigan disponibles
 * sin JavaScript ni acceso a GitHub. La consulta de actividad es opcional y solo
 * lee repositorios públicos, sin claves ni tokens en el navegador.
 */
const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('#nav-links');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); }
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  links.classList.toggle('open', open);
});
links?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.section-heading,.project,.skill-row,.education-card').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
}

const sync = document.querySelector('#sync-github');
sync?.addEventListener('click', async () => {
  const status = document.querySelector('#sync-status');
  sync.disabled = true;
  status.textContent = 'Consultando repositorios públicos…';
  try {
    await Promise.all([...document.querySelectorAll('[data-repo]')].map(async card => {
      const response = await fetch(`https://api.github.com/repos/bastiiiuuu/${encodeURIComponent(card.dataset.repo)}`, { signal: AbortSignal.timeout(8000), headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error('GitHub no respondió.');
      const data = await response.json();
      if (data.pushed_at) card.querySelector('.repo-update').textContent = 'Último push: '+new Intl.DateTimeFormat('es-CL',{dateStyle:'medium'}).format(new Date(data.pushed_at));
    }));
    status.textContent = 'Actividad consultada en GitHub. Las fechas indican pushes, no años de experiencia.';
  } catch {
    status.textContent = 'No fue posible consultar la actividad. Puedes abrir los repositorios directamente desde sus enlaces.';
  } finally { sync.disabled = false; }
});
