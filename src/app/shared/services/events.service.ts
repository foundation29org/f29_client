import { Injectable, signal } from '@angular/core';

@Injectable()
export class EventsService {
  private readonly listeners = new Map<string, Array<(msg: any) => void>>();
  private readonly _lastEvent = signal<{ name: string; msg: any } | null>(null);
  readonly lastEvent = this._lastEvent.asReadonly();
  private readonly _currentLanguage = signal<string>(sessionStorage.getItem('lang') || 'en');
  readonly currentLanguage = this._currentLanguage.asReadonly();

    on(name: string, listener: (msg: any) => void): () => void {
        if (!this.listeners.has(name)) {
            this.listeners.set(name, []);
        }

        this.listeners.get(name)!.push(listener);

        // Return unsubscribe callback for gradual cleanup at call sites.
        return () => {
            const current = this.listeners.get(name) || [];
            this.listeners.set(
                name,
                current.filter((registered) => registered !== listener)
            );
        };
    }

    broadcast(name: string, msg: any): void {
        if (name === 'changelang' && typeof msg === 'string') {
            this._currentLanguage.set(msg);
        }
        this._lastEvent.set({ name, msg });
        const registered = this.listeners.get(name) || [];
        for (const listener of registered) {
            listener(msg);
        }
    }

    setLanguage(language: string): void {
        this._currentLanguage.set(language);
        this.broadcast('changelang', language);
    }
}
