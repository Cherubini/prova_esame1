import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PageInfo } from '../models/pageInfo';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class DataServicesService {
  readonly BASE_URL = 'https://gutendex.com/books/';
  pageInfo: PageInfo={
    "count": 71635,
    "next": "",
    "previous": null
  };
  constructor(private http:HttpClient) { }


  getBooks(url:string): Observable<any>{
    console.log('getFirst32Books');
    return this.http.get<any[]>(url)
    .pipe(
      map((data: any) =>{
          this.pageInfo = {
            "count" : data.count,
            "next" : data.next,
            "previous" : data.previous
          };
          return data.results as Book[]})
    )
  }

  searchBooks(query: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}?search=${query}`);
  }

}
