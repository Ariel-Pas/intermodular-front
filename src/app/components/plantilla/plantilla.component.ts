import { Component } from '@angular/core';
import { PlantillaNavComponent } from '../plantilla-nav/plantilla-nav.component';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-plantilla',
  imports: [PlantillaNavComponent, RouterOutlet, AsyncPipe],
  templateUrl: './plantilla.component.html',
  styleUrl: './plantilla.component.scss'
})
export class PlantillaComponent {

  //Behavior Subject es un observable con un estado inicial, que reacciona a cambios y permite obtener el ultimo estado.
  currentRoute = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.currentRoute.next(this.router.url);
    });
  }



}
