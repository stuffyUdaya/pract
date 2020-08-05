import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IBooks } from './IBooks';
import { BookService } from './book.service';

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['books.component.css']
})
export class BooksComponent implements OnInit {
    books: IBooks[];
    @Output() bookClicked: EventEmitter<string> =
    new EventEmitter<string>();
    @Input() message: string;
    constructor(private bookService: BookService) {

    }
    ngOnInit() {
        console.log('message from parent', this.message);
        this.books = this.bookService.getBooks();
        }
        onClick(e: string): void {
            console.log('you clicked a book', e);
            this.bookClicked.emit(e);
        }
}

