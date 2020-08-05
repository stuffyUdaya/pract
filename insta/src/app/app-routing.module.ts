import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {path: 'cards', component: CardComponent},
  {path: 'welcome', component: WelcomeComponent},
  {path: '**', redirectTo: 'welcome'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
