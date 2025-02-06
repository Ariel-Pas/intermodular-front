import { Component, computed, inject, input } from '@angular/core';
import IEmpresasService from '../../../services/IEmpresasService';
import { IEmpresaDisplay, IPregunta } from '../../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { ITokenService } from '../../../services/token/ITokenService';
import { FormsModule } from '@angular/forms';
import { FormulariosApiService } from '../../../services/formularios/formularios-api.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-empresa',
  imports: [FormsModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent {

  constructor(private router: Router) { }
  private route = inject(ActivatedRoute);
  public id = input.required<string>();

  public empresa!: IEmpresaDisplay;
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.empresa = data['empresa']
    })
  }

  // DEBORA
  private tokenService = inject(ITokenService);
  private formulariosService = inject(FormulariosApiService);

  protected formularioId!: number;
  protected centroId: number = 2;
  protected tokenIngresado: string = '';
  protected urlFormulario: string | null = null;
  protected preguntas: IPregunta[] = [];
  public empresaId = computed(() => this.id());


  crearToken(event: Event): void {
    event.preventDefault();

    const empresaId = this.empresaId();

    if (!empresaId) {
      console.error('El ID de la empresa aún no está disponible.');
      return;
    }

    if (this.formularioId) {
      console.log('Generando token con:', this.formularioId , 'para la empresa:', empresaId);

      this.tokenService.generarToken(Number(empresaId), this.formularioId, 2).subscribe({
        next: (response) => {
          console.log('Token generado:', response);
          this.tokenIngresado = response.token; // era token
          console.log('Token asignado:', this.tokenIngresado);  // Verifica si el token está asignado correctamente
        },
        error: (error) => console.error('Error al generar token:', error),
      });
    } else {
      console.error('Por favor, selecciona un formulario.');
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;  // Asegura que event.target es un HTMLInputElement
    if (target) {
      this.tokenIngresado = target.value;  // Asigna el valor al tokenIngresado
    }
  }

  buscarFormulario() {
    if (!this.tokenIngresado) {
      alert('Ingrese un token');
      return;
    }

    this.tokenService.buscarFormularioPorToken(this.tokenIngresado).pipe(
      switchMap(response => {
        if (response.formulario_id == null) {
          throw new Error("El formulario no tiene un ID válido.");
        }
        this.formularioId = response.formulario_id;
        return this.formulariosService.getPreguntas(this.formularioId.toString());
      })
    ).subscribe({
      next: preguntas => {
        this.preguntas = preguntas;
        this.urlFormulario = `http://localhost:8000/api/mostrarFormulario/${this.formularioId}`;
        console.log('Preguntas obtenidas:', preguntas);
        this.router.navigate(['/formulario', this.formularioId], {
          queryParams: { empresaId: this.empresaId() }
        });
      },
      error: error => {
        console.error('Error al obtener las preguntas', error);
        alert('No se pudieron obtener las preguntas.');
      },
      complete: () => {
        console.log("Consulta de preguntas completada.");
      }
    });
  }


}

