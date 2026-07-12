import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RBAC_MATRIX, type UserRole, type Module, type Permission } from '@/types';

const ROLES: { key: UserRole; label: string }[] = [
  { key: 'FLEET_MANAGER', label: 'Fleet Manager' },
  { key: 'DRIVER', label: 'Dispatcher' },
  { key: 'SAFETY_OFFICER', label: 'Safety Officer' },
  { key: 'FINANCIAL_ANALYST', label: 'Financial Analyst' },
];

const MODULES: { key: Module; label: string }[] = [
  { key: 'fleet', label: 'Fleet' },
  { key: 'drivers', label: 'Drivers' },
  { key: 'trips', label: 'Trips' },
  { key: 'maintenance', label: 'Maint.' },
  { key: 'fuel_exp', label: 'Fuel/Exp.' },
  { key: 'analytics', label: 'Analytics' },
];

function PermCell({ perm }: { perm: Permission }) {
  if (perm === 'full') return <Check className="w-4 h-4 text-emerald mx-auto" />;
  if (perm === 'view') return <Eye className="w-3.5 h-3.5 text-amber mx-auto" />;
  return <X className="w-3.5 h-3.5 text-muted/40 mx-auto" />;
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  },
};

export default function Settings() {
  const [depotName, setDepotName] = useState('Gandhinagar Depot A24');
  const [currency, setCurrency] = useState('INR (₹)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={stagger.item}>
        <h2 className="text-2xl font-bold text-white">Settings & RBAC</h2>
        <p className="text-sm text-muted mt-1">Manage general settings and view role-based access control matrix.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div variants={stagger.item}>
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Depot Name"
                value={depotName}
                onChange={(e) => setDepotName(e.target.value)}
              />
              <Input
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
              <Input
                label="Distance Unit"
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value)}
              />
              <Button onClick={handleSave} icon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}>
                {saved ? 'Saved!' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* RBAC Matrix */}
        <motion.div variants={stagger.item}>
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-3 py-2 text-left text-2xs font-semibold text-muted uppercase tracking-wider">Role</th>
                      {MODULES.map(m => (
                        <th key={m.key} className="px-3 py-2 text-center text-2xs font-semibold text-muted uppercase tracking-wider">{m.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLES.map(role => (
                      <tr key={role.key} className="border-b border-white/[0.03] last:border-0">
                        <td className="px-3 py-3 text-sm font-medium text-white">{role.label}</td>
                        {MODULES.map(m => (
                          <td key={m.key} className="px-3 py-3 text-center">
                            <PermCell perm={RBAC_MATRIX[role.key][m.key]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-4 text-2xs text-muted">
                <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald" /> Full access</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-amber" /> View only</span>
                <span className="flex items-center gap-1"><X className="w-3 h-3 text-muted/40" /> No access</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
