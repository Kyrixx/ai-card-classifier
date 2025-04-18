import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  standalone: true,
  template: `
    <h2 mat-dialog-title>Display Opening Configuration</h2>
    <mat-dialog-content>
      <form [formGroup]="formGroup" class="flex flex-col mt-4!">
        <mat-form-field appearance="outline" floatLabel="always">
          <mat-label>Price per booster</mat-label>
          <input
            matInput
            placeholder="Price per booster"
            type="number"
            formControlName="pricePerBooster"
          />
          <div matTextSuffix>€</div>
        </mat-form-field>
        <mat-form-field appearance="outline" floatLabel="always">
          <mat-label>Card per booster</mat-label>
          <input
            matInput
            placeholder="Card per booster"
            type="number"
            formControlName="cardsPerBooster"
          />
        </mat-form-field>
        <div class="flex flex-row items-center">
          <mat-checkbox formControlName="tts" class="mb-4 text-lg">Text to Speech</mat-checkbox>
          <mat-checkbox formControlName="autoChangeBooster" class="mb-4 text-lg">Change booster when full</mat-checkbox>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Language</mat-label>
          <mat-select
            type="text"
            formControlName="language"
          >
            <mat-option value="en">English</mat-option>
            <mat-option value="fr">Français</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Set</mat-label>
          <mat-select
            type="text"
            formControlName="set"
          >
            <mat-option value="tdm">TDM</mat-option>
            <mat-option value="dft">DFT</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Back</button>
      <button mat-button mat-dialog-close [matDialogClose]="formGroup.value">Save</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatLabel,
    MatSuffix,
  ],
  styles: `
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      display: none;
    }
  `,
})
export class DisplayOpeningConfigDialogComponent {
  readonly data = inject(MAT_DIALOG_DATA);

  formGroup = new FormGroup({
    pricePerBooster: new FormControl<number>(this.data.pricePerBooster),
    cardsPerBooster: new FormControl<number>(this.data.cardsPerBooster),
    tts: new FormControl<boolean>(this.data.tts ?? false),
    autoChangeBooster: new FormControl<boolean>(this.data.autoChangeBooster ?? false),
    language: new FormControl<string>(this.data.language),
    set: new FormControl<string>(this.data.set),
  })
}
