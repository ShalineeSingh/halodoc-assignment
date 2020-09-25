import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task-service';
import { Task } from '../models/Task';
import { TaskObj } from '../models/TaskObj';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  button_loader: boolean = false;
  page_loader: boolean = false;
  task: Task = { message: "" };
  priority_map: { name: string, value: number }[] = [{ name: "High", value: 1 }, { name: "Medium", value: 2 }, { name: "Low", value: 3 }]
  dueDate: Date;
  taskPriority: { name: string, value: number };
  users_list: any;
  taskAssignee: any;
  task_id: string;
  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.task_id = this.route.snapshot.params.id;
      this.getTaskDetails();
    }
    this.getUsersList();

  }
  getTaskDetails() {
    let task_details = this.taskService.getCurrentTask();
    this.task.id = task_details.id;
    this.task.message = task_details.message;
    this.task.priority = task_details.priority;
    this.task.assigned_to = task_details.assigned_to;
    if (task_details.due_date) {
      this.task.due_date = task_details.due_date;
      this.dueDate = new Date(task_details.due_date);
    }
    this.taskPriority = this.priority_map.find(el => el.value == this.task.priority);
  }
  submitForm() {
    let body = new FormData();
    body.append("message", this.task.message);
    if (this.task_id) {
      body.append("taskid", this.task.id.toString());
    }
    if (this.taskPriority) {
      let priority = this.priority_map.find(el => el.value == this.taskPriority.value).value;
      body.append("priority", priority.toString());
    }
    if (this.taskAssignee) {
      let user_id = this.users_list.find(el => el.id == this.taskAssignee.id).id;
      body.append("assigned_to", user_id.toString());
    }
    if (this.dueDate) {
      let current_datetime = new Date(this.dueDate)
      let formatted_date = current_datetime.getFullYear() + "-" + this.appendLeadingZeroes(current_datetime.getMonth() + 1) + "-" + this.appendLeadingZeroes(current_datetime.getDate()) + " " + this.appendLeadingZeroes(current_datetime.getHours()) + ":" + this.appendLeadingZeroes(current_datetime.getMinutes()) + ":" + this.appendLeadingZeroes(current_datetime.getSeconds());
      console.log(formatted_date);
      body.append("due_date", formatted_date);
    }
    this.task_id ? this.updateTask(body) : this.saveTask(body);
  }

  saveTask(body: FormData) {
    this.button_loader = true;
    this.taskService.createTask(body).subscribe((response: any) => {
      this.router.navigate(['/']);
    }).add(() => this.button_loader = false);
  }

  updateTask(body: FormData) {
    this.button_loader = true;
    this.taskService.updateTask(body).subscribe((response: any) => {
      this.router.navigate(['/']);
    })
      .add(() => this.button_loader = false);
  }

  getUsersList() {
    this.taskService.getUsersList().subscribe((response: any) => {
      if (response.status === 'success') {
        this.users_list = response.users;
        if (this.task_id) {
          this.taskAssignee = this.users_list.find(el => el.id == this.task.assigned_to);
        }
      }
    });
  }
  appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }
}
