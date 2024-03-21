import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {

  constructor(private firestore: Firestore) { }


  getCollection(collId: string) {
    try {
      const itemCollection = collection(this.firestore, collId);
      return collectionData(itemCollection);
    } catch (error) {
      return of([]);
    }
  }


  async addDoc(collID: string, docId: number, data: any) {
    try {
      // const docRef = await addDoc(collection(this.firestore, collID, docId), data)
      await setDoc(doc(this.firestore, collID, `${docId}`), data) 
    } catch (error) {
      console.log(error)
    }

  }


  async updateDoc(docId: string, collId: string, data: any) {
    try {
      const docRef = doc(this.firestore, collId, docId);
      await updateDoc(docRef, data)
    } catch (error) {
      console.log(error)
    }

  }


  async deleteDoc(id: string, collID: string) {
    try {
      await deleteDoc(doc(this.firestore, collID, id));
    } catch (error) {

    }

  }
}
