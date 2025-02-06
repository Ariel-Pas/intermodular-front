import { Component, inject, OnInit } from '@angular/core';
import { IFormulariosService } from '../../../services/formularios/IFormulariosService';
import { IPregunta, IResenia} from '../../../types';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormRecord, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { IReseniaService } from '../../../services/resenias/IReseniaService';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formularios',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './formularios.component.html',
  styleUrl: './formularios.component.scss'
})
export class FormulariosComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private formulariosService = inject(IFormulariosService);
  private reseniasService = inject(IReseniaService);
  protected formularioId!: number;
  protected empresaId!: number;
  protected centroId: number = 2; // EJEMPLO, debe ser dinámico

  preguntas: IPregunta[] = [];
  starCount: number = 5; // número total de estrellas
  ratings: { [key: string]: number } = {}; // objeto para almacenar el rating de cada pregunta
  form: FormGroup = new FormGroup({
      // respuesta: new FormControl<string | number | null>(null)
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const formularioId = params.get('id'); // obtengo el ID del formulario desde la URL
      if (formularioId) {
        this.formularioId = Number(formularioId); // convierto el form_id a número y lo asigno

        this.route.queryParams.subscribe(queryParams => {
          this.empresaId = Number(queryParams['empresaId']); // obtengo el ID de la empresa desde la URL

          this.form.addControl('formulario_id', new FormControl<number>(this.formularioId, Validators.required));
          this.form.addControl('empresa_id', new FormControl<number>(this.empresaId, Validators.required));
          this.form.addControl('centro_id', new FormControl<number>(this.centroId, Validators.required));

          this.cargarPreguntas(formularioId);
        });
      }
    });
  }


  cargarPreguntas(formularioId: string) {
    this.formulariosService.getPreguntas(formularioId).subscribe({
      next: (data: IPregunta[]) => {
        this.preguntas = data;
        this.preguntas.forEach(pregunta => {

          let validators = []; //nuevo
          switch (pregunta.tipo) {  // defino validaciones según el tipo de pregunta
            case 'text':
              validators.push(Validators.required, Validators.maxLength(60));
              break;

            case 'textarea':
              validators.push(Validators.required, Validators.maxLength(200));
              break;

            case 'estrellas':
              validators.push(Validators.required);
              break;
          }

          this.form.addControl(pregunta.id.toString(), new FormControl<string | number | null>(null, validators)
          );

          if (pregunta.tipo === 'estrellas') {
            this.ratings[pregunta.id.toString()] = 0;
          }
        });

        console.log('Formulario cargado:', this.preguntas);
      },
      error: (err) => {
        console.error('Error al cargar formulario:', err);
      }
    });
  }

  onSubmit() {
    if (!this.formularioId || !this.empresaId) {
      console.error('Formulario ID o Empresa ID no definidos');
      return;
    }

    const respuestas: IResenia[] = this.preguntas.map((pregunta) => ({
      respuesta: this.form.get(pregunta.id.toString())?.value ?? '',
      pregunta_id: pregunta.id,
      formulario_id: this.formularioId,
      empresa_id: this.empresaId,
      centro_id: this.centroId, // Ajustar dinámicamente si es necesario
    }));

    console.log('Datos enviados:', respuestas);

    respuestas.forEach(resenia => {
      this.reseniasService.crearResenia(resenia).subscribe({
        next: (res) => console.log('Reseña creada exitosamente', res),
        error: (err) => console.error('Error al crear reseña', err),
        complete: () => console.log('Operación completada'),
      });
    });
  }

  // Metodos para las estrellas
  onClick(preguntaId: string, rating: number): void {
    this.ratings[preguntaId] = rating; // actualiza el rating para la pregunta específica
    this.form.get(preguntaId)?.setValue(rating); // actualiza el valor del control de formulario
  }
  showIcon(preguntaId: string, index: number): string {   // muestra la estrella llena o vacía
    if (this.ratings[preguntaId] >= index + 1) {
      return 'star';
    } else {
      return 'star_border'; // estrella vacía
    }
  }
}



  // onSubmit() {
  //   if (!this.formularioId || !this.empresaId) {
  //     console.error('Formulario ID o Empresa ID no definidos');
  //     return;
  //   }

  //   this.preguntas.forEach((pregunta) => {
  //     const respuesta = this.form.controls[pregunta.id.toString()]?.value;
  //     if (respuesta != null) {
  //       const resenia: IResenia = {
  //         respuesta: respuesta,
  //         pregunta_id: pregunta.id,
  //         formulario_id: this.formularioId,
  //         empresa_id: this.empresaId,
  //         centro_id: 2, // Debe ser dinamico
  //       };

  //       this.reseniasService.crearResenia(resenia).subscribe({
  //         next: (res) => console.log('Reseña creada exitosamente', res),
  //         error: (err) => console.error('Error al crear reseña', err),
  //         complete: () => console.log('Operación completada'),
  //       });
  //     }
  //   });
  // }








  // form = new FormRecord ({
  //     id: new FormControl<string | number | null>(null),
  //     respuesta: new FormControl<string | number | null>(null),
  // })


  // modelToData(): IResenia {
  //   return {
  //     respuesta: this.form.controls.respuesta.value?.respuesta ?? '',
  //   }
  // }

  // modelToData(): IResenia[] { ver este nuevo modelToData()
  //   return this.preguntas.map((pregunta) => ({
  //     respuesta: this.form.get(pregunta.id.toString())?.value ?? '',
  //     pregunta_id: pregunta.id,
  //     formulario_id: this.form.get('formulario_id')?.value ?? 1,
  //     centro_id: this.form.get('centro_id')?.value ?? 2,
  //     empresa_id: this.form.get('empresa_id')?.value ?? 3,
  //   }));
  // }
