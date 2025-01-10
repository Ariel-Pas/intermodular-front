import { Signal } from "@angular/core";
import { IEmpresaDisplay, IFiltros } from "../types";


export default abstract class IGestionFiltradoEmpresas
{
  abstract getEmpresasFiltradas() : Signal<IEmpresaDisplay[]>;

  abstract actualizarFiltros(filtros : IFiltros ) : void;

}
