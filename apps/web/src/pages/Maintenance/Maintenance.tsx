import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useVehicleStore } from '@/store/vehicleStore';
import type { MaintenanceLog, MaintenanceStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

const initialForm = {
  vehicle_id: '',
  type: '',
  description: '',
  cost: '',
};

export default function Maintenance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [closeTarget, setCloseTarget] = useState<MaintenanceLog | null>(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');

  const { logs, createLog, closeLog } = useMaintenanceStore();
  const vehicles = useVehicleStore((s) => s.vehicles);

  const statusFilter: MaintenanceStatus | undefined =
    activeTab === 'open' ? 'OPEN' :
    activeTab === 'closed' ? 'CLOSED' :
    undefined;

  const filtered = useMaintenanceStore.getState().getFilteredLogs({
    status: statusFilter,
    search: searchQuery,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.vehicle_id || !form.type || !form.cost) {
      setFormError('Please fill vehicle, service type, and cost.');
      return;
    }

    const result = await createLog({
      vehicle_id: form.vehicle_id,
      type: form.type,
      description: form.description || undefined,
      cost: Number(form.cost),
    });

    if ('error' in result) {
      setFormError(result.error);
      return;
    }

    setForm(initialForm);
    setShowForm(false);
  };

  const handleClose = async () => {
    if (!closeTarget) return;
    const result = await closeLog(closeTarget.id);
    if ('error' in result) { setFormError(result.error); }
    setCloseTarget(null);
  };

  // Vehicle options — exclude retired
  const vehicleOptions = vehicles
    .filter(v => v.status !== 'RETIRED')
    .map(v => ({ value: v.id, label: `${v.registration_number} — ${v.name_model}` }));

  const columns = [
    { key: 'vehicle', header: 'Vehicle', render: (l: MaintenanceLog) => {
      const v = useVehicleStore.getState().getVehicle(l.vehicle_id);
      return <span className="font-mono font-semibold text-white">{v?.registration_number ?? 'N/A'}</span>;
    }},
    { key: 'type', header: 'Service', render: (l: MaintenanceLog) => (
      <span className="text-white">{l.type}</span>
    )},
    { key: 'cost', header: 'Cost', render: (l: MaintenanceLog) => formatCurrency(l.cost) },
    { key: 'opened_at', header: 'Opened', render: (l: MaintenanceLog) => formatDate(l.opened_at) },
    { key: 'closed_at', header: 'Closed', render: (l: MaintenanceLog) => l.closed_at ? formatDate(l.closed_at) : '—' },
    { key: 'status', header: 'Status', render: (l: MaintenanceLog) => <StatusBadge status={l.status} /> },
    { key: 'actions', header: '', render: (l: MaintenanceLog) => (
      l.status === 'OPEN' ? (
        <Button size="sm" variant="outline" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setCloseTarget(l); }} icon={<CheckCircle className="w-3 h-3" />}>
          Close
        </Button>
      ) : null
    )},
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Maintenance</h2>
          <p className="text-sm text-muted mt-1">Track vehicle maintenance schedules and service records.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => { setForm(initialForm); setFormError(''); setShowForm(true); }}>
          Log Service Record
        </Button>
      </div>

      {/* Status flow diagram */}
      <Card className="p-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald font-medium">Available</span>
            <ArrowRight className="w-3 h-3 text-muted" />
            <span className="text-xs text-muted italic">Creating maintenance record...</span>
            <ArrowRight className="w-3 h-3 text-muted" />
            <span className="text-amber font-medium">In Shop</span>
          </div>
          <span className="text-muted">|</span>
          <div className="flex items-center gap-2">
            <span className="text-amber font-medium">In Shop</span>
            <ArrowRight className="w-3 h-3 text-muted" />
            <span className="text-xs text-muted italic">Closing record...</span>
            <ArrowRight className="w-3 h-3 text-muted" />
            <span className="text-emerald font-medium">Available</span>
          </div>
        </div>
        <p className="text-2xs text-muted mt-2">Note: In Shop vehicles are removed from the dispatch pool.</p>
      </Card>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Search maintenance records..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({logs.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({logs.filter(l => l.status === 'OPEN').length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({logs.filter(l => l.status === 'CLOSED').length})</TabsTrigger>
        </TabsList>

        {['all', 'open', 'closed'].map(tab => (
          <TabsContent key={tab} value={tab}>
            {filtered.length === 0 ? (
              <Card className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                  icon={Wrench}
                  title="No Maintenance Records"
                  description="Log maintenance activities to keep your fleet in top condition."
                  actionLabel="Create First Record"
                  onAction={() => { setForm(initialForm); setFormError(''); setShowForm(true); }}
                />
              </Card>
            ) : (
              <Table columns={columns} data={filtered} keyExtractor={(l) => l.id} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Create Maintenance Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Service Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <Select
              label="Vehicle *"
              value={form.vehicle_id}
              onChange={(val) => setForm(f => ({ ...f, vehicle_id: val }))}
              placeholder="Select vehicle..."
              options={vehicleOptions}
            />
            <Input
              label="Service Type *"
              value={form.type}
              onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
              placeholder="e.g. Oil Change, Engine Repair, Tyre Replace"
            />
            <Input
              label="Cost (₹) *"
              type="number"
              value={form.cost}
              onChange={(e) => setForm(f => ({ ...f, cost: e.target.value }))}
              placeholder="2500"
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional notes..."
            />
            {formError && <p className="text-crimson text-sm">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation */}
      <ConfirmDialog
        open={!!closeTarget}
        onOpenChange={(open) => !open && setCloseTarget(null)}
        title="Close Maintenance Record"
        description={`Close the "${closeTarget?.type}" maintenance record? The vehicle will be restored to Available status.`}
        confirmLabel="Close Record"
        variant="info"
        onConfirm={handleClose}
      />
    </motion.div>
  );
}
