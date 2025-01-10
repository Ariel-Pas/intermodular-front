import { Directive, ElementRef, signal } from '@angular/core';

@Directive({
  selector: '[caracteresProhibidosInput]',
  host: {
    '(keydown)' : 'replaceForbiddenCharacters($event.key, $event)'
  }
})
export class CaracteresProhibidosInputDirective {

  hasChanged = signal(false);
  lastCharacter = signal('');

  replaceForbiddenCharacters(character: string, event: Event) : void{
    const forbiddenCharacters = '*@"#';
    if(forbiddenCharacters.includes(character))
      event.preventDefault();
  }

  constructor(inputElement: ElementRef<HTMLInputElement>)
  {

  }

}
