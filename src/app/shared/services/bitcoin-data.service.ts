import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitcoinDataService {

  urlHistoricalData: string = "https://mempool.space/api/v1/historical-price";
  urlCurrentPrice: string = "https://mempool.space/api/v1/prices";

  constructor(private http: HttpClient) { }

  getHistoricalData() {
    return this.http.get(this.urlHistoricalData).pipe(
      retry(3),
      catchError(error => {
        console.error('An error has occurred', error);
        return of([])
      })
    );
  }

  
  getCurrentBitcoinPrice() {
    return this.http.get(this.urlCurrentPrice).pipe(
      retry(3),
      catchError(error => {
        console.error('An error has occurred', error);
        return of([])
      })
    )
  }


  
}
