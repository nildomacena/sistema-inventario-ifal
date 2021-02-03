import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { Localidade } from '../model/localidade.model';
import { FireService } from '../services/fire.service';
import { RouterService } from '../services/router.service';
import * as localidadeFactory from '../model/localidade.model';
import { Bem } from '../model/bem.model';
import { UtilService } from '../services/util.service';

declare var jQuery: any;
@Component({
  selector: 'app-localidade-detail',
  templateUrl: './localidade-detail.component.html',
  styleUrls: ['./localidade-detail.component.scss'],
})
export class LocalidadeDetailComponent implements OnInit {
  localidade: Localidade;
  bemSelecionado: Bem;
  corrigir: boolean;
  salvando: boolean;
  exibirParticulares: boolean = false;
  bensFiltrados: Bem[] = [];
  descricao: string;
  arquivo: File;
  exibicao: string = 'tabela';
  pesquisa: string;
  motivoCorrecao: string;

  constructor(
    private fireService: FireService,
    private router: Router,
    private routerService: RouterService,
    private utilService: UtilService) {
    if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras?.state != null) {
      console.log(this.router.getCurrentNavigation().extras.state);
      this.localidade = this.router.getCurrentNavigation().extras.state?.localidade;
    }
  }

  ngOnInit(): void {
    console.log(this.localidade);
    jQuery('#modalBem').on('hidden.bs.modal', (e) => {
      this.bemSelecionado = null;
      this.motivoCorrecao = '';
    })


    if (!this.localidade && this.routerService.localidade)
      this.localidade = this.routerService.localidade;
    if (!this.localidade && !this.routerService.localidade)
      // Retirar quando acabar o teste 
      this.router.navigate(['localidades']);
    //Linha de teste this.localidade = localidadeFactory.objetoTeste();
    this.bensFiltrados = this.localidade.bens.filter(b => !b.bemParticular);

  }

  toggleExibicao(exibicao: string) {
    this.exibicao = exibicao;
  }

  abrirModal(bem: Bem) {
    this.bemSelecionado = bem;
    setTimeout(() => {
      jQuery('#modalBem').modal({
      });
      this.motivoCorrecao = '';
    }, 300);
  }

  onSearch() {
    if (this.pesquisa.length == 0)
      this.bensFiltrados = this.localidade.bens;
    else
      this.bensFiltrados = this.localidade.bens.filter(b => b.pesquisa(this.pesquisa, this.exibirParticulares))
  }

  async solicitarCorrecao() {
    if (this.motivoCorrecao.length < 5) {
      alert('Preencha o motivo da correção corretamente');
      return;
    }
    this.salvando = true;
    try {
      this.localidade.bens = await this.fireService.solicitarCorrecao(this.localidade, this.bemSelecionado, this.motivoCorrecao);
      this.utilService.toastrSucesso('Sucesso!', 'Solicitação de correção foi enviada')
      jQuery('#modalBem').modal('toggle');
      this.motivoCorrecao = '';
      this.corrigir = false;
    } catch (error) {
      this.utilService.toastrErro();
    }
    this.salvando = false;
  }

  toggleCorrecao() {
    this.corrigir = !this.corrigir;
  }

  async excluirBem() {
    jQuery('#modalBem').modal('hide');
    jQuery('#modalLoading').modal({
      backdrop: false,
      keyboard: false,
    });
    if (confirm(`Deseja realmente excluir o bem ${this.bemSelecionado.descricao} - ${this.bemSelecionado.patrimonio}?\nATENÇÃO: Esse procedimento é irreversível.`))
      try {
        this.localidade = await this.fireService.excluirBem(this.bemSelecionado);
      } catch (error) {
        console.error('erro: ', error)
      }
    jQuery('#modalLoading').modal('hide');
    return;
  }

  editarBem() {
    this.router.navigateByUrl('bem-detail', { state: { bem: this.bemSelecionado, localidade: this.localidade } })
  }

  async reabrirLocalidade() {
    console.log(this.localidade);
    if (this.salvando || !confirm('Deseja realmente abrir a localidade.\nAo fazer isso, a foto do relatório será excluída.'))
      return;
    try {
      this.salvando = true;
      this.localidade = await this.fireService.reabrirLocalidade(this.localidade);
    } catch (error) {
      console.error(error)
      this.utilService.toastrErro();
    }
  }

  toggleParticulares() {
    this.exibirParticulares = !this.exibirParticulares;
    if (!this.exibirParticulares)
      this.bensFiltrados = this.localidade.bens.filter(b => !b.bemParticular)
    else
      this.bensFiltrados = this.localidade.bens;
  }

}
