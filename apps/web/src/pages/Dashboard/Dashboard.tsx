import { motion } from 'framer-motion';
import { Truck, Users, MapPin, DollarSign, TrendingUp, Activity, Clock, AlertTriangle } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  },
};

export default function Dashboard() {
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
          <h2 className="text-2xl font-bold text-white">Good morning, Admin</h2>
          <p className="text-sm text-muted mt-1">Here's what's happening with your fleet today.</p>
        </div>
        <Badge variant="active" pulse>System Online</Badge>
      </motion.div>

      {/* KPI Cards — Bento row */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Vehicles"
          value={0}
          icon={Truck}
          color="cyan"
          trend={{ value: 0, direction: 'up' }}
        />
        <KPICard
          title="Active Drivers"
          value={0}
          icon={Users}
          color="emerald"
          trend={{ value: 0, direction: 'up' }}
        />
        <KPICard
          title="Trips Today"
          value={0}
          icon={MapPin}
          color="amber"
          trend={{ value: 0, direction: 'up' }}
        />
        <KPICard
          title="Revenue"
          value={0}
          prefix="$"
          icon={DollarSign}
          color="crimson"
          trend={{ value: 0, direction: 'down' }}
        />
      </motion.div>

      {/* Bento grid: Fleet map + Activity feed + Quick stats */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Fleet Map Placeholder */}
        <Card className="lg:col-span-2 min-h-[360px] flex flex-col" glow="cyan">
          <CardHeader>
            <CardTitle>Fleet Map</CardTitle>
            <Badge variant="info">Live</Badge>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MapPin}
              title="Fleet Map Coming Soon"
              description="Real-time vehicle tracking will appear here once GPS data is connected."
              variant="compact"
            />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="min-h-[360px] flex flex-col" glow="emerald">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <Clock className="w-4 h-4 text-muted" />
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={Activity}
              title="No Recent Activity"
              description="Fleet events and alerts will appear here in real time."
              variant="compact"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom row: Quick stats */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card variant="interactive" glow="amber">
          <CardHeader>
            <CardTitle>Fuel Efficiency</CardTitle>
            <TrendingUp className="w-4 h-4 text-amber" />
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={TrendingUp}
              title="No Data Yet"
              description="Fuel efficiency metrics will appear once trips are logged."
              variant="compact"
            />
          </CardContent>
        </Card>

        <Card variant="interactive" glow="crimson">
          <CardHeader>
            <CardTitle>Maintenance Alerts</CardTitle>
            <AlertTriangle className="w-4 h-4 text-crimson" />
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={AlertTriangle}
              title="No Alerts"
              description="Maintenance alerts will show up when vehicles need attention."
              variant="compact"
            />
          </CardContent>
        </Card>

        <Card variant="interactive" glow="emerald">
          <CardHeader>
            <CardTitle>Driver Performance</CardTitle>
            <Users className="w-4 h-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Users}
              title="No Drivers"
              description="Driver performance scores will appear here."
              variant="compact"
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
