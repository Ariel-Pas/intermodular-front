import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthApiBetaService } from '../../../services/auth/auth-api-beta.service';

@Component({
  selector: 'app-profesor-profile',
  imports: [RouterLink],
  templateUrl: './profesor-profile.component.html',
  styleUrl: './profesor-profile.component.scss'
})
export class ProfesorProfileComponent {
  private authService = inject(AuthApiBetaService);
  public session = toSignal(this.authService.session$, { initialValue: null });
}
