import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedTask: Task | null = null;
  showForm = false;
  isEdit = false;
  showDeleteConfirm = false;
  searchTerm = '';
  page = 1;
  pageSize = 20;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  refresh() {
    this.loadTasks();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter(task =>
      task.assignedTo.toLowerCase().includes(term) ||
      task.status.toLowerCase().includes(term) ||
      task.priority.toLowerCase().includes(term) ||
      (task.comments && task.comments.toLowerCase().includes(term))
    );
    this.page = 1;
  }

  onPageSizeChange() {
    this.page = 1;
  }

  get pagedTasks() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredTasks.slice(start, end);
  }

  get totalRecords() {
    return this.filteredTasks.length;
  }

  get totalPages() {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  onAddTask() {
    this.selectedTask = null;
    this.isEdit = false;
    this.showForm = true;
  }

  onEditTask(task: Task) {
    this.selectedTask = { ...task };
    this.isEdit = true;
    this.showForm = true;
  }

  onDeleteTask(task: Task) {
    this.selectedTask = task;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (this.selectedTask) {
      this.taskService.deleteTask(this.selectedTask.id).subscribe(() => {
        this.loadTasks();
        this.showDeleteConfirm = false;
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  onFormSubmit() {
    this.showForm = false;
    this.loadTasks();
  }
} 