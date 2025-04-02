import { Component, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Session } from '../models/api/session';
import { ApiService } from '../services/api.service';

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

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,

  imports: [
    MatTableModule,
  ],
})
export class SessionsComponent implements OnInit {
  protected readonly displayedColumns: string[] = ['sessionId', 'type'];
  sessions = signal<Session[]>([]);

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getSessions().subscribe((sessions) => {
      this.sessions.set(sessions);
    });
  }
}
