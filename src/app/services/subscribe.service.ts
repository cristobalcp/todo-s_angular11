import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Subscription } from '../models/subscription';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class SubscribeService {
  private subCollectionName = 'subscriptions';
  user: firebase.default.User;

  constructor(private http: HttpClient,
    private db: AngularFirestore, 
    private afAuth: AngularFireAuth) {

    this.afAuth.user.subscribe((user) => {
      if (user) {
        this.user = user;

        console.log(user);
        
      }
    });
  }


  //  Lista los To Dos disponibles en la Collection
  getSubscriptions(userId: string): Observable<firebase.default.firestore.QuerySnapshot> {
    return this.db.collection<Subscription>(this.subCollectionName, (ref) =>
      ref.where("userId", "==", userId).orderBy('subDate', 'desc')).get();
  }

  // // Backend call to subscribe user
  // addPushSubscriber(sub: any) {
  //   console.log('Guardar en Subscritions firebase: ', sub);
  //   // Crear Subscription Object

  //   return this.http.post('/api/notifications', sub);
  //   // this.http.post('/api/notifications', sub);
  // }

  //  Crea un Nuevo Subscription
  addPushSubscriber(sub: any): Promise<DocumentReference> {
    console.log('SUB recibida: ', sub);

    const subscription: Subscription = {
      userId: this.user.uid,
      subDate: new Date(),
      endpoint: sub.endpoint,
      expirationTime: sub.expirationTime,
      options: {
        applicationServerKey: sub.options.applicationServerKey,
        userVisibleOnly: sub.options.userVisibleOnly
      },
    }

    return this.db.collection(this.subCollectionName).add(subscription);
  }

  // Backend call to Post Notification
  send() {
    return this.http.post('/api/newsletter', null);
  }

}