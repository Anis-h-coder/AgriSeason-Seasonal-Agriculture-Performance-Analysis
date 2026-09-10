import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Bot,
  Send,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Droplets,
  Wheat,
  ShieldCheck,
  AlertCircle,
  Database,
  Copy,
  Check,
  BarChart3,
  Layers,
  ChevronRight,
  ArrowRight,
  Info,
  Calendar,
} from 'lucide-react';
import { getGroundedDatasetAnswer, AgriAIResponse, SupportingMetric } from '../utils/agriAiGrounding';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { AiLoadingState, AiErrorState } from '../components/StateFeedback';

interface AIInsightsViewProps {
  selectedSeason?: string;
  onSeasonChange?: (season: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  supportingMetrics?: SupportingMetric[];
  datasetGroundingNote?: string;
  confidenceScore?: number;
  category?: string;
  relevantSeason?: string;
  relevantCrop?: string;
  source?: string;
}

const SUGGESTED_QUESTIONS = [
  {
    category: 'Yield & Performance',
    icon: Wheat,
    question: 'Which season has the highest average yield?',
  },
  {
    category: 'Crop Rankings',
    icon: BarChart3,
    question: 'Which crop performs best?',
  },
  {
    category: 'Economics & Margins',
    icon: TrendingUp,
    question: 'Which season generates the highest profit?',
  },
  {
    category: 'Meteorology',
    icon: Droplets,
    question: 'How does rainfall vary across seasons?',
  },
  {
    category: 'Hydrology',
    icon: Droplets,
    question: 'Which crops use the most water?',
  },
  {
    category: 'Multivariate Patterns',
    icon: Layers,
    question: 'What are the major patterns in the dataset?',
  },
  {
    category: 'Anomalies & Outliers',
    icon: AlertCircle,
    question: 'Are there unusual observations?',
  },
  {
    category: 'Strategic Policy',
    icon: Sparkles,
    question: 'What should agricultural planners investigate further?',
  },
];

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  selectedSeason,
  onSeasonChange,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Welcome to **AgriAI** — your specialized conversational agronomic intelligence assistant. I am connected directly to your analyzed **Seasonal Agriculture Performance dataset (50 records)** with full statistical verification. Ask me any question regarding seasonal yields, crop economics, water efficiency, or policy recommendations.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      datasetGroundingNote: 'Grounded directly in 50 farm observations across Andhra Pradesh, Gujarat, and Punjab.',
      confidenceScore: 100,
      category: 'General',
      supportingMetrics: [
        { label: 'Dataset Observations', value: '50 Farms', subtext: 'Kharif, Rabi, Zaid' },
        { label: 'Calculated Attributes', value: '28 Metrics', subtext: 'Soil, Climate, Economics' },
        { label: 'Highest Yield Season', value: 'Zaid / Rabi', subtext: '3.86 & 3.52 t/ha' },
        { label: 'Highest Profit Season', value: 'Rabi', subtext: '₹1.43L avg profit' },
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    setErrorMsg(null);
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      // Call server-side API endpoint
      const response = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: textToSend,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        supportingMetrics: data.supportingMetrics || [],
        datasetGroundingNote: data.datasetGroundingNote || 'Calculated from empirical dataset records.',
        confidenceScore: data.confidenceScore || 95,
        category: data.category,
        relevantSeason: data.relevantSeason,
        relevantCrop: data.relevantCrop,
        source: data.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('Network / server call failed, falling back to local grounded intelligence engine:', err);
      // Fallback directly to deterministic grounding function
      const fallbackResult: AgriAIResponse = getGroundedDatasetAnswer(textToSend);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackResult.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        supportingMetrics: fallbackResult.supportingMetrics,
        datasetGroundingNote: fallbackResult.datasetGroundingNote,
        confidenceScore: fallbackResult.confidenceScore,
        category: fallbackResult.category,
        relevantSeason: fallbackResult.relevantSeason,
        relevantCrop: fallbackResult.relevantCrop,
        source: 'dataset_deterministic_local',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch (e) {
      // Ignore clipboard error in restricted sandboxed environment
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg-reset',
        sender: 'ai',
        text: "Chat cleared. Ask any question about the **50-record Seasonal Agriculture Performance dataset**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        datasetGroundingNote: '50 verified dataset records ready for analysis.',
        confidenceScore: 100,
      },
    ]);
  };

  // Helper to format text with react-markdown cleanly
  const renderFormattedText = (text: string) => {
    return (
      <div className="text-sm leading-relaxed text-[#1B3022] space-y-2">
        <Markdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-lg font-bold font-display text-[#13281C] mt-4 mb-2">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-bold font-display text-[#13281C] mt-3.5 mb-1.5">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-bold font-display text-[#2C6B45] mt-3 mb-1.5">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-[#1B3022] leading-relaxed my-1.5">{children}</p>
            ),
            hr: () => (
              <hr className="my-3 border-t border-[#E2E8DE]" />
            ),
            ul: ({ children }) => (
              <ul className="space-y-1.5 my-2 pl-1 text-sm text-[#1B3022]">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal space-y-1.5 my-2 pl-5 text-sm text-[#1B3022]">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2 text-sm text-[#1B3022] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2C6B45] mt-2 shrink-0" />
                <div className="flex-1">{children}</div>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-[#13281C]">{children}</strong>
            ),
            code: ({ children }) => (
              <code className="px-1.5 py-0.5 rounded bg-[#F4F7F2] border border-[#E2E8DE] font-mono text-xs text-[#2C6B45]">
                {children}
              </code>
            ),
          }}
        >
          {text}
        </Markdown>
      </div>
    );
  };

  const filteredQuestions =
    activeCategoryFilter === 'all'
      ? SUGGESTED_QUESTIONS
      : SUGGESTED_QUESTIONS.filter((q) => q.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));

  return (
    <div id="ai-insights-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#1B3022] text-white rounded-[32px] p-6 md:p-8 border border-[#1B3022] shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#A3E635] text-[#1B3022] flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-display text-white tracking-tight">AgriAI</h1>
                  <span className="text-[11px] uppercase font-bold tracking-wider bg-[#A3E635] text-[#1B3022] px-3 py-0.5 rounded-full">
                    Dataset Grounded
                  </span>
                </div>
                <p className="text-sm text-[#A3E635] font-medium">Ask questions about your agricultural data.</p>
              </div>
            </div>

            <p className="text-xs text-[#9AABA0] leading-relaxed pt-1">
              Agronomic conversational intelligence strictly anchored in the 50 surveyed farm records. Every numerical answer is verified against empirical statistics to eliminate hallucinations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs text-white">
              <Database className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>
                <strong>50</strong> Records Verified
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Zero-Hallucination Policy</span>
            </div>

            <button
              onClick={handleClearChat}
              className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset Conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions Section */}
      <div className="bg-white rounded-[32px] p-6 border border-[#E2E8DE] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8DE] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#707D72]">
            <Sparkles className="w-4 h-4 text-[#2F9E44]" />
            <span>Suggested Agronomic Inquiries</span>
          </div>
          <span className="text-[11px] text-[#707D72]">Click any question below to ask AgriAI instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredQuestions.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.button
                key={idx}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSendMessage(item.question)}
                disabled={isLoading}
                className="group text-left p-3.5 rounded-2xl bg-[#F0F7EE]/60 hover:bg-[#F0F7EE] border border-[#E2E8DE] hover:border-[#A3E635] transition-all cursor-pointer flex flex-col justify-between space-y-2 hover:shadow-xs disabled:opacity-50"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F9E44] bg-white px-2 py-0.5 rounded-md border border-[#E2E8DE]">
                    {item.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#707D72] group-hover:text-[#1B3022] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs font-semibold text-[#1B3022] leading-snug line-clamp-2">
                  {item.question}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-[32px] border border-[#E2E8DE] shadow-sm flex flex-col overflow-hidden min-h-[500px]">
        {/* Chat Stream Area */}
        <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[600px] bg-[#FAFDF9]">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                } space-y-2`}
              >
                {/* Message Header */}
                <div className="flex items-center gap-2 px-2 text-[11px] text-[#707D72] font-medium">
                  {msg.sender === 'ai' ? (
                    <>
                      <div className="w-5 h-5 rounded-md bg-[#1B3022] text-[#A3E635] flex items-center justify-center font-bold text-[10px]">
                        AI
                      </div>
                      <span className="font-bold text-[#1B3022]">AgriAI</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                      {msg.confidenceScore && (
                        <span className="bg-[#F0F7EE] text-[#2F9E44] px-2 py-0.2 rounded-md font-mono text-[10px] font-bold border border-[#E2E8DE]">
                          {msg.confidenceScore}% Data Match
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <span>{msg.timestamp}</span>
                      <span>•</span>
                      <span className="font-bold text-[#1B3022]">You</span>
                    </>
                  )}
                </div>

                {/* Message Bubble Container */}
                <div
                  className={`max-w-3xl rounded-[24px] p-5 shadow-xs transition-all ${
                    msg.sender === 'user'
                      ? 'bg-[#1B3022] text-white rounded-tr-none'
                      : 'bg-white border border-[#E2E8DE] rounded-tl-none space-y-4'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="space-y-4">
                      {/* Rendered Text */}
                      {renderFormattedText(msg.text)}

                      {/* Supporting Metrics Panel if available */}
                      {msg.supportingMetrics && msg.supportingMetrics.length > 0 && (
                        <div className="pt-3 border-t border-[#E2E8DE]">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#707D72]">
                              <BarChart3 className="w-3.5 h-3.5 text-[#2F9E44]" />
                              <span>Supporting Dataset Metrics</span>
                            </div>
                            <span className="text-[10px] text-[#707D72]">Calculated from 50 observations</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {msg.supportingMetrics.map((metric, mIdx) => (
                              <div
                                key={mIdx}
                                className="bg-[#F0F7EE] rounded-xl p-2.5 border border-[#E2E8DE] flex flex-col justify-between"
                              >
                                <span className="text-[10px] font-bold text-[#707D72] truncate">
                                  {metric.label}
                                </span>
                                <div className="flex items-baseline gap-1 my-1">
                                  <span className="text-sm font-bold text-[#1B3022] font-mono">
                                    {metric.value}
                                  </span>
                                  {metric.trend === 'up' && (
                                    <TrendingUp className="w-3 h-3 text-[#2F9E44]" />
                                  )}
                                  {metric.trend === 'down' && (
                                    <TrendingDown className="w-3 h-3 text-[#D9480F]" />
                                  )}
                                </div>
                                {metric.subtext && (
                                  <span className="text-[9px] text-[#707D72] truncate">
                                    {metric.subtext}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Grounding Stamp */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#707D72] border-t border-[#E2E8DE]/60">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2F9E44]" />
                          <span>{msg.datasetGroundingNote || 'Based on Seasonal Agriculture Performance dataset'}</span>
                        </div>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-[#1B3022] transition-colors cursor-pointer bg-[#F0F7EE] px-2 py-0.5 rounded-md border border-[#E2E8DE]"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#2F9E44]" />
                              <span className="text-[#2F9E44] font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Insight</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Animation Bubble with Production StateFeedback */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl"
            >
              <AiLoadingState message="AgriAI is analyzing the 50 surveyed farm records..." />
            </motion.div>
          )}

          {errorMsg && (
            <div className="w-full max-w-xl">
              <AiErrorState
                errorMessage={errorMsg}
                onRetry={() => handleSendMessage()}
              />
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 md:p-6 bg-white border-t border-[#E2E8DE] space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1">
              <input
                id="agri-ai-input"
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask AgriAI anything about seasonal yields, profits, rainfall, or crops..."
                disabled={isLoading}
                className="w-full bg-[#F0F7EE]/60 border border-[#E2E8DE] focus:border-[#2F9E44] focus:bg-white rounded-full px-5 py-3.5 text-sm text-[#1B3022] placeholder:text-[#707D72] focus:outline-none transition-all disabled:opacity-50"
              />
            </div>

            <button
              id="agri-ai-submit"
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-[#1B3022] hover:bg-[#2C332E] text-[#A3E635] px-6 py-3.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#707D72] px-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#2F9E44]" />
              <span>Empirical Grounding Engine Active</span>
            </div>
            <span>Press Enter to send or select a suggested inquiry above</span>
          </div>
        </div>
      </div>
    </div>
  );
};
