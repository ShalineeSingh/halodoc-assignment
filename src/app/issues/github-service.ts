import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GitHubService {
  repo_name: string;
  issue_url: string;
  constructor(private httpClient: HttpClient) {}
  getRepoName() {
    return this.repo_name;
  }
  setRepoName(repo_name: string) {
    this.repo_name = repo_name;
  }
  getIssueURL() {
    return this.issue_url;
  }
  setIssueURL(issue_url: string) {
    this.issue_url = issue_url;
  }

  getIssueList(query_params: any): Observable<any> {
    return this.httpClient.get("https://api.github.com/search/issues", {
      headers: {
        accept: "application/vnd.github.v3+json"
      },
      params: query_params
    });
    // return this.httpClient.get("assets/mock-data/issue-list.json");
  }
  getRepoDetails(): Observable<any> {
    return this.httpClient.get("https://api.github.com/repos/angular/angular");
    // return this.httpClient.get("assets/mock-data/repo-details.json");
  }
  getIssueDetails(url: any): Observable<any> {
    // return this.httpClient.get("assets/mock-data/issue-details.json");
    return this.httpClient.get(url);
  }
  getLabels(query_params: any) {
    return this.httpClient.get("https://api.github.com/search/labels", {
      headers: {
        accept: "application/vnd.github.v3+json"
      },
      params: query_params
    });
  }
}
