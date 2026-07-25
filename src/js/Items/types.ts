import { WebglManager } from '../webgl/Manager';

export type TProps = {
  manager: WebglManager;
  images: HTMLImageElement[];
  onProgress?: (progress: number) => void;
  onInteract?: () => void;
};
