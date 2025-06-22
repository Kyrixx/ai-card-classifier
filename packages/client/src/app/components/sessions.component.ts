import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Session } from '../models/api/session';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SessionDialogComponent, SessionDialogModeEnum } from './widgets/session-dialog.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-sessions',
  template: `
    <table mat-table [dataSource]="sessions()" class="mat-elevation-z8">

      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef> Id</th>
        <td mat-cell *matCellDef="let element" (click)="goToSession(element)"> {{ element.id }}</td>
      </ng-container>

      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef> Type</th>
        <td mat-cell *matCellDef="let element" (click)="goToSession(element)"> {{ element.type }}</td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Nom</th>
        <td mat-cell *matCellDef="let element" (click)="goToSession(element)"> {{ element.name }}</td>
      </ng-container>

      <ng-container matColumnDef="card_count">
        <th mat-header-cell *matHeaderCellDef> Nb Cartes</th>
        <td mat-cell *matCellDef="let element" (click)="goToSession(element)"> {{ element.card_count }}</td>
      </ng-container>

      <ng-container matColumnDef="booster_count">
        <th mat-header-cell *matHeaderCellDef> Nb Boosters</th>
        <td mat-cell *matCellDef="let element" (click)="goToSession(element)"> {{ element.booster_count }}</td>
      </ng-container>

      <ng-container matColumnDef="edit">
        <th mat-header-cell *matHeaderCellDef>Edit</th>
        <td mat-cell *matCellDef="let element" (click)="openDialog(element)"><mat-icon>edit</mat-icon></td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        class="hover:bg-blue-100! cursor-pointer"
        mat-row
        *matRowDef="let row; columns: displayedColumns;"
      ></tr>
    </table>

    <button mat-flat-button (click)="openDialog()">New Session</button>
  `,
  imports: [
    MatTableModule,
    MatButton,
    MatIcon,
  ],
})
export class SessionsComponent implements OnInit {
  protected router = inject(Router);
  protected apiWebservice = inject(ApiService);
  readonly dialog = inject(MatDialog);
  protected readonly displayedColumns: string[] = ['id', 'name', 'type', 'card_count', 'booster_count', 'edit'];

  sessions = signal<Session[]>([]);

  constructor(private readonly apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getSessions().subscribe((sessions) => {
      this.sessions.set(sessions);
      console.log('sessions', this.sessions());
    });
  }

  async goToSession(session: Session) {
    await this.router.navigate(['/session', session.id]);
  }

  openDialog(session?: Session) {
    console.log(session)
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      data: {
        mode: !!session ? SessionDialogModeEnum.Edit : SessionDialogModeEnum.Add,
        session
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        if (session) {
          this.apiWebservice.updateSession({ sessionId: session.id, name: result.sessionName, type: result.sessionType }).subscribe(() => {
            this.sessions.update((sessions) => sessions.map((s) => s.id === session.id ? { ...s, name: result.sessionName, type: result.sessionType } : s));
          });
        } else {
          this.apiWebservice.createSession({ name: result.sessionName, type: result.sessionType }).subscribe((session) => {
            this.sessions.update((sessions) => [...sessions, session]);
            this.goToSession(session);
          });
        }
      }
    });
  }
}
