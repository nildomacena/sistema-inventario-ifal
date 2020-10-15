
import { Action, DocumentSnapshot } from '@angular/fire/firestore/interfaces';
import { Campus } from './campus.model';


export class Usuario {
    uid: string;
    nome: string;
    email: string;
    campus: Campus;
    papel: string;
    constructor(
        uid: string,
        nome: string,
        email: string,
        papel: string,
        campus: Campus,
    ) {
        this.uid = uid;
        this.nome = nome;
        this.email = email;
        this.papel = papel;
        this.campus = campus;
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
}

export function fromFirebase(snapshot: Action<DocumentSnapshot<unknown>>, campus: Campus) {
    return new Usuario(
        snapshot.payload.id,
        snapshot.payload.data()['nome'],
        snapshot.payload.data()['email'],
        snapshot.payload.data()['papel'] ?? 'padrao',
        campus
    );
}
