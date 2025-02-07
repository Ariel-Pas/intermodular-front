import { Component, computed, inject, input, viewChild } from '@angular/core';
import IEmpresasService from '../../../services/IEmpresasService';
import { ApiErrorMessage, IEmpresaCompleta, IEmpresaDisplay } from '../../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionsUnderlineComponent } from '../../sections-underline/sections-underline.component';
import { ButtonMainComponent } from "../../button-main/button-main.component";
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-empresa',
  imports: [SectionsUnderlineComponent, ButtonMainComponent, MatTabContent, MatTabGroup, MatTab, ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})


export class EmpresaComponent {
  private route = inject(ActivatedRoute);
  private navigator = inject(Router);
  private empresasService = inject(IEmpresasService);
  public id = input.required<string>();

  alert = viewChild.required(SwalComponent);

  public empresa! : IEmpresaCompleta;
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.empresa = data['empresa'];
      this.urlEditarToken = `${window.origin}/company/update/${this.empresa.urlEditar}`
      this.urlEditar = `/company/update/${this.empresa.id}`

      this.formNotas.patchValue({notas : this.empresa.notas})
    })
  }

  protected urlEditar = '';
  protected urlEditarToken = '';

  formNotas = new FormGroup ({
    notas: new FormControl(
              '',
              [Validators.required, Validators.minLength(5)],
            ),
  })

  actualizarNotas()
  {
    console.log(this.formNotas.controls.notas.value);
    this.empresasService.actualizarNota(this.empresa.id, this.formNotas.controls.notas.value ?? '').subscribe({
      next: ()=> {
              this.alert().title = "Nota actualizada";
              this.alert().text = '';
              this.alert().icon = "success";
              this.alert().fire();

            },
            error: (errorMsg: ApiErrorMessage) => {
              this.alert().title = "Ha ocurrido un error";
              this.alert().text = "No se ha podido guardar";
              this.alert().icon = "error";
              this.alert().fire();
            }
    })

  }

  eliminarEmpresa(event: Event){
    this.empresasService.eliminarEmpresa(this.empresa.id).subscribe({
      next: ()=> {
        this.alert().title = "Empresa eliminada";
        this.alert().text = '';
        this.alert().icon = "success";
        this.alert().fire();
        this.navigator.navigate(['/dashboard']);

      },
      error: (errorMsg: ApiErrorMessage) => {
        this.alert().title = "Ha ocurrido un error";
        this.alert().text = "No se ha podido eliminar";
        this.alert().icon = "error";
        this.alert().fire();
      }
    })

  }

}

