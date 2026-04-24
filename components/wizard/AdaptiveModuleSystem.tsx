'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

import { AdaptivePanel } from './AdaptivePanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Sparkles, 
  Target, 
  Zap, 
  TrendingUp, 
  Video, 
  Settings,
  Gauge,
  Activity,
  Crosshair,
  Lightbulb
} from 'lucide-react';

type Context = {
  game?: string;
  step?: number;
  benchmarkScore?: number;
  skillLevel?: string;
  hasBenchmark?: boolean;
  isProUser?: boolean;
};

type ModuleConfig = {
  id: string;
  name: string;
  icon: React.ElementType;
  conditions: (ctx: Context) => boolean;
  component: React.ComponentType<any>;
};

const modules: ModuleConfig[] = [
  {
    id: 'adaptive-tuning',
    name: 'Adaptive Tuning',
    icon: Sparkles,
    conditions: (ctx) => ctx.step === 1 && (ctx.game === 'valorant' || ctx.game === 'cs2'),
    component: AdaptivePanel,
  },
  {
    id: 'video-learning',
    name: 'Learning Videos',
    icon: Video,
    conditions: (ctx) => (ctx.hasBenchmark === true) && ((ctx.benchmarkScore || 0) > 0) && ((ctx.benchmarkScore || 0) < 60),
    component: () => (
      <Card variant="bordered">
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-[var(--app-accent)]" />
          <span className="text-sm font-medium text-[var(--app-text-primary)]">Recommended Learning</span>
        </div>
        <p className="text-xs text-[var(--app-text-secondary)]">Based on your benchmark performance, we've curated specific training videos.</p>
      </Card>
    ),
  },
  {
    id: 'skill-insights',
    name: 'Skill Insights',
    icon: Lightbulb,
    conditions: (ctx) => (ctx.step || 0) >= 3,
    component: () => (
      <Card variant="glow">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-[var(--app-text-primary)]">Skill Insights</span>
        </div>
        <p className="text-xs text-[var(--app-text-secondary)]">Your training focus should be on micro-adjustments and crosshair placement.</p>
      </Card>
    ),
  },
  {
    id: 'progress-dashboard',
    name: 'Progress Tracker',
    icon: TrendingUp,
    conditions: (ctx) => (ctx.step || 0) >= 4,
    component: () => (
      <Card variant="bordered">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-[var(--app-text-primary)]">Weekly Progress</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--app-text-secondary)]">Tracking</span>
            <span className="text-green-400">+5%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--app-text-secondary)]">Flicking</span>
            <span className="text-green-400">+3%</span>
          </div>
        </div>
      </Card>
    ),
  },
  {
    id: 'warmup-suggestions',
    name: 'Warmup Routine',
    icon: Zap,
    conditions: (ctx) => (ctx.step || 0) >= 1,
    component: () => (
      <Card variant="bordered">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-[var(--app-text-primary)]">Today's Warmup</span>
        </div>
        <div className="space-y-2 text-xs text-[var(--app-text-secondary)]">
          <p>• 3 min Smooth Tracking (Easy)</p>
          <p>• 3 min Reflexshot (Medium)</p>
          <p>• 3 min Gridshot Ultimate</p>
        </div>
      </Card>
    ),
  },
  {
    id: 'advanced-settings',
    name: 'Advanced Settings',
    icon: Settings,
    conditions: (ctx) => ctx.step === 1 && (ctx.isProUser === true),
    component: () => (
      <Card variant="bordered">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-[var(--app-accent)]" />
          <span className="text-sm font-medium text-[var(--app-text-primary)]">Advanced Options</span>
        </div>
        <div className="space-y-2">
          <Button variant="secondary" className="w-full text-xs">Mouse Acceleration</Button>
          <Button variant="secondary" className="w-full text-xs">Raw Input Override</Button>
        </div>
      </Card>
    ),
  },
];

interface AdaptiveModuleSystemProps {
  children?: React.ReactNode;
}

export function AdaptiveModuleSystem({ children, ...context }: AdaptiveModuleSystemProps & Context) {
  const { data: session } = useSession();
  
  const activeModules = useMemo(() => {
    const ctx = { 
      ...context, 
      isProUser: !!session?.user?.id 
    };
    return modules.filter(m => m.conditions(ctx));
  }, [context, session]);

  if (activeModules.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {activeModules.map((module) => {
          const Icon = module.icon;
          const Component = module.component;
          
          return (
            <motion.div
              key={module.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Component />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export function useAdaptiveModules(context: Context) {
  const { data: session } = useSession();
  
  return useMemo(() => {
    const ctx = { ...context, isProUser: !!session?.user?.id };
    return modules.filter(m => m.conditions(ctx));
  }, [context, session]);
}

export { modules };
export type { ModuleConfig, Context };