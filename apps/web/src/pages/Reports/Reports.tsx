import { motion } from 'framer-motion';
import { Download, Fuel, Gauge, DollarSign, TrendingUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { KPICard } from '@/components/ui/KPICard';
import { useVehicleStore } from '@/store/vehicleStore';
import { useTripStore } from '@/store/tripStore';
import { useFinanceStore } from '@/store/financeStore';
import { useMaintenanceStore } from '@/store/maintenanceStore';
import { formatCurrency } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
  },
};

const CHART_COLORS = ['#FF3366', '#FFB800', '#00D4FF', '#00C896', '#8B5CF6', '#EC4899', '#F59E0B'];

export default function Reports() {
  const vehicles = useVehicleStore((s) => s.vehicles);
  const trips = useTripStore((s) => s.trips);
  const totalFuelCost = useFinanceStore((s) => s.getTotalFuelCost());
  const fuelLogs = useFinanceStore((s) => s.fuelLogs);
  const totalMaintenanceCost = useMaintenanceStore((s) => s.getTotalMaintenanceCost());

  const nonRetired = vehicles.filter(v => v.status !== 'RETIRED');
  const onTripVehicles = vehicles.filter(v => v.status === 'ON_TRIP').length;

  // Fuel Efficiency = Total Distance / Total Fuel
  const completedTrips = trips.filter(t => t.status === 'COMPLETED');
  const totalDistance = completedTrips.reduce((sum, t) => sum + (t.actual_distance_km ?? 0), 0);
  const totalFuel = completedTrips.reduce((sum, t) => sum + (t.fuel_consumed_liters ?? 0), 0);
  const fuelEfficiency = totalFuel > 0 ? (totalDistance / totalFuel).toFixed(1) : '0.0';

  // Fleet Utilization
  const fleetUtilization = nonRetired.length > 0 ? Math.round((onTripVehicles / nonRetired.length) * 100) : 0;

  // Operational Cost
  const totalOperationalCost = totalFuelCost + totalMaintenanceCost;

  // Vehicle ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost
  const totalRevenue = trips.reduce((sum, t) => sum + (t.revenue ?? 0), 0);
  const totalAcquisitionCost = vehicles.reduce((sum, v) => sum + v.acquisition_cost, 0);
  const vehicleROI = totalAcquisitionCost > 0
    ? (((totalRevenue - totalOperationalCost) / totalAcquisitionCost) * 100).toFixed(1)
    : '0.0';

  // Monthly revenue data for bar chart
  const monthlyData: { month: string; revenue: number }[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 12; i++) {
    const monthTrips = completedTrips.filter(t => {
      const d = new Date(t.completed_at ?? t.created_at);
      return d.getMonth() === i;
    });
    monthlyData.push({
      month: months[i],
      revenue: monthTrips.reduce((sum, t) => sum + (t.revenue ?? 0), 0),
    });
  }

  // Top costliest vehicles
  const vehicleCosts = vehicles.map(v => {
    const vFuel = fuelLogs.filter(f => f.vehicle_id === v.id).reduce((s, f) => s + f.cost, 0);
    const vMaint = useMaintenanceStore.getState().getLogsByVehicle(v.id).reduce((s, l) => s + l.cost, 0);
    return { name: v.registration_number, cost: vFuel + vMaint };
  }).sort((a, b) => b.cost - a.cost).slice(0, 5);

  // CSV Export
  const exportCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Fuel Efficiency (km/l)', fuelEfficiency],
      ['Fleet Utilization (%)', String(fleetUtilization)],
      ['Total Operational Cost', String(totalOperationalCost)],
      ['Vehicle ROI (%)', vehicleROI],
      ['Total Distance (km)', String(totalDistance)],
      ['Total Fuel (liters)', String(totalFuel)],
      ['Total Revenue', String(totalRevenue)],
      ['Total Fuel Cost', String(totalFuelCost)],
      ['Total Maintenance Cost', String(totalMaintenanceCost)],
      ['', ''],
      ['Top Costliest Vehicles', ''],
      ...vehicleCosts.map(v => [v.name, String(v.cost)]),
      ['', ''],
      ['Monthly Revenue', ''],
      ...monthlyData.map(m => [m.month, String(m.revenue)]),
    ];

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transitops-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('TransitOps Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    // KPI Summary Table
    autoTable(doc, {
      startY: 40,
      head: [['KPI Summary', 'Value']],
      body: [
        ['Fuel Efficiency (km/l)', fuelEfficiency],
        ['Fleet Utilization (%)', `${fleetUtilization}%`],
        ['Total Operational Cost', formatCurrency(totalOperationalCost)],
        ['Vehicle ROI (%)', `${vehicleROI}%`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Top Costliest Vehicles
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Top Costliest Vehicles', 'Cost']],
      body: vehicleCosts.map(v => [v.name, formatCurrency(v.cost)]),
      theme: 'grid',
      headStyles: { fillColor: [192, 57, 43] },
    });

    doc.save(`transitops-report-${new Date().toISOString().slice(0, 10)}.pdf`);
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
          <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-sm text-muted mt-1">ROI = (Revenue − (Maintenance + Fuel)) / Acquisition Cost</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<FileText className="w-4 h-4" />} onClick={exportPDF}>
            Export PDF
          </Button>
          <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* 4 KPI Summary Cards */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Fuel Efficiency" value={Number(fuelEfficiency)} suffix=" km/l" icon={Fuel} color="cyan" />
        <KPICard title="Fleet Utilization" value={fleetUtilization} suffix="%" icon={Gauge} color="emerald" />
        <KPICard title="Operational Cost" value={totalOperationalCost} prefix="₹" icon={DollarSign} color="amber" />
        <KPICard title="Vehicle ROI" value={Number(vehicleROI)} suffix="%" icon={TrendingUp} color="crimson" />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {totalRevenue === 0 ? (
              <EmptyState 
                title="No Data Available" 
                description="No revenue data. Add revenue to trips to see this chart." 
                icon={DollarSign} 
                variant="compact" 
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <RTooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: '#12121A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} activeBar={false}>
                    {monthlyData.map((_, idx) => (
                      <Cell key={idx} fill="#6B9BD2" opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Costliest Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle>Top Costliest Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {vehicleCosts.length === 0 || vehicleCosts.every(v => v.cost === 0) ? (
              <EmptyState 
                title="No Data Available" 
                description="No cost data available yet." 
                icon={TrendingUp} 
                variant="compact" 
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleCosts} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#fff', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                  <RTooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ background: '#12121A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 12 }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => [formatCurrency(value), 'Cost']}
                  />
                  <Bar dataKey="cost" radius={[0, 6, 6, 0]} activeBar={false}>
                    {vehicleCosts.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} opacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
