
import { DocumentChangeAction } from '@angular/fire/firestore/interfaces';
import { Campus } from './campus.model';
import { Bem } from './bem.model';
import { Usuario } from './usuario.model';
import * as bemFactory from './bem.model';
import { from } from 'rxjs';
import * as firebase from 'firebase';

enum Status {
    nao_iniciado,
    em_andamento,
    finalizado
}
export class Localidade {
    //uid: string;
    nome: string;
    id: string;
    status: Status;
    campusId: string;
    bens: Array<Bem>;
    panoramica: string;
    relatorio: string;
    observacoes: string;
    finalizadoPor: string;
    constructor(
        id: string,
        nome: string,
        status: Status,
        bens: Array<Bem>,
        campusId: string,
        panoramica?: string,
        relatorio?: string,
        observacoes?: string,
        finalizadoPor?: string
    ) {
        this.nome = nome;
        this.id = id;
        this.status = status;
        this.bens = bens;
        this.panoramica = panoramica;
        this.relatorio = relatorio;
        this.observacoes = observacoes;
        this.finalizadoPor = finalizadoPor;
        this.campusId = campusId;
    }

    get finalizada(): boolean {
        return this.status == Status.finalizado;
    }
    get statusString(): string {
        return (this.status == Status.nao_iniciado ? 'Não iniciado' : this.status == Status.em_andamento ? 'Em andamento' : 'Finalizado');
    }

    get asObject() {
        let bens: Array<any> = [];
        this.bens.forEach(b => {
            bens.push(b.asObject);
        })
        return {
            uid: this.nome,
            nome: this.id,
            email: this.status,
            bens: bens
        }
    }
    // public toString = (): string => `${this.nome} - ${this.id} - Quantidade de bens: ${this.bens.length}`;


}
/* 
export function fromFirebase(snapshot: Action<DocumentSnapshot<unknown>>, campus: Campus) {
    return new Localidade(
        snapshot.payload.id,
        snapshot.payload.data()['nome'],
        snapshot.payload.data()['email'],
        snapshot.payload.data()['papel'] ?? 'padrao',
        //campus
    );
} 
 */

export async function localidadeFromFirebase(snapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>, bens: DocumentChangeAction<unknown>[]) {
    const data = snapshot.data();
    let bensArray = [];
    //console.log(bens, bens[0].payload.doc)
    bensArray = bens.map(b => bemFactory.fromFirebase(b.payload.doc));
    console.log(snapshot.exists, snapshot.ref.parent.id);
    return new Localidade(
        snapshot.id,
        data['nome'],
        status ? status : data['status'] ?? Status.em_andamento,
        bensArray,
        snapshot.ref.parent.id, //Referência do campus
        data['panoramica'],
        data['imagemRelatorio'],
        data['observacoes'],
        data['nomeUsuario']);
}

export function listFromFirebase(querySnapshot: DocumentChangeAction<any>[]): Promise<Localidade>[] {
    return querySnapshot.map(async (s) => {
        let data = s.payload.doc.data();
        let bens: Bem[] = [];
        let status: Status;

        bens = (await s.payload.doc.ref.collection('bens').get()).docs.map(b => bemFactory.fromFirebase(b))
        if (data['status'] == null) {
            if (bens.length > 0)
                status = Status.em_andamento;
            else
                status = Status.nao_iniciado;
        }
        return new Localidade(
            s.payload.doc.id,
            data['nome'],
            status ? status : data['status'] ?? Status.em_andamento,
            bens,
            s.payload.doc.ref.parent.parent.parent.parent.id,
            data['panoramica'], data['imagemRelatorio'], 
            data['observacoes'], 
            data['nomeUsuario']);
    });

}