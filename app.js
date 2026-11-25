/**
 * La navegación y el contenido funcionan sin JavaScript. Este módulo añade el
 * menú móvil, orientación de sección, ampliación de imágenes y una consulta
 * opcional a GitHub; ningún recorrido necesita credenciales o datos privados.
 */
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-links');
function closeMenu() {
  menu?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('open');
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation?.classList.toggle('open', open);
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});

// Una sección activa orienta al lector sin alterar el historial ni mover el foco.
if ('IntersectionObserver' in window) {
  const sectionLinks = [...document.querySelectorAll('.nav-links a, .case-toc a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of sectionLinks) {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
}

const lightbox = document.querySelector('.lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('p');
  let opener;
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      opener = link;
      const figure = link.closest('figure');
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      caption.textContent = [...figure.querySelector('figcaption').children].map(element => element.textContent).join('. ');
      lightbox.showModal();
    });
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  // El diálogo nativo contiene el foco y permite Escape; al cerrar se vuelve a la imagen elegida.
  lightbox.addEventListener('close', () => opener?.focus());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      const rect = lightbox.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) lightbox.close();
    }
  });
}

const sync = document.querySelector('#sync-github');
sync?.addEventListener('click', async () => {
  const status = document.querySelector('#sync-status');
  const cards = [...document.querySelectorAll('[data-repo]')].filter(card => card.dataset.repo);
  sync.disabled = true;
  status.textContent = 'Consultando actividad pública…';
  try {
    await Promise.all(cards.map(async card => {
      const response = await fetch(`https://api.github.com/repos/bastiiiuuu/${encodeURIComponent(card.dataset.repo)}`, {
        signal: AbortSignal.timeout(8000), headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error('No se pudo consultar el repositorio.');
      const data = await response.json();
      const label = card.querySelector('.repo-update');
      if (data.pushed_at && label) label.textContent = 'Último push: ' + new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(new Date(data.pushed_at));
    }));
    status.textContent = 'Actividad consultada. Puedes revisar los cambios desde cada repositorio.';
  } catch {
    status.textContent = 'GitHub no está disponible para esta consulta. Los enlaces a los proyectos siguen disponibles.';
  } finally {
    sync.disabled = false;
  }
});

/**
 * Las entradas se animan al llegar al área visible, sin ocultar contenido en CSS.
 * Si JavaScript falla o se prefiere menos movimiento, las páginas siguen visibles.
 */
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const activeAnimations = new Set();
  const entranceObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entranceObserver.unobserve(entry.target);
      if (motionPreference.matches || typeof entry.target.animate !== 'function') continue;
      const animation = entry.target.animate([
        { opacity: 0.2, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)' });
      activeAnimations.add(animation);
      animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.project-feature,.project-row,.profile-copy,.technology-table>div,.timeline article,.method-grid article,.case-article section').forEach(element => entranceObserver.observe(element));
  motionPreference.addEventListener('change', event => {
    if (!event.matches) return;
    entranceObserver.disconnect();
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations.clear();
  });
}
