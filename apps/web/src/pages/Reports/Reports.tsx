import { motion } from 'framer-motion';
import { BarChart3, Download, Fuel, DollarSign, Users, Truck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  },
};

export default function Reports() {
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
          <h2 className="text-2xl font-bold text-white">Reports</h2>
          <p className="text-sm text-muted mt-1">Generate and analyze comprehensive fleet reports.</p>
        </div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />} disabled>
          Export Report
        </Button>
      </motion.div>

      {/* Report type tabs */}
      <motion.div variants={stagger.item}>
        <Tabs defaultValue="fuel">
          <TabsList>
            <TabsTrigger value="fuel">Fuel Efficiency</TabsTrigger>
            <TabsTrigger value="costs">Operational Costs</TabsTrigger>
            <TabsTrigger value="drivers">Driver Performance</TabsTrigger>
            <TabsTrigger value="fleet">Fleet Utilization</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="fuel">
            <Card className="min-h-[450px] flex items-center justify-center">
              <EmptyState
                icon={Fuel}
                title="Fuel Efficiency Report"
                description="Track fuel consumption trends, cost per kilometer, and identify optimization opportunities. Data will populate once trips and fuel records are logged."
                actionLabel="Generate Report"
                onAction={() => {}}
              />
            </Card>
          </TabsContent>

          <TabsContent value="costs">
            <Card className="min-h-[450px] flex items-center justify-center">
              <EmptyState
                icon={DollarSign}
                title="Operational Costs Report"
                description="Breakdown of all operational expenses including fuel, maintenance, insurance, and labor costs."
              />
            </Card>
          </TabsContent>

          <TabsContent value="drivers">
            <Card className="min-h-[450px] flex items-center justify-center">
              <EmptyState
                icon={Users}
                title="Driver Performance Report"
                description="Compare driver safety scores, trip efficiency, and on-time delivery rates across your team."
              />
            </Card>
          </TabsContent>

          <TabsContent value="fleet">
            <Card className="min-h-[450px] flex items-center justify-center">
              <EmptyState
                icon={Truck}
                title="Fleet Utilization Report"
                description="Analyze vehicle usage rates, idle time, and optimize asset allocation across your fleet."
              />
            </Card>
          </TabsContent>

          <TabsContent value="roi">
            <Card className="min-h-[450px] flex items-center justify-center">
              <EmptyState
                icon={TrendingUp}
                title="ROI Analysis"
                description="Measure return on investment across all fleet operations and identify high-impact improvement areas."
              />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
