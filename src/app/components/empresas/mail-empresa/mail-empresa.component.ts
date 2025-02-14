import { Component, computed, inject, viewChild } from '@angular/core';
import IEmpresasService from '../../../services/IEmpresasService';
import { GestionFiltradoEmpresasService } from '../../../services/gestion-filtrado-empresas.service';
import { FormControl, FormGroup, FormRecord, Validators , ReactiveFormsModule} from '@angular/forms';
import { checkboxValidation } from '../../FormValidation/FormValidationsFn';
import { KeyValuePipe } from '@angular/common';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpClient } from '@angular/common/http';
import { ApiErrorMessage } from '../../../types';
import { ButtonMainComponent } from '../../button-main/button-main.component';

@Component({
  selector: 'mail-empresa',
  imports: [ReactiveFormsModule, KeyValuePipe, SweetAlert2Module, ButtonMainComponent],
  templateUrl: './mail-empresa.component.html',
  styleUrl: './mail-empresa.component.scss'
})

export class MailEmpresaComponent {
  private gestionEmpresasService = inject(GestionFiltradoEmpresasService);
  private empresasService = inject(IEmpresasService);
  private http = inject(HttpClient);
  alert = viewChild.required(SwalComponent);

  constructor() {
    this.empresasService.getEmpresas().subscribe({
      next: (x) => {
        x.forEach((element) => {
          this.form.controls.empresas.addControl(
            element.nombre,
            new FormControl<boolean>(false)
          );
        });
      },
    })


  }


  form = new FormGroup({
    asunto: new FormControl(
          '',
          [Validators.required, Validators.minLength(5)],

        ),
    empresas: new FormRecord({}, [checkboxValidation({ min: 1 })]),
    mensaje: new FormControl(
      '',
      [Validators.required, Validators.minLength(5)],

    ),
  })

  obtenerIdEmpresa(nombre : string){
    return this.gestionEmpresasService.empresas().find(x =>x.nombre == nombre)
  }


  generarArrayIdsEmpresa(){
    const arrayIds = [];
    const empresasForm = this.form
      .get('empresas')?.value;
    for(const checkbox in empresasForm)
    {
      if (empresasForm[checkbox]){
        let empresa = this.obtenerIdEmpresa(checkbox);
        if(empresa) arrayIds.push(empresa.id);
      }
    }

    return arrayIds;
  }


  onSubmit(){
    const data = {
     /*  asunto : this.form.controls.asunto.value, */
      empresas : this.generarArrayIdsEmpresa(),
      mensaje : this.form.controls.mensaje.value ?? ''
    }
    this.empresasService.enviarMail(data).subscribe({
      next: ()=> {
                    this.alert().title = "Mail enviado";
                    this.alert().text = '';
                    this.alert().icon = "success";
                    this.alert().fire();

                  },
                  error: (errorMsg: ApiErrorMessage) => {
                    this.alert().title = "Ha ocurrido un error";
                    this.alert().text = "No se ha podido enviar";
                    this.alert().icon = "error";
                    this.alert().fire();
                  }
    })

    console.log(data);
    this.form.reset();
  }
}
