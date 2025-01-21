import { Component, computed, inject, input } from '@angular/core';
import IEmpresasService from '../../../services/IEmpresasService';
import { IEmpresaDisplay } from '../../../types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-empresa',
  imports: [],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent {
  private route = inject(ActivatedRoute);
  public id = input.required<string>();

  public empresa! : IEmpresaDisplay;
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.empresa = data['empresa']
    })
  }

}

