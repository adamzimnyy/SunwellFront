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
  readonly ROOT_URL = 'https://sunwell-back.herokuapp.com';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  getCharacterObservable(name: string): Observable<Character> {
    this.characterObs = this.http.get<Character>(this.ROOT_URL+"/"+name);
    return this.characterObs;
  }

  getCharacter(name: string) {
    this.getCharacterObservable(name).subscribe(value => {this.character = value; this.isRefreshing = false});
  }

  onSearch(name: string) {
    this.isRefreshing = true;
    this.router.navigate(['/character', name.charAt(0).toUpperCase() + name.toLowerCase().slice(1)])
  }

  ngOnInit() {
    this.isRefreshing = true;
    let name = this.route.snapshot.paramMap.get('name');
    this.getCharacter(name);
  }
}
