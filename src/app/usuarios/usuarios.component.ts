import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FireService } from '../services/fire.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../services/util.service';
import { Usuario } from '../model/usuario.model';

declare var jQuery: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  formPreCadastro: FormGroup;
  salvando: boolean;
  usuarios: Usuario[];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private fireService: FireService,
    private toastr: ToastrService,
    private utilService: UtilService
  ) {
    this.formPreCadastro = this.formBuilder.group({
      'nome': new FormControl('', Validators.required),
      'cpf': new FormControl('', Validators.required),
      'siape': new FormControl('', Validators.required),
    });
    this.fireService.getUsuarioCadastrados().then(usuarios => {
      this.usuarios = usuarios;
    })
  }

  ngOnInit(): void {

  }

  consolee() {
    jQuery('#modalPreCadastro').modal('hide');
  }

  resetForm() {
    this.formPreCadastro.reset();
    jQuery('#modalPreCadastro').modal('hide');
  }

  async salvarPreCadastro() {
    this.salvando = true;
    if (this.formPreCadastro.invalid) {
      alert('Preencha todos os campos');
      return;
    }
    try {
      let value = this.formPreCadastro.value;
      this.usuarios = await this.fireService.salvarPreCadastro(value['nome'], value['cpf'], value['siape']);
      this.utilService.toastrSucesso('Sucesso!', 'Pré-cadastro realizado');
      this.resetForm();
    } catch (error) {
      this.utilService.toastrErro();
    }
  }

  async excluirPreCadastro(usuario: Usuario) {
    if (usuario.dataSignup) {
      alert('Não é possível excluir esse usuário, pois o mesmo já fez login no sistema')
      return;
    }
    if (!confirm(`Deseja realmente excluir o pré cadastro de ${usuario.nome}?`))
      return;
    try {
      this.usuarios = await this.fireService.excluirPreCadastro(usuario);
      this.utilService.toastrSucesso();
    } catch (error) {
      this.utilService.toastrErro();
    }
  }
}
