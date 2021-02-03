import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, DocumentChangeAction, DocumentData, DocumentSnapshot } from '@angular/fire/firestore/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import * as campusFactory from '../model/campus.model';
import { Observable, timer, pipe } from 'rxjs';
import { map, first, mergeMap, flatMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Usuario } from '../model/usuario.model';
import * as usuarioFactory from '../model/usuario.model';
import { Localidade } from '../model/localidade.model';
import * as localidadeFactory from '../model/localidade.model';
import * as bemFactory from '../model/bem.model';

import * as firebase from 'firebase';
import { Bem } from '../model/bem.model';
import { Correcao } from '../model/correcao.model';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  user: User;
  $usuario: Observable<Usuario>;
  $user: Observable<User>;
  $localidades: Observable<Localidade[]>;
  campi: Array<campusFactory.Campus>;
  localidades: Localidade[];
  constructor(private firestore: AngularFirestore, public auth: AngularFireAuth, public storage: AngularFireStorage) {
    this.$user = this.auth.user;


    //Testando nova função de ouvir Observable do usuário
    this.authState().subscribe((usuario: Usuario) => {
      console.log(usuario);
    });

    this.auth.user.pipe(map(user => {
      this.$usuario = this.getUsuario(user.uid);
    }));


    this.firestore.collection('campi').snapshotChanges().subscribe(snapshot => {
      let campi: Array<campusFactory.Campus> = [];
      snapshot.forEach(snap => {
        campi.push(campusFactory.fromCollectionFirestore(snap))
      });
      this.campi = campi
    });
  }

  authState(): Observable<Usuario> {
    return this.auth.authState.pipe(flatMap((user) => {
      if (!user)
        return null;
      return this.getUsuario(user.uid);
    }));
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**AUTENTICAÇÃO */
  isLoggedIn() {
    this.auth.user.pipe(map((user) => {
      console.log(user);
      return user != null
    }));
  }

  login(email: string, senha: string): Promise<any> {
    return this.auth.signInWithEmailAndPassword(email, senha);
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  async criarUsuario(email: string, senha: string, nome: string, campus: campusFactory.Campus): Promise<any> {
    if (!email.includes('@ifal.edu.br'))
      return Promise.reject('email-nao-institucional');
    let userCredential: firebase.auth.UserCredential = await this.auth.createUserWithEmailAndPassword(email, senha);
    return this.firestore.doc(`usuarios/${userCredential.user.uid}`).set({
      uid: userCredential.user.uid,
      campus: campus.asObject,
      nome: nome,
      email: email,
      papel: 'admin'
    });
  }

  /**FIM AUTENTICAÇÃO */

  /** USUÁRIOS */

  getUsuario(uid: string): Observable<Usuario> {
    return this.firestore.doc(`usuarios/${uid}`).snapshotChanges().pipe(map(snapshotUser => {
      let usuario: Usuario;
      let campus: campusFactory.Campus;
      if (this.campi && this.campi.length > 0)
        this.campi.forEach(c => {
          if (snapshotUser.payload.data()['campus']['id'].indexOf(c.id) >= 0) {
            campus = c;
          }
        })
      usuario = usuarioFactory.fromFirebase(snapshotUser, campus);
      return usuario;
    }))

  }

  async getUsuarioAsPromise(): Promise<Usuario> {
    return this.getUsuario((await this.auth.currentUser).uid).pipe(first()).toPromise();
  }


  async getUsuarioCadastrados(): Promise<Usuario[]> {
    let usuario: Usuario = await this.getUsuarioAsPromise();
    let querySnapshot = await this.firestore.collection('usuarios', ref => ref.where('campusId', '==', usuario.campus.id)).get().pipe(first()).toPromise();
    return querySnapshot.docs.map(snapshot => {
      return usuarioFactory.fromDocumentSnapshot(snapshot);
    });
  }


  async salvarPreCadastro(nome: string, cpf: string, siape: string): Promise<Usuario[]> {
    let usuario = await this.getUsuario((await this.auth.currentUser).uid).pipe(first()).toPromise();
    await this.firestore.collection('usuarios').add({
      campus: usuario.campus.asObject,
      campusId: usuario.campus.id,
      nome: nome,
      cpf: cpf,
      siape: siape,
      confirmado: false,
      dataPreCadastro: firebase.firestore.FieldValue.serverTimestamp(),
      papel: 'padrao'
    });
    return this.getUsuarioCadastrados();
  }

  async excluirPreCadastro(usuario: Usuario): Promise<Usuario[]> {
    await this.firestore.doc(`usuarios/${usuario.documentId}`).delete();
    return this.getUsuarioCadastrados();
  }

  async usuarioEAdmin(): Promise<boolean> {
    //await timer(500).pipe(first()).toPromise();
    let user: User = await this.$user.pipe(first()).toPromise();
    if (!user)
      return false;
    let usuario: Usuario = await this.getUsuario(user.uid).pipe(first()).toPromise();
    return usuario.papel == 'admin';
    /* return this.getUsuario(uid).pipe(map(usuario => {
      return usuario.papel == 'admin';
    })).toPromise(); */
  }

  /**FIM USUÁRIOS */


  /**CAMPUS */

  getCampi(): Observable<Array<campusFactory.Campus>> {
    return this.firestore.collection('campi').snapshotChanges().pipe(map(snapshot => {
      let campi: Array<campusFactory.Campus> = [];
      console.log('snap.payload.doc.data()', snapshot);
      snapshot.forEach(snap => {
        campi.push(campusFactory.fromCollectionFirestore(snap))
      });
      console.log(this.campi, campi);
      if (!this.campi || this.campi.length == 0 || this.campi == null || this.campi == undefined) {
        this.campi = campi
      }
      return campi;
    }));
  }


  async getCampusPorUid(usuario?: Usuario): Promise<campusFactory.Campus> {
    let user: User;
    let usuarioInfo;
    if (usuario == null) {
      user = await this.auth.user.pipe(first()).toPromise();
      usuarioInfo = await this.firestore.doc(`usuarios/${user.uid}`).valueChanges().pipe(first()).toPromise();
      if (usuarioInfo['papel'] == 'admin')
        return campusFactory.fromDocFirestore(await this.firestore.doc(`campi/${usuarioInfo['campus']['id']}`).snapshotChanges().pipe(first()).toPromise());
      else {
        console.log(user.uid)
        let error: Error = new Error();
        error.name = 'nao-autorizado';
        error.message = 'O usuário não tem permissão para essa operação'
        return Promise.reject(error);
      }
    }
    else {
      if (usuario.papel == 'admin')
        return campusFactory.fromDocFirestore(await this.firestore.doc(`campi/${usuario.campus.id}`).snapshotChanges().pipe(first()).toPromise());
      else {
        let error: Error;
        error.name = 'nao-autorizado';
        error.message = 'O usuário não tem permissão para essa operação'
        return Promise.reject(error);
      }
    }
  }

  async getBensCadastradosCampus(): Promise<Bem[]> {
    let usuario: Usuario;
    usuario = await this.getUsuario((await this.auth.currentUser).uid).pipe(first()).toPromise();
    let bensReference = await this.firestore.collection(`campi/${usuario.campus.id}/2020/2020/bens`).snapshotChanges().pipe((first())).toPromise();
    return bensReference.map(r => {
      return bemFactory.fromFirebase(r.payload.doc);
    });
  }

  async getLocalidadeById(campusId: string, localidadeId: string): Promise<Localidade> {
    let bensReference = await this.firestore.collection(`campi/${campusId}/2020/2020/localidades/${localidadeId}/bens`, ref => ref.where('deletado', '==', false)).snapshotChanges().pipe((first())).toPromise();
    let documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> = await this.firestore.doc(`campi/${campusId}/2020/2020/localidades/${localidadeId}`).get().pipe(first()).toPromise();
    return localidadeFactory.localidadeFromFirebase(documentSnapshot, bensReference);
  }

  async getLocalidades(): Promise<Localidade[]> {
    let uid: string;
    let usuario: Usuario;
    await this.sleep(500);
    usuario = await this.getUsuario((await this.auth.currentUser).uid).pipe(first()).toPromise();
    console.log('this.fireService.getLocalidades()', usuario);
    let querySnapshot: DocumentChangeAction<any>[] = await this.firestore.collection(`campi/${usuario.campus.id}/2020/2020/localidades`).snapshotChanges().pipe(first()).toPromise();
    if (this.user != null)
      uid = this.user.uid;
    else {
      let user = await this.auth.currentUser
      uid = user.uid;
    }
    this.localidades = await Promise.all(localidadeFactory.listFromFirebase(querySnapshot));
    return Promise.all(localidadeFactory.listFromFirebase(querySnapshot));
  }

  async cadastraLocalidade(nome: string): Promise<Localidade[]> {
    let campus: campusFactory.Campus = await this.getCampusPorUid();
    await this.firestore.collection(`campi/${campus.id}/2020/2020/localidades/`).add({
      nome: nome,
      status: 0,
      panoramica: '',
      observacoes: '',
    });
    return this.getLocalidades();
  }

  async salvarLocalidades(localidades: Localidade[]): Promise<any> {
    if (await this.usuarioEAdmin() == false)
      return Promise.reject('usuario-nao-autorizado')
    let usuario: Usuario = await this.getUsuario(this.user.uid).pipe(first()).toPromise();
    let batch = firebase.firestore().batch();
    localidades.forEach(l => {
      /* let ref = this.firestore.collection(`campi/${await usuario.campus.id}/localidades2020`).doc();
       */
      console.log('ref: ', usuario.campus.id);
      batch.set(firebase.firestore().collection(`campi/${usuario.campus.id}/localidades2020`).doc(), l.asObject);
    })
    console.log('batch')
    return batch.commit();
  }

  async reabrirLocalidade(localidade: Localidade): Promise<Localidade> {
    await this.storage.ref(`inventario2020/${localidade.campusId}/${localidade.id}/relatorio`).delete();
    await this.firestore.doc(`campi/${localidade.campusId}/2020/2020/localidades/${localidade.id}`).update({
      panoramica: '',
      status: 1,
      reabertoEm: firebase.firestore.FieldValue.serverTimestamp(),
      reabertoPor: this.user.uid
    });
    return this.getLocalidadeById(localidade.campusId, localidade.id);
  }

  async solicitarCorrecao(localidade: Localidade, bem: Bem, motivo: string): Promise<Bem[]> {
    await this.firestore.collection(`campi/${localidade.campusId}/2020/2020/correcoes`).add({
      motivo: motivo,
      bemId: bem.id,
      bemDescricao: bem.descricao,
      bemPatrimonio: bem.patrimonio ?? "",
      localidadeId: localidade.id,
      localidadeNome: localidade.nome
    });
    await this.firestore.doc(`campi/${localidade.campusId}/2020/2020/localidades/${localidade.id}/bens/${bem.id}`).update({ aCorrigir: true });
    let querySnapshot = await this.firestore.collection(`campi/${localidade.campusId}/2020/2020/localidades/${localidade.id}/bens`).get().pipe(first()).toPromise()
    return querySnapshot.docs.map(s => bemFactory.fromFirebase(s));
  }

  async getCorrecoes() {
    //this.auth
  }

  /**BEM */
  async excluirBem(bem: Bem): Promise<Localidade> {
    let bensReference;
    await this.storage.ref(`inventario2020/${bem.campusId}/${bem.localidadeId}/bens/${bem.id}`).delete().pipe((first())).toPromise();
    await this.firestore.doc(`campi/${bem.campusId}/2020/2020/localidades/${bem.localidadeId}/bens/${bem.id}`).delete();
    return this.getLocalidadeById(bem.campusId, bem.localidadeId);
    /* bensReference = await this.firestore.collection(`campi/${bem.campusId}/2020/2020/localidades/${bem.localidadeId}/bens`).snapshotChanges().pipe((first())).toPromise();
    let documentSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> = await this.firestore.doc(`campi/${bem.campusId}/2020/2020/localidades/${bem.localidadeId}`).get().pipe(first()).toPromise();
    return localidadeFactory.localidadeFromFirebase(documentSnapshot, bensReference) */
  }

  async alterarBem(bem: Bem): Promise<Localidade> {
    await this.firestore.doc(`campi/${bem.campusId}/2020/2020/localidades/${bem.localidadeId}/bens/${bem.id}`).update(bem.asObject);
    console.log(bem)
    return this.getLocalidadeById(bem.campusId, bem.localidadeId);
  }

}
