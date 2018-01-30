import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Online} from "./online";

import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  readonly ROOT_URL = 'https://sunwell-back.herokuapp.com/online';

  onlineObs: Observable<Online[]>;
  online: Online[];

  constructor(private http: HttpClient, private router: Router) {
  }

  onSearch(name: string) {
    this.router.navigate(['/character', name])
  }

  ngOnInit() {
    this.getOnline()
  }

  getOnlineObservable(): Observable<Online[]> {
    this.onlineObs = this.http.get<Online[]>(this.ROOT_URL);
    return this.onlineObs;
  }

  getOnline() {
    this.getOnlineObservable().subscribe(value => this.online = value);
  }
}
