import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit {
  totalBensSIPAC: number;
  novoTotalBens: number;
  salvando: boolean;
  constructor(private fireService: FireService, private utilService: UtilService) {
    this.initPromises();
  }

  ngOnInit(): void {
  }

  async initPromises() {
    this.totalBensSIPAC = await this.fireService.getTotalBensSIPAC();
  }

  async salvarTotal() {
    try {
      this.salvando = true;
      this.totalBensSIPAC = await this.fireService.setTotalBensSIPAC(+this.novoTotalBens)
      this.utilService.toastrSucesso();
    } catch (error) {
      console.error(error);
      this.utilService.toastrErro();
    }
    this.salvando = false;
  }

}
