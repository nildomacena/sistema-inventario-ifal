
import { Action, DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';
import { Campus } from './campus.model';
import * as campusFactory from './campus.model';


export class Usuario {
    documentId: string;
    uid: string;
    nome: string;
    email: string;
    campus: Campus;
    confirmado: boolean;
    cpf: string;
    dataPreCadastro: Date;
    dataSignup: Date;
    papel: string;
    siape: string;
    constructor(
        documentId: string,
        uid: string,
        nome: string,
        email: string,
        papel: string,
        campus: Campus,
        cpf: string,
        dataPreCadastro: Date,
        dataSignup: Date,
        siape: string
    ) {
        this.cpf = cpf;
        this.uid = uid;
        this.nome = nome;
        this.siape = siape;
        this.email = email;
        this.papel = papel;
        this.campus = campus;
        this.documentId = documentId;
        this.dataSignup = dataSignup;
        this.dataPreCadastro = dataPreCadastro;
    }

    get asObject() {
        return {
            uid: this.uid,
            nome: this.nome,
            email: this.email,
            campus: this.campus.asObject,
            papel: this.papel
        }
    }
    get perfil(): string {
        if (this.papel == 'admin')
            return 'Administrador';
        else
            return 'Perfil Padrão';
    }

    get nomeCampus(): string {
        return this.campus.nome;
    }

    get status(): string {
        if (!this.dataSignup)
            return 'Usuário não realizou o cadastro';
        else return `Usuário realizou o cadastro em ${this.dataSignup.getDay()}/${this.dataSignup.getMonth()}/${this.dataSignup.getFullYear()}`;
    }
}

export function fromFirebase(snapshot: Action<DocumentSnapshot<unknown>>, campus?: Campus) {
    if (campus == null) {
        campus = new Campus(snapshot.payload.data()['campus']['id'], snapshot.payload.data()['campus']['nome']);
    }
    return new Usuario(
        snapshot.payload.id,
        snapshot.payload.data()['uid'] ?? snapshot.payload.id,
        snapshot.payload.data()['nome'],
        snapshot.payload.data()['email'],
        snapshot.payload.data()['papel'] ?? 'padrao',
        campus,
        snapshot.payload.data()['cpf'] ?? '',
        snapshot.payload.data()['dataPreCadastro'] != null ? snapshot.payload.data()['dataPreCadastro'].toDate() : Date.now(),
        snapshot.payload.data()['dataSignup']?.toDate(),
        snapshot.payload.data()['siape'] ?? '',
    );
}

export function fromDocumentSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>, campus?: Campus) {
    if (campus == null) {
        campus = new Campus(snapshot.data()['campus']['id'], snapshot.data()['campus']['nome']);
    }
    return new Usuario(
        snapshot.id,
        snapshot.data()['uid'] ?? snapshot.id,
        snapshot.data()['nome'],
        snapshot.data()['email'],
        snapshot.data()['papel'] ?? 'padrao',
        campus,
        snapshot.data()['cpf'] ?? '',
        snapshot.data()['dataPreCadastro'] != null ? snapshot.data()['dataPreCadastro'].toDate() : Date.now(),
        snapshot.data()['dataSignup']?.toDate(),
        snapshot.data()['siape'] ?? '',
    );
}