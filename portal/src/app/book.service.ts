
import { Injectable } from '@angular/core';
import { IBooks } from './IBooks';

@Injectable({
    providedIn: 'root'
})
export class BookService {
// private bookInformation = './books.json';
getBooks(): IBooks[] {
    return [
        {
            bookUrl: 'https://picsum.photos/200/200?random=1',
            bookName: 'Angular',
            bookRating: '4'
        },
        {
            bookUrl: 'https://picsum.photos/200/200?random=2',
            bookName: 'React',
            bookRating: '4'
        },
        {
            bookUrl: 'https://picsum.photos/200/200?random=3',
            bookName: 'Advanced Java',
            bookRating: '4'
        },
        {
            bookUrl: 'https://picsum.photos/200/200?random=4',
            bookName: 'Spring',
            bookRating: '4'
        },
        {
            bookUrl: 'https://picsum.photos/200/200?random=5',
            bookName: 'HTML',
            bookRating: '5'
        },
    ];
}
}
