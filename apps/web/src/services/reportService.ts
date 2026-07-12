export interface Report {
  id: string;
  type: 'FUEL_EFFICIENCY' | 'OPERATIONAL_COSTS' | 'DRIVER_PERFORMANCE' | 'FLEET_UTILIZATION' | 'ROI';
  title: string;
  generatedAt: string;
  data: Record<string, unknown>;
}

export const reportService = {
  async getReports(): Promise<Report[]> {
    return Promise.resolve([]);
  },

  async getReportById(_id: string): Promise<Report | null> {
    return Promise.resolve(null);
  },

  async generateReport(_type: Report['type']): Promise<Report | null> {
    return Promise.resolve(null);
  },
};
