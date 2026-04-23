export class SoundManager {
  private static enabled: boolean = false;
  private static sounds: Map<string, HTMLAudioElement> = new Map();
  
  static init() {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem('truesens-sound');
    this.enabled = stored === 'true';
    
    if (this.enabled) {
      this.preload();
    }
  }
  
  static setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('truesens-sound', String(enabled));
    }
    if (enabled) {
      this.preload();
    }
  }
  
  static isEnabled(): boolean {
    return this.enabled;
  }
  
  private static preload() {
    const sounds = {
      click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAAAADMlQ',
      success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAAAADMlQ',
      hover: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAAAADMlQ',
      complete: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAAAADMlQ',    };
    
    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }
  
  static play(type: 'click' | 'success' | 'hover' | 'complete') {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(type);
    if (sound) {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = 0.3;
      clone.play().catch(() => {});
    }
  }
}