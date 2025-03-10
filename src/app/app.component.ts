import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PlantillaComponent } from './components/plantilla/plantilla.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlantillaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'intermodular-front';
}
