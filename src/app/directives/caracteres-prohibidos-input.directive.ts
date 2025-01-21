import { Directive, ElementRef, signal } from '@angular/core';

@Directive({
  selector: '[caracteresProhibidosInput]',
  host: {
    '(keydown)' : 'replaceForbiddenCharacters($event.key, $event)'
  }
})
export class CaracteresProhibidosInputDirective {


  //prohibidos = input.required<string>()      poner un prohibidos en el componente que tiene la directiva

  replaceForbiddenCharacters(character: string, event: Event) : void{
    const forbiddenCharacters = '*@"#';
    if(forbiddenCharacters.includes(character))
      event.preventDefault();
  }

  constructor(inputElement: ElementRef<HTMLInputElement>)
  {

  }

}
