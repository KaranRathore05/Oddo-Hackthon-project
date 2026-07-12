import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Filter, Search, Route } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export default function Trips() {
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
          <h2 className="text-2xl font-bold text-white">Trips</h2>
          <p className="text-sm text-muted mt-1">Plan, monitor, and review all transport trips.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Schedule Trip
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search trips..."
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
          <TabsTrigger value="all">All Trips</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState
              icon={MapPin}
              title="No Trips Scheduled"
              description="Create your first trip to start tracking routes, distances, and fuel consumption across your fleet."
              actionLabel="Schedule Your First Trip"
              onAction={() => {}}
            />
          </Card>
        </TabsContent>

        <TabsContent value="planned">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Route} title="No Planned Trips" description="Upcoming scheduled trips will appear here." variant="compact" />
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={MapPin} title="No Active Trips" description="Trips currently in progress will appear here with live tracking." variant="compact" />
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={MapPin} title="No Completed Trips" description="Trip history and analytics will appear here after trips are completed." variant="compact" />
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
