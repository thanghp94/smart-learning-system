
import { Facility } from '../types';
import { fetchAll, fetchById, insert, update, remove } from './base-service';

export const facilityService = {
  getAll: () => fetchAll<Facility>('facilities'),
  getById: (id: string) => fetchById<Facility>('facilities', id),
  create: (facility: Partial<Facility>) => insert<Facility>('facilities', facility),
  update: (id: string, updates: Partial<Facility>) => update<Facility>('facilities', id, updates),
  delete: (id: string) => remove('facilities', id)
};
