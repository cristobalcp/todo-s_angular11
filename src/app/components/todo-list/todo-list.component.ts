import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoService } from '../../services/todo.service';
import { TodoViewModel } from 'src/app/models/todo-view-model';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos: TodoViewModel[] = [];
  user : firebase.default.User;

  constructor(private modalService: NgbModal,
    private todoService: TodoService,
    private afAuth: AngularFireAuth) { }

  ngOnInit() {
    // Cargamos los To Dos ya creados on Init
    this.afAuth.user.subscribe(user => {
      if (user) {
        console.log(user);
        this.loadTodos(user.uid);
      }
    })
  }

  clickAddTodo() {
    const modal = this.modalService.open(TodoFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this));
  }

  handleModalTodoFormClose(response) {
    // is response an object?
    if (response === Object(response)) {

      // Añadimos ToDo si estamos en modo Creacion
      if (response.createMode) {
        response.todo.id = response.id;
        this.todos.unshift(response.todo);
      } else {
        // Editamos ToDo seleccionado si estamos en modo Edicion
        let index = this.todos.findIndex(value => value.id == response.id);
        this.todos[index] = response.todo;
      }
    }
  }

  loadTodos(userId: string) {
    this.todoService.getTodos(userId).subscribe(response => {
      this.todos = [];
      console.log(response.metadata);

      // Iteramos sobre todos los Documents
      // y creamos un Array de TodoViews
      response.docs.forEach(value => {
        const data = value.data();
        const id = value.id;

        const todo: TodoViewModel = {
          id: id,
          title: data.title,
          description: data.description,
          done: data.done,
          lastModifiedDate: data.lastModifiedDate.toDate()
        };

        this.todos.push(todo);
      });

    });
  }

  checkedDone(index: number) {
    // Campo Boolean, get contrario actual
    const newDoneValue = !this.todos[index].done,
      id = this.todos[index].id,
      obj_changed = { done: newDoneValue };

    // Cambiamos Valor Front
    this.todos[index].done = newDoneValue;

    // Actualizamos Firestore ToDo
    this.todoService.editTodoPartial(id, obj_changed);

  }
  handleEditClick(todo: TodoViewModel) {
    const modal = this.modalService.open(TodoFormComponent);

    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    )
    modal.componentInstance.createMode = false;
    modal.componentInstance.todo = todo;
  }
  handleDeleteClick(todoId: string, index: number) {
    this.todoService.deleteTodo(todoId)
      .then(() => {
        this.todos.splice(index, 1);
      })
      .catch(err => console.error(err));
  }
}