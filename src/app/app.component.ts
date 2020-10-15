import { Component } from '@angular/core';
import { FireService } from './services/fire.service';
import { Usuario } from './model/usuario.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  usuario: Usuario;
  user: User;
  constructor(private fireService: FireService, private router: Router, private toastr: ToastrService) {
    this.fireService.auth.onAuthStateChanged(user => {
      this.user = user;
      this.fireService.getUsuario(user.uid).subscribe(usuario => {
        this.usuario = usuario;
      })
    });
  }

  async logout() {
    try {
      await this.fireService.logout();
      this.router.navigate(['login']);
    } catch (error) {
      this.toastr.error('Ocorreu um erro durante a operação. Tente novamente.', 'Erro')
    }
  }
}
