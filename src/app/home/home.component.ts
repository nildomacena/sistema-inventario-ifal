import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { map } from 'rxjs/operators';
import { Localidade } from '../model/localidade.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nome = '';
  localidades: Localidade[];

  constructor(private fireService: FireService, private router: Router) {
    this.fireService.getLocalidades().then(localidades => {
      this.localidades = localidades;
      console.log(this.localidades)
    });


  }

  get localidadesVisitadas(): string {
    let visitadas: number = 0;
    this.localidades.forEach(l => {
      if (l.status == 2 || l.bens.length > 0 || l.panoramica)
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
