import { Component, OnInit } from "@angular/core";
import { GitHubService } from "../github-service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-issue-view",
  templateUrl: "./issue-view.component.html",
  styleUrls: ["./issue-view.component.scss"]
})
export class IssueViewComponent implements OnInit {
  repo_name: string;
  page_loader: boolean = true;
  issue_details: any;
  issue_url: string;
  constructor(
    private gitHubService: GitHubService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.repo_name = this.gitHubService.getRepoName();
    this.issue_url =
      this.gitHubService.getIssueURL() ||
      "https://api.github.com/repos/angular/angular/issues/" +
        this.route.snapshot.params.id;
    this.getIssueDetails();
  }
  getIssueDetails() {
    this.page_loader = true;
    this.gitHubService
      .getIssueDetails(this.issue_url)
      .subscribe((response: any) => {
        console.log(response);
        this.issue_details = response;
      })
      .add(() => (this.page_loader = false));
  }
}
