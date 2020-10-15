
import { Action, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';
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
    condicao: string;
    semEtiqueta: boolean;

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
    }

    get asObject() {
        return {
            uid: this.patrimonio,
            nome: this.descricao,
            email: this.condicao,

        }
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
        snapshot.data()['semEtiqueta']
    );
}
