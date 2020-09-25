export interface Task {
  id?: number | string,
  message: string,
  due_date?: Date,
  priority?: number,
  assigned_to?: number | boolean
}