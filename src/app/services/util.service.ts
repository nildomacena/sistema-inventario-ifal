import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private toastrService: ToastrService) { }

  toastrSucesso(titulo?: string, mensagem?: string) {
    this.toastrService.success(mensagem ?? 'Informações salvas', titulo ?? 'Sucesso');
  }
  toastrErro(titulo?: string, mensagem?: string) {
    this.toastrService.error(mensagem ?? 'Ocorreu um erro durante o procedimento', titulo ?? 'Erro!');
  }
}
