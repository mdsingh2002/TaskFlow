/**
 * useTasks hook for task management with local state.
 */

import { useState, useEffect, useCallback } from "react";
import taskService from "../services/taskService";
import { Task, TaskCreate, TaskUpdate, TaskFilters, TaskStatus } from "../types/task";

export function useTasks(initialFilters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters || {});

  /**
   * Fetch tasks from the API
   */
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks";
      setError(errorMessage);
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Create a new task
   */
  const createTask = async (taskData: TaskCreate): Promise<Task> => {
    setError(null);

    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create task";
      setError(errorMessage);
      console.error("Error creating task:", err);
      throw err;
    }
  };

  /**
   * Update an existing task
   */
  const updateTask = async (id: number, taskData: TaskUpdate): Promise<Task> => {
    setError(null);

    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task";
      setError(errorMessage);
      console.error("Error updating task:", err);
      throw err;
    }
  };

  /**
   * Delete a task
   */
  const deleteTask = async (id: number): Promise<void> => {
    setError(null);

    try {
      await taskService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  /**
   * Update task status
   */
  const updateTaskStatus = async (id: number, status: TaskStatus): Promise<Task> => {
    setError(null);

    try {
      const updatedTask = await taskService.updateTaskStatus(id, status);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task status";
      setError(errorMessage);
      console.error("Error updating task status:", err);
      throw err;
    }
  };

  /**
   * Update filters and refetch tasks
   */
  const updateFilters = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Fetch tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateFilters,
  };
}
