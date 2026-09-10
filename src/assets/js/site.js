// Loaded in <head> without defer so the `js` class lands before first paint:
// the collapsed mobile menu applies only when this script is here to open it
// again. Without JavaScript the navigation stays a plain, wrapped list.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const button = nav?.querySelector('.menu-button');
  const list = nav?.querySelector('.site-nav__list');
  if (!nav || !button || !list) return;

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  };

  button.addEventListener('click', () => setOpen(!isOpen()));

  // Every menu entry is an in-page anchor or a new page; either way the menu
  // has done its job once one is chosen.
  list.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });
});
