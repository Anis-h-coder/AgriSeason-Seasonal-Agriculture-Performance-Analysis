import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { SeasonType, GlobalFilterState } from '../types';
import {
  getSanitizedRecords,
  filterFarmRecords,
  getDistinctFilterOptions,
  getFilteredMetricCards,
  SanitizedFarmRecord,
  DistinctFilterOptions,
  FilterCriteria,
} from '../utils/datasetProcessor';
import { MetricCardData } from '../types';

export interface ActiveFilterTag {
  key: keyof GlobalFilterState;
  dimensionLabel: string;
  displayValue: string;
  category: 'season' | 'crop' | 'region' | 'category' | 'search';
}

export interface FilterContextValue {
  filters: GlobalFilterState;
  setSeason: (season: SeasonType) => void;
  setCrop: (crop: string) => void;
  setRegion: (region: string) => void;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setFilter: <K extends keyof GlobalFilterState>(key: K, value: GlobalFilterState[K]) => void;
  clearFilter: (key: keyof GlobalFilterState) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  activeFilterTags: ActiveFilterTag[];
  filteredRecords: SanitizedFarmRecord[];
  totalRecordsCount: number;
  filteredRecordsCount: number;
  filteredMetrics: MetricCardData[];
  distinctOptions: DistinctFilterOptions;
  isQuickFilterActive: (key: keyof GlobalFilterState, value: string) => boolean;
}

const DEFAULT_FILTERS: GlobalFilterState = {
  season: 'all',
  crop: 'all',
  region: 'all',
  category: 'all',
  searchQuery: '',
};

const FilterContext = createContext<FilterContextValue | null>(null);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalFilterState>(DEFAULT_FILTERS);

  // Setters
  const setSeason = useCallback((season: SeasonType) => {
    setFilters((prev) => ({ ...prev, season }));
  }, []);

  const setCrop = useCallback((crop: string) => {
    setFilters((prev) => ({ ...prev, crop }));
  }, []);

  const setRegion = useCallback((region: string) => {
    setFilters((prev) => ({ ...prev, region }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const setFilter = useCallback(<K extends keyof GlobalFilterState>(key: K, value: GlobalFilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilter = useCallback((key: keyof GlobalFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === 'searchQuery' ? '' : 'all',
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Compute filtered dataset
  const filterCriteria: FilterCriteria = useMemo(
    () => ({
      season: filters.season,
      crop: filters.crop,
      region: filters.region,
      category: filters.category,
      searchQuery: filters.searchQuery,
    }),
    [filters]
  );

  const filteredRecords = useMemo(() => filterFarmRecords(filterCriteria), [filterCriteria]);
  const allRecords = useMemo(() => getSanitizedRecords(), []);
  const totalRecordsCount = allRecords.length;
  const filteredRecordsCount = filteredRecords.length;

  const distinctOptions = useMemo(() => getDistinctFilterOptions(filterCriteria), [filterCriteria]);

  const filteredMetrics = useMemo(() => getFilteredMetricCards(filterCriteria), [filterCriteria]);

  // Active filters analysis & chips
  const activeFilterTags = useMemo<ActiveFilterTag[]>(() => {
    const tags: ActiveFilterTag[] = [];

    if (filters.season && filters.season !== 'all') {
      const seasonNames: Record<string, string> = {
        kharif: 'Kharif (Monsoon)',
        rabi: 'Rabi (Winter)',
        zaid: 'Zaid (Summer)',
      };
      tags.push({
        key: 'season',
        dimensionLabel: 'Season',
        displayValue: seasonNames[filters.season] || filters.season,
        category: 'season',
      });
    }

    if (filters.crop && filters.crop !== 'all') {
      tags.push({
        key: 'crop',
        dimensionLabel: 'Crop',
        displayValue: filters.crop,
        category: 'crop',
      });
    }

    if (filters.region && filters.region !== 'all') {
      tags.push({
        key: 'region',
        dimensionLabel: 'Region',
        displayValue: filters.region,
        category: 'region',
      });
    }

    if (filters.category && filters.category !== 'all') {
      tags.push({
        key: 'category',
        dimensionLabel: 'Category',
        displayValue: filters.category,
        category: 'category',
      });
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      tags.push({
        key: 'searchQuery',
        dimensionLabel: 'Search',
        displayValue: `"${filters.searchQuery.trim()}"`,
        category: 'search',
      });
    }

    return tags;
  }, [filters]);

  const hasActiveFilters = activeFilterTags.length > 0;
  const activeFilterCount = activeFilterTags.length;

  const isQuickFilterActive = useCallback(
    (key: keyof GlobalFilterState, value: string) => {
      if (key === 'searchQuery') return filters.searchQuery.toLowerCase() === value.toLowerCase();
      return String(filters[key]).toLowerCase() === value.toLowerCase();
    },
    [filters]
  );

  const value: FilterContextValue = {
    filters,
    setSeason,
    setCrop,
    setRegion,
    setCategory,
    setSearchQuery,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
    activeFilterTags,
    filteredRecords,
    totalRecordsCount,
    filteredRecordsCount,
    filteredMetrics,
    distinctOptions,
    isQuickFilterActive,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = (): FilterContextValue => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
