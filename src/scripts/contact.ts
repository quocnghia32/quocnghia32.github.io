import { buildMailto, validateMessage, type Message } from '../lib/contact';

interface CopyOptions {
  writeText?: (text: string) => Promise<void>;
  resetMs?: number;
}

export function initCopy(root: ParentNode, opts: CopyOptions = {}): void {
  const writeText = opts.writeText ?? ((t: string) => navigator.clipboard.writeText(t));
  const resetMs = opts.resetMs ?? 1600;
  for (const btn of root.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    const label = btn.textContent!.trim();
    btn.addEventListener('click', async () => {
      try {
        await writeText(btn.dataset.copy!);
        btn.textContent = 'Copied ✓';
      } catch {
        btn.textContent = 'Copy failed';
      }
      setTimeout(() => (btn.textContent = label), resetMs);
    });
  }
}

type MailtoHook = { __onMailto?: (url: string) => void };

/** E2E tests set window.__onMailto to observe the mailto URL instead of opening a mail client. */
export function defaultNavigate(url: string): void {
  const hook = (window as unknown as MailtoHook).__onMailto;
  if (hook) hook(url);
  else window.location.assign(url);
}

export function initContactForm(
  root: ParentNode,
  navigate: (url: string) => void = defaultNavigate,
): void {
  const form = root.querySelector<HTMLFormElement>('[data-contact]');
  if (!form) return;
  const field = (name: keyof Message) => form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`)!;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg: Message = { name: field('name').value, email: field('email').value, message: field('message').value };
    const errors = validateMessage(msg);
    for (const key of ['name', 'email', 'message'] as const) {
      const out = form.querySelector(`[data-error-for="${key}"]`)!;
      out.textContent = errors[key] ?? '';
      if (errors[key]) field(key).setAttribute('aria-invalid', 'true');
      else field(key).removeAttribute('aria-invalid');
    }
    if (Object.keys(errors).length) return;
    navigate(buildMailto(form.dataset.to!, msg));
  });
}
