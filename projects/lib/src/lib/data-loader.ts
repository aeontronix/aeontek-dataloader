import {BehaviorSubject, forkJoin, isObservable, Observable, ReplaySubject, Subscription} from 'rxjs';
import {EnvironmentInjector, runInInjectionContext} from '@angular/core';

export class DataLoader<T, P> {
    private readonly preReqs: Observable<boolean[]> | undefined;
    private readonly preReqsSub: Subscription | undefined;
    private loadingRequested = false;
    private data: T | undefined;
    private params: P | undefined;
    private preReqsFulfilled: boolean = false;
    private dataSubject = new ReplaySubject<T>()
    private dataObservable = this.dataSubject.asObservable();
    private readonly loader: (param: P | undefined) => Observable<T> | T | undefined;
    private loadingSubscription: Subscription | null = null;
    private loading = new BehaviorSubject(false);
    private readonly errorSubject = new ReplaySubject<void>(1)

    constructor(private injector: EnvironmentInjector, loadImmediately: boolean,
                loader: (param: P | undefined) => Observable<T> | T | undefined,
                preReqs: Observable<boolean>[]) {
        this.loader = loader;
        if (preReqs && preReqs.length > 0) {
            this.preReqs = forkJoin(preReqs)
            this.preReqsSub = this.preReqs.subscribe(val => this.preReqChanged(val));
        } else {
            this.preReqsFulfilled = true;
        }
        this.loadingRequested = loadImmediately
    }

    public close() {
        if (this.preReqsSub) {
            this.preReqsSub.unsubscribe();
        }
    }

    public load() {
        if (this.preReqsFulfilled) {
            runInInjectionContext(this.injector, () => {
                let result = this.loader(this.params);
                if (result !== undefined) {
                    if (isObservable(result)) {
                        this.loading.next(true)
                        result.subscribe({
                            next: (val) => {
                                if (val !== undefined) {
                                    this.dataSubject.next(val);
                                    this.data = val
                                }
                                this.finishLoading();
                            },
                            error: (err) => {
                                runInInjectionContext(this.injector, () => {
                                    this.errorSubject.next(err);
                                })
                                this.finishLoading();
                            },
                            complete: () => {
                                this.finishLoading();
                            }
                        })
                    } else {
                        this.dataSubject.next(result);
                        this.data = result;
                    }
                }
            })
        }
    }

    finishLoading() {
        if (this.loadingSubscription) {
            this.loadingSubscription.unsubscribe()
            this.loadingSubscription = null
            this.loading.next(false)
        }
    }

    private preReqChanged(results: boolean[]) {
        if (this.preReqsFulfilled && (results.length > 0 && results.includes(false))) {
            this.preReqsFulfilled = false
        } else if (!this.preReqsFulfilled && (results.length == 0 || !results.includes(false))) {
            this.preReqsFulfilled = true
            if (this.loadingRequested) {
                this.load()
            }
        }
    }

    public getData(): Observable<T> {
        return this.dataObservable;
    }

    public getDataValue(): T | undefined {
        return this.data;
    }
}
