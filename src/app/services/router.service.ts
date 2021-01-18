import { Injectable } from '@angular/core';
import { Bem } from '../model/bem.model';
import { Localidade } from '../model/localidade.model';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  localidade: Localidade;
  bem: Bem;
  constructor() { }

  setLocalidade(localidade: Localidade) {
    this.localidade = localidade;
    console.log(this.localidade);
  }

  clearLocalidade() {
    this.localidade = null;
  }

  setBem(bem: Bem) {
    this.bem = bem;
  }

  clearBem() {
    this.bem = null;
  }
}
