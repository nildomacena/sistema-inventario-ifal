import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import * as campusFactory from '../model/campus.model';
import { Observable, timer, pipe } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Usuario } from '../model/usuario.model';
import * as usuarioFactory from '../model/usuario.model';
import { Localidade } from '../model/localidade.model';
import * as localidadeFactory from '../model/localidade.model';

import * as firebase from 'firebase';

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
  constructor(private firestore: AngularFirestore, public auth: AngularFireAuth) {
    this.$user = this.auth.user;

    this.auth.user.pipe(map(user => {
      this.$usuario = this.getUsuario(user.uid);
    }));

    this.auth.onAuthStateChanged(user => {
      this.user = user;
      if (user) {

      }
    });

    this.firestore.collection('campi').snapshotChanges().subscribe(snapshot => {
      let campi: Array<campusFactory.Campus> = [];
      snapshot.forEach(snap => {
        campi.push(campusFactory.fromCollectionFirestore(snap))
      });
      this.campi = campi
    });
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


  /** Usuários */

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

  logout(): Promise<void> {
    return this.auth.signOut();
  }

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
      if (usuarioInfo == 'admin')
        return campusFactory.fromDocFirestore(await this.firestore.doc(`campi/${usuarioInfo['campus']['id']}`).snapshotChanges().pipe(first()).toPromise());
      else {
        let error: Error;
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

}
