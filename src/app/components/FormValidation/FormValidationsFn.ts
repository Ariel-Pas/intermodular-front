import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


export function checkboxValidation(config : { exact?: number, min?: number, max?: number}) : ValidatorFn{
  return(control: AbstractControl) : ValidationErrors | null => {
    const { exact, min, max} = config;
    const checked = Object.values((control as FormGroup).controls).filter(x => x != null && x.value).length;
    return (exact == undefined || checked === exact) && (min == undefined || checked >= min) && (max == undefined || checked <= max) ? null : { 'validar-checkbox': { checked: checked, min, max, exact } }
  }
}


//la validación se le pone al formgroup con los campos
export function validarHoraInicioPrecedeFin(datos : {campoInicio : string, campoFin : string}) : ValidatorFn {
  return(control:AbstractControl) : ValidationErrors | null => {

      const inputHorarioApertura = control.get(datos.campoInicio);
      const inputHorarioCierre = control.get(datos.campoFin);


      if ((inputHorarioApertura && inputHorarioCierre) && (inputHorarioApertura.value && inputHorarioCierre.value)) {
        const [horaApertura, minutosApertura] = inputHorarioApertura.value.split(':');
        const [horaCierre, minutosCierre] = inputHorarioCierre.value.split(':');


        if((!isNaN(Number(horaCierre)) && !isNaN(Number(horaApertura))) && Number(horaCierre) <= Number(horaApertura) ) return {'validarHorario' : true};
        return null;


      }else
        return {'validarHorario' : true}

  }
}


export function fileInputTodoImagenes(fileInputName : string) :  ValidatorFn {
  return (control : AbstractControl) : ValidationErrors | null =>{
    const fileInput = control.get(fileInputName);
    if(fileInput instanceof HTMLInputElement)
    {
      const fileList = fileInput.files;
      if(fileList ){
        for (const file of fileList) {
          if (!file.type.startsWith("image/")) {
            return {'imagen-no-valida' : true};
          }
        }
      }
      return null;
    }
    return null;

  }
}