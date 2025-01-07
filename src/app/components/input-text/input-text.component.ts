import { Component, input } from '@angular/core';

@Component({
  selector: 'app-input-text',
  imports: [],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent {
  public name = input.required<string>;
  public label = input.required<string>;
  public placeholder = input<string>;
}
