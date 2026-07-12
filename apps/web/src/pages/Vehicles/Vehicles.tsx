import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, Search, Edit, Archive, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { useVehicleStore } from '@/store/vehicleStore';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle, VehicleType, VehicleStatus, VehicleDocument } from '@/types';
import { formatCurrency } from '@/lib/utils';

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: 'TRUCK', label: 'Truck' },
  { value: 'VAN', label: 'Van' },
  { value: 'BUS', label: 'Bus' },
  { value: 'CAR', label: 'Car' },
  { value: 'OTHER', label: 'Other' },
];

const initialForm = {
  registration_number: '',
  name_model: '',
  type: 'VAN' as VehicleType,
  max_load_capacity_kg: '',
  odometer_km: '',
  acquisition_cost: '',
  region: '',
};

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [retireTarget, setRetireTarget] = useState<Vehicle | null>(null);
  const [docsTarget, setDocsTarget] = useState<Vehicle | null>(null);
  const [documents, setDocuments] = useState<VehicleDocument[]>([]);
  const [docForm, setDocForm] = useState({ title: '', file: null as File | null });
  const [docLoading, setDocLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');

  const { vehicles, addVehicle, updateVehicle, retireVehicle } = useVehicleStore();

  const statusFilter: VehicleStatus | undefined =
    activeTab === 'active' ? 'AVAILABLE' :
    activeTab === 'on-trip' ? 'ON_TRIP' :
    activeTab === 'maintenance' ? 'IN_SHOP' :
    activeTab === 'retired' ? 'RETIRED' :
    undefined;

  const filtered = useVehicleStore.getState().getFilteredVehicles({
    status: statusFilter,
    search: searchQuery,
  });

  const openAdd = () => {
    setEditingVehicle(null);
    setForm(initialForm);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setForm({
      registration_number: v.registration_number,
      name_model: v.name_model,
      type: v.type,
      max_load_capacity_kg: String(v.max_load_capacity_kg),
      odometer_km: String(v.odometer_km),
      acquisition_cost: String(v.acquisition_cost),
      region: v.region ?? '',
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.registration_number || !form.name_model || !form.max_load_capacity_kg || !form.acquisition_cost) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const data = {
      registration_number: form.registration_number,
      name_model: form.name_model,
      type: form.type,
      max_load_capacity_kg: Number(form.max_load_capacity_kg),
      odometer_km: Number(form.odometer_km) || 0,
      acquisition_cost: Number(form.acquisition_cost),
      region: form.region || undefined,
    };

    if (editingVehicle) {
      const result = await updateVehicle(editingVehicle.id, data);
      if ('error' in result) { setFormError(result.error); return; }
    } else {
      const result = await addVehicle(data);
      if ('error' in result) { setFormError(result.error); return; }
    }

    setShowForm(false);
    setForm(initialForm);
  };

  const handleRetire = async () => {
    if (!retireTarget) return;
    const result = await retireVehicle(retireTarget.id);
    if ('error' in result) { setFormError(result.error); return; }
    setRetireTarget(null);
  };

  const openDocs = async (v: Vehicle) => {
    setDocsTarget(v);
    setDocForm({ title: '', file: null });
    setDocLoading(true);
    try {
      const docs = await vehicleService.getVehicleDocuments(v.id);
      setDocuments(docs);
    } catch (e) {
      console.error(e);
    } finally {
      setDocLoading(false);
    }
  };

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docsTarget || !docForm.title || !docForm.file) return;
    setDocLoading(true);
    try {
      const newDoc = await vehicleService.uploadVehicleDocument(docsTarget.id, docForm.file, docForm.title);
      setDocuments([newDoc, ...documents]);
      setDocForm({ title: '', file: null });
    } catch (err) {
      console.error('Failed to upload', err);
    } finally {
      setDocLoading(false);
    }
  };


  const columns = [
    { key: 'registration_number', header: 'Reg. Number', render: (v: Vehicle) => (
      <span className="font-mono font-semibold text-white">{v.registration_number}</span>
    )},
    { key: 'name_model', header: 'Model' },
    { key: 'type', header: 'Type', render: (v: Vehicle) => (
      <span className="capitalize text-white/70">{v.type.toLowerCase()}</span>
    )},
    { key: 'max_load_capacity_kg', header: 'Capacity', render: (v: Vehicle) => `${v.max_load_capacity_kg} kg` },
    { key: 'odometer_km', header: 'Odometer', render: (v: Vehicle) => `${v.odometer_km.toLocaleString()} km` },
    { key: 'acquisition_cost', header: 'Cost', render: (v: Vehicle) => formatCurrency(v.acquisition_cost) },
    { key: 'region', header: 'Region', render: (v: Vehicle) => v.region || '—' },
    { key: 'status', header: 'Status', render: (v: Vehicle) => <StatusBadge status={v.status} /> },
    { key: 'actions', header: '', render: (v: Vehicle) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); openDocs(v); }} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-cyan transition-colors" title="Documents">
          <FileText className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); openEdit(v); }} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors" title="Edit">
          <Edit className="w-3.5 h-3.5" />
        </button>
        {v.status !== 'RETIRED' && v.status !== 'ON_TRIP' && (
          <button onClick={(e) => { e.stopPropagation(); setRetireTarget(v); }} className="p-1.5 rounded-lg hover:bg-crimson/10 text-muted hover:text-crimson transition-colors" title="Retire">
            <Archive className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Fleet Registry</h2>
          <p className="text-sm text-muted mt-1">Manage and track your fleet vehicles. <span className="text-white/50">{vehicles.length} total</span></p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={openAdd}>
          Add Vehicle
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by registration, model, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({vehicles.length})</TabsTrigger>
          <TabsTrigger value="active">Available ({vehicles.filter(v => v.status === 'AVAILABLE').length})</TabsTrigger>
          <TabsTrigger value="on-trip">On Trip ({vehicles.filter(v => v.status === 'ON_TRIP').length})</TabsTrigger>
          <TabsTrigger value="maintenance">In Shop ({vehicles.filter(v => v.status === 'IN_SHOP').length})</TabsTrigger>
          <TabsTrigger value="retired">Retired ({vehicles.filter(v => v.status === 'RETIRED').length})</TabsTrigger>
        </TabsList>

        {['all', 'active', 'on-trip', 'maintenance', 'retired'].map(tab => (
          <TabsContent key={tab} value={tab}>
            {filtered.length === 0 ? (
              <Card className="min-h-[400px] flex items-center justify-center">
                <EmptyState
                  icon={Truck}
                  title={tab === 'all' ? 'No Vehicles Registered' : `No ${tab.replace('-', ' ')} Vehicles`}
                  description={tab === 'all' ? 'Add your first vehicle to start managing your fleet.' : `No vehicles with this status.`}
                  actionLabel={tab === 'all' ? 'Add Your First Vehicle' : undefined}
                  onAction={tab === 'all' ? openAdd : undefined}
                />
              </Card>
            ) : (
              <Table columns={columns} data={filtered} keyExtractor={(v) => v.id} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              label="Registration Number *"
              value={form.registration_number}
              onChange={(e) => setForm(f => ({ ...f, registration_number: e.target.value }))}
              placeholder="e.g. VAN-05"
            />
            <Input
              label="Vehicle Name / Model *"
              value={form.name_model}
              onChange={(e) => setForm(f => ({ ...f, name_model: e.target.value }))}
              placeholder="e.g. Tata Ace Gold"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Vehicle Type *"
                value={form.type}
                onChange={(val) => setForm(f => ({ ...f, type: val as VehicleType }))}
                options={VEHICLE_TYPES}
              />
              <Input
                label="Max Load Capacity (kg) *"
                type="number"
                value={form.max_load_capacity_kg}
                onChange={(e) => setForm(f => ({ ...f, max_load_capacity_kg: e.target.value }))}
                placeholder="500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Odometer (km)"
                type="number"
                value={form.odometer_km}
                onChange={(e) => setForm(f => ({ ...f, odometer_km: e.target.value }))}
                placeholder="0"
              />
              <Input
                label="Acquisition Cost (₹) *"
                type="number"
                value={form.acquisition_cost}
                onChange={(e) => setForm(f => ({ ...f, acquisition_cost: e.target.value }))}
                placeholder="500000"
              />
            </div>
            <Input
              label="Region"
              value={form.region}
              onChange={(e) => setForm(f => ({ ...f, region: e.target.value }))}
              placeholder="e.g. Gujarat"
            />
            {formError && <p className="text-crimson text-sm">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">{editingVehicle ? 'Save Changes' : 'Add Vehicle'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Retire Confirmation */}
      <ConfirmDialog
        open={!!retireTarget}
        onOpenChange={(open) => !open && setRetireTarget(null)}
        title="Retire Vehicle"
        description={`Are you sure you want to retire "${retireTarget?.registration_number}"? This vehicle will no longer be available for dispatch.`}
        confirmLabel="Retire Vehicle"
        variant="warning"
        onConfirm={handleRetire}
      />

      {/* Documents Dialog */}
      <Dialog open={!!docsTarget} onOpenChange={(open) => !open && setDocsTarget(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Documents for {docsTarget?.registration_number}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <form onSubmit={handleUploadDoc} className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
              <h4 className="text-sm font-medium text-white mb-2">Upload New Document</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input 
                    placeholder="Document Title (e.g. RC Book)" 
                    value={docForm.title}
                    onChange={e => setDocForm(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="file" 
                    onChange={e => setDocForm(f => ({ ...f, file: e.target.files?.[0] || null }))}
                    className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                    required
                  />
                </div>
                <Button type="submit" disabled={docLoading} icon={<Upload className="w-4 h-4" />}>
                  {docLoading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </form>

            <div>
              <h4 className="text-sm font-medium text-white mb-3">Uploaded Documents</h4>
              {docLoading && documents.length === 0 ? (
                <p className="text-sm text-muted">Loading documents...</p>
              ) : documents.length === 0 ? (
                <p className="text-sm text-muted text-center py-4 border border-dashed border-white/10 rounded-xl">No documents uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan" />
                        <div>
                          <p className="text-sm font-medium text-white">{doc.title}</p>
                          <p className="text-xs text-muted">Uploaded on {new Date(doc.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <a 
                        href={`http://localhost:4000${doc.file_url}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm text-cyan hover:underline"
                      >
                        View File
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
