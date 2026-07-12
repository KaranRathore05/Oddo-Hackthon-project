import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Search, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Stepper } from '@/components/ui/Stepper';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useTripStore } from '@/store/tripStore';
import { useVehicleStore } from '@/store/vehicleStore';
import { useDriverStore } from '@/store/driverStore';
import type { Trip } from '@/types';

const TRIP_STEPS = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Dispatched', value: 'DISPATCHED' },
  { label: 'Completed', value: 'COMPLETED' },
];

const initialForm = {
  source: '',
  destination: '',
  vehicle_id: '',
  driver_id: '',
  cargo_weight_kg: '',
  planned_distance_km: '',
  revenue: '',
};

export default function Trips() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Complete trip dialog
  const [completeTarget, setCompleteTarget] = useState<Trip | null>(null);
  const [completeForm, setCompleteForm] = useState({ actual_distance_km: '', fuel_consumed_liters: '' });

  // Action confirmations
  const [dispatchTarget, setDispatchTarget] = useState<Trip | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Trip | null>(null);

  const { trips, createTrip, dispatchTrip, completeTrip, cancelTrip } = useTripStore();
  const availableVehicles = useVehicleStore((s) => s.getAvailableVehicles());
  const availableDrivers = useDriverStore((s) => s.getAvailableDrivers());

  // Get selected vehicle for capacity display
  const selectedVehicle = useVehicleStore.getState().getVehicle(form.vehicle_id);
  const cargoWeight = Number(form.cargo_weight_kg) || 0;
  const capacityExceeded = selectedVehicle && cargoWeight > selectedVehicle.max_load_capacity_kg;

  const filtered = useTripStore.getState().getFilteredTrips({ search: searchQuery });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.source || !form.destination || !form.vehicle_id || !form.driver_id || !form.cargo_weight_kg || !form.planned_distance_km) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const result = createTrip({
      source: form.source,
      destination: form.destination,
      vehicle_id: form.vehicle_id,
      driver_id: form.driver_id,
      cargo_weight_kg: Number(form.cargo_weight_kg),
      planned_distance_km: Number(form.planned_distance_km),
      revenue: form.revenue ? Number(form.revenue) : undefined,
    });

    if ('error' in result) {
      setFormError(result.error);
      return;
    }

    setForm(initialForm);
    setShowCreate(false);
  };

  const handleDispatch = () => {
    if (!dispatchTarget) return;
    const result = dispatchTrip(dispatchTarget.id);
    if ('error' in result) { setFormError(result.error); }
    setDispatchTarget(null);
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeTarget) return;
    const result = completeTrip(completeTarget.id, {
      actual_distance_km: Number(completeForm.actual_distance_km),
      fuel_consumed_liters: Number(completeForm.fuel_consumed_liters),
    });
    if ('error' in result) { setFormError(result.error); return; }
    setCompleteTarget(null);
    setCompleteForm({ actual_distance_km: '', fuel_consumed_liters: '' });
  };

  const handleCancel = () => {
    if (!cancelTarget) return;
    const result = cancelTrip(cancelTarget.id);
    if ('error' in result) { setFormError(result.error); }
    setCancelTarget(null);
  };

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
          <h2 className="text-2xl font-bold text-white">Trip Dispatcher</h2>
          <p className="text-sm text-muted mt-1">Create, dispatch, and monitor transport trips.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
          Create Trip
        </Button>
      </div>

      {/* Trip Lifecycle Stepper */}
      <Card className="p-4">
        <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-4">Trip Lifecycle</p>
        <Stepper steps={TRIP_STEPS} currentStep="DRAFT" className="max-w-md" />
      </Card>

      {/* Split Layout: Search + Live Board */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Live Board */}
        <div>
          <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">Live Board</p>
          {filtered.length === 0 ? (
            <Card className="min-h-[300px] flex items-center justify-center">
              <EmptyState
                icon={MapPin}
                title="No Trips Yet"
                description="Create your first trip to start tracking routes and dispatching vehicles."
                actionLabel="Create Your First Trip"
                onAction={() => setShowCreate(true)}
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map(trip => {
                const vehicle = useVehicleStore.getState().getVehicle(trip.vehicle_id);
                const driver = useDriverStore.getState().getDriver(trip.driver_id);

                return (
                  <Card key={trip.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted">{trip.id.slice(0, 8).toUpperCase()}</span>
                          <span className="text-xs text-muted">·</span>
                          <span className="text-xs text-white/50">{vehicle?.registration_number ?? 'N/A'} / {driver?.name ?? 'N/A'}</span>
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {trip.source} → {trip.destination}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <StatusBadge status={trip.status} size="md" />
                          <span className="text-2xs text-muted">{trip.cargo_weight_kg} kg · {trip.planned_distance_km} km</span>
                          {trip.actual_distance_km && (
                            <span className="text-2xs text-emerald">Actual: {trip.actual_distance_km} km</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {trip.status === 'DRAFT' && (
                          <Button size="sm" onClick={() => setDispatchTarget(trip)} icon={<Play className="w-3 h-3" />}>
                            Dispatch
                          </Button>
                        )}
                        {trip.status === 'DISPATCHED' && (
                          <>
                            <Button size="sm" onClick={() => { setCompleteTarget(trip); setCompleteForm({ actual_distance_km: String(trip.planned_distance_km), fuel_consumed_liters: '' }); }} icon={<CheckCircle className="w-3 h-3" />}>
                              Complete
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => setCancelTarget(trip)} icon={<XCircle className="w-3 h-3" />}>
                              Cancel
                            </Button>
                          </>
                        )}
                        {trip.status === 'COMPLETED' && vehicle && (
                          <span className="text-2xs text-muted">Vehicle went: {trip.status}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Trip Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Trip</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <Input
              label="Source *"
              value={form.source}
              onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))}
              placeholder="e.g. Gandhinagar Depot"
            />
            <Input
              label="Destination *"
              value={form.destination}
              onChange={(e) => setForm(f => ({ ...f, destination: e.target.value }))}
              placeholder="e.g. Ahmedabad Hub"
            />
            <Select
              label="Vehicle (Available Only) *"
              value={form.vehicle_id}
              onChange={(val) => setForm(f => ({ ...f, vehicle_id: val }))}
              placeholder="Select vehicle..."
              options={availableVehicles.map(v => ({
                value: v.id,
                label: `${v.registration_number} — ${v.name_model} (${v.max_load_capacity_kg} kg capacity)`,
              }))}
            />
            <Select
              label="Driver (Available Only) *"
              value={form.driver_id}
              onChange={(val) => setForm(f => ({ ...f, driver_id: val }))}
              placeholder="Select driver..."
              options={availableDrivers.map(d => ({
                value: d.id,
                label: `${d.name} — ${d.license_category}`,
              }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Cargo Weight (kg) *"
                type="number"
                value={form.cargo_weight_kg}
                onChange={(e) => setForm(f => ({ ...f, cargo_weight_kg: e.target.value }))}
                placeholder="450"
                error={capacityExceeded ? undefined : undefined}
              />
              <Input
                label="Planned Distance (km) *"
                type="number"
                value={form.planned_distance_km}
                onChange={(e) => setForm(f => ({ ...f, planned_distance_km: e.target.value }))}
                placeholder="120"
              />
            </div>
            <Input
              label="Revenue (₹)"
              type="number"
              value={form.revenue}
              onChange={(e) => setForm(f => ({ ...f, revenue: e.target.value }))}
              placeholder="Optional — for ROI tracking"
            />

            {/* Capacity validation display */}
            {selectedVehicle && cargoWeight > 0 && (
              <div className={`p-3 rounded-xl border ${capacityExceeded ? 'border-crimson/40 bg-crimson/5' : 'border-emerald/30 bg-emerald/5'}`}>
                <p className="text-xs font-medium">
                  <span className="text-white">Vehicle Capacity:</span>{' '}
                  <span className="font-mono">{selectedVehicle.max_load_capacity_kg} kg</span>
                </p>
                <p className="text-xs">
                  <span className="text-white">Cargo Weight:</span>{' '}
                  <span className="font-mono">{cargoWeight} kg</span>
                </p>
                {capacityExceeded ? (
                  <p className="text-xs text-crimson mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    ✕ Capacity exceeded by {cargoWeight - selectedVehicle.max_load_capacity_kg} kg — dispatch blocked!
                  </p>
                ) : (
                  <p className="text-xs text-emerald mt-1">
                    ✓ Within capacity ({selectedVehicle.max_load_capacity_kg - cargoWeight} kg remaining)
                  </p>
                )}
              </div>
            )}

            {formError && <p className="text-crimson text-sm">{formError}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit">Create Trip (Draft)</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complete Trip Dialog */}
      <Dialog open={!!completeTarget} onOpenChange={(open) => !open && setCompleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Trip</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleComplete} className="space-y-4 mt-4">
            <p className="text-sm text-muted">
              Enter the actual distance traveled and fuel consumed to complete this trip.
            </p>
            <Input
              label="Actual Distance (km) *"
              type="number"
              value={completeForm.actual_distance_km}
              onChange={(e) => setCompleteForm(f => ({ ...f, actual_distance_km: e.target.value }))}
              placeholder="e.g. 115"
            />
            <Input
              label="Fuel Consumed (liters) *"
              type="number"
              value={completeForm.fuel_consumed_liters}
              onChange={(e) => setCompleteForm(f => ({ ...f, fuel_consumed_liters: e.target.value }))}
              placeholder="e.g. 45"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setCompleteTarget(null)}>Cancel</Button>
              <Button type="submit">Complete Trip</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dispatch Confirmation */}
      <ConfirmDialog
        open={!!dispatchTarget}
        onOpenChange={(open) => !open && setDispatchTarget(null)}
        title="Dispatch Trip"
        description={`Dispatch trip from "${dispatchTarget?.source}" to "${dispatchTarget?.destination}"? This will mark both the vehicle and driver as On Trip.`}
        confirmLabel="Dispatch"
        variant="info"
        onConfirm={handleDispatch}
      />

      {/* Cancel Confirmation */}
      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Cancel Trip"
        description={`Cancel the dispatched trip from "${cancelTarget?.source}" to "${cancelTarget?.destination}"? Vehicle and driver will be restored to Available.`}
        confirmLabel="Cancel Trip"
        variant="danger"
        onConfirm={handleCancel}
      />
    </motion.div>
  );
}
