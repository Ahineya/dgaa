import {StoreSubject} from "@dgaa/store-subject";

class MainStore {
  public image = new StoreSubject<HTMLImageElement | null>(null);

  public state = new StoreSubject({
    contrast: 1,
    brightness: 0,
    clarity: 0,
  });

  public setImage(image: HTMLImageElement) {
    this.image.next(image);
  }

  public setContrast(contrast: number) {
    this.state.next({
      ...this.state.getValue(),
      contrast,
    });
  }

  public setBrightness(brightness: number) {
    this.state.next({
      ...this.state.getValue(),
      brightness,
    });
  }

  public setClarity(clarity: number) {
    this.state.next({
      ...this.state.getValue(),
      clarity,
    });
  }
}

export const mainStore = new MainStore();
