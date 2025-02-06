import { Component, computed, inject, input } from '@angular/core';
import IEmpresasService from '../../../services/IEmpresasService';
import { IEmpresaCompleta, IEmpresaDisplay } from '../../../types';
import { ActivatedRoute } from '@angular/router';
import { SectionsUnderlineComponent } from '../../sections-underline/sections-underline.component';
import { ButtonMainComponent } from "../../button-main/button-main.component";
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-empresa',
  imports: [SectionsUnderlineComponent, ButtonMainComponent, MatTabContent, MatTabGroup, MatTab, ReactiveFormsModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})


export class EmpresaComponent {
  private route = inject(ActivatedRoute);
  public id = input.required<string>();

  public empresa! : IEmpresaCompleta;
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.empresa = data['empresa'];
      this.urlEditarToken = `${window.origin}/company/update/${this.empresa.urlEditar}`
      this.urlEditar = `/company/update/${this.empresa.id}`
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
    
  }

}

