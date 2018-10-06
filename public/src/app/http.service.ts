import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient){
    this.getAuthors()
  }

  getAuthors() {
    let observable = this._http.get('/authors');
    observable.subscribe(console.log)
  }
  
}
