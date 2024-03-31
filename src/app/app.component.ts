import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bitbalance';

  constructor(private auth: Auth, private authService: AuthService) {
    
  }


  async ngOnInit() {

  }

  ngOnDestroy() {
    console.log('main component')
  }
}
