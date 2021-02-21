import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-firebase';
  user: firebase.default.User;

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
        this.ngZone.run(() => {
          this.router.navigate(['']);
        })
      }
    });
  }
}