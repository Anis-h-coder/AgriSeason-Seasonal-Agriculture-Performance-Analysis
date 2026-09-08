import { ACTUAL_DATASET_RECORDS, FarmRecord } from '../data/actualSeasonData';

export interface NumericalColumnDef {
  key: keyof FarmRecord;
  label: string;
  shortLabel: string;
  unit: string;
  category: 'Agro-Climatic' | 'Soil & Nutrition' | 'Inputs & Technology' | 'Agronomic Output' | 'Financial & Economic';
  description: string;
  format: (val: number) => string;
}

export const NUMERICAL_COLUMNS: NumericalColumnDef[] = [
  {
    key: 'Yield_Tonnes_Ha',
    label: 'Crop Yield (Tonnes / Hectare)',
    shortLabel: 'Yield',
    unit: 't/ha',
    category: 'Agronomic Output',
    description: 'Calculated crop yield per hectare harvested',
    format: (v) => `${v.toFixed(2)} t/ha`,
  },
  {
    key: 'Production_Tonnes',
    label: 'Total Production (Tonnes)',
    shortLabel: 'Production',
    unit: 'Tonnes',
    category: 'Agronomic Output',
    description: 'Total harvested volume across farm acreage',
    format: (v) => `${v.toFixed(1)} t`,
  },
  {
    key: 'Revenue_INR',
    label: 'Gross Farm Revenue (INR ₹)',
    shortLabel: 'Revenue',
    unit: '₹',
    category: 'Financial & Economic',
    description: 'Total revenue realized at farm gate',
    format: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
  },
  {
    key: 'Profit_INR',
    label: 'Net Farm Profit / Loss (INR ₹)',
    shortLabel: 'Net Profit',
    unit: '₹',
    category: 'Financial & Economic',
    description: 'Net farm operating income (Revenue minus Total Cost)',
    format: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
  },
  {
    key: 'Total_Cost_INR',
    label: 'Total Production Cost (INR ₹)',
    shortLabel: 'Total Cost',
    unit: '₹',
    category: 'Financial & Economic',
    description: 'Cumulative input, labor, irrigation, and operational cost',
    format: (v) => `₹${Math.round(v).toLocaleString('en-IN')}`,
  },
  {
    key: 'Market_Price_INR_Tonne',
    label: 'Market Price Realized (₹ / Tonne)',
    shortLabel: 'Market Price',
    unit: '₹/t',
    category: 'Financial & Economic',
    description: 'Wholesale selling price per metric tonne',
    format: (v) => `₹${Math.round(v).toLocaleString('en-IN')}/t`,
  },
  {
    key: 'Rainfall_mm',
    label: 'Cumulative Rainfall (mm)',
    shortLabel: 'Rainfall',
    unit: 'mm',
    category: 'Agro-Climatic',
    description: 'Precipitation received during seasonal crop cycle',
    format: (v) => `${v.toFixed(1)} mm`,
  },
  {
    key: 'Avg_Temperature_C',
    label: 'Mean Temperature (°C)',
    shortLabel: 'Temperature',
    unit: '°C',
    category: 'Agro-Climatic',
    description: 'Average diurnal ambient temperature during growth',
    format: (v) => `${v.toFixed(1)}°C`,
  },
  {
    key: 'Humidity_pct',
    label: 'Relative Humidity (%)',
    shortLabel: 'Humidity',
    unit: '%',
    category: 'Agro-Climatic',
    description: 'Average atmospheric moisture content',
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'Sunlight_Hours_Day',
    label: 'Sunlight Exposure (Hours / Day)',
    shortLabel: 'Sunlight',
    unit: 'hrs/day',
    category: 'Agro-Climatic',
    description: 'Daily photoperiod direct sunlight duration',
    format: (v) => `${v.toFixed(1)} hrs`,
  },
  {
    key: 'Soil_Moisture_pct',
    label: 'Soil Moisture Content (%)',
    shortLabel: 'Soil Moisture',
    unit: '%',
    category: 'Soil & Nutrition',
    description: 'Volumetric soil moisture in topsoil root zone',
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'Soil_pH',
    label: 'Soil pH Level',
    shortLabel: 'Soil pH',
    unit: 'pH',
    category: 'Soil & Nutrition',
    description: 'Acidity/alkalinity scale of farm plot soil',
    format: (v) => `${v.toFixed(2)}`,
  },
  {
    key: 'Nitrogen_kg_ha',
    label: 'Nitrogen Content (kg / ha)',
    shortLabel: 'Nitrogen',
    unit: 'kg/ha',
    category: 'Soil & Nutrition',
    description: 'Available soil Nitrogen nutrient density',
    format: (v) => `${v.toFixed(1)} kg/ha`,
  },
  {
    key: 'Phosphorus_kg_ha',
    label: 'Phosphorus Content (kg / ha)',
    shortLabel: 'Phosphorus',
    unit: 'kg/ha',
    category: 'Soil & Nutrition',
    description: 'Available soil Phosphorus nutrient density',
    format: (v) => `${v.toFixed(1)} kg/ha`,
  },
  {
    key: 'Potassium_kg_ha',
    label: 'Potassium Content (kg / ha)',
    shortLabel: 'Potassium',
    unit: 'kg/ha',
    category: 'Soil & Nutrition',
    description: 'Available soil Potassium nutrient density',
    format: (v) => `${v.toFixed(1)} kg/ha`,
  },
  {
    key: 'Fertilizer_kg_ha',
    label: 'Fertilizer Applied (kg / ha)',
    shortLabel: 'Fertilizer',
    unit: 'kg/ha',
    category: 'Inputs & Technology',
    description: 'Total chemical & organic fertilizer dosage per hectare',
    format: (v) => `${v.toFixed(1)} kg/ha`,
  },
  {
    key: 'Pesticide_Litre_ha',
    label: 'Pesticide Applied (L / ha)',
    shortLabel: 'Pesticide',
    unit: 'L/ha',
    category: 'Inputs & Technology',
    description: 'Plant protection chemical volume applied per hectare',
    format: (v) => `${v.toFixed(2)} L/ha`,
  },
  {
    key: 'Seed_Quality_Score',
    label: 'Seed Quality Index (0–1.0)',
    shortLabel: 'Seed Quality',
    unit: 'score',
    category: 'Inputs & Technology',
    description: 'Certified seed germination and genetic vigor rating',
    format: (v) => `${v.toFixed(2)}`,
  },
  {
    key: 'Water_Used_m3',
    label: 'Water Consumed (m³)',
    shortLabel: 'Water Usage',
    unit: 'm³',
    category: 'Inputs & Technology',
    description: 'Total irrigation and supplemental water applied in cubic meters',
    format: (v) => `${Math.round(v).toLocaleString('en-IN')} m³`,
  },
  {
    key: 'Water_Efficiency_t_per_1000m3',
    label: 'Water Productivity (t / 1,000 m³)',
    shortLabel: 'Water Efficiency',
    unit: 't/1000m³',
    category: 'Agronomic Output',
    description: 'Yield production per 1,000 cubic meters of water consumed',
    format: (v) => `${v.toFixed(2)} t/k-m³`,
  },
  {
    key: 'Disease_Pest_Risk_pct',
    label: 'Disease & Pest Incident Risk (%)',
    shortLabel: 'Pest Risk',
    unit: '%',
    category: 'Agro-Climatic',
    description: 'Incidence probability of fungal, bacterial, or insect infestation',
    format: (v) => `${v.toFixed(1)}%`,
  },
  {
    key: 'Farm_Area_Hectares',
    label: 'Plot Area (Hectares)',
    shortLabel: 'Farm Area',
    unit: 'ha',
    category: 'Inputs & Technology',
    description: 'Cultivated farm land size in hectares',
    format: (v) => `${v.toFixed(2)} ha`,
  },
];

// Helper to filter valid numbers
function getValidPairs(
  records: FarmRecord[],
  xKey: keyof FarmRecord,
  yKey: keyof FarmRecord
): { x: number; y: number; record: FarmRecord }[] {
  const result: { x: number; y: number; record: FarmRecord }[] = [];
  for (const rec of records) {
    const xv = rec[xKey];
    const yv = rec[yKey];
    if (
      xv !== null &&
      xv !== undefined &&
      typeof xv === 'number' &&
      !isNaN(xv) &&
      yv !== null &&
      yv !== undefined &&
      typeof yv === 'number' &&
      !isNaN(yv)
    ) {
      result.push({ x: xv, y: yv, record: rec });
    }
  }
  return result;
}

export interface RegressionStats {
  count: number;
  r: number; // Pearson correlation
  rSquared: number;
  slope: number;
  intercept: number;
  xMean: number;
  yMean: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  relationshipStrength: 'Strong Positive' | 'Moderate Positive' | 'Weak / Neutral' | 'Moderate Negative' | 'Strong Negative';
  direction: 'Positive' | 'Negative' | 'Neutral';
  equation: string;
  interpretation: string;
}

export function computeRegression(
  records: FarmRecord[],
  xKey: keyof FarmRecord,
  yKey: keyof FarmRecord
): RegressionStats | null {
  const pairs = getValidPairs(records, xKey, yKey);
  const n = pairs.length;
  if (n < 3) return null;

  let sumX = 0;
  let sumY = 0;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of pairs) {
    sumX += p.x;
    sumY += p.y;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const xMean = sumX / n;
  const yMean = sumY / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (const p of pairs) {
    const dx = p.x - xMean;
    const dy = p.y - yMean;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denom = Math.sqrt(denomX * denomY);
  const r = denom === 0 ? 0 : numerator / denom;
  const slope = denomX === 0 ? 0 : numerator / denomX;
  const intercept = yMean - slope * xMean;
  const rSquared = r * r;

  let relationshipStrength: RegressionStats['relationshipStrength'] = 'Weak / Neutral';
  if (r >= 0.6) relationshipStrength = 'Strong Positive';
  else if (r >= 0.25) relationshipStrength = 'Moderate Positive';
  else if (r <= -0.6) relationshipStrength = 'Strong Negative';
  else if (r <= -0.25) relationshipStrength = 'Moderate Negative';

  const direction: RegressionStats['direction'] = r > 0.05 ? 'Positive' : r < -0.05 ? 'Negative' : 'Neutral';

  const sign = intercept >= 0 ? '+' : '-';
  const equation = `y = ${slope.toFixed(3)}x ${sign} ${Math.abs(intercept).toFixed(2)}`;

  let interpretation = '';
  const xDef = NUMERICAL_COLUMNS.find((c) => c.key === xKey)?.shortLabel || String(xKey);
  const yDef = NUMERICAL_COLUMNS.find((c) => c.key === yKey)?.shortLabel || String(yKey);

  if (Math.abs(r) < 0.15) {
    interpretation = `There is no significant linear correlation (r = ${r.toFixed(2)}) between ${xDef} and ${yDef} in this dataset. Variations in ${yDef} are governed predominantly by seasonal conditions and crop biological characteristics.`;
  } else if (r > 0) {
    interpretation = `A ${relationshipStrength.toLowerCase()} correlation (r = +${r.toFixed(2)}, R² = ${(rSquared * 100).toFixed(1)}%) indicates that increases in ${xDef} generally coincide with higher ${yDef} across the surveyed plots.`;
  } else {
    interpretation = `A ${relationshipStrength.toLowerCase()} inverse correlation (r = ${r.toFixed(2)}, R² = ${(rSquared * 100).toFixed(1)}%) indicates that higher ${xDef} tends to correspond with lower ${yDef}.`;
  }

  return {
    count: n,
    r: Number(r.toFixed(4)),
    rSquared: Number(rSquared.toFixed(4)),
    slope: Number(slope.toFixed(4)),
    intercept: Number(intercept.toFixed(4)),
    xMean: Number(xMean.toFixed(2)),
    yMean: Number(yMean.toFixed(2)),
    xMin: minX,
    xMax: maxX,
    yMin: minY,
    yMax: maxY,
    relationshipStrength,
    direction,
    equation,
    interpretation,
  };
}

// Correlation Heatmap calculation
export interface CorrelationCell {
  xKey: keyof FarmRecord;
  yKey: keyof FarmRecord;
  xLabel: string;
  yLabel: string;
  r: number;
}

export function computeCorrelationMatrix(
  records: FarmRecord[],
  keys: (keyof FarmRecord)[]
): { keys: (keyof FarmRecord)[]; matrix: CorrelationCell[][] } {
  const matrix: CorrelationCell[][] = [];

  for (let i = 0; i < keys.length; i++) {
    const row: CorrelationCell[] = [];
    const yKey = keys[i];
    const yDef = NUMERICAL_COLUMNS.find((c) => c.key === yKey);
    const yLabel = yDef?.shortLabel || String(yKey);

    for (let j = 0; j < keys.length; j++) {
      const xKey = keys[j];
      const xDef = NUMERICAL_COLUMNS.find((c) => c.key === xKey);
      const xLabel = xDef?.shortLabel || String(xKey);

      if (i === j) {
        row.push({ xKey, yKey, xLabel, yLabel, r: 1.0 });
      } else {
        const reg = computeRegression(records, xKey, yKey);
        row.push({
          xKey,
          yKey,
          xLabel,
          yLabel,
          r: reg ? reg.r : 0,
        });
      }
    }
    matrix.push(row);
  }

  return { keys, matrix };
}

// Distribution & Histogram calculations
export interface HistogramBin {
  binIndex: number;
  rangeMin: number;
  rangeMax: number;
  rangeLabel: string;
  count: number;
  percentage: number;
  kharifCount: number;
  rabiCount: number;
  zaidCount: number;
  records: FarmRecord[];
}

export interface DistributionStats {
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  bins: HistogramBin[];
}

export function computeDistribution(
  records: FarmRecord[],
  colKey: keyof FarmRecord,
  binCount = 10
): DistributionStats | null {
  const values: { val: number; rec: FarmRecord }[] = [];
  for (const r of records) {
    const v = r[colKey];
    if (v !== null && v !== undefined && typeof v === 'number' && !isNaN(v)) {
      values.push({ val: v, rec: r });
    }
  }

  const n = values.length;
  if (n === 0) return null;

  values.sort((a, b) => a.val - b.val);
  const rawVals = values.map((v) => v.val);

  const min = rawVals[0];
  const max = rawVals[rawVals.length - 1];
  const sum = rawVals.reduce((acc, c) => acc + c, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 === 0 ? (rawVals[mid - 1] + rawVals[mid]) / 2 : rawVals[mid];

  // Q1 & Q3
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const q1 = rawVals[q1Index];
  const q3 = rawVals[q3Index];
  const iqr = q3 - q1;

  // Variance & StdDev
  const variance = rawVals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Skewness (Pearson's moment coefficient of skewness)
  const skewnessNumerator = rawVals.reduce((acc, v) => acc + Math.pow(v - mean, 3), 0) / n;
  const skewness = stdDev > 0 ? skewnessNumerator / Math.pow(stdDev, 3) : 0;

  // Binning
  const range = max - min;
  const step = range === 0 ? 1 : range / binCount;
  const bins: HistogramBin[] = [];

  for (let b = 0; b < binCount; b++) {
    const bMin = min + b * step;
    const bMax = b === binCount - 1 ? max : min + (b + 1) * step;
    const isLast = b === binCount - 1;

    const matched = values.filter((item) =>
      isLast ? item.val >= bMin && item.val <= bMax : item.val >= bMin && item.val < bMax
    );

    const kharifCount = matched.filter((m) => m.rec.Season.toLowerCase() === 'kharif').length;
    const rabiCount = matched.filter((m) => m.rec.Season.toLowerCase() === 'rabi').length;
    const zaidCount = matched.filter((m) => m.rec.Season.toLowerCase() === 'zaid').length;

    const colDef = NUMERICAL_COLUMNS.find((c) => c.key === colKey);
    const formatFn = colDef?.format || ((v: number) => v.toFixed(1));

    bins.push({
      binIndex: b,
      rangeMin: Number(bMin.toFixed(2)),
      rangeMax: Number(bMax.toFixed(2)),
      rangeLabel: `${formatFn(bMin)} - ${formatFn(bMax)}`,
      count: matched.length,
      percentage: Number(((matched.length / n) * 100).toFixed(1)),
      kharifCount,
      rabiCount,
      zaidCount,
      records: matched.map((m) => m.rec),
    });
  }

  return {
    count: n,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    variance: Number(variance.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
    q1: Number(q1.toFixed(2)),
    q3: Number(q3.toFixed(2)),
    iqr: Number(iqr.toFixed(2)),
    skewness: Number(skewness.toFixed(2)),
    bins,
  };
}

// Outlier detection using IQR & Z-Score
export interface OutlierItem {
  id: string;
  farmId: string;
  crop: string;
  season: string;
  state: string;
  district: string;
  metricKey: keyof FarmRecord;
  metricLabel: string;
  value: number;
  formattedValue: string;
  mean: number;
  zScore: number;
  method: 'IQR Extreme' | 'Z-Score Spike';
  direction: 'High' | 'Low';
  plainEnglishExplanation: string;
  record: FarmRecord;
}

export function detectDatasetOutliers(
  records: FarmRecord[],
  targetKeys: (keyof FarmRecord)[] = [
    'Yield_Tonnes_Ha',
    'Profit_INR',
    'Production_Tonnes',
    'Water_Used_m3',
    'Rainfall_mm',
    'Revenue_INR',
  ]
): OutlierItem[] {
  const outliers: OutlierItem[] = [];

  for (const key of targetKeys) {
    const dist = computeDistribution(records, key);
    if (!dist || dist.count < 5) continue;

    const lowerBound = dist.q1 - 1.5 * dist.iqr;
    const upperBound = dist.q3 + 1.5 * dist.iqr;
    const colDef = NUMERICAL_COLUMNS.find((c) => c.key === key);
    const formatFn = colDef?.format || ((v: number) => String(v));
    const label = colDef?.shortLabel || String(key);

    for (const rec of records) {
      const v = rec[key];
      if (v === null || v === undefined || typeof v !== 'number') continue;

      const zScore = dist.stdDev > 0 ? (v - dist.mean) / dist.stdDev : 0;
      const isIqrOutlier = v < lowerBound || v > upperBound;
      const isZScoreOutlier = Math.abs(zScore) >= 2.0;

      if (isIqrOutlier || isZScoreOutlier) {
        const direction = v > dist.mean ? 'High' : 'Low';
        const method = isIqrOutlier ? 'IQR Extreme' : 'Z-Score Spike';

        let explanation = '';
        if (key === 'Yield_Tonnes_Ha') {
          if (direction === 'High') {
            explanation = `Plot recorded an extraordinary yield of ${formatFn(v)} (${zScore > 0 ? '+' : ''}${zScore.toFixed(1)}σ above mean ${formatFn(dist.mean)}). Driven by high-biomass ${rec.Crop} cultivated under ${rec.Irrigation_Method} irrigation in ${rec.Season} season.`;
          } else {
            explanation = `Plot experienced an unusually depressed yield of ${formatFn(v)} (${zScore.toFixed(1)}σ below normal). Suffered heavy pest pressure (${rec.Disease_Pest_Risk_pct}%) and adverse water conditions.`;
          }
        } else if (key === 'Profit_INR') {
          if (direction === 'High') {
            explanation = `Exceptional financial return of ${formatFn(v)} (${zScore > 0 ? '+' : ''}${zScore.toFixed(1)}σ above average). Capitalized on strong market prices (${formatFn(rec.Market_Price_INR_Tonne)}/t) and large harvested volume.`;
          } else {
            explanation = `Severe financial deficit of ${formatFn(v)} (${zScore.toFixed(1)}σ below average). Input expenditures (${formatFn(rec.Total_Cost_INR)}) drastically exceeded realized harvest revenue.`;
          }
        } else if (key === 'Rainfall_mm') {
          if (direction === 'High') {
            explanation = `Heavy localized monsoon inundation of ${formatFn(v)} (${zScore > 0 ? '+' : ''}${zScore.toFixed(1)}σ above mean), leading to soil saturation and heightened fungal vulnerability.`;
          } else {
            explanation = `Acute precipitation deficit of ${formatFn(v)} (${zScore.toFixed(1)}σ below mean), requiring 100% artificial irrigation reliance during the growth phase.`;
          }
        } else if (key === 'Water_Used_m3') {
          explanation = `${direction === 'High' ? 'Substantial water volume' : 'Minimal water volume'} of ${formatFn(v)} (${zScore > 0 ? '+' : ''}${zScore.toFixed(1)}σ from mean) deployed on ${rec.Farm_Area_Hectares} ha using ${rec.Irrigation_Method} irrigation.`;
        } else {
          explanation = `Measured value of ${formatFn(v)} deviates significantly (${zScore > 0 ? '+' : ''}${zScore.toFixed(1)} standard deviations) from the dataset benchmark average of ${formatFn(dist.mean)}.`;
        }

        outliers.push({
          id: `${rec.Farm_ID}-${key}`,
          farmId: rec.Farm_ID,
          crop: rec.Crop,
          season: rec.Season,
          state: rec.State,
          district: rec.District,
          metricKey: key,
          metricLabel: label,
          value: v,
          formattedValue: formatFn(v),
          mean: dist.mean,
          zScore: Number(zScore.toFixed(2)),
          method,
          direction,
          plainEnglishExplanation: explanation,
          record: rec,
        });
      }
    }
  }

  // Sort by highest absolute z-score deviation first
  outliers.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
  return outliers;
}

// Preset relationships for fast exploration
export interface RelationshipPreset {
  id: string;
  title: string;
  xKey: keyof FarmRecord;
  yKey: keyof FarmRecord;
  agronomicHypothesis: string;
}

export const RELATIONSHIP_PRESETS: RelationshipPreset[] = [
  {
    id: 'rain-yield',
    title: 'Rainfall vs. Yield',
    xKey: 'Rainfall_mm',
    yKey: 'Yield_Tonnes_Ha',
    agronomicHypothesis: 'Evaluates whether excessive monsoon rainfall boosts yield or causes saturation/pest losses across seasons.',
  },
  {
    id: 'temp-yield',
    title: 'Temperature vs. Yield',
    xKey: 'Avg_Temperature_C',
    yKey: 'Yield_Tonnes_Ha',
    agronomicHypothesis: 'Examines thermal tolerance: Rabi crops prefer moderate ~23°C whereas Zaid sugarcane thrives at >32°C.',
  },
  {
    id: 'water-yield',
    title: 'Water Usage vs. Yield',
    xKey: 'Water_Used_m3',
    yKey: 'Yield_Tonnes_Ha',
    agronomicHypothesis: 'Measures irrigation efficiency curve to determine where additional water application yields diminishing returns.',
  },
  {
    id: 'yield-profit',
    title: 'Yield vs. Profit',
    xKey: 'Yield_Tonnes_Ha',
    yKey: 'Profit_INR',
    agronomicHypothesis: 'Tests the fundamental commercial link: does higher biological productivity directly translate into net operating margin?',
  },
  {
    id: 'humidity-pest',
    title: 'Humidity vs. Disease Risk',
    xKey: 'Humidity_pct',
    yKey: 'Disease_Pest_Risk_pct',
    agronomicHypothesis: 'Tests pathogen vectors: sustained ambient humidity accelerates fungal and insect proliferation in monsoon fields.',
  },
  {
    id: 'nitrogen-yield',
    title: 'Nitrogen vs. Yield',
    xKey: 'Nitrogen_kg_ha',
    yKey: 'Yield_Tonnes_Ha',
    agronomicHypothesis: 'Evaluates soil chemical fertility response to available nitrogen levels across different crop varieties.',
  },
  {
    id: 'cost-revenue',
    title: 'Total Cost vs. Revenue',
    xKey: 'Total_Cost_INR',
    yKey: 'Revenue_INR',
    agronomicHypothesis: 'Examines input investment leverage and breakeven boundaries across surveyed smallholder and commercial plots.',
  },
];
