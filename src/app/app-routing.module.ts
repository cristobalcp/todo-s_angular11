import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { MapsComponent } from './components/maps/maps.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  { 
    path: 'maps',
    component: MapsComponent 
  },
  { path: 'todos', 
    component: TodoListComponent 
  },
  { path: 'notifica', 
    component: NotificationsComponent 
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})

export class AppRoutingModule { }