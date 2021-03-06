import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Localidade } from '../model/localidade.model';
import { Bem } from '../model/bem.model';
import { FireService } from '../services/fire.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterService } from '../services/router.service';
import { UtilService } from '../services/util.service';
declare var jQuery: any;

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {
  arquivoCSV;
  loading: boolean = false;
  localidades: Array<Localidade> = [];
  localidadesSalvas: Array<Localidade> = [];
  nomeNovaLocalidade: string;
  constructor(
    private papa: Papa,
    private fireService: FireService,
    private toastr: ToastrService,
    private router: Router,
    private routerService: RouterService,
    private utilService: UtilService) {
    this.fireService.getLocalidades().then(localidades => {
      this.localidades = localidades;
      console.log(this.localidades)
    });

  }

  ngOnInit(): void {
  }

  goToLocalidade(localidade) {
    console.log('goToLocalidade');
    this.routerService.setLocalidade(localidade);
    this.router.navigateByUrl('localidade-detail');
  }


  onFileChange(event) {
    /* let localidades: Array<Localidade> = [];
    this.arquivoCSV = event.target.files[0]
    this.papa.parse(this.arquivoCSV, {
      complete: (results) => {
        console.log(results);
        results.data.forEach(element => {
          let achouElemento: boolean = false;

          if (element[24] && !element[24].toUpperCase().includes("LOCALIDADE")) {
            localidades.forEach(l => {
              if (element[24] == l['descricaoCompleta'])
                achouElemento = true;
            })
            if (!achouElemento) {
              localidades.push(

                new Localidade(
                  element[24].includes(' - ') ? element[24].substr(element[24].indexOf(' -') + 2) : element[24],
                  element[24].substr(0, element[24].indexOf(' -')),
                  element[24],
                  'nao_iniciado', []
                )
              );
            }
          }
        });
        results.data.forEach(element => {
          localidades.forEach(l => {
            if (element[24] == l.descricaoCompleta)
              l.bens.push(new Bem(
                element[4],
                element[7],
                element[8],
              ))
          })
        })
        console.log(localidades);
        this.localidades = localidades;
      }
    }); */
  }

  async cadastrarNovaLocalidade() {
    if (this.nomeNovaLocalidade.length <= 3) {
      alert('Preencha o nome da localidade corretamente.')
      return;
    }
    if ((this.localidades.filter(l => {
      return l.nome.toLocaleLowerCase() == this.nomeNovaLocalidade.toLocaleLowerCase();
    })).length > 0) {
      alert('J?? existe uma localidade cadastrada com esse nome')
    }
    try {
      this.loading = true;
      this.localidades = await this.fireService.cadastraLocalidade(this.nomeNovaLocalidade);
      this.nomeNovaLocalidade = '';
      this.utilService.toastrSucesso();

    } catch (error) {
      this.utilService.toastrErro('Erro durante o cadastro', 'Ocorreu o seguinte erro durante o cadastro: ' + error);
      console.error(error);
    }
    this.loading = false;
  }

  async salvarDados() {
    console.log('salvarDados')
    if (confirm('Deseja realmente salvar esses dados? Uma vez salvos, os cadastros anteriores ser??o apagados')) {
      this.loading = true;
      try {
        await this.fireService.salvarLocalidades(this.localidades);
        this.loading = false;


      } catch (error) {
        if (error == 'usuario-nao-autorizado') {
          this.toastr.error('Seu usu??rio n??o possui autoriza????o. Entre em contato com o administrador do sistema', 'ACESSO NEGADO')
        }
        else
          this.toastr.error(`Ocorreu um erro durante a opera????o. Tente novamente mais tarde. Caso o erro persista, entre em contato com o administrador do sistema`, 'Erro')
        console.error(error);
        this.loading = false;

      }
      this.localidadesSalvas = this.localidades;
      jQuery('#modal-default').modal('hide')
    }
  }
}
