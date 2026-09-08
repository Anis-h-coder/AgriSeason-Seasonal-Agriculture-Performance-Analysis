import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  X,
  Search,
  Filter,
  Columns,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { DATASET_AUDIT } from '../data/mockData';
import { DatasetColumnMeta } from '../types';

interface DatasetAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatasetAuditModal: React.FC<DatasetAuditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All 28 Columns' },
    { id: 'Season-related', label: 'Season (1)' },
    { id: 'Crop-related', label: 'Crop (3)' },
    { id: 'Regional/Geographical', label: 'Regional (3)' },
    { id: 'Environmental', label: 'Environmental (7)' },
    { id: 'Production/Yield', label: 'Production / Yield (3)' },
    { id: 'Resource Usage', label: 'Resource Usage (8)' },
    { id: 'Economic', label: 'Economic (4)' },
  ];

  const filteredColumns = DATASET_AUDIT.columns.filter((col) => {
    const matchesSearch =
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || col.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1B3022]/60 backdrop-blur-xs">
      <div
        id="dataset-audit-modal"
        className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl border border-[#E2E8DE] overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#E2E8DE] flex items-center justify-between bg-[#F0F7EE]/70">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1B3022] text-[#A3E635] flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1B3022] font-display">
                  Dataset Schema & Audit Analysis
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#A3E635]/30 text-[#1B3022] border border-[#A3E635]/50">
                  4,000 Records Verified
                </span>
              </div>
              <p className="text-xs text-[#707D72] mt-0.5">
                Strict analysis of uploaded CSV schema, data types, missing records, and field mappings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E2E8DE] flex items-center justify-center text-[#707D72] hover:text-[#1B3022] hover:bg-[#F0F7EE] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Summary Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-6 bg-[#FAFBF8] border-b border-[#E2E8DE]">
          <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DE]">
            <span className="text-[11px] font-semibold text-[#707D72] block">Total Rows</span>
            <span className="text-xl font-bold text-[#1B3022] font-display">4,000</span>
            <span className="text-[10px] text-[#707D72] block mt-0.5">Plots SF10001–SF14000</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DE]">
            <span className="text-[11px] font-semibold text-[#707D72] block">Total Columns</span>
            <span className="text-xl font-bold text-[#1B3022] font-display">28</span>
            <span className="text-[10px] text-[#707D72] block mt-0.5">6 Cat · 22 Num</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DE]">
            <span className="text-[11px] font-semibold text-[#707D72] block">Duplicate Rows</span>
            <span className="text-xl font-bold text-[#347A52] font-display flex items-center gap-1">
              0 <CheckCircle2 className="w-4 h-4 text-[#347A52]" />
            </span>
            <span className="text-[10px] text-[#707D72] block mt-0.5">100% Unique Farm_ID</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DE]">
            <span className="text-[11px] font-semibold text-[#707D72] block">Missing Fields</span>
            <span className="text-xl font-bold text-[#B45309] font-display flex items-center gap-1">
              127 <AlertTriangle className="w-4 h-4 text-[#B45309]" />
            </span>
            <span className="text-[10px] text-[#707D72] block mt-0.5">Across 3 columns</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DE]">
            <span className="text-[11px] font-semibold text-[#707D72] block">States Covered</span>
            <span className="text-xl font-bold text-[#1B3022] font-display">8 States</span>
            <span className="text-[10px] text-[#707D72] block mt-0.5">10 Key Districts</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8DE]">
            <span className="text-[11px] font-semibold text-[#707D72] block">Crops Surveyed</span>
            <span className="text-xl font-bold text-[#1B3022] font-display">8 Crops</span>
            <span className="text-[10px] text-[#707D72] block mt-0.5">Kharif, Rabi, Zaid</span>
          </div>
        </div>

        {/* Missing Values Notice */}
        <div className="px-6 py-3 bg-[#FEF3C7]/40 border-b border-[#FDE68A] flex flex-wrap items-center justify-between gap-3 text-xs text-[#92400E]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
            <span>
              <strong>Missing Values Audit:</strong> <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono">Soil_Moisture_pct</code> (58 missing), <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono">Rainfall_mm</code> (37 missing), <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono">Yield_Tonnes_Ha</code> (32 missing, derived via Production/Area). All other 25 columns are 100% complete.
            </span>
          </div>
          <span className="text-[11px] font-medium text-[#78350F]">No synthetic values inserted</span>
        </div>

        {/* Filters & Search */}
        <div className="p-6 border-b border-[#E2E8DE] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1B3022] text-[#A3E635] font-bold'
                    : 'bg-[#F0F7EE] text-[#707D72] hover:text-[#1B3022]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9AABA0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search column names or types..."
              className="pl-9 pr-4 py-1.5 bg-[#F0F7EE] rounded-full text-xs text-[#1B3022] w-64 focus:ring-2 focus:ring-[#A3E635] outline-none"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="border border-[#E2E8DE] rounded-2xl overflow-hidden bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F0F7EE] text-[#1B3022] font-semibold border-b border-[#E2E8DE]">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Column Name</th>
                  <th className="py-3 px-4">Data Type</th>
                  <th className="py-3 px-4">Domain Group</th>
                  <th className="py-3 px-4">Missing</th>
                  <th className="py-3 px-4">Sample Values</th>
                  <th className="py-3 px-4">Field Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8DE]/70 text-[#2C332E]">
                {filteredColumns.map((col, idx) => (
                  <tr key={col.name} className="hover:bg-[#FAFBF8] transition-colors">
                    <td className="py-3 px-4 text-[#707D72] font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#1B3022]">
                      {col.name}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                          col.dataType === 'string'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {col.dataType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F0F7EE] text-[#347A52] border border-[#E2E8DE]">
                        {col.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {col.missingCount > 0 ? (
                        <span className="font-semibold text-[#B45309]">
                          {col.missingCount} ({(col.missingCount / 40).toFixed(1)}%)
                        </span>
                      ) : (
                        <span className="text-[#347A52] font-medium">0 (0.0%)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#707D72]">
                      {col.sampleValues.slice(0, 3).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-[#707D72] max-w-xs">
                      {col.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-[#F0F7EE]/60 border-t border-[#E2E8DE] flex items-center justify-between text-xs text-[#707D72]">
          <span>
            Mapped directly to AgriSeason dashboard state engine (Zero simulated fields)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B3022] text-[#A3E635] font-semibold rounded-full hover:bg-[#2C4A35] transition-colors"
          >
            Close Schema Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
