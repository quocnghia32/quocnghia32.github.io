/** Buttons with aria-controls toggle the `hidden` panel they point at. */
export function initPubToggles(root: ParentNode): void {
  for (const btn of root.querySelectorAll<HTMLButtonElement>('[data-toggle][aria-controls]')) {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls')!);
      if (!panel) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    });
  }
}
