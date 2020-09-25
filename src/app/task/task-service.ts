import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskObj } from './models/TaskObj';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  appKey: string;
  task: TaskObj;
  constructor(private httpClient: HttpClient) {
    this.appKey = "C6Q3CMi2qxjCwpQkwoQdNuw83l7JJZmE";
  }

  getUsersList(): Observable<any> {
    return this.httpClient.get('https://devza.com/tests/tasks/listusers', { headers: { 'AuthToken': this.appKey } });
  }
  createTask(body: any): Observable<any> {
    return this.httpClient.post('http://devza.com/tests/tasks/create', body, { headers: { 'AuthToken': this.appKey } });
  }
  updateTask(body: any): Observable<any> {
    return this.httpClient.post('https://devza.com/tests/tasks/update', body, { headers: { 'AuthToken': this.appKey } });
  }
  deleteTask(body: any): Observable<any> {
    return this.httpClient.post('https://devza.com/tests/tasks/delete', body, { headers: { 'AuthToken': this.appKey } });
  }
  getTaskList(): Observable<any> {
    return this.httpClient.get('https://devza.com/tests/tasks/list', { headers: { 'AuthToken': this.appKey } });
  }
  getCurrentTask() {
    return this.task;
  }
  setCurrentTask(task: TaskObj) {
    this.task = task;
  }
}