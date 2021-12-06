import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { map } from 'rxjs/operators';
import { Localidade } from '../model/localidade.model';
import { Router } from '@angular/router';
import { Bem } from '../model/bem.model';
import { Correcao } from '../model/correcao.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nome = '';
  localidades: Localidade[];
  bens: Bem[];
  semEtiqueta: string;
  emUso: string;
  ocioso: string;
  danificado: string;
  desfazimento: string;
  particular: string;
  correcoes: Correcao[];
  totalBensSIPAC: number;
  totalBensConcluido: string;

  constructor(private fireService: FireService, private router: Router) {
    this.fireService.getLocalidades().then(localidades => {
      this.localidades = localidades;
      console.log(this.localidades)
    });
    this.fireService.getCorrecoes().then(correcoes => {
      this.correcoes = correcoes;
    });
    this.fireService.getTotalBensSIPAC().then(total => {
      this.totalBensSIPAC = total;
    });
    this.fireService.getBensCadastradosCampus().then(bens => {
      this.bens = bens;
      this.semEtiqueta = ((this.bens.filter(bem => bem.semEtiqueta).length / this.bens.length) * 100).toFixed(0) + '%'
      this.emUso = ((this.bens.filter(bem => bem.estadoBem == 'uso').length / this.bens.length) * 100).toFixed(0) + '%'
      this.ocioso = ((this.bens.filter(bem => bem.estadoBem == 'ocioso').length / this.bens.length) * 100).toFixed(0) + '%'
      this.danificado = ((this.bens.filter(bem => bem.estadoBem == 'danificado').length / this.bens.length) * 100).toFixed(0) + '%'
      this.desfazimento = ((this.bens.filter(bem => bem.indicaDesfazimento).length / this.bens.length) * 100).toFixed(0) + '%'
      this.particular = ((this.bens.filter(bem => bem.bemParticular).length / this.bens.length) * 100).toFixed(0) + '%'
      this.totalBensConcluido = ((this.bens.length / this.totalBensSIPAC) * 100).toFixed(2) + '%'
    });

    this.fireService
  }

  get localidadesVisitadas(): string {
    let visitadas: number = 0;
    this.localidades.forEach(l => {
      if (l.status == 2 || l.status == 1 || l.bens.length > 0 || (l.panoramica && l.panoramica.length > 0))
        visitadas++;
    })
    return ((visitadas / this.localidades.length) * 100).toFixed(2);
  }

  ngOnInit(): void {
    this.fireService.$user.pipe(map(user => user.email)).subscribe(email => {
      this.nome = email;
    });
  }

  get localidadesFinalizadas(): string {
    let finalizadas: number = 0;
    this.localidades.forEach(l => {
      if (l.status == 2)
        finalizadas++;
    })
    return ((finalizadas / this.localidades.length) * 100).toFixed(2);
  }

  irParaLocalidades() {
    this.router.navigate(['localidades']);
  }

  logout() {
    this.fireService.logout();
  }
}
