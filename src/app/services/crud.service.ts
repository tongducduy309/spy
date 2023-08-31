import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  room!: Observable<any[]>;
  game!: Observable<any[]>;
  roles!: Observable<any[]>;
  constructor(private firestore:AngularFirestore) {
    this.room=this.getDataChange('room');
    this.game=this.getDataChange('game');
    this.roles=this.getDataChange('roles');
  }

  getDataChange(collection:any){
    return this.firestore.collection(collection).snapshotChanges().pipe(map((actions: any[]) => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      //console.log(id);
      return { id,...data };
      })))
  }

  addData(collection:any,value:any){
    this.firestore.collection(collection).add(value);
  }

  addNewData(collection:any,id:any,value:any){
    this.firestore.doc(collection+`/${id}`).set(value);
  }

  deleteAllData(collection:any){
    this.firestore.doc(collection).delete();
  }

  deleteData(collection:any,_id:any) {
    this.firestore.doc(collection+`/${_id}`).delete();
  }

  getAllData(collection:any) {
    return new Promise<any>((resolve)=> {
    this.firestore.collection(collection).valueChanges({ idField: 'id' }).subscribe(data => resolve(data));
    })
  }
  updateData(collection:any,_id:any,value:any) {
    this.firestore.doc(collection+`/${_id}`).update(value);
  }

  getRoom(){
    return this.room;
  }
  getGame(){
    return this.game;
  }
  getRoles(){
    return this.roles;
  }
}
