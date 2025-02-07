import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // importe bootstrap
import "bootstrap-icons/font/bootstrap-icons.scss"
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));




