import { apiClient } from './apiClient';
import type { Expense, FuelLog } from '@/types';

export const financeService = {
  async getExpenses(): Promise<Expense[]> {
    return apiClient.get<Expense[]>('/finance/expenses');
  },

  async getFuelLogs(): Promise<FuelLog[]> {
    return apiClient.get<FuelLog[]>('/finance/fuel-logs');
  },

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    return apiClient.post<Expense>('/finance/expenses', expense);
  },

  async createFuelLog(record: Partial<FuelLog>): Promise<FuelLog> {
    return apiClient.post<FuelLog>('/finance/fuel-logs', record);
  },
};
