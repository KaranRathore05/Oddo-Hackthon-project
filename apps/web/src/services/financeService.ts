import { apiClient } from './apiClient';
import type { Expense, FuelLog } from '@/types';

export const financeService = {
  async getExpenses(): Promise<Expense[]> {
    return apiClient.get<Expense[]>('/fuel-expense/expenses');
  },

  async getFuelLogs(): Promise<FuelLog[]> {
    return apiClient.get<FuelLog[]>('/fuel-expense/fuel-logs');
  },

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    return apiClient.post<Expense>('/fuel-expense/expenses', expense);
  },

  async createFuelLog(record: Partial<FuelLog>): Promise<FuelLog> {
    return apiClient.post<FuelLog>('/fuel-expense/fuel-logs', record);
  },
};
