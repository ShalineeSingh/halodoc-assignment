import { Component, OnInit } from "@angular/core";
import { GitHubService } from "../github-service";
import { Router } from "@angular/router";
import { TypeaheadModel } from "src/app/models/typeahead.model";
import { concat, of } from "rxjs";
import { HttpParams } from "@angular/common/http";
import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  tap,
  catchError,
  map
} from "rxjs/operators";

@Component({
  selector: "app-issue-list",
  templateUrl: "./issue-list.component.html",
  styleUrls: ["./issue-list.component.scss"]
})
export class IssueListComponent implements OnInit {
  issue_list: any = [];
  repo_details: any;
  page_loader: boolean = true;
  currentPage = 0;
  page: number;
  total_items: number;
  search_param: string;
  query: string = "repo:angular/angular/node+state:open";
  label_list: any = [];
  label_select = new TypeaheadModel();
  selectedLabels: any;

  constructor(private gitHubService: GitHubService, private router: Router) {}

  ngOnInit() {
    this.getRepoDetails();
    this.getIssueList();
    this._loadLabels();
  }

  getRepoDetails() {
    this.gitHubService
      .getRepoDetails()
      .subscribe((response: any) => {
        console.log(response);
        this.repo_details = response;
      })
      .add(() => (this.page_loader = false));
  }

  getIssueList() {
    this.issue_list = [];
    this.page_loader = true;
    let params = {
      per_page: "10",
      page: this.currentPage
    };
    if (this.query) {
      Object.assign(params, {
        q: this.query
      });
    }
    if (this.selectedLabels) {
      let labels = this.selectedLabels.map(e => e.name).join(",");
      if (params["q"]) {
        params["q"] = params["q"] + "+" + labels;
      } else {
        params["q"] = labels;
      }
    }
    this.gitHubService
      .getIssueList(params)
      .subscribe((response: any) => {
        console.log(response);
        this.total_items = response.total_count;
        this.issue_list = response.items;
      })
      .add(() => (this.page_loader = false));
  }
  goToIssue(url, number) {
    this.gitHubService.setRepoName(this.repo_details.full_name);
    this.gitHubService.setIssueURL(url);
    this.router.navigate(["/view/", number]);
  }

  searchParam() {
    this.currentPage = 0;
    if (this.search_param) {
      this.query = this.query + "+" + this.search_param;
    }
    this.getIssueList();
  }
  pageChanged(event: any): void {
    this.getIssueList();
  }

  private _debounceTime = 500; // in milliseconds
  private _loadLabels() {
    this.label_select.list = concat(
      of([]), // default items
      this.label_select.typeahead.pipe(
        debounceTime(this._debounceTime),
        distinctUntilChanged(),
        tap(() => (this.label_select.loader = true)),
        switchMap((term: string) => {
          let query_params = new HttpParams()
            .set("page", "0")
            .set("repository_id", this.repo_details.id)
            .set("q", term);
          return this.gitHubService.getLabels(query_params).pipe(
            map((response: any) => {
              return response.items;
            }),
            catchError(() => of([])), // empty list on error
            tap(() => (this.label_select.loader = false))
          );
        })
      )
    );
  }
}
