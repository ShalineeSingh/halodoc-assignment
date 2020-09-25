import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TaskListComponent } from "./task/task-list/task-list.component";
import { TaskFormComponent } from "./task/task-form/task-form.component";
import { TaskComponent } from "./task/task.component";

const routes: Routes = [
  {
    path: "",
    component: TaskComponent,
    children: [
      {
        path: "",
        component: TaskListComponent
      },
      {
        path: "form",
        component: TaskFormComponent
      },
      {
        path: ":id",
        component: TaskFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
