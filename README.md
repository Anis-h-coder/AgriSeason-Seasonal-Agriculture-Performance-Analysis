# 🌾 AgriSeason — Seasonal Agriculture Performance Analysis & AgriAI

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini 3.6 Flash](https://img.shields.io/badge/Google_Gemini-3.6_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

**AgriSeason** is a full-stack agricultural decision-support and agronomic intelligence platform. It analyzes multi-seasonal farm telemetry across 50 monitored farm nodes across diverse Indian agro-climatic zones, evaluating performance across **Kharif (Monsoon)**, **Rabi (Winter)**, and **Zaid (Summer)** cropping cycles.

The platform pairs statistical exploration (correlation matrices, regression analyses, what-if agronomic simulations) with **AgriAI**, a server-side Gemini 3.6 Flash intelligence layer grounded in real farm dataset records with deterministic fallback calculations.

---

## 📌 Table of Contents

- [Key Capabilities & Modules](#-key-capabilities--modules)
- [Dataset Architecture](#-dataset-architecture)
- [Agronomic & Statistical Insights](#-agronomic--statistical-insights)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)

---

## 🚀 Key Capabilities & Modules

### 1. 🏠 Landing & Farm Telemetry Overview (`/`)
- High-level overview of monitored farm nodes, total cultivated area, gross crop production, and multi-season harvest cycles.
- Interactive quick-launch portal routing to deep analytics modules.

### 2. 📊 Executive Dashboard (`/overview`)
- **Telemetry KPI Cards**: Mean Harvest Yield (T/Ha), Total Cultivated Land (Hectares), Gross Production (Tonnes), Water Efficiency (T/1000m³), and Net Operating Margins (INR).
- **Seasonal Performance Visualization**: Multi-metric seasonal trend charts comparing Kharif, Rabi, and Zaid cycles.
- **Crop Performance Matrix**: Bar and line distributions comparing yields, prices, and input costs across crops.
- **Environmental Context Panel**: Ambient temperature, precipitation volume, sunlight hours, and soil moisture indicators.

### 3. 🗓️ Seasonal Performance Intelligence (`/seasons`)
- Detailed seasonal comparison across **Kharif** (June–October), **Rabi** (October–March), and **Zaid** (March–June).
- Contrast weather parameters (monsoon precipitation vs winter sunshine vs summer heat stress) with crop output and profit margins.
- Seasonal crop suitability and water footprint analysis.

### 4. 🌾 Crop Performance Matrix (`/crops`)
- Granular breakdown of 7 key crops: **Wheat, Rice, Maize, Pulses, Cotton, Groundnut, and Chilli**.
- Unit economics: Market price realization (₹/Tonne), total cultivation cost, gross revenue, and net profit per hectare.
- Soil nutrient profile analysis: Nitrogen (N), Phosphorus (P), and Potassium (K) consumption patterns.
- Crop risk assessment: Disease and pest susceptibility scores correlated with climatic parameters.

### 5. 🗺️ Regional & Geographic Analytics (`/regions`)
- State and district level comparisons across **Andhra Pradesh, Gujarat, Karnataka, Maharashtra, Punjab, Tamil Nadu, and Telangana**.
- Irrigation method breakdowns (Drip, Sprinkler, Flood, Rainfed) and regional water efficiency indexes.
- Regional productivity rankings, revenue density, and agronomic challenges.

### 6. 🔬 Advanced Analytics & What-If Simulation Lab (`/analytics`)
- **Pearson Correlation Heatmap**: Computed across 8 key variables (Yield, Rainfall, Temperature, Fertilizer, Pesticide, Seed Quality, Water Efficiency, Profit).
- **Bivariate Scatter Plots & Trendlines**: Discover non-linear relationships such as Seed Quality Score vs Yield and Water Efficiency vs Net Profit.
- **What-If Agronomic Simulation Engine**: Interactive sliders allowing users to model hypothetical farming scenarios (adjust rainfall, fertilizer rate, irrigation method, and seed quality) and observe real-time predicted yields and economics.
- **Outlier Detection & Frequency Histograms**: Identify exceptional high-yield plots and severe economic loss events.

### 7. 📑 Project Insights & Academic Findings (`/project-insights`)
- Comprehensive research summary highlighting verified agronomic hypotheses, statistical proofs, and policy recommendations.
- Mathematical correlation proofs (e.g., Pearson $r = +0.68$ between Seed Vigor Score and Harvest Yield).
- Irrigation method comparative returns (Drip irrigation delivering ₹1,82,000 average profit vs ₹68,000 for Flood irrigation).

### 8. 🤖 AgriAI Grounded Dataset Assistant (`/insights`)
- Natural-language query interface powered by **Gemini 3.6 Flash**.
- **Dataset Grounding Engine**: Every prompt is injected with a 9-part structured analytical summary of the 50 farm records to prevent hallucinations.
- **Deterministic Mathematical Fallback**: If no Gemini API key is configured or an external network error occurs, questions are answered via local deterministic analytics algorithms.

### 9. 🗄️ Dataset Audit Modal
- Complete ground-truth data table inspecting all 50 farm records.
- Column-by-column schema documentation with units and types.
- Client-side CSV export functionality.

---

## 📈 Dataset Architecture

The platform operates on a verified 50-plot agricultural dataset (`src/data/raw_dataset.csv` and TypeScript modules) capturing real telemetry variables:

| Category | Parameters |
|:---|:---|
| **Spatial & Identification** | `Farm_ID`, `State`, `District`, `Crop`, `Season`, `Farm_Area_Hectares` |
| **Meteorological Conditions** | `Rainfall_mm`, `Avg_Temperature_C`, `Humidity_pct`, `Sunlight_Hours_Day` |
| **Edaphic & Soil Health** | `Soil_pH`, `Soil_Moisture_pct`, `Nitrogen_kg_ha`, `Phosphorus_kg_ha`, `Potassium_kg_ha` |
| **Farm Practices & Inputs** | `Irrigation_Method` (Drip, Sprinkler, Flood, Rainfed), `Fertilizer_kg_ha`, `Pesticide_Litre_ha`, `Seed_Quality_Score` (0.00 – 1.00) |
| **Harvest & Agronomic Yield** | `Yield_Tonnes_Ha`, `Production_Tonnes`, `Disease_Pest_Risk_pct` |
| **Resource Efficiency** | `Water_Used_m3`, `Water_Efficiency_t_per_1000m3` |
| **Agricultural Economics** | `Market_Price_INR_Tonne`, `Total_Cost_INR`, `Revenue_INR`, `Profit_INR` |

---

## 🔬 Agronomic & Statistical Insights

Key empirical findings extracted from the 50-farm telemetry records:

1. **Certified Seed Quality Impact**: Strong positive Pearson correlation ($r = +0.68, p < 0.001$) between Seed Quality Score and Yield. Certified seeds (>0.80 score) generate an average yield boost of +1.8 T/Ha.
2. **Micro-Irrigation Economics**: Drip-irrigated plots achieve a mean water efficiency of 4.8 T/1000m³ with net profit averaging ₹1,82,000, compared to Flood irrigation which averages 2.1 T/1000m³ and ₹68,000 profit due to pumping energy costs and runoff.
3. **Pest Pressure & Output Loss**: Moderate negative correlation ($r = -0.54$) between disease pest risk percentage and net yield. Plots reporting pest risk above 60% exhibit an average harvest penalty of -1.42 T/Ha.
4. **Fertilizer Diminishing Returns**: Excess nitrogen application (>150 kg/ha) without proportional potassium shows diminishing yield returns and increased pathogen vulnerability.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Charts & Visualizations**: [Recharts 3.10](https://recharts.org/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Server / Backend**: [Express 4](https://expressjs.com/) with [tsx](https://github.com/privatenumber/tsx) and [esbuild](https://esbuild.github.io/)
- **AI / LLM Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gen AI SDK targeting `gemini-3.6-flash`)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown)

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    Browser Client (React 19)                │
│  - GlobalFilterBar (Season, Search, Metrics)                │
│  - Recharts Visualizations & What-If Simulation Engine      │
│  - Responsive Sidebar Drawer & Tab Navigation               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                  Express Server (server.ts)                 │
│  - GET  /api/health (Service & Gemini readiness)            │
│  - POST /api/gemini/insights (Dataset-grounded AgriAI)      │
│  - Vite Middleware (Dev) / Static Asset Fallback (Prod)     │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│       Google GenAI SDK      ││  Local Deterministic Engine  │
│      (gemini-3.6-flash)     ││ (agriAiGrounding.ts fallback)│
│  - System Prompt Grounding  ││ - Mathematical aggregation   │
│  - 50-record context audit  ││ - Zero-dependency offline    │
└─────────────────────────────┘└──────────────────────────────┘
```

---

## 🔌 API Reference

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "hasGeminiKey": true,
  "datasetRecords": 50
}
```

### 2. AgriAI Insights
```http
POST /api/gemini/insights
Content-Type: application/json
```
**Request Body:**
```json
{
  "question": "Which crop provides the highest profit margin in the Rabi season?",
  "history": []
}
```
**Response:**
```json
{
  "answer": "Chilli generates the highest profit margin in the Rabi season with an average net profit of ₹19,54,835 per plot...",
  "supportingMetrics": {
    "season": "Rabi",
    "topCrop": "Chilli",
    "avgProfit": 1954835
  },
  "datasetGroundingNote": "Verified against 50 dataset records via server-side Gemini 3.6 Flash model.",
  "confidenceScore": 0.98,
  "source": "gemini_grounded"
}
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **npm** or **bun**

### Installation

1. Clone or open the project repository:
   ```bash
   git clone https://github.com/your-username/agri-season.git
   cd agri-season
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Provide your Gemini API key (optional for core analytics, required for live AI responses):
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```
   *(Note: If no key is set, AgriAI automatically falls back to deterministic mathematical calculations based on the 50-plot dataset).*

4. Launch the Development Server:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000`.

---

## 📜 Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Launches the tsx Express server with integrated Vite middleware on port 3000 |
| `npm run build` | Builds client static assets via Vite and bundles `server.ts` to `dist/server.cjs` via esbuild |
| `npm start` | Executes the compiled production bundle (`node dist/server.cjs`) |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) to verify type integrity |
| `npm run clean` | Deletes the `dist/` directory |

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|:---|:---|:---|
| `GEMINI_API_KEY` | Optional | API key for Gemini 3.6 Flash server-side integration |
| `PORT` | Optional | Port for the Express server (defaults to `3000`) |
| `APP_URL` | Optional | Hosted URL for links and callbacks |

---

## 📁 Project Structure

```text
├── .env.example               # Example environment variables
├── index.html                 # Primary HTML entry point
├── metadata.json              # AI Studio applet metadata & permissions
├── package.json               # Package configuration and dependencies
├── server.ts                  # Express backend & Gemini API proxy
├── tsconfig.json              # TypeScript compilation configuration
├── vite.config.ts             # Vite build & Tailwind configuration
├── src/
│   ├── main.tsx               # Client React DOM entry point
│   ├── App.tsx                # Main app layout, routing & tab state
│   ├── index.css              # Global styling & Tailwind directives
│   ├── types.ts               # Core TypeScript types & data schemas
│   ├── assets/                # Botanical accents & imagery
│   ├── components/            # Reusable UI & chart components
│   │   ├── AnimatedNumber.tsx
│   │   ├── CropPerformanceSection.tsx
│   │   ├── DatasetAuditModal.tsx
│   │   ├── EnvironmentalCard.tsx
│   │   ├── GlobalFilterBar.tsx
│   │   ├── Header.tsx
│   │   ├── KeyInsightCard.tsx
│   │   ├── MetricCards.tsx
│   │   ├── RightInfoPanel.tsx
│   │   ├── SeasonalPerformanceChart.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── StateFeedback.tsx
│   ├── context/
│   │   └── FilterContext.tsx  # React Context for season & search filters
│   ├── data/
│   │   ├── raw_dataset.csv    # 50-plot raw telemetry dataset
│   │   ├── mockData.ts        # Mock dataset fallbacks
│   │   ├── actualCropData.ts  # Pre-aggregated crop statistics
│   │   ├── actualRegionData.ts# Pre-aggregated regional statistics
│   │   └── actualSeasonData.ts# Pre-aggregated season statistics
│   ├── utils/
│   │   ├── agriAiGrounding.ts # Gemini context grounding & deterministic fallback
│   │   ├── analyticsMath.ts   # Correlation, regression, simulation math
│   │   └── datasetProcessor.ts# Dataset parser, validators, aggregations
│   └── views/
│       ├── AIInsightsView.tsx # AgriAI interactive conversational agent
│       ├── AnalyticsView.tsx  # Correlation lab & What-If simulator
│       ├── CropsView.tsx      # Granular crop economics & soil demands
│       ├── LandingView.tsx    # Welcome portal & telemetry summary
│       ├── ProjectInsightsView.tsx # Statistical findings & academic report
│       ├── RegionsView.tsx    # State & zone geospatial analytics
│       └── SeasonsView.tsx    # Kharif vs Rabi vs Zaid seasonal breakdowns
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
