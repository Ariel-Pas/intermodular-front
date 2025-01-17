import { Component } from '@angular/core';
import { PlantillaNavComponent } from '../plantilla-nav/plantilla-nav.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-plantilla',
  imports: [PlantillaNavComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './plantilla.component.html',
  styleUrl: './plantilla.component.scss'
})
export class PlantillaComponent {

}
