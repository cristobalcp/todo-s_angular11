import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  
  @Input() user: firebase.default.User;
  constructor(private afAuth: AngularFireAuth) { }

  logout() {
    this.afAuth.signOut();
  }
}
