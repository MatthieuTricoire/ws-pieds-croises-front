import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../chore/services/auth.service';
import { MessagesContainerComponent } from '../../shared/components/messages-container/messages-container.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-test',
  imports: [MessagesContainerComponent, JsonPipe],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent implements OnInit {
  #authService = inject(AuthService);

  // Utiliser computed() pour créer des signaux dérivés qui se mettent à jour automatiquement
  isAdmin = computed(() => this.#authService.isAdminSignal());
  user = computed(() => this.#authService.userSignal());

  logOut() {
    this.#authService.logout().subscribe();
  }

  ngOnInit(): void {
    this.#authService.loadCurrentUser();
  }
}
