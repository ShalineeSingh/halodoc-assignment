export interface TaskObj {
  id: number | string,
  message: string,
  due_date?: Date,
  priority?: number,
  assigned_to?: number | boolean,
  assigned_name?: string | boolean,
  created_on?: Date
}