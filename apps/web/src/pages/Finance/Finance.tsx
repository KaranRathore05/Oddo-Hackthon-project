import { motion } from 'framer-motion';
import { DollarSign, Plus, Fuel, Receipt, TrendingDown, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { KPICard } from '@/components/ui/KPICard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  },
};

export default function Finance() {
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
          <h2 className="text-2xl font-bold text-white">Finance</h2>
          <p className="text-sm text-muted mt-1">Track expenses, fuel costs, and financial performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={<Fuel className="w-4 h-4" />}>
            Log Fuel
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            Add Expense
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Expenses"
          value={0}
          prefix="$"
          icon={DollarSign}
          color="crimson"
        />
        <KPICard
          title="Fuel Costs"
          value={0}
          prefix="$"
          icon={Fuel}
          color="amber"
        />
        <KPICard
          title="Savings"
          value={0}
          prefix="$"
          icon={PiggyBank}
          color="emerald"
        />
        <KPICard
          title="Cost Reduction"
          value={0}
          suffix="%"
          icon={TrendingDown}
          color="cyan"
        />
      </motion.div>

      {/* Tabs: Expenses / Fuel Logs */}
      <motion.div variants={stagger.item}>
        <Tabs defaultValue="expenses">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="fuel">Fuel Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses">
            <Card className="min-h-[350px] flex items-center justify-center">
              <EmptyState
                icon={Receipt}
                title="No Expenses Recorded"
                description="Track all fleet-related expenses including maintenance, insurance, tolls, and miscellaneous costs."
                actionLabel="Record First Expense"
                onAction={() => {}}
              />
            </Card>
          </TabsContent>

          <TabsContent value="fuel">
            <Card className="min-h-[350px] flex items-center justify-center">
              <EmptyState
                icon={Fuel}
                title="No Fuel Records"
                description="Log fuel purchases to monitor consumption patterns and optimize fuel efficiency."
                actionLabel="Log First Fuel Purchase"
                onAction={() => {}}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
