import { IEmpresaDisplay } from "../types";

export default abstract class IEmpresasService{
  abstract getEmpresas(): IEmpresaDisplay[];
}
