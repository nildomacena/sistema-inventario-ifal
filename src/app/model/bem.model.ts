
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Action, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';
import { FormGroup } from '@angular/forms';
import { Campus } from './campus.model';


export class Bem {
    id: string;
    bemParticular: boolean;
    campusId: string;
    deletado: boolean;
    descricao: string;
    estadoBem: string;
    imagem: string;
    indicaDesfazimento: boolean;
    localidadeId: string;
    numeroSerie: string;
    observacoes: string;
    patrimonio: string;
    semEtiqueta: boolean;
    nomeUsuario: string;
    uidUsuario: string;

    constructor(
        id: string,
        bemParticular: boolean,
        campusId: string,
        deletado: boolean,
        descricao: string,
        estadoBem: string,
        imagem: string,
        indicaDesfazimento: boolean,
        localidadeId: string,
        numeroSerie: string,
        observacoes: string,
        patrimonio: string,
        semEtiqueta: boolean,
        nomeUsuario: string,
        uidUsuario: string
    ) {
        this.id = id;
        this.patrimonio = patrimonio;
        this.bemParticular = bemParticular;
        this.descricao = descricao;
        this.campusId = campusId;
        this.deletado = deletado;
        this.estadoBem = estadoBem;
        this.imagem = imagem;
        this.indicaDesfazimento = indicaDesfazimento;
        this.localidadeId = localidadeId;
        this.numeroSerie = numeroSerie;
        this.observacoes = observacoes;
        this.semEtiqueta = semEtiqueta;
        this.nomeUsuario = nomeUsuario ?? 'Usuário teste';
        this.uidUsuario = uidUsuario ?? 'uidusuarioteste';
    }

    get asObject() {
        return {
            id: this.id,
            estadoBem: this.estadoBem,
            descricao: this.descricao,
            indicaDesfazimento: this.indicaDesfazimento,
            numeroSerie: this.numeroSerie,
            observacoes: this.observacoes,
            patrimonio: this.patrimonio,
            semEtiqueta: this.semEtiqueta,
            nomeUsuario: this.nomeUsuario,
            uidUsuario: this.uidUsuario,
            campusId: this.campusId,
            imagem: this.imagem,
            localidadeId: this.localidadeId,
        }
    }

    pesquisa(str: string, exibirParticulares: boolean): boolean {
        str = str.toLowerCase();
        if (exibirParticulares == false && this.bemParticular)
            return false;

        return this.id.toLowerCase().includes(str) ||
            this.estadoBem.toLowerCase().includes(str) ||
            this.observacoes.toLowerCase().includes(str) ||
            this.patrimonio.toLowerCase().includes(str) ||
            this.nomeUsuario.toLowerCase().includes(str) ||
            this.descricao.toLowerCase().includes(str) ||
            this.numeroSerie.toLowerCase().includes(str)
    }
}

export function fromFirebase(snapshot: QueryDocumentSnapshot<unknown>) {
    return new Bem(
        snapshot.id,
        snapshot.data()['bemParticular'],
        snapshot.data()['campusId'],
        snapshot.data()['deletado'] ?? false,
        snapshot.data()['descricao'],
        snapshot.data()['estadoBem'],
        snapshot.data()['imagem'],
        snapshot.data()['indicaDesfazimento'],
        snapshot.data()['localidadeId'],
        snapshot.data()['numeroSerie'],
        snapshot.data()['observacoes'],
        snapshot.data()['patrimonio'],
        snapshot.data()['semEtiqueta'],
        snapshot.data()['nomeUsuario'],
        snapshot.data()['uidUsuario'],
    );
}

export function fromForm(formGroup: FormGroup) {
    let data = formGroup.value;
    return new Bem(
        data['id'],
        data['bemParticular'],
        data['campusId'],
        data['deletado'] ?? false,
        data['descricao'],
        data['estadoBem'],
        data['imagem'],
        data['indicaDesfazimento'],
        data['localidadeId'],
        data['numeroSerie'],
        data['observacoes'],
        data['patrimonio'],
        data['semEtiqueta'],
        data['nomeUsuario'],
        data['uidUsuario'],
    );
}

export function objetoTeste() {
    return new Bem('DUC58YIOn3PL0fQLM3ch', false, 'xQvvY7xXGWLIB4Eoj3HI', false, 'CPU DELL', 'em_uso',
        'https://http2.mlstatic.com/pc-cpu-gamer-asuscore-i5-9400f16gb-ddr4ssd240gtx1050-4gb-D_Q_NP_918705-MLB33074064682_122019-F.webp',
        true,
        'CEjM5Y3DyCLBTzb3INnP',
        '',
        'Sem observações',
        '987654321',
        false,
        'Usuario teste',
        'uidusuarioteste'
    );
}
