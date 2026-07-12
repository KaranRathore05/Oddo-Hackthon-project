import { create } from 'zustand';
import type { FuelLog, Expense, ExpenseCategory } from '@/types';
import { financeService } from '@/services/financeService';

interface CreateFuelLogInput {
  vehicle_id: string;
  trip_id?: string;
  liters: number;
  cost: number;
  date: string;
}

interface CreateExpenseInput {
  vehicle_id?: string;
  trip_id?: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string;
}

interface FinanceState {
  fuelLogs: FuelLog[];
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  fetchFinanceData: () => Promise<void>;
  addFuelLog: (data: CreateFuelLogInput) => Promise<FuelLog | { error: string }>;
  addExpense: (data: CreateExpenseInput) => Promise<Expense | { error: string }>;
  getFuelLogsByVehicle: (vehicleId: string) => FuelLog[];
  getExpensesByVehicle: (vehicleId: string) => Expense[];
  getTotalFuelCost: (vehicleId?: string) => number;
  getTotalExpenses: (vehicleId?: string) => number;
  getTotalOperationalCost: (vehicleId?: string) => number;
}

export const useFinanceStore = create<FinanceState>()(
  (set, get) => ({
    fuelLogs: [],
    expenses: [],
    isLoading: false,
    error: null,

    fetchFinanceData: async () => {
      set({ isLoading: true, error: null });
      try {
        const [fuelLogs, expenses] = await Promise.all([
          financeService.getFuelLogs(),
          financeService.getExpenses()
        ]);
        set({ fuelLogs, expenses, isLoading: false });
      } catch (err: any) {
        set({ error: err?.error?.message || 'Failed to fetch finance data', isLoading: false });
      }
    },

    addFuelLog: async (data) => {
      try {
        const result = await financeService.createFuelLog(data);
        set((s) => ({ fuelLogs: [...s.fuelLogs, result] }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to create fuel log' };
      }
    },

    addExpense: async (data) => {
      try {
        const result = await financeService.createExpense(data);
        set((s) => ({ expenses: [...s.expenses, result] }));
        return result;
      } catch (err: any) {
        return { error: err?.error?.message || 'Failed to create expense' };
      }
    },

    getFuelLogsByVehicle: (vehicleId) =>
      get().fuelLogs.filter(f => f.vehicle_id === vehicleId),

    getExpensesByVehicle: (vehicleId) =>
      get().expenses.filter(e => e.vehicle_id === vehicleId),

    getTotalFuelCost: (vehicleId) => {
      const logs = vehicleId
        ? get().fuelLogs.filter(f => f.vehicle_id === vehicleId)
        : get().fuelLogs;
      return logs.reduce((sum, f) => sum + f.cost, 0);
    },

    getTotalExpenses: (vehicleId) => {
      const exps = vehicleId
        ? get().expenses.filter(e => e.vehicle_id === vehicleId)
        : get().expenses;
      return exps.reduce((sum, e) => sum + e.amount, 0);
    },

    getTotalOperationalCost: (vehicleId) => {
      return get().getTotalFuelCost(vehicleId) + get().getTotalExpenses(vehicleId);
    },
  })
);

