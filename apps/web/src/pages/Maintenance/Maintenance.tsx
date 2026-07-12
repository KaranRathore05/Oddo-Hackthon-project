import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, Filter, Search, AlertTriangle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export default function Maintenance() {
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
          <h2 className="text-2xl font-bold text-white">Maintenance</h2>
          <p className="text-sm text-muted mt-1">Track vehicle maintenance schedules and service records.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Add Record
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search maintenance records..."
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
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState
              icon={Wrench}
              title="No Maintenance Records"
              description="Log maintenance activities to keep your fleet in top condition. Track scheduled services, emergency repairs, and inspection records."
              actionLabel="Create First Record"
              onAction={() => {}}
            />
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Calendar} title="No Pending Maintenance" description="Upcoming scheduled maintenance tasks will appear here." variant="compact" />
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Wrench} title="No Active Maintenance" description="Vehicles currently being serviced will appear here." variant="compact" />
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Wrench} title="No Completed Records" description="Past maintenance history will appear here." variant="compact" />
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
