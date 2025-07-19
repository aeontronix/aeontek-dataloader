import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Button} from 'primeng/button';
import {ToggleButton} from 'primeng/togglebutton';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, Button, ToggleButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app';
}
