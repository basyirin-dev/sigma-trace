import type { District } from '@engine/types';

export interface CityGridProps {
  districts: District[];
  onDistrictClick?: (districtId: string) => void;
}

export function CityGrid(_props: CityGridProps) {
  return <div data-testid="city-grid" />;
}
