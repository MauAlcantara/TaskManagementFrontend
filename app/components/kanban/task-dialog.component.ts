import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateTaskRequest } from '../../models/task.model';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>Crear nueva tarea</h2>
    <mat-dialog-content>
      <form [formGroup]="taskForm" class="dialog-form">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" placeholder="Ej. Terminar el nivel 1">
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
            El título es obligatorio.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Detalles de la tarea..."></textarea>
          <mat-error *ngIf="taskForm.get('description')?.hasError('required')">
            La descripción es obligatoria.
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close [disabled]="isSubmitting">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="taskForm.invalid || isSubmitting">
        {{ isSubmitting ? 'Guardando...' : 'Agregar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form { display: flex; flex-direction: column; gap: 15px; margin-top: 10px; min-width: 300px; }
    .full-width { width: 100%; }
  `]
})
export class TaskDialogComponent {
  taskForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>
  ) {
    // Define el formulario con validaciones 
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.isSubmitting = true; // Bloquea el botón para evitar dobles clicks
      
      const request: CreateTaskRequest = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description
      };
      
      // Cierr el diálogo y manda los datos de regreso al componente padre
      this.dialogRef.close(request);
    }
  }
}