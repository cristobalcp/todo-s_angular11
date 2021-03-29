import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, Inject, Injectable } from '@angular/core';

import { AppComponent } from './app.component';

// Cristobal
import { environment } from 'src/environments/environment'; // Config Firebase
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { AngularFireModule } from '@angular/fire'; // Firebase config
import { AngularFirestoreModule } from '@angular/fire/firestore'; // For Cloud Firestore
import { AngularFireAuthModule } from '@angular/fire/auth'; // Auth

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { MenuComponent } from './components/menu/menu.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';

import { HttpClientModule } from '@angular/common/http';
// Localization
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { MapsComponent } from './components/maps/maps.component';

import { AgmCoreModule } from '@agm/core'

registerLocaleData(localeEs, 'es');


@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoFormComponent,
    MenuComponent,
    ContactComponent,
    LoginComponent,
    NotificationsComponent,
    MapsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Import firebase
    AngularFirestoreModule, // Import firestore
    AngularFireAuthModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBslvcSbs-aDAZyfOv2UlqBWOsDeym2Rs0"
    }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }, // LOCALIZATION
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig
    }], 
    bootstrap: [AppComponent],

  // Se añaden de manera dinamica
  entryComponents: [TodoFormComponent]

})
export class AppModule { }
