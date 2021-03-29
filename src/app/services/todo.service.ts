import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';
import { TodoViewModel } from '../models/todo-view-model';

@Injectable({
  providedIn: 'root'
})

export class TodoService {

  constructor(private db: AngularFirestore) { }

  //  Nombre Collection Firestore
  private todoCollectionName = 'todos';


  //  Lista los To Dos disponibles en la Collection
  getTodos(userId: string): Observable<firebase.default.firestore.QuerySnapshot> {
    return this.db.collection<Todo>(this.todoCollectionName, ref =>
      ref.where("userId", "==", userId).orderBy('lastModifiedDate', 'desc')).get();
  }

  //  Crea un Nuevo To Do
  saveTodo(todo: Todo): Promise<DocumentReference> {
    return this.db.collection(this.todoCollectionName).add(todo);
  }
  // Edita un To Do ya creado
  editTodo(todo: TodoViewModel): Promise<void> {
    return this.db.collection(this.todoCollectionName).doc(todo.id).update(todo);
  }

  editTodoPartial(id: string, obj: Object): Promise<void> {
    return this.db.collection(this.todoCollectionName).doc(id).update(obj);
  }

  //  Elimina un To Do de la Collection definiticvamente
  deleteTodo(idTodo: string): Promise<void> {
    return this.db.collection(this.todoCollectionName).doc(idTodo).delete();
  }
}