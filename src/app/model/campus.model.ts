
import { Action, DocumentChangeAction, DocumentSnapshot } from '@angular/fire/firestore/interfaces';


export class Campus {
    id: string;
    nome: string;
    constructor(
        id: string,
        nome: string
    ) {
        this.id = id;
        this.nome = nome;
    }

    get asObject() {
        return {
            id: this.id,
            nome: this.nome
        }
    }
}

export function fromCollectionFirestore(snapshot: DocumentChangeAction<any>) {
    let data = snapshot.payload.doc.data();
    return new Campus(
        snapshot.payload.doc.id,
        snapshot.payload.doc.data()['nome'],
    );
}

export function fromDocFirestore(snapshot: Action<DocumentSnapshot<unknown>>) {
    let data = snapshot.payload.data();
    return new Campus(
        snapshot.payload.id,
        snapshot.payload.data()['nome'],
    );
}