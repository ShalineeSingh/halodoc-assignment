import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IssueListComponent } from "./issues/issue-list/issue-list.component";
import { IssueComponent } from "./issues/issue.component";
import { IssueViewComponent } from "./issues/issue-view/issue-view.component";

const routes: Routes = [
  {
    path: "",
    component: IssueComponent,
    children: [
      {
        path: "",
        component: IssueListComponent
      },
      {
        path: "view/:id",
        component: IssueViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
