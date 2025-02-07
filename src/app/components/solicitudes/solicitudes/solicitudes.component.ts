import { Component, computed, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ICentro, IRegion, ISolicitud, ITown } from '../../../types';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ILocalizacionService } from '../../../services/localizacion/ILocalizacionService';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import IEmpresasService from '../../../services/IEmpresasService';
import { ISolicitudService } from '../../../services/solicitudes/ISolicitudService';

@Component({
  selector: 'app-solicitudes',
  imports: [ReactiveFormsModule, JsonPipe, AsyncPipe],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.scss'
})
export class SolicitudesComponent {
  private serviciosLocalizacion = inject(ILocalizacionService);
  private servicioSolicitudes = inject(ISolicitudService);
  empresaId: number | null = 100;

  form = new FormGroup({
    nombreEmpresa: new FormControl('',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    actividad: new FormControl('',
      [Validators.required, Validators.maxLength(50)]),
    cif: new FormControl('',
      [Validators.required, Validators.pattern(/^[A-Z][0-9]{8}$/)]),
    provincia: new FormControl<IRegion | null>(null, Validators.required),
    localidad: new FormControl<ITown | null>(null, Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    titularidad: new FormControl('', [Validators.required]),
    horario_comienzo: new FormControl('', [Validators.required]),
    horario_fin: new FormControl('', [Validators.required]),
    empresa_id:  new FormControl(1, [Validators.required]),
    centro_id: new FormControl<ICentro | null>(null, Validators.required)
    // centro_id: new FormControl<ICentro| null>(null, Validators.required)
    // centro_id: new FormControl(2, [Validators.required]) // number; no los rellena nadie, los envio con input type hidden
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


  onSubmit() {
    if (this.form.invalid) {
      console.error('El formulario contiene errores');
      return;
    }

    const solicitud: ISolicitud = {
      nombreEmpresa: this.form.controls.nombreEmpresa.value ?? '',
      actividad: this.form.controls.actividad.value ?? '',
      cif: this.form.controls.cif.value ?? '',
      provincia: this.form.controls.provincia.value?.name ?? null,
      localidad: this.form.controls.localidad.value?.name ?? null,
      horario_comienzo : this.form.controls.horario_comienzo.value ?? null,
      horario_fin : this.form.controls.horario_fin.value ?? null,
      email: this.form.controls.email.value ?? '',
      titularidad: this.form.controls.titularidad.value ?? '',
      empresa_id: 1,
      centro_id: this.form.controls.centro_id.value?.id ?? null,
    }
    console.log('Datos enviados:', solicitud);

      this.servicioSolicitudes.crearSolicitud(solicitud).subscribe({
        next: (res) => console.log('Solicitud creada exitosamente', res),
        error: (err) => console.error('Error al crear solicitud', err),
        complete: () => console.log('Operación completada'),
      });

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
