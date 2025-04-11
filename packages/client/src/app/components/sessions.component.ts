import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Session } from '../models/api/session';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-sessions',
  template: `
    <table mat-table [dataSource]="sessions()" class="mat-elevation-z8">

      <ng-container matColumnDef="sessionId">
        <th mat-header-cell *matHeaderCellDef> Id</th>
        <td mat-cell *matCellDef="let element"> {{ element.sessionId }}</td>
      </ng-container>

      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef> Type</th>
        <td mat-cell *matCellDef="let element"> {{ element.type }}</td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Nom</th>
        <td mat-cell *matCellDef="let element"> {{ element.name }}</td>
      </ng-container>

      <ng-container matColumnDef="card_count">
        <th mat-header-cell *matHeaderCellDef> Nb Cartes</th>
        <td mat-cell *matCellDef="let element"> {{ element.card_count }}</td>
      </ng-container>

      <ng-container matColumnDef="booster_count">
        <th mat-header-cell *matHeaderCellDef> Nb Boosters</th>
        <td mat-cell *matCellDef="let element"> {{ element.booster_count }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        class="hover:bg-blue-100! cursor-pointer"
        mat-row
        *matRowDef="let row; columns: displayedColumns;"
        (click)="goToSession(row)"
      ></tr>
    </table>

    <button mat-flat-button (click)="addSession()">Add Session</button>
  `,
  imports: [
    MatTableModule,
    MatButton,
  ],
})
export class SessionsComponent implements OnInit {
  protected router = inject(Router);
  protected apiWebservice = inject(ApiService)
  protected readonly displayedColumns: string[] = ['sessionId', 'name', 'type', 'card_count', 'booster_count'];
  sessions = signal<Session[]>([]);

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getSessions().subscribe((sessions) => {
      this.sessions.set(sessions);
    });
  }

  async goToSession(session: Session) {
    await this.router.navigate(['/session', session.sessionId]);
  }

  async addSession() {
    const newSessionId = (await lastValueFrom(this.apiWebservice.createSession({ type: 'display_opening' }))).sessionId
    await this.router.navigate(['/session', newSessionId]);
  }
}
