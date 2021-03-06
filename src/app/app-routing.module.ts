import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { PerfisComponent } from './perfis/perfis.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { LocalidadeDetailComponent } from './localidade-detail/localidade-detail.component';
import { BrowserModule } from '@angular/platform-browser';
import { BemDetailComponent } from './bem-detail/bem-detail.component';
import { ConfiguracoesComponent } from './configuracoes/configuracoes.component';
import { TestesComponent } from './testes/testes.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToHome } },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToHome } },
  { path: 'papeis', component: PerfisComponent, canActivate: [AuthGuard] },
  { path: 'perfis', component: PerfisComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'bem-detail', component: BemDetailComponent, canActivate: [AuthGuard] },
  { path: 'localidades', component: LocalidadesComponent, canActivate: [AuthGuard] },
  { path: 'localidade-detail', component: LocalidadeDetailComponent, canActivate: [AuthGuard] },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [AuthGuard] },
  { path: 'testes', component: TestesComponent },


  /* { path: 'home', component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } } */

];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule,],
  exports: [RouterModule]
})
export class AppRoutingModule { }
