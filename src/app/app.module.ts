import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DndModule } from "ng2-dnd";
import bootstrap from "bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgSelectModule } from "@ng-select/ng-select";
import { PaginationModule } from "ngx-bootstrap/pagination";

import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { IssueListComponent } from "./issues/issue-list/issue-list.component";
import { IssueComponent } from "./issues/issue.component";
import { IssueViewComponent } from "./issues/issue-view/issue-view.component";

@NgModule({
  declarations: [
    AppComponent,
    IssueListComponent,
    IssueComponent,
    IssueViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgSelectModule,
    BrowserAnimationsModule,
    PaginationModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
