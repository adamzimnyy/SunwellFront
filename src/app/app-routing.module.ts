import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent} from './search/search.component';
import {DetailsComponent} from './details/details.component';


const routes: Routes = [
  { path: '', component: SearchComponent},
  { path: 'character/:realm/:name', component: DetailsComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
