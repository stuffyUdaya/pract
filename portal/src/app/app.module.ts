import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome.component';
import { BooksComponent } from './books.component';
import {FormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    BooksComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    RouterModule.forRoot([
      {
      path: 'welcome',
      component: WelcomeComponent
    },
    {
      path: 'books',
      component: BooksComponent
    },
    {
      path: '**',
      redirectTo: 'welcome'
    }
  ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
