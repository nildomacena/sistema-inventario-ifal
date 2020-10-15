import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Usuario } from '../model/usuario.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  usuario: Usuario;
  constructor(private fireService: FireService) {
    this.fireService.$user.subscribe(user => {
      console.log('user no nav', user);
      this.fireService.getUsuario(user.uid).subscribe(usuario => {
        this.usuario = usuario;
      })
    })
  }


  ngOnInit(): void {

  }

}
