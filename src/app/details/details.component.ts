import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Character} from './character';
import {Observable} from 'rxjs/Observable';
import {Router, ActivatedRoute} from '@angular/router'
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  isRefreshing: boolean;
  characterObs: Observable<Character>;
  character: Character;
  readonly ROOT_URL = 'https://sunwell-back.herokuapp.com/character';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  getCharacterObservable(name: string,realm: string): Observable<Character> {
    this.characterObs = this.http.get<Character>(this.ROOT_URL+"/"+realm+"/"+name);
    return this.characterObs;
  }

  getCharacter(name: string,realm: string) {
    let nameCase = name.charAt(0).toUpperCase()+name.slice(1).toLowerCase();
    let realmCase = realm.charAt(0).toUpperCase()+realm.slice(1).toLowerCase();
    this.getCharacterObservable(nameCase,realmCase).subscribe(value => {this.character = value; this.isRefreshing = false});
  }

  ngOnInit() {
    this.isRefreshing = true;
    let name = this.route.snapshot.paramMap.get('name');
    let realm = this.route.snapshot.paramMap.get('realm');
    this.getCharacter(name,realm);
  }
}
