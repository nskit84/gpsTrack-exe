import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import * as firebase from 'firebase/app';

import { auth } from 'firebase/app';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { switchMap, take,finalize } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class BackendService {

    task: AngularFireUploadTask;
    //percentage: Observable<number>;
    snapshot: Observable<any>;
    downloadURL: Observable<string>;

    constructor(public afAuth: AngularFireAuth, private _afs: AngularFirestore, private _storage: AngularFireStorage) { }
    // login page - login with FB/GOOGLE/EMAIL, if formData is passed, this means is user is using email/password login
  async login(loginType, formData?) {
        if (loginType === 'EMAIL') {
            return  await this.afAuth.auth.signInWithEmailAndPassword(formData.value.email, formData.value.password);
        } else {
            let loginMethod;
            if (loginType === 'FB') { loginMethod = new auth.FacebookAuthProvider(); }
            if (loginType === 'GOOGLE') { loginMethod = new auth.GoogleAuthProvider(); }
            if (loginType === 'TWITTER') { loginMethod = new auth.TwitterAuthProvider();}

            //return  await this.afAuth.auth.signInWithRedirect(loginMethod);
            return  await this.afAuth.auth.signInWithPopup(loginMethod);
        }
    }

    // method to retreive firebase auth after login redirect
    async redirectLogin() {
        return await this.afAuth.auth.getRedirectResult();
    }
    async createUser(formData) {
        if (environment.database === 'firebase') {
            return await this.afAuth.auth.createUserWithEmailAndPassword(formData.value.email, formData.value.password);
        }
        if (environment.database === 'SQL') {
            // need to call SQL API here if a SQL Database is used
        }
    }
    async getUser(): Promise<any> {
        return await this.afAuth.authState.pipe(take(1)).toPromise();
    }

    async sendPasswordResetEmail(passwordResetEmail: string) {
        return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
      }
    getAttendance(): Observable<any> {
        return this._afs.collection('attendanceusers').doc(this.afAuth.auth.currentUser.uid).valueChanges().pipe(
            switchMap(val => this.getUserAttendance(val)));
    }
    getUserAttendance(val?) {
        if (val) {
            return this._afs.collection('attendance', ref =>
            ref.where('delete_flag', '==', 'N')
                .limit(20)
                .orderBy('updatedAt', "desc")).valueChanges();
        } else {
            return this._afs.collection('attendance', ref =>
            ref.where('delete_flag', '==', 'N')
            .where("author", "==", this.afAuth.auth.currentUser.uid)
                .limit(20)
                .orderBy('updatedAt', "desc")).valueChanges();
        }
    }
    setAttendance(filePath: string, userData, file) {
        const id = this._afs.createId();
        const item = { id, name };
        const docRef = this._afs.collection('attendance').doc(item.id);
        docRef.set({
            path: filePath,
            updatedAt: this.timestamp,
            createdAt: this.timestamp,
            delete_flag: "N",
            author: userData.uid,
            id: item.id,
            data: userData
        });

       this.uploadPhoto(file,id);
    }
    updateAttendance(filePath: string, docId: string) {
        const timestamp = this.timestamp;
        const docRef = this._afs.collection('attendance').doc(docId);
        return docRef.update({
            path: filePath,
            updatedAt: this.timestamp
        });
    }
    deleteAttendance(docId) {
        this._afs.collection('attendance').doc(docId).delete();
    }
    // helper functions // get local or serverTimestamp
    get timestamp() {
        const d = new Date();
        return d;
        // return firebase.firestore.FieldValue.serverTimestamp();
    }

    startUpload(file,docId) {
        //const file = event.item(0);
        const filePath =  '/image/' + new Date().getTime();
        const fileRef = this._storage.ref(filePath);
        const task = this._storage.upload(filePath, file);

        // observe percentage changes
        //this.percentage = task.percentageChanges();
        // update attendance doc
        task.snapshotChanges().pipe(
            finalize(() => this.downloadURL = fileRef.getDownloadURL()))
            .subscribe((res) => {
                if (res.bytesTransferred === res.totalBytes) {
                    res.ref.getDownloadURL().then((val) => {
                        return this.updateAttendance(val, docId);
                    });
                }
            });
    }

    uploadPhoto(file,docId) {
        const storageRef = firebase.storage().ref('/images/gpsTrack/'+docId+'.jpeg');
        
        //return storageRef.putString(file, 'base64', { contentType: 'image/jpeg' })
        return storageRef.putString(file, 'data_url', { contentType: 'image/jpeg' })
        .then(() => {
      return storageRef.getDownloadURL().then(downloadURL => {
        return this.updateAttendance(downloadURL, docId);
    });
    })
    }

    async userLogout() {
        return await this.afAuth.auth.signOut();
    }
}
