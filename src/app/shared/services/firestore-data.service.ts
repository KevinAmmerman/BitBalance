import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { NotificationHandlingService } from './notification-handling.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDataService {

  constructor(
    private firestore: Firestore,
    private notificationService: NotificationHandlingService
    ) { }


  getCollection(collId: string) {
    try {
      const itemCollection = collection(this.firestore, collId);
      return collectionData(itemCollection);
    } catch (err) {
      this.notificationService.error(`Something went wrong! ${err}`)
      return of([]);
    }
  }


  async addDoc(collID: string, docId: number, data: any) {
    try {
      await setDoc(doc(this.firestore, collID, `${docId}`), data) 
    } catch (err) {
      this.notificationService.error(`Something went wrong! ${err}`)
    }
  }


  async updateDoc(docId: string, collId: string, data: any) {
    try {
      const docRef = doc(this.firestore, collId, docId);
      await updateDoc(docRef, data)
    } catch (err) {
      this.notificationService.error(`Something went wrong! ${err}`)
    }

  }


  async deleteDoc(id: string, collID: string) {
    try {
      await deleteDoc(doc(this.firestore, collID, id));
    } catch (err) {
      this.notificationService.error(`Something went wrong! ${err}`)
    }
  }
}
