import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task-service';
import { Router } from '@angular/router';
import { TaskObj } from '../models/TaskObj';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  page_loader: boolean = true;
  task_list = {
    'priority_1': [],
    'priority_2': [],
    'priority_3': []
  };
  priority_map: { name: string, value: number }[] = [{ name: "High", value: 1 }, { name: "Medium", value: 2 }, { name: "Low", value: 3 }, { name: "All", value: 4 }];
  taskPriority: { name: string, value: number };
  taskMessage: string;
  filtered_task_list: Array<TaskObj>;
  dueDate: Date;
  task_backup;

  constructor(private taskService: TaskService, private router: Router) {
    this.taskPriority = { name: "All", value: 4 };
  }

  ngOnInit() {
    this.getTaskList();
  }
  getTaskList() {
    this.page_loader = true;
    this.taskService.getTaskList().subscribe((response: any) => {
      if (response.status === 'success') {
        response.tasks.forEach(element => {
          if (element.priority == 1) {
            this.task_list.priority_1.push(element);
          } else if (element.priority == 2) {
            this.task_list.priority_2.push(element);
          } else {
            this.task_list.priority_3.push(element);
          }
        });
        this.task_backup = { ...this.task_list };
      }
    }).add(() => this.page_loader = false);
  }
  goToForm() {
    this.router.navigate(['/form']);
  }
  goToEdit(task) {
    this.taskService.setCurrentTask(task);
    this.router.navigate(['/', task.id]);
  }
  removeFomBucket($event: any, type: string) {
    this.task_list[type] = this.task_list[type].filter(el => el.id !== $event.dragData.id);
    this.task_backup[type] = this.task_backup[type].filter(el => el.id !== $event.dragData.id);
  }
  addToBucket($event: any, type: string) {
    let priority = type.split('_')[1];
    $event.dragData.priority = priority;
    this.task_list[type].push($event.dragData);
    this.task_backup[type].push($event.dragData);
    this.updateTask($event.dragData);
  }
  updateTask(task: TaskObj) {
    let body = new FormData();
    body.append("taskid", task.id.toString());
    body.append("message", task.message);
    body.append("priority", task.priority.toString());
    if (task.assigned_to) {
      body.append("assigned_to", task.assigned_to.toString());
    }
    if (task.due_date) {
      body.append("due_date", task.due_date.toString());
    }
    this.taskService.updateTask(body).subscribe((response: any) => {
      if (response.status === 'success') {
        console.log(response);
      } else {
        alert(response.error);
      }
    });
  }
  deleteTask(task: TaskObj, type: string) {
    let body = new FormData();
    body.append("taskid", task.id.toString());
    this.taskService.deleteTask(body).subscribe((response: any) => {
      if (response.status === 'success') {
        this.task_list[type] = this.task_list[type].filter(el => el.id !== task.id);
        this.task_backup[type] = this.task_backup[type].filter(el => el.id !== task.id);
      } else {
        alert(response.error);
      }
    });
  }
  messageFilter() {
    if (this.taskMessage) {
      Object.keys(this.task_list).forEach(priority => {
        this.task_list[priority] = this.task_list[priority].filter(el => {
          return el.message.toLowerCase().indexOf(this.taskMessage.toLowerCase()) > -1;
        });
      });
    } else {
      this.task_list = { ...this.task_backup };
    }
  }
  priorityFilter() {
    switch (this.taskPriority.value) {
      case 1:
        this.filtered_task_list = this.task_list.priority_1;
        break;
      case 2:
        this.filtered_task_list = this.task_list.priority_2;
        break;
      case 3:
        this.filtered_task_list = this.task_list.priority_3;
        break;
      default: break;
    }
  }
  dueDateFilter() {
    if (this.dueDate) {
      let [cur_date, cur_month, cur_year] = [new Date(this.dueDate).getDate(), new Date(this.dueDate).getMonth(), new Date(this.dueDate).getFullYear()];
      Object.keys(this.task_list).forEach(priority => {
        this.task_list[priority] = this.task_list[priority].filter(el => {
          let [new_date, new_month, new_year] = [new Date(el.due_date).getDate(), new Date(el.due_date).getMonth(), new Date(el.due_date).getFullYear()];
          return new_date === cur_date && new_month === cur_month && new_year === cur_year;
        })
      })
    } else {
      this.task_list = { ...this.task_backup };
    }
  }
}
