import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { SubscribeService } from 'src/app/services/subscribe.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'src/app/models/subscription';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit {
  
  subscription: any;
  user : firebase.default.User;

  readonly VAPID_KEYS = {
    "publicKey": "BCxgv50d3jobTbjyJGD6p6bGrUZwfJS3kdvAAxNrbJBnp6XY9ByQnbyyPpUACAfF97cMlzda-mXv-qS63SyhA0Q",
    "privateKey": "o_q1f9HQ8dcj-j-qJHNM9fdJ5Eb1JsRDbGnBRJTVb74"
  }

  constructor(private swPush: SwPush,
    private subscribeService: SubscribeService,
    private afAuth: AngularFireAuth) { }


  ngOnInit(): void {
     // Cargamos las Subs del usuario ya creadas on Init
     this.afAuth.user.subscribe(user => {
      if (user) {
        this.loadNotif(user.uid);
      }
    });
  }

  subscribeToNotifications() {

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_KEYS.publicKey
    })
      .then((sub) =>      
        this.subscribeService.addPushSubscriber(sub)
      )
      .catch (err => console.error("Could not subscribe to notifications", err));
  }

  loadNotif(userId){
    this.subscribeService.getSubscriptions(userId).subscribe(response => {
      this.subscription = [];
      // Iteramos sobre todos los Documents
      // y creamos un Array de TodoViews
      response.docs.forEach(value => {
        const data = value.data();
        const id = value.id;

        console.log('Get Subs: ', value);
        
      });

    });
  }


  // export function sendNewsletter(req, res) {

  //     const allSubscriptions = ... get subscriptions from database 

  //     console.log('Total subscriptions', allSubscriptions.length);

  //     const notificationPayload = {
  //         "notification": {
  //             "title": "Angular News",
  //             "body": "Newsletter Available!",
  //             "icon": "assets/main-page-logo-small-hat.png",
  //             "vibrate": [100, 50, 100],
  //             "data": {
  //                 "dateOfArrival": Date.now(),
  //                 "primaryKey": 1
  //             },
  //             "actions": [{
  //                 "action": "explore",
  //                 "title": "Go to the site"
  //             }]
  //         }
  //     };

  //     Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
  //         sub, JSON.stringify(notificationPayload) )))
  //         .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
  //         .catch(err => {
  //             console.error("Error sending notification, reason: ", err);
  //             res.sendStatus(500);
  //         });
  // }
}
