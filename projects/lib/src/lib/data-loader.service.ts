import {EnvironmentInjector, inject, Injectable, runInInjectionContext} from '@angular/core';
import {DataLoader} from './data-loader';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataLoaderService {
    private injector = inject(EnvironmentInjector)
    private reloadSubject = new ReplaySubject<void>(1);
    private errorHandlerSubject = new ReplaySubject<void>(1);
    private globalPreReqs: () => Observable<boolean>[];

    constructor(globalPreReqs: () => Observable<boolean>[] = () => []) {
        this.globalPreReqs = globalPreReqs;
    }

    createDataLoader<T>(preReqs: Observable<boolean>[] = []): DataLoader<T> {
        return runInInjectionContext(this.injector, () => {
            let pr = this.globalPreReqs();
            return new DataLoader<T>(this.injector, pr.concat(preReqs))
        })
    }
}
