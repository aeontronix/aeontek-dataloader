import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {DataLoader} from './data-loader';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataLoaderService {
    private injector = inject(EnvironmentInjector)
    private reloadSubject = new ReplaySubject<void>(1);
    private errorSubject = new ReplaySubject<void>(1);
    private globalPreReqs: Observable<boolean>[] = [];

    constructor() {
    }

    createDataLoader<T, P>(loader: (param: P | undefined) => Observable<T> | T | undefined,
                           loadImmediately = true, preReqs: Observable<boolean>[] = []): DataLoader<T, P> {
        return runInInjectionContext(this.injector, () => {
            return new DataLoader<T, P>(this.injector, loadImmediately, loader, this.globalPreReqs.concat(preReqs))
        })
    }

    addGlobalPreReq(preReq: Observable<boolean>) {
        this.globalPreReqs.push(preReq);
    }

    removeGlobalPreReq(preReq: Observable<boolean>) {
        this.globalPreReqs = this.globalPreReqs.filter(o => o !== preReq);
    }
}
