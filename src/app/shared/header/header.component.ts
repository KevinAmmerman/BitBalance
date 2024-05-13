import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../services/modal.service';
import { UserProfileComponent } from '../../user/user-profile/user-profile.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  authSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService, 
    private router: Router,
    private modalService: ModalService
  ) {}

  open() {
    this.modalService.openModal(UserProfileComponent);
  }

  logout() {
    this.authSub = this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('sign-in'),
      error: (err: Error) => console.log(err.message) 
    })
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
