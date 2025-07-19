import {EnvironmentProviders, makeEnvironmentProviders} from '@angular/core';
import {DataLoaderService} from './data-loader.service';
import {Observable} from 'rxjs';

export function provideDataLoader(preReqs: Observable<boolean>[] = []): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: DataLoaderService,
            useValue: new DataLoaderService(preReqs)
        }
    ])
}
