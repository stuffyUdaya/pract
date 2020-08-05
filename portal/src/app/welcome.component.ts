import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']

})


export class WelcomeComponent {
    name1 = 'text';
clicked(name: string): void {
    console.log('in clicked', name);
    this.name1 = name;
}
}

