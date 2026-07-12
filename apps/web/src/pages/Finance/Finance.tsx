import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Plus, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { KPICard } from '@/components/ui/KPICard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useFinanceStore } from '@/store/financeStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useTripStore } from '@/store/tripStore';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import type { FuelLog, Expense, ExpenseCategory } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'TOLL', label: 'Toll' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OTHER', label: 'Other' },
];

export default function Finance() {
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [fuelForm, setFuelForm] = useState({ vehicle_id: '', trip_id: '', liters: '', cost: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ vehicle_id: '', trip_id: '', category: 'TOLL' as ExpenseCategory, amount: '', date: '', notes: '' });
  const [formError, setFormError] = useState('');

  const { fuelLogs, expenses, addFuelLog, addExpense, getTotalFuelCost, getTotalExpenses } = useFinanceStore();
  const vehicles = useVehicleStore((s) => s.vehicles);
  const trips = useTripStore((s) => s.trips);
  const totalMaintenanceCost = useMaintenanceStore((s) => s.getTotalMaintenanceCost());

  const totalFuel = getTotalFuelCost();
  const totalExp = getTotalExpenses();
  const totalOperational = totalFuel + totalMaintenanceCost + totalExp;

  const vehicleOptions = vehicles.map(v => ({ value: v.id, label: `${v.registration_number} — ${v.name_model}` }));
  const tripOptions = trips.map(t => ({ value: t.id, label: `${t.id.slice(0, 8).toUpperCase()} — ${t.source} → ${t.destination}` }));

  const handleAddFuel = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!fuelForm.vehicle_id || !fuelForm.liters || !fuelForm.cost || !fuelForm.date) {
      setFormError('Please fill all required fields.');
      return;
    }
    const result = await addFuelLog({
      vehicle_id: fuelForm.vehicle_id,
      trip_id: fuelForm.trip_id || undefined,
      liters: Number(fuelForm.liters),
      cost: Number(fuelForm.cost),
      date: fuelForm.date,
    });
    
    if ('error' in result) {
      setFormError(result.error);
      return;
    }

    setFuelForm({ vehicle_id: '', trip_id: '', liters: '', cost: '', date: '' });
    setShowFuelForm(false);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!expenseForm.amount || !expenseForm.date) {
      setFormError('Please fill amount and date.');
      return;
    }
    const result = await addExpense({
      vehicle_id: expenseForm.vehicle_id || undefined,
      trip_id: expenseForm.trip_id || undefined,
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      date: expenseForm.date,
      notes: expenseForm.notes || undefined,
    });
    
    if ('error' in result) {
      setFormError(result.error);
      return;
    }

    setExpenseForm({ vehicle_id: '', trip_id: '', category: 'TOLL', amount: '', date: '', notes: '' });
    setShowExpenseForm(false);
  };

  const fuelColumns = [
    { key: 'vehicle', header: 'Vehicle', render: (f: FuelLog) => {
      const v = useVehicleStore.getState().getVehicle(f.vehicle_id);
      return <span className="font-mono font-semibold text-white">{v?.registration_number ?? 'N/A'}</span>;
    }},
    { key: 'date', header: 'Date', render: (f: FuelLog) => formatDate(f.date) },
    { key: 'liters', header: 'Liters', render: (f: FuelLog) => `${f.liters} L` },
    { key: 'cost', header: 'Cost', render: (f: FuelLog) => formatCurrency(f.cost) },
  ];

  const expenseColumns = [
    { key: 'trip', header: 'Trip', render: (e: Expense) => {
      if (!e.trip_id) return '—';
      const t = useTripStore.getState().getTrip(e.trip_id);
      return t ? <span className="font-mono text-2xs">{t.id.slice(0, 8).toUpperCase()}</span> : '—';
    }},
    { key: 'vehicle', header: 'Vehicle', render: (e: Expense) => {
      if (!e.vehicle_id) return '—';
      const v = useVehicleStore.getState().getVehicle(e.vehicle_id);
      return v ? <span className="font-mono">{v.registration_number}</span> : '—';
    }},
    { key: 'category', header: 'Category', render: (e: Expense) => (
      <span className="capitalize text-white/70">{e.category.toLowerCase()}</span>
    )},
    { key: 'amount', header: 'Amount', render: (e: Expense) => formatCurrency(e.amount) },
    { key: 'date', header: 'Date', render: (e: Expense) => formatDate(e.date) },
    { key: 'notes', header: 'Notes', render: (e: Expense) => e.notes || '—' },
  ];

  const stagger = {
    container: { animate: { transition: { staggerChildren: 0.08 } } },
    item: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
    },
  };

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={stagger.item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Fuel & Expenses</h2>
          <p className="text-sm text-muted mt-1">Track expenses, fuel costs, and financial performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Fuel className="w-4 h-4" />} onClick={() => { setFormError(''); setShowFuelForm(true); }}>
            + Log Fuel
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => { setFormError(''); setShowExpenseForm(true); }}>
            + Add Expense
          </Button>
        </div>
      </motion.div>

      {/* Fuel Logs Section */}
      <motion.div variants={stagger.item}>
        <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">Fuel Logs</p>
        {fuelLogs.length === 0 ? (
          <Card className="min-h-[150px] flex items-center justify-center">
            <p className="text-muted text-sm">No fuel records yet. Click "+ Log Fuel" to add one.</p>
          </Card>
        ) : (
          <Table columns={fuelColumns} data={[...fuelLogs].reverse()} keyExtractor={(f) => f.id} />
        )}
      </motion.div>

      {/* Expenses Section */}
      <motion.div variants={stagger.item}>
        <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">Other Expenses (Toll / Misc)</p>
        {expenses.length === 0 ? (
          <Card className="min-h-[150px] flex items-center justify-center">
            <p className="text-muted text-sm">No expenses yet. Click "+ Add Expense" to add one.</p>
          </Card>
        ) : (
          <Table columns={expenseColumns} data={[...expenses].reverse()} keyExtractor={(e) => e.id} />
        )}
      </motion.div>

      {/* Total Operational Cost */}
      <motion.div variants={stagger.item}>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Total Operational Cost (Auto) = Fuel + Maint.</p>
              <p className="text-2xs text-muted mt-1">Fuel: {formatCurrency(totalFuel)} + Maintenance: {formatCurrency(totalMaintenanceCost)} + Other: {formatCurrency(totalExp)}</p>
            </div>
            <p className="text-2xl font-bold text-amber">{formatCurrency(totalOperational)}</p>
          </div>
        </Card>
      </motion.div>

      {/* Fuel Form Dialog */}
      <Dialog open={showFuelForm} onOpenChange={setShowFuelForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Log Fuel</DialogTitle></DialogHeader>
          <form onSubmit={handleAddFuel} className="space-y-4 mt-4">
            <Select label="Vehicle *" value={fuelForm.vehicle_id} onChange={(val) => setFuelForm(f => ({ ...f, vehicle_id: val }))} placeholder="Select vehicle..." options={vehicleOptions} />
            <Select label="Trip (Optional)" value={fuelForm.trip_id} onChange={(val) => setFuelForm(f => ({ ...f, trip_id: val }))} placeholder="Link to trip..." options={[{ value: '', label: 'None' }, ...tripOptions]} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Liters *" type="number" value={fuelForm.liters} onChange={(e) => setFuelForm(f => ({ ...f, liters: e.target.value }))} placeholder="42" />
              <Input label="Cost (₹) *" type="number" value={fuelForm.cost} onChange={(e) => setFuelForm(f => ({ ...f, cost: e.target.value }))} placeholder="3150" />
            </div>
            <Input label="Date *" type="date" value={fuelForm.date} onChange={(e) => setFuelForm(f => ({ ...f, date: e.target.value }))} />
            {formError && <p className="text-crimson text-sm">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowFuelForm(false)}>Cancel</Button>
              <Button type="submit">Log Fuel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Expense Form Dialog */}
      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4 mt-4">
            <Select label="Category *" value={expenseForm.category} onChange={(val) => setExpenseForm(f => ({ ...f, category: val as ExpenseCategory }))} options={EXPENSE_CATEGORIES} />
            <Select label="Vehicle (Optional)" value={expenseForm.vehicle_id} onChange={(val) => setExpenseForm(f => ({ ...f, vehicle_id: val }))} placeholder="Link to vehicle..." options={[{ value: '', label: 'None' }, ...vehicleOptions]} />
            <Select label="Trip (Optional)" value={expenseForm.trip_id} onChange={(val) => setExpenseForm(f => ({ ...f, trip_id: val }))} placeholder="Link to trip..." options={[{ value: '', label: 'None' }, ...tripOptions]} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Amount (₹) *" type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm(f => ({ ...f, amount: e.target.value }))} placeholder="120" />
              <Input label="Date *" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <Input label="Notes" value={expenseForm.notes} onChange={(e) => setExpenseForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional" />
            {formError && <p className="text-crimson text-sm">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowExpenseForm(false)}>Cancel</Button>
              <Button type="submit">Add Expense</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
