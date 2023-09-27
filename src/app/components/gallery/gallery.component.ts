import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Book } from 'src/app/models/book';
import { DataServicesService } from 'src/app/services/data-services.service';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  books:Book[] = [];
  length = this.dataServ.pageInfo.count;
  pageSize = 32;
  pageIndex = 0;
  hidePageSize = true;
  showFirstLastButtons = true;
  pageEvent: PageEvent = new PageEvent;
  query: string = '';
  searchResults: Book[]=[];
  error='';
  loading = false;
  constructor(private dataServ:DataServicesService){ }
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(){
    console.log('init!');
    this.loading=true;
    this.dataServ.getBooks(this.dataServ.BASE_URL).subscribe({
      next: data=>{
                    this.books=data;
                    this.loading=false},
      error: err => console.log(err),
    })
  }
  handlePageEvent(e: PageEvent) {
    console.log(this.dataServ.pageInfo);
    this.pageEvent = e;
    console.log('e');

    console.log(e);

    if(e.previousPageIndex==null || e.pageIndex===e.previousPageIndex+1)
      {
      this.loading=true;
      this.dataServ.getBooks(this.dataServ.pageInfo.next).subscribe({
          next: data=>  {
                        this.books=data;
                        console.log(this.dataServ.pageInfo.next);

                        console.log(this.books);
                        this.loading=false;

                        },
          error: err => console.log(err),
        })
      }
     else if(e.pageIndex===e.previousPageIndex-1)
      {
    this.loading=true;
    this.dataServ.getBooks(this.dataServ.pageInfo.previous).subscribe({
          next: data=>  {

                        this.books=data;
                        this.loading=false;

                        },
          error: err => console.log(err),
        })
       }
      else if(e.pageIndex===Math.floor(this.length/this.pageSize))
       {
        this.loading=true;
          this.dataServ.getBooks(this.dataServ.BASE_URL+'?page='+Math.floor(this.length/this.pageSize+1)+'&search='+this.query).subscribe({
           next: data=>{ this.books=data;
            this.loading=false;},
           error: err => console.log(err),
         })
       }
      else if(e.pageIndex===0)
       {
        this.loading=true;
          this.dataServ.getBooks(this.dataServ.BASE_URL+'?page=1'+'&search='+this.query).subscribe({
           next: data=> {this.books=data;
            this.loading=false;},
           error: err => console.log(err),
         })
       }
  }

  onSearch(): void {
    this.loading=true;
    this.dataServ.searchBooks(this.query).subscribe({
      next: (data) => {
        this.paginator.firstPage()
        this.dataServ.pageInfo={
          "count": data.count,
          "next": data.next,
          "previous": data.previous
        };
        this.books = data.results;
        console.log("searching", this.books);
        this.length=data.count;
        this.loading=false;

      },
      error: (error) => {
        this.books=[];
        this.length=0;
        this.error=error.error.error;
        console.error('Error during search:', error);
      }
    });
  }

  resetSearch(){
    this.loading=true;
    this.query='';
    this.paginator.firstPage();
    this.dataServ.getBooks(this.dataServ.BASE_URL).subscribe({
      next: data=> {
                    this.books=data;
                    this.loading=false;
                  },
      error: err => console.log(err),
    })
    this.length=this.dataServ.pageInfo.count;

  }

  scrollToTop() {
    // Scorri verso l'alto quando il pulsante viene cliccato
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Utilizza 'smooth' per un effetto di scorrimento fluido
  }




}
