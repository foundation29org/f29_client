import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    private readonly _changeState = signal<any | null>(null);
    readonly changeState = this._changeState.asReadonly();
    readonly changeEmitted$ = toObservable(this._changeState).pipe(
        filter((value): value is any => value !== null)
    );

    emitChange(change: any) {
        this._changeState.set(change);
    }


    //Customizer
    private readonly _customizerState = signal<any | null>(null);
    readonly customizerState = this._customizerState.asReadonly();
    readonly customizerChangeEmitted$ = toObservable(this._customizerState).pipe(
        filter((value): value is any => value !== null)
    );

    emitCustomizerChange(change: any) {
        this._customizerState.set(change);
    }

    //customizer - compact menu
    private readonly _customizerCMState = signal<any | null>(null);
    readonly customizerCMState = this._customizerCMState.asReadonly();
    readonly customizerCMChangeEmitted$ = toObservable(this._customizerCMState).pipe(
        filter((value): value is any => value !== null)
    );

    emitCustomizerCMChange(change: any) {
        this._customizerCMState.set(change);
    }

       //customizer - compact menu
       private readonly _notiSidebarState = signal<any | null>(null);
       readonly notiSidebarState = this._notiSidebarState.asReadonly();
       readonly notiSidebarChangeEmitted$ = toObservable(this._notiSidebarState).pipe(
           filter((value): value is any => value !== null)
       );

       emitNotiSidebarChange(change: any) {
           this._notiSidebarState.set(change);
       }
}
