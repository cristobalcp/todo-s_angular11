import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  
  public isActive: boolean = false;
  errorMessage = '';

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder,
    private ngZone: NgZone) { }

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.ngZone.run(() => {
          this.router.navigate(['/todos']);
        })
      }
    })
  }

  // Create User Email Password
  createUser() {
    this.afAuth.createUserWithEmailAndPassword(this.loginForm.value.username, this.loginForm.value.password).then(() => {
      this.router.navigate(['/todos']);
    }).catch(response => {
      this.errorMessage = response.message;
    });
  }

  // Sign In Email-Password
  signIn() {
    this.afAuth.signInWithEmailAndPassword(this.loginForm.value.username, this.loginForm.value.password)
      .then(() => {
        this.router.navigate(['/todos']);
      }).catch(response => {
        this.errorMessage = response.message;
      });
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.default.auth.GoogleAuthProvider());
  }

  // Sign in with Facebook
  FacebookAuth() {
    return this.AuthLogin(new firebase.default.auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider)
      .then(() => {
        this.router.navigate(['/todos']);
      }).catch((result) => {
        this.errorMessage = result.message;
      })
  }

  // Reset Forggot password
  ForgotPassword() {
    return this.afAuth.sendPasswordResetEmail(this.loginForm.value.username)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        this.errorMessage = error;
      })
  }

  toggleInput(activar: boolean) {
    return this.isActive = activar;
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
}