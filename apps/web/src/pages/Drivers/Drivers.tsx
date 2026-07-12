import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Edit, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useDriverStore } from '@/store/driverStore';
import { useAuthStore } from '@/store/authStore';
import type { Driver, DriverStatus } from '@/types';
import { isLicenseExpired, isLicenseExpiringSoon } from '@/types';

const initialForm = {
  name: '',
  license_number: '',
  license_category: '',
  license_expiry_date: '',
  contact_number: '',
  safety_score: '100',
};

export default function Drivers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<Driver | null>(null);
  const [reinstateTarget, setReinstateTarget] = useState<Driver | null>(null);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');

  const { drivers, addDriver, updateDriver, suspendDriver, reinstateDriver } = useDriverStore();
  const userRole = useAuthStore((s) => s.user?.role);

  const statusFilter: DriverStatus | undefined =
    activeTab === 'available' ? 'AVAILABLE' :
    activeTab === 'on-trip' ? 'ON_TRIP' :
    activeTab === 'off-duty' ? 'OFF_DUTY' :
    activeTab === 'suspended' ? 'SUSPENDED' :
    undefined;

  const filtered = useDriverStore.getState().getFilteredDrivers({
    status: statusFilter,
    search: searchQuery,
  });

  const openAdd = () => {
    setEditingDriver(null);
    setForm(initialForm);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (d: Driver) => {
    setEditingDriver(d);
    setForm({
      name: d.name,
      license_number: d.license_number,
      license_category: d.license_category,
      license_expiry_date: d.license_expiry_date,
      contact_number: d.contact_number,
      safety_score: String(d.safety_score),
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.license_number || !form.license_category || !form.license_expiry_date || !form.contact_number) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const data = {
      name: form.name,
      license_number: form.license_number,
      license_category: form.license_category,
      license_expiry_date: form.license_expiry_date,
      contact_number: form.contact_number,
      safety_score: Number(form.safety_score) || 100,
    };

    if (editingDriver) {
      const result = await updateDriver(editingDriver.id, data);
      if ('error' in result) { setFormError(result.error); return; }
    } else {
      const result = await addDriver(data);
      if ('error' in result) { setFormError(result.error); return; }
    }

    setShowForm(false);
    setForm(initialForm);
  };

  const handleSuspend = async () => {
    if (!suspendTarget) return;
    const result = await suspendDriver(suspendTarget.id);
    if ('error' in result) { setFormError(result.error); }
    setSuspendTarget(null);
  };

  const handleReinstate = async () => {
    if (!reinstateTarget) return;
    const result = await reinstateDriver(reinstateTarget.id);
    if ('error' in result) { setFormError(result.error); }
    setReinstateTarget(null);
  };

  const LicenseBadge = ({ driver }: { driver: Driver }) => {
    if (isLicenseExpired(driver.license_expiry_date)) {
      return <Badge variant="danger"><AlertTriangle className="w-3 h-3 mr-1" />Expired</Badge>;
    }
    if (isLicenseExpiringSoon(driver.license_expiry_date)) {
      return <Badge variant="warning"><AlertTriangle className="w-3 h-3 mr-1" />Expiring Soon</Badge>;
    }
    return null;
  };

  const SafetyIndicator = ({ score }: { score: number }) => {
    const color = score >= 80 ? 'bg-emerald' : score >= 60 ? 'bg-amber' : 'bg-crimson';
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
        </div>
        <span className="text-2xs text-muted font-mono">{score}</span>
      </div>
    );
  };

  const columns = [
    { key: 'name', header: 'Name', render: (d: Driver) => <span className="font-semibold text-white">{d.name}</span> },
    { key: 'license_number', header: 'License #', render: (d: Driver) => (
      <div className="flex items-center gap-2">
        <span className="font-mono text-white/70">{d.license_number}</span>
        <LicenseBadge driver={d} />
      </div>
    )},
    { key: 'license_category', header: 'Category' },
    { key: 'license_expiry_date', header: 'License Expiry', render: (d: Driver) => (
      <span className={isLicenseExpired(d.license_expiry_date) ? 'text-crimson' : 'text-white/70'}>
        {d.license_expiry_date}
      </span>
    )},
    { key: 'contact_number', header: 'Contact' },
    { key: 'safety_score', header: 'Safety', render: (d: Driver) => <SafetyIndicator score={d.safety_score} /> },
    { key: 'status', header: 'Status', render: (d: Driver) => <StatusBadge status={d.status} /> },
    { key: 'actions', header: '', render: (d: Driver) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); openEdit(d); }} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors">
          <Edit className="w-3.5 h-3.5" />
        </button>
        {(userRole === 'SAFETY_OFFICER' || userRole === 'FLEET_MANAGER') && d.status === 'AVAILABLE' && (
          <button onClick={(e) => { e.stopPropagation(); setSuspendTarget(d); }} className="p-1.5 rounded-lg hover:bg-crimson/10 text-muted hover:text-crimson transition-colors">
            <ShieldAlert className="w-3.5 h-3.5" />
          </button>
        )}
        {(userRole === 'SAFETY_OFFICER' || userRole === 'FLEET_MANAGER') && (d.status === 'SUSPENDED' || d.status === 'OFF_DUTY') && (
          <button onClick={(e) => { e.stopPropagation(); setReinstateTarget(d); }} className="p-1.5 rounded-lg hover:bg-emerald/10 text-muted hover:text-emerald transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Drivers</h2>
          <p className="text-sm text-muted mt-1">Manage driver profiles, safety scores, and availability. <span className="text-white/50">{drivers.length} total</span></p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>
          Add Driver
        </Button>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Search drivers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({drivers.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({drivers.filter(d => d.status === 'AVAILABLE').length})</TabsTrigger>
          <TabsTrigger value="on-trip">On Trip ({drivers.filter(d => d.status === 'ON_TRIP').length})</TabsTrigger>
          <TabsTrigger value="off-duty">Off Duty ({drivers.filter(d => d.status === 'OFF_DUTY').length})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({drivers.filter(d => d.status === 'SUSPENDED').length})</TabsTrigger>
        </TabsList>

        {['all', 'available', 'on-trip', 'off-duty', 'suspended'].map(tab => (
          <TabsContent key={tab} value={tab}>
            {filtered.length === 0 ? (
              <Card className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                  icon={Users}
                  title={tab === 'all' ? 'No Drivers Added' : `No ${tab.replace('-', ' ')} Drivers`}
                  description={tab === 'all' ? 'Register your drivers to start tracking.' : `No drivers with this status.`}
                  actionLabel={tab === 'all' ? 'Add Your First Driver' : undefined}
                  onAction={tab === 'all' ? openAdd : undefined}
                />
              </Card>
            ) : (
              <Table columns={columns} data={filtered} keyExtractor={(d) => d.id} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              label="Full Name *"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Alex M."
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="License Number *"
                value={form.license_number}
                onChange={(e) => setForm(f => ({ ...f, license_number: e.target.value }))}
                placeholder="e.g. DL-12345"
              />
              <Input
                label="License Category *"
                value={form.license_category}
                onChange={(e) => setForm(f => ({ ...f, license_category: e.target.value }))}
                placeholder="e.g. HMV"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="License Expiry Date *"
                type="date"
                value={form.license_expiry_date}
                onChange={(e) => setForm(f => ({ ...f, license_expiry_date: e.target.value }))}
              />
              <Input
                label="Contact Number *"
                value={form.contact_number}
                onChange={(e) => setForm(f => ({ ...f, contact_number: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
            {(userRole === 'SAFETY_OFFICER' || userRole === 'FLEET_MANAGER') && (
              <Input
                label="Safety Score (0-100)"
                type="number"
                value={form.safety_score}
                onChange={(e) => setForm(f => ({ ...f, safety_score: e.target.value }))}
                placeholder="100"
              />
            )}
            {formError && <p className="text-crimson text-sm">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">{editingDriver ? 'Save Changes' : 'Add Driver'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Suspend/Reinstate Confirmations */}
      <ConfirmDialog
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title="Suspend Driver"
        description={`Are you sure you want to suspend "${suspendTarget?.name}"? They will be removed from the dispatch pool.`}
        confirmLabel="Suspend Driver"
        variant="danger"
        onConfirm={handleSuspend}
      />
      <ConfirmDialog
        open={!!reinstateTarget}
        onOpenChange={(open) => !open && setReinstateTarget(null)}
        title="Reinstate Driver"
        description={`Reinstate "${reinstateTarget?.name}" to active duty?`}
        confirmLabel="Reinstate"
        variant="info"
        onConfirm={handleReinstate}
      />
    </motion.div>
  );
}
