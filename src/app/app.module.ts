import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

/**FIREBASE IMPORTS */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { NgxLoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { PerfisComponent } from './perfis/perfis.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { LocalidadeDetailComponent } from './localidade-detail/localidade-detail.component';

const firebaseConfig = {
  apiKey: "AIzaSyDAzyzGNmKJO23hOgq7PXNmCSraJw9Xhkc",
  authDomain: "inventario-ifal.firebaseapp.com",
  databaseURL: "https://inventario-ifal.firebaseio.com",
  projectId: "inventario-ifal",
  storageBucket: "inventario-ifal.appspot.com",
  messagingSenderId: "5252042581",
  appId: "1:5252042581:web:f7102f0e9fb316b2aea9dc",
  measurementId: "G-SDMX8NTFXD"
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavComponent,
    PerfisComponent,
    UsuariosComponent,
    LocalidadesComponent,
    LocalidadeDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({})
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
