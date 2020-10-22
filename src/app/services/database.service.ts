import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  public sendComments(comments: string) {
    const date = Date.now();
    const comment = {
      id: String(date),
      comment: comments,
      date: new Date().toDateString()
    };
    this.firestore.collection('comments').doc(comment.id).set(comment);
  }
}
