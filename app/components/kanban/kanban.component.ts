import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskDto, CreateTaskRequest } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from './task-dialog.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule, 
    DragDropModule, 
    MatCardModule, 
    MatIconModule,
    MatButtonModule, 
    MatDialogModule, 
    MatSnackBarModule 
  ],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
  todo: TaskDto[] = [];
  done: TaskDto[] = [];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.todo = tasks.filter(t => !t.isCompleted);
        this.done = tasks.filter(t => t.isCompleted);
      },
      error: (err) => this.showNotification('Error al cargar las tareas', 'error')
    });
  }

  // --- FUNCIÓN PARA ABRIR EL DIÁLOGO ---
  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      disableClose: true // Evita que se cierre haciendo clic afuera si se quiere forzar decisión
    });

    dialogRef.afterClosed().subscribe((result: CreateTaskRequest) => {
      // Si el usuario cancela, result es undefined
      if (result) {
        this.createNewTask(result);
      }
    });
  }

  // --- FUNCIÓN PARA ENVIAR AL BACKEND ---
  private createNewTask(request: CreateTaskRequest) {
    this.taskService.createTask(request).subscribe({
      next: (newTask: TaskDto) => {
        this.todo.unshift(newTask);
        this.showNotification('¡Tarea creada exitosamente!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Error al crear la tarea. Intenta de nuevo.', 'error');
      }
    });
  }

  // --- FUNCIÓN HELPER PARA NOTIFICACIONES ---
  private showNotification(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      this.taskService.completeTask(task.id).subscribe({
        next: () => {
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
          this.showNotification('Tarea completada', 'success');
        },
        error: (err) => this.showNotification('No se pudo actualizar la tarea', 'error')
      });
    }
  }
}