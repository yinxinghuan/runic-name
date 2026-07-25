import '../styles/index.scss';
import { Preloader } from './Preloader';
import './initScene';

const preloaderContainer = document.getElementById('preloader') as HTMLElement;
const query = new URLSearchParams(window.location.search);
document.documentElement.dataset.baseline =
  query.get('baseline') === '1' ? 'true' : 'false';

const localeOverride = localStorage.getItem('game_locale');
let locale: 'zh' | 'en' = navigator.language.toLowerCase().startsWith('zh')
  ? 'zh'
  : 'en';
if (localeOverride === 'en' || localeOverride === 'zh') {
  locale = localeOverride;
}
const copy = {
  zh: { sealed: '名字已封存', error: '符文没有出现', retry: '重新载入' },
  en: { sealed: 'NAME SEALED', error: 'RUNES NOT FOUND', retry: 'RELOAD' },
}[locale];
document.querySelector<HTMLElement>('[data-sealed-label]')!.textContent =
  copy.sealed;
document.querySelector<HTMLElement>('[data-error-label]')!.textContent =
  copy.error;
document.querySelector<HTMLButtonElement>('[data-retry]')!.textContent =
  copy.retry;
document
  .querySelector<HTMLButtonElement>('[data-retry]')!
  .addEventListener('click', () => window.location.reload());

// eslint-disable-next-line no-new
new Preloader({
  container: preloaderContainer,
});
