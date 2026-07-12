import { motion } from 'framer-motion';
import { Truck, Users, MapPin, TrendingUp, Activity, Wrench, Gauge, Clock } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { useVehicleStore } from '@/store/vehicleStore';
import { useDriverStore } from '@/store/driverStore';
import { useTripStore } from '@/store/tripStore';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { useFinanceStore } from '@/store/financeStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  },
};

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const vehicles = useVehicleStore((s) => s.vehicles);
  const drivers = useDriverStore((s) => s.drivers);
  const trips = useTripStore((s) => s.trips);
  const maintenanceLogs = useMaintenanceStore((s) => s.logs);
  const totalOpCost = useFinanceStore((s) => s.getTotalOperationalCost());

  // KPI calculations
  const nonRetired = vehicles.filter(v => v.status !== 'RETIRED');
  const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const onTripVehicles = vehicles.filter(v => v.status === 'ON_TRIP').length;
  const inShopVehicles = vehicles.filter(v => v.status === 'IN_SHOP').length;
  const activeTrips = trips.filter(t => t.status === 'DISPATCHED').length;
  const pendingTrips = trips.filter(t => t.status === 'DRAFT').length;
  const driversOnDuty = drivers.filter(d => d.status === 'ON_TRIP').length;
  const fleetUtilization = nonRetired.length > 0
    ? Math.round((onTripVehicles / nonRetired.length) * 100)
    : 0;

  // Recent activity — last 5 trips + maintenance logs combined
  const recentTrips = trips.slice(0, 5);
  const recentMaintenance = maintenanceLogs.slice(0, 3);

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Page header */}
      <motion.div variants={stagger.item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] ?? 'Admin'}
          </h2>
          <p className="text-sm text-muted mt-1">Here's what's happening with your fleet today.</p>
        </div>
        <Badge variant="active" pulse>System Online</Badge>
      </motion.div>

      {/* KPI Cards — Bento row */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Vehicles"
          value={onTripVehicles}
          icon={Truck}
          color="cyan"
          trend={{ value: availableVehicles, direction: 'up' }}
        />
        <KPICard
          title="Available Vehicles"
          value={availableVehicles}
          icon={Truck}
          color="emerald"
        />
        <KPICard
          title="Active Trips"
          value={activeTrips}
          icon={MapPin}
          color="amber"
          trend={{ value: pendingTrips, direction: 'up' }}
        />
        <KPICard
          title="Fleet Utilization"
          value={fleetUtilization}
          suffix="%"
          icon={Gauge}
          color="crimson"
        />
      </motion.div>

      {/* Second row: more KPIs */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="In Maintenance"
          value={inShopVehicles}
          icon={Wrench}
          color="amber"
        />
        <KPICard
          title="Pending Trips"
          value={pendingTrips}
          icon={Clock}
          color="cyan"
        />
        <KPICard
          title="Drivers On Duty"
          value={driversOnDuty}
          icon={Users}
          color="emerald"
        />
        <KPICard
          title="Operational Cost"
          value={totalOpCost}
          prefix="₹"
          icon={TrendingUp}
          color="crimson"
        />
      </motion.div>

      {/* Bottom: Recent Activity + Quick Stats */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Trips */}
        <Card className="lg:col-span-2 min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
            <Badge variant="info">{trips.length} total</Badge>
          </CardHeader>
          <CardContent className="flex-1">
            {recentTrips.length === 0 ? (
              <EmptyState 
                title="No Trips Available" 
                description="No recent trips found. Create your first trip from the Trips page." 
                icon={MapPin} 
                variant="compact" 
              />
            ) : (
              <div className="space-y-3">
                {recentTrips.map(trip => {
                  const vehicle = useVehicleStore.getState().getVehicle(trip.vehicle_id);
                  const driver = useDriverStore.getState().getDriver(trip.driver_id);
                  return (
                    <div key={trip.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {trip.source} → {trip.destination}
                        </p>
                        <p className="text-2xs text-muted mt-0.5">
                          {vehicle?.registration_number ?? 'N/A'} · {driver?.name ?? 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-2xs text-muted">{formatDate(trip.created_at)}</span>
                        <StatusBadge status={trip.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Activity */}
        <Card className="min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
            <Activity className="w-4 h-4 text-muted" />
          </CardHeader>
          <CardContent className="flex-1">
            {recentMaintenance.length === 0 ? (
              <EmptyState 
                title="No Data Available" 
                description="No maintenance records found." 
                icon={Wrench} 
                variant="compact" 
              />
            ) : (
              <div className="space-y-3">
                {recentMaintenance.map(log => {
                  const vehicle = useVehicleStore.getState().getVehicle(log.vehicle_id);
                  return (
                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{log.type}</p>
                        <p className="text-2xs text-muted">{vehicle?.registration_number ?? 'N/A'} · {formatCurrency(log.cost)}</p>
                      </div>
                      <StatusBadge status={log.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
