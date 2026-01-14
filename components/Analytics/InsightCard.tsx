'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Insight } from '@/lib/types';
import { 
  Lightbulb, 
  AlertCircle, 
  Trophy, 
  Target,
  Zap,
  Star,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  Rocket
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InsightCardProps {
  insight: Insight;
  className?: string;
}

const getInsightStyles = (type: Insight['type']) => {
  switch (type) {
    case 'highlight':
      return {
        icon: Trophy,
        iconColor: 'text-white',
        bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-300',
        accentColor: 'text-blue-600 dark:text-blue-400',
        buttonVariant: 'primary' as const
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        iconColor: 'text-white',
        bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        accentColor: 'text-yellow-600 dark:text-yellow-400',
        buttonVariant: 'secondary' as const
      };
    case 'encouragement':
      return {
        icon: Star,
        iconColor: 'text-white',
        bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-300',
        accentColor: 'text-green-600 dark:text-green-400',
        buttonVariant: 'primary' as const
      };
    case 'recommendation':
      return {
        icon: Rocket,
        iconColor: 'text-white',
        bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
        borderColor: 'border-purple-200 dark:border-purple-800',
        textColor: 'text-purple-700 dark:text-purple-300',
        accentColor: 'text-purple-600 dark:text-purple-400',
        buttonVariant: 'primary' as const
      };
    default:
      return {
        icon: Lightbulb,
        iconColor: 'text-white',
        bgColor: 'bg-gradient-to-br from-gray-500 to-gray-600',
        borderColor: 'border-gray-200 dark:border-gray-800',
        textColor: 'text-gray-700 dark:text-gray-300',
        accentColor: 'text-gray-600 dark:text-gray-400',
        buttonVariant: 'primary' as const
      };
  }
};

const getActionIcon = (type: Insight['action']['type']) => {
  switch (type) {
    case 'concept':
      return BookOpen;
    case 'quiz':
      return Target;
    case 'study':
      return TrendingUp;
    default:
      return Zap;
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export function InsightCard({ insight, className = '' }: InsightCardProps) {
  const router = useRouter();
  const styles = getInsightStyles(insight.type);
  const ActionIcon = insight.action ? getActionIcon(insight.action.type) : Zap;

  const handleAction = () => {
    if (insight.action) {
      router.push(insight.action.target);
    }
  };

  return (
    <Card 
      className={`
        overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]
        border ${styles.borderColor} ${className}
      `}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-6">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${styles.bgColor}`}>
            <styles.icon className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          
          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className={`font-semibold ${styles.accentColor}`}>
                    {insight.title}
                  </h4>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {formatTimeAgo(insight.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-[var(--foreground)] leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
            
            {insight.action && (
              <Button
                variant={styles.buttonVariant}
                size="sm"
                onClick={handleAction}
                className="group"
              >
                <ActionIcon className="w-4 h-4 mr-2" />
                {insight.action.label}
                <div className="ml-2 transform transition-transform group-hover:translate-x-1">
                  →
                </div>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface InsightsPanelProps {
  insights: Insight[];
  className?: string;
  title?: string;
}

export function InsightsPanel({ insights, className = '', title = 'AI Insights' }: InsightsPanelProps) {
  if (!insights || insights.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-[var(--border)]" />
            <p>Analysis in progress...</p>
            <p className="text-sm mt-2">Check back soon for personalized insights!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highlightInsights = insights.filter(i => i.type === 'highlight');
  const warningInsights = insights.filter(i => i.type === 'warning');
  const recommendationInsights = insights.filter(i => i.type === 'recommendation');
  const encouragementInsights = insights.filter(i => i.type === 'encouragement');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[var(--primary)]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* High Priority Insights */}
          {[...warningInsights, ...recommendationInsights].map((insight) => (
            <InsightCard 
              key={insight.id} 
              insight={insight}
              className="border-2"
            />
          ))}
          
          {/* Encouragement Insights */}
          {encouragementInsights.map((insight) => (
            <InsightCard 
              key={insight.id} 
              insight={insight}
            />
          ))}
          
          {/* Highlight Insights */}
          {highlightInsights.map((insight) => (
            <InsightCard 
              key={insight.id} 
              insight={insight}
            />
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] text-center">
            Insights based on your learning activity and performance
          </p>
        </div>
      </CardContent>
    </Card>
  );
}