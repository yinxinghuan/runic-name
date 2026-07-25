import { loadImage, times, vevet } from '@anton.bobrov/vevet-init';
import { WebglManager } from './webgl/Manager';
import { Items } from './Items';
import { nameToGlyphs } from './glyphs';
import { resolveIdentityName } from './identity';

const managerContainer = document.getElementById('scene') as HTMLElement;

const manager = new WebglManager(managerContainer, {
  cameraProps: { fov: 50, perspective: 800 },
  rendererProps: {
    dpr: vevet.viewport.lowerDesktopDpr,
    antialias: false,
  },
});

manager.play();

const query = new URLSearchParams(window.location.search);
const isBaselineMode = query.get('baseline') === '1';

function setIdentity(name: string) {
  document
    .querySelectorAll<HTMLElement>('[data-identity-name]')
    .forEach((element) => {
      element.replaceChildren(name);
    });
}

async function initialize() {
  const identityName = isBaselineMode ? 'RUNES' : await resolveIdentityName();
  setIdentity(identityName);

  const glyphs = isBaselineMode
    ? times((index) => index, 24)
    : nameToGlyphs(identityName);
  const imageSrcs = glyphs.map((index) => `${index}.png`);
  let loadCount = 0;

  function handleLoaded() {
    loadCount += 1;

    manager.container.setAttribute(
      'data-is-loaded',
      `${loadCount / (imageSrcs.length + 1)}`,
    );
  }

  const loaders = imageSrcs.map((image) => loadImage(image));
  loaders.forEach((loader) => {
    loader.then(() => handleLoaded()).catch(() => {});
  });

  const images = await Promise.all(loaders);
  let isCompleted = false;
  let audioContext: AudioContext | null = null;
  let lastStep = -1;
  const ghost = document.getElementById('ghost');
  const sealed = document.getElementById('sealed');
  const scene = document.getElementById('scene');

  function tone(progress: number) {
    if (!audioContext) return;
    const step = Math.round(progress * (images.length - 1));
    if (step === lastStep) return;
    lastStep = step;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 190 + (step % 8) * 17;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.025,
      audioContext.currentTime + 0.01,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.055,
    );
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.06);
  }

  const items = new Items({
    manager,
    images,
    onInteract: () => {
      ghost?.classList.remove('runic-ghost--show');
      if (!audioContext) {
        audioContext = new AudioContext();
      }
    },
    onProgress: (progress) => {
      document.documentElement.style.setProperty(
        '--runic-progress',
        progress.toFixed(4),
      );
      tone(progress);
      if (progress > 0.985 && !isCompleted) {
        isCompleted = true;
        sealed?.classList.add('runic-sealed--show');
        window.setTimeout(
          () => sealed?.classList.remove('runic-sealed--show'),
          1600,
        );
      } else if (progress < 0.9) {
        isCompleted = false;
      }
    },
  });

  scene?.classList.add('runic-ready');
  handleLoaded();

  if (
    !isBaselineMode &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.setTimeout(() => {
      ghost?.classList.add('runic-ghost--show');
      items.demo();
    }, 950);
  }
}

initialize().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  document.getElementById('preloader')?.setAttribute('hidden', '');
  document.getElementById('error')?.removeAttribute('hidden');
});
