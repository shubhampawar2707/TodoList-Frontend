import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnChanges {
  @Input() task: Task | null = null;
  @Input() isEdit = false;
  @Output() formSubmit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['Not Started', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Normal', Validators.required],
      comments: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      if (this.task) {
        this.taskForm.patchValue(this.task);
      } else {
        this.taskForm.reset({
          assignedTo: '',
          status: 'Not Started',
          dueDate: '',
          priority: 'Normal',
          comments: ''
        });
      }
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      if (this.isEdit && this.task) {
        this.taskService.updateTask({ ...this.task, ...formValue }).subscribe(() => {
          this.formSubmit.emit();
        });
      } else {
        this.taskService.addTask(formValue).subscribe(() => {
          this.formSubmit.emit();
        });
      }
    }
  }
} 