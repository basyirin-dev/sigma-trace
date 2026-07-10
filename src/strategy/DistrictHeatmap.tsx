import type { District } from '@engine/types';

export interface DistrictHeatmapProps {
  districts: District[];
  metric: 'sigma' | 'r0';
}

export function DistrictHeatmap(_props: DistrictHeatmapProps) {
  return <div data-testid="district-heatmap" />;
}
