import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Campus } from '../model/campus.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signup: boolean = false;
  campi: Array<Campus> = [];
  formLogin: FormGroup;
  formSignup: FormGroup;
  carregando: boolean;

  constructor(
    private fireService: FireService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router) {
    this.initForms();
  }

  ngOnInit(): void {
  }

  initForms() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.formSignup = this.formBuilder.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email,]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', [Validators.required, Validators.minLength(6)]],
      campus: ['', [Validators.required]],
    });
    this.fireService.getCampi().subscribe(campi => {
      this.campi = campi;
    })
  }

  toggleSignup() {
    this.signup = !this.signup;
  }

  async onSubmitLogin() {
    try {
      await this.fireService.login(this.formLogin.value['email'], this.formLogin.value['senha']);
      this.router.navigate(['home']);
    } catch (error) {
      console.error(error);
      this.toastr.error('Ocorreu um erro durante a solicitação. Tente novamente mais tarde', 'Erro');
    }
  }

  async onSubmitSignup() {
    this.carregando = true;
    if (!this.formSignup.value['email'].includes('@ifal.edu.br')) {
      this.toastr.error('Por favor, use um email institucional', 'Erro!');
      return;
      this.carregando = false;
    }
    if (this.formSignup.value['senha'] != this.formSignup.value['confirmaSenha']) {
      this.toastr.error('A senha digitada não é igual à confirmação da mesma', 'Erro!');
      return;
      this.carregando = false;
    }
    try {
      let campus: Campus;
      this.campi.forEach(c => {
        if (c.id = this.formSignup.value['campus'])
          campus = c;
      });

      await this.fireService.criarUsuario(this.formSignup.value['email'], this.formSignup.value['senha'], this.formSignup.value['nome'], campus);
      this.toastr.success('Seu cadastro foi criado. Agora é só esperar o administrador autorizá-lo', 'Sucesso!');
      this.initForms();
      this.signup = false;
      this.carregando = false;
    } catch (error) {
      console.error(error);
      if (error == '') {
        this.toastr.error('Por favor, use um email institucional', 'Erro!');
        return;
        this.carregando = false;
      }
      if (error['code'] == 'auth/email-already-in-use') {
        this.toastr.error('Esse endereço de email já está sendo utilizado. Tente usar a opção "esqueci a senha" ou entre em contato com o administrador', 'Erro!');
        this.carregando = false;
        return;
      }
      this.toastr.error(`Ocorreu um erro durante a solicitação: ${error} `, 'Erro!');
      this.carregando = false;

    }
    console.log(this.formSignup);

  }
}
