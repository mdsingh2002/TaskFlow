/**
 * Task service for CRUD operations.
 */

import api from "./api";
import { Task, TaskCreate, TaskUpdate, TaskFilters, TaskStatus } from "../types/task";

const taskService = {
  /**
   * Get all tasks with optional filters
   */
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const response = await api.get<Task[]>(`/tasks?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single task by ID
   */
  async getTask(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  async createTask(task: TaskCreate): Promise<Task> {
    const response = await api.post<Task>("/tasks", task);
    return response.data;
  },

  /**
   * Update an existing task
   */
  async updateTask(id: number, task: TaskUpdate): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  /**
   * Delete a task
   */
  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  /**
   * Update task status only
   */
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },
};

export default taskService;
