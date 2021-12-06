import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.scss']
})
export class TestesComponent implements OnInit {
  numOperacoes: string;
  numRegistros: number;
  salvando: boolean;
  constructor(private fireService: FireService) {
  }

  ngOnInit(): void {
    this.updateNumRegistros()
  }

  updateNumRegistros() {
    setTimeout(() => {
      this.fireService.getBensCadastradosCampus().then(bens => {
        console.log('bens', bens)
        this.numRegistros = bens.length;
      })
    }, 1000);

  }
  gerarRegistros() {
    if (+this.numOperacoes > 100) {
      alert('Digite um número menor que 100')
      return;
    }
    this.salvando = true;
    try {
      this.fireService.gerarRegistros(+this.numOperacoes)
      alert('concluiu')
    } catch (error) {
      alert('ERRO')
      console.error(error);
    }
    this.salvando = false;
  }

}
