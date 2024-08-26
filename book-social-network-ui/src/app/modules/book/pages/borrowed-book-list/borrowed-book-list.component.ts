import { Component, OnInit } from '@angular/core';
import {
  BorrowedBookResponse,
  FeedbackRequest,
  PageResponseBorrowedBookResponse,
} from 'src/app/services/models';
import { BookService, FeedbacksService } from 'src/app/services/services';

@Component({
  selector: 'app-borrowed-book-list',
  templateUrl: './borrowed-book-list.component.html',
  styleUrls: ['./borrowed-book-list.component.scss'],
})
export class BorrowedBookListComponent implements OnInit {
  borrowedBooks: PageResponseBorrowedBookResponse = {};
  selectedBook: BorrowedBookResponse | undefined = undefined;
  feedbackRequest: FeedbackRequest = {
    bookId: 0,
    comment: '',
    note: 0,
  };
  page = 0;
  size = 5;

  constructor(
    private bookService: BookService,
    private feedbackService: FeedbacksService
  ) {}

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }

  goToPage(page: number) {
    this.page = page;
    this.findAllBorrowedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }

  goToLastPage() {
    this.page = (this.borrowedBooks.totalPages as number) - 1;
    this.findAllBorrowedBooks();
  }

  get isLastPage(): boolean {
    return this.page == (this.borrowedBooks.totalPages as number) - 1;
  }

  private findAllBorrowedBooks() {
    this.bookService
      .findAllBorrowedBooks({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response) => {
          this.borrowedBooks = response;
        },
      });
  }

  returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.feedbackRequest.bookId = book.id as number;
  }

  returnBook(withFeedback: boolean) {
    this.bookService
      .returnBorrowBook({
        'book-id': this.selectedBook?.id as number,
      })
      .subscribe({
        next: () => {
          if (withFeedback) {
            this.giveFeedback();
          }

          this.selectedBook = undefined;
          this.findAllBorrowedBooks();
        },
      });
  }

  private giveFeedback() {
    this.feedbackService
      .saveFeedback({
        body: this.feedbackRequest,
      })
      .subscribe({
        next: () => {},
      });
  }
}
