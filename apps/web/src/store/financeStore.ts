import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FuelLog, Expense, ExpenseCategory } from '@/types';
import { generateId, nowISO } from '@/types';

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
  addFuelLog: (data: CreateFuelLogInput) => FuelLog;
  addExpense: (data: CreateExpenseInput) => Expense;
  getFuelLogsByVehicle: (vehicleId: string) => FuelLog[];
  getExpensesByVehicle: (vehicleId: string) => Expense[];
  getTotalFuelCost: (vehicleId?: string) => number;
  getTotalExpenses: (vehicleId?: string) => number;
  getTotalOperationalCost: (vehicleId?: string) => number;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      fuelLogs: [],
      expenses: [],

      addFuelLog: (data) => {
        const log: FuelLog = {
          id: generateId(),
          vehicle_id: data.vehicle_id,
          trip_id: data.trip_id,
          liters: data.liters,
          cost: data.cost,
          date: data.date,
          created_at: nowISO(),
        };
        set((s) => ({ fuelLogs: [...s.fuelLogs, log] }));
        return log;
      },

      addExpense: (data) => {
        const expense: Expense = {
          id: generateId(),
          vehicle_id: data.vehicle_id,
          trip_id: data.trip_id,
          category: data.category,
          amount: data.amount,
          date: data.date,
          notes: data.notes,
          created_at: nowISO(),
        };
        set((s) => ({ expenses: [...s.expenses, expense] }));
        return expense;
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
    }),
    { name: 'transitops-finance' }
  )
);
