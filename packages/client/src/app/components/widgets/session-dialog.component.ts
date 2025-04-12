import { Component, inject, model } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Session } from '../../models/api/session';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export enum SessionDialogModeEnum {
  Add = 'add',
  Edit = 'edit',
}

@Component({
  standalone: true,
  template: `
    <h2 mat-dialog-title>{{ titles[mode()] }}</h2>
    <mat-dialog-content>
      <form [formGroup]="formGroup" class="flex flex-col mt-4!">
        <mat-form-field appearance="outline">
          <mat-label>Session Name</mat-label>
          <input matInput placeholder="Session Name" formControlName="sessionName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Session type</mat-label>
          <mat-select required formControlName="sessionType">
            <mat-option value="display_opening">Display Opening</mat-option>
            <mat-option value="deck">Deck Building</mat-option>
            <mat-option value="random">Random</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Back</button>
      <button mat-button mat-dialog-close [matDialogClose]="formGroup.value">{{ cta[mode()] }}</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
})
export class SessionDialogComponent {
  readonly data = inject(MAT_DIALOG_DATA);
  mode = model<SessionDialogModeEnum>(this.data.mode);
  session = model<Session>(this.data.session);

  formGroup = new FormGroup({
    sessionName: new FormControl<string>(this.session()?.name ?? ''),
    sessionType: new FormControl<string>(this.session()?.type ?? ''),
  })

  protected readonly titles: Record<SessionDialogModeEnum, string> = {
    [SessionDialogModeEnum.Add]: 'Add Session',
    [SessionDialogModeEnum.Edit]: 'Edit Session',
  }

  protected readonly cta: Record<SessionDialogModeEnum, string> = {
    [SessionDialogModeEnum.Add]: 'Create',
    [SessionDialogModeEnum.Edit]: 'Save',
  }
}
