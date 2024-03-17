import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData, getDocs } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bitbalance';
  firestore = inject(Firestore);
  item$: Observable<any> = new Observable()


  ngOnInit() {
    const itemCollection = collection(this.firestore, 'test');
    this.item$ = collectionData(itemCollection);
    this.item$.subscribe(value => console.log(value))
  }
}
