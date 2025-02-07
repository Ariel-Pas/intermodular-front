import { Component, computed, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ICentro, ICiclo, IRegion, ISolicitud, ITown } from '../../../types';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ILocalizacionService } from '../../../services/localizacion/ILocalizacionService';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import IEmpresasService from '../../../services/IEmpresasService';
import { ISolicitudService } from '../../../services/solicitudes/ISolicitudService';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  imports: [ReactiveFormsModule, JsonPipe, AsyncPipe, SweetAlert2Module],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.scss'
})
export class SolicitudesComponent {
  private serviciosLocalizacion = inject(ILocalizacionService);
  private servicioSolicitudes = inject(ISolicitudService);
  empresaId: number | null = 100;
  numero_puestos: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  form = new FormGroup({
    nombreEmpresa: new FormControl('',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    actividad: new FormControl('',
      [Validators.required, Validators.maxLength(50)]),
      cif: new FormControl('', [
        Validators.required,
        Validators.pattern('^\\d{8}[A-Z]$')
      ]),
    provincia: new FormControl<IRegion | null>(null, Validators.required),
    localidad: new FormControl<ITown | null>(null, Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    titularidad: new FormControl('', [Validators.required]),
    horario_comienzo: new FormControl('', [Validators.required]),
    horario_fin: new FormControl('', [Validators.required]),
    empresa_id:  new FormControl(1, [Validators.required]),
    centro_id: new FormControl<ICentro | null>(null, Validators.required),
    ciclo_id: new FormControl <ICiclo | null>(null, Validators.required), // debo tener un tipo ICiclo al cual lo relaciono para obtener y asignar el id
    numero_puestos: new FormControl<number | null>(null, [Validators.required]),
  },
  SolicitudesComponent.validacionHorasValidadas('horario_comienzo', 'horario_fin'));

  // Provincias
  protected provinciasResource = rxResource({
    loader: () => this.serviciosLocalizacion.getRegiones()
  });

  protected provinciasComputada = computed(() => this.provinciasResource.value() ?? []);

  // Localidades
  localidades$ = this.form.controls.provincia.valueChanges.pipe(
    switchMap((provincia) =>
      provincia ? this.serviciosLocalizacion.getPoblaciones(provincia.id) : of([])
    )
  );

  // Centros
  protected centrosResource = rxResource({
    loader: () => this.servicioSolicitudes.cargarCentros()
  })

  protected centrosComputada = computed(() => this.centrosResource.value() ?? []);

  // Ciclos
  ciclos$ = this.form.controls.centro_id.valueChanges.pipe(
    switchMap((centro) =>
      centro ? this.servicioSolicitudes.cargarCiclosSegunCentro(centro) : of([])
    )
  )

  onSubmit() {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Por favor, corrija los errores antes de enviar.',
      });
      return;
    }

    const solicitud: ISolicitud = {
      nombreEmpresa: this.form.controls.nombreEmpresa.value ?? '',
      actividad: this.form.controls.actividad.value ?? '',
      cif: this.form.controls.cif.value ?? '',
      provincia: this.form.controls.provincia.value?.name ?? null,
      localidad: this.form.controls.localidad.value?.id ?? null, // antes era name
      horario_comienzo : this.form.controls.horario_comienzo.value ?? null,
      horario_fin : this.form.controls.horario_fin.value ?? null,
      email: this.form.controls.email.value ?? '',
      titularidad: this.form.controls.titularidad.value ?? '',
      empresa_id: this.form.controls.empresa_id.value ?? null,
      centro_id: this.form.controls.centro_id.value?.id ?? null,
      ciclo_id: this.form.controls.ciclo_id.value?.id ?? null,
      numero_puestos: this.form.controls.numero_puestos.value ?? 0,
    }

    console.log('Datos enviados:', solicitud);

      this.servicioSolicitudes.crearSolicitud(solicitud).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Solicitud enviada',
            text: 'La solicitud se ha creado correctamente.',
          });
          this.form.reset();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: 'Hubo un problema al procesar la solicitud.',
          });
          console.error('Error al crear solicitud', err);
        },
        complete: () => console.log('Operación completada'),
      });

  }

  onLimpiar() {
    if (this.form.pristine) { // si el formulario no ha sido modificado
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El formulario ya está vacío.',
      });
    } else {
      this.form.reset(); // si el formulario si tenía datos
      Swal.fire({
        icon: 'success',
        title: 'Formulario limpiado',
        text: 'Todos los campos han sido restablecidos.',
      });
    }
  }

  // Validación cruzada horario
  static conventirASegundos(horario: string): number {
    const [horas, minutos] = horario.split(':').map(Number);
    return horas * 3600 + minutos * 60;
  }

  static validacionHorasValidadas(manana: string, tarde: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const mananaControl = group.get(manana);
      const tardeControl = group.get(tarde);
      if (!mananaControl || !tardeControl) {
        return null;
      }
      const mananaValor = mananaControl.value;
      const tardeValor = tardeControl.value;
      if (!mananaValor || !tardeValor) {
        return null;
      }
      const mananaSegundos = this.conventirASegundos(mananaValor);
      const tardeSegundos = this.conventirASegundos(tardeValor);
      if (mananaSegundos >= tardeSegundos) return { horarioValidadoValidacion: true }
      return null;
    }
  }


}
