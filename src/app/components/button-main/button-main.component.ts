import { Component, input } from '@angular/core';

@Component({
  selector: 'button-main',
  imports: [],
  templateUrl: './button-main.component.html',
  styleUrl: './button-main.component.scss'
})
export class ButtonMainComponent {
  public href = input<string>('');
  public text = input.required<string>({alias: 'text'});

  public flat = input<boolean>(false);
  public submit = input<boolean>(false);
  public btnIcon = input<string>('');
  public onClick = input<((e: any )=> void)>(()=> {return});

  useClickFunction = () => {
    if(this.onClick() != undefined) this.onClick()('');
  }
}

//Componente que puede crear un botón submit o un botón con link
//ejemplo uso
//<button-main link="#" text="Contactar" btnIcon='<i icon class="bi bi-search"></i>'>
