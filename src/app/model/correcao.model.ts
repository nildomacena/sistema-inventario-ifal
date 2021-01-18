
import { Action, DocumentChangeAction, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';


export class Correcao {
    id: string;
    bemDescricao: string;
    bemId: string;
    localidadeNome: string;
    localidadeId: string;
    constructor(
        id: string,
        bemDescricao: string,
        bemId: string,
        localidadeNome: string,
        localidadeId: string,
    ) {
        this.id = id;
        this.bemDescricao = bemDescricao;
        this.bemId = bemId;
        this.localidadeId = localidadeId;
        this.localidadeNome = localidadeNome;
    }

    get asObject() {
        return {
            id: this.id,
            bemDescricao: this.bemDescricao,
            bemId: this.bemId,
            localidadeId: this.localidadeId,
            localidadeNome: this.localidadeNome,
        }
    }
}

export function fromCollectionFirestore(snapshot: QueryDocumentSnapshot<unknown>) {
    let data = snapshot.data();
    return new Correcao(
        snapshot.id,
        data['bemDescricao'],
        data['bemId'],
        data['localidadeNome'],
        data['localidadeId'],
    );
}

