import { Subject, Observable } from "rxjs";

export class TypeaheadModel {
  public typeahead;
  public loader;
  public list;
  public debounceTime;
  constructor() {
    this.typeahead = new Subject<string>();
    this.loader = false;
    this.list = new Observable<any>();
    this.debounceTime = 500; // in milliseconds
  }
}
