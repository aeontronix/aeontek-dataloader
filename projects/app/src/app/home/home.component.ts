import {Component} from '@angular/core';
import {Panel} from 'primeng/panel';
import {DataLoaderService} from '../../../../lib/src/lib/data-loader.service';
import {DataLoader} from '../../../../lib/src/lib/data-loader';
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'app-home',
    imports: [
        Panel,
        AsyncPipe
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    protected dataLoader: DataLoader<string>;

    constructor(dataLoaderService: DataLoaderService) {
        this.dataLoader = dataLoaderService.createDataLoader();
    }
}
