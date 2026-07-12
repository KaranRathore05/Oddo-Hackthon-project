import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Filter, Search, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

export default function Drivers() {
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
          <h2 className="text-2xl font-bold text-white">Drivers</h2>
          <p className="text-sm text-muted mt-1">Manage driver profiles, safety scores, and availability.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Add Driver
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search drivers..."
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
          <TabsTrigger value="all">All Drivers</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="on-trip">On Trip</TabsTrigger>
          <TabsTrigger value="off-duty">Off Duty</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState
              icon={Users}
              title="No Drivers Added"
              description="Register your drivers to track their performance, safety scores, and trip assignments in real-time."
              actionLabel="Add Your First Driver"
              onAction={() => {}}
            />
          </Card>
        </TabsContent>

        <TabsContent value="available">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={UserCheck} title="No Available Drivers" description="Drivers currently available for assignment will appear here." variant="compact" />
          </Card>
        </TabsContent>

        <TabsContent value="on-trip">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Users} title="No Drivers On Trip" description="Drivers currently on active trips will appear here." variant="compact" />
          </Card>
        </TabsContent>

        <TabsContent value="off-duty">
          <Card className="min-h-[400px] flex items-center justify-center">
            <EmptyState icon={Users} title="No Off-Duty Drivers" description="Off-duty and suspended drivers will appear here." variant="compact" />
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
