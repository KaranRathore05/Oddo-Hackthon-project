import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState('');

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
          <h2 className="text-2xl font-bold text-white">Vehicles</h2>
          <p className="text-sm text-muted mt-1">Manage and track your fleet vehicles.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Add Vehicle
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="secondary" icon={<Filter className="w-4 h-4" />}>
          Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="maintenance">In Maintenance</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState
              icon={Truck}
              title="No Vehicles Registered"
              description="Add your first vehicle to start managing your fleet. Track location, fuel consumption, and maintenance schedules."
              actionLabel="Add Your First Vehicle"
              onAction={() => {}}
            />
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Truck} title="No Active Vehicles" description="Vehicles currently in operation will appear here." variant="compact" />
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Truck} title="No Vehicles in Maintenance" description="Vehicles undergoing maintenance will appear here." variant="compact" />
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Truck} title="No Inactive Vehicles" description="Inactive or retired vehicles will appear here." variant="compact" />
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
