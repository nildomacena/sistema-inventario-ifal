import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bem } from '../model/bem.model';
import * as bemFactory from '../model/bem.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Localidade } from '../model/localidade.model';
import { RouterService } from '../services/router.service';
import { FireService } from '../services/fire.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bem-detail',
  templateUrl: './bem-detail.component.html',
  styleUrls: ['./bem-detail.component.scss']
})
export class BemDetailComponent implements OnInit {
  bem: Bem;
  localidade: Localidade;
  formProduto: FormGroup;
  salvando: boolean = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _location: Location,
    private routerService: RouterService,
    private fireService: FireService,
    private toastr: ToastrService,) {
    this.formProduto = this.formBuilder.group({
      'id': new FormControl(''),
      'estadoBem': new FormControl('', [Validators.required]),
      'campusId': new FormControl('', [Validators.required]),
      'descricao': new FormControl('', [Validators.required]),
      'indicaDesfazimento': new FormControl('', [Validators.required]),
      'numeroSerie': new FormControl(''),
      'observacoes': new FormControl(''),
      'patrimonio': new FormControl(''),
      'imagem': new FormControl(''),
      'localidadeId': new FormControl(''),
      'nomeUsuario': new FormControl(''),
      'uidUsuario': new FormControl(''),
      'semEtiqueta': new FormControl(false),
      'bemParticular': new FormControl(false),
    });
    if (this.router.getCurrentNavigation().extras.state) {
      this.bem = this.router.getCurrentNavigation().extras.state?.bem;
    }
    else {
      console.log('else')
      this.bem = bemFactory.objetoTeste();
    }
    this.formProduto.patchValue(this.bem.asObject);

    this.formProduto.controls['semEtiqueta'].valueChanges.subscribe(value => console.log(value))
    console.log(this.bem.asObject)
  }

  ngOnInit(): void {

  }


  abrirImagem() {
    window.open(this.bem.imagem, 'blank');
  }

  voltar() {
    console.log(this.bem);
    this.router.navigate(['localidade-detail'], { state: { localidade: this.localidade } });
  }
  async onSubmit() {
    if (this.formProduto.invalid) {
      this.toastr.error('As informações estão incompletas. Preencha todo o formulário para salvar as informações', 'ERRO')
      return;
    }
    let bem: Bem = bemFactory.fromForm(this.formProduto);
    this.salvando = true;
    try {
      this.localidade = await this.fireService.alterarBem(bem);
      this.toastr.success('Dados salvos', 'SUCESSO');
      this.voltar();
    } catch (error) {
      console.error(error);
      this.toastr.error('Ocorreu um erro durante o processo. Tente novamente mais tarde. Se os erro continuar, entre em contato com o administrador do sistema', 'ERRO')
    }
    this.salvando = false;
    console.log(this.formProduto.value);
  }

}
