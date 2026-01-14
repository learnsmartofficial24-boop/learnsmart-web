'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, BookOpen, MessageSquare, Target, Zap, Award, Clock } from 'lucide-react';
import { StudySession } from '@/lib/types';

interface ActivityFeedProps {
  sessions: StudySession[];
  className?: string;
}

interface Activity {
  id: string;
  type: 'quiz' | 'concept' | 'achievement' | 'chat' | 'study';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: {
    score?: number;
    concepts?: string[];
    xp?: number;
    streak?: number;
    icon?: React.ReactNode;
  };
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'quiz':
      return <Target className="w-5 h-5 text-white" />;
    case 'concept':
      return <BookOpen className="w-5 h-5 text-white" />;
    case 'achievement':
      return <Trophy className="w-5 h-5 text-white" />;
    case 'chat':
      return <MessageSquare className="w-5 h-5 text-white" />;
    case 'study':
      return <Clock className="w-5 h-5 text-white" />;
    default:
      return <Zap className="w-5 h-5 text-white" />;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'quiz':
      return 'bg-[var(--primary)]';
    case 'concept':
      return 'bg-[var(--success)]';
    case 'achievement':
      return 'bg-[var(--warning)]';
    case 'chat':
      return 'bg-[var(--primary)]';
    case 'study':
      return 'bg-[var(--primary)]';
    default:
      return 'bg-[var(--primary)]';
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function ActivityFeed({ sessions, className = '' }: ActivityFeedProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[var(--muted-foreground)]">
            <Clock className="w-12 h-12 mx-auto mb-4 text-[var(--border)]" />
            <p>No recent activity</p>
            <p className="text-sm mt-2">Your learning activities will appear here once you start studying!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate activities from study sessions
  const activities: Activity[] = sessions.flatMap((session) => {
    const activitiesList: Activity[] = [];
    
    // Main study session activity
    activitiesList.push({
      id: `session-${session.id}`,
      type: 'study',
      title: session.quizTaken ? 'Study + Quiz Session' : 'Study Session',
      description: session.quizTaken 
        ? `Studied for ${formatDuration(session.duration)} and took a quiz` 
        : `Studied for ${formatDuration(session.duration)}`,
      timestamp: session.date,
      metadata: {
        duration: session.duration,
        xp: session.xpEarned,
        accuracy: session.accuracy,
        concepts: session.conceptsStudied
      }
    });
    
    // If quiz was taken, add quiz activity
    if (session.quizTaken && session.accuracy !== undefined) {
      activitiesList.push({
        id: `quiz-${session.id}`,
        type: 'quiz',
        title: 'Quiz Completed',
        description: `${Math.round(session.accuracy)}% accuracy earned`,
        timestamp: session.date,
        metadata: {
          score: session.accuracy,
          xp: session.xpEarned
        }
      });
    }
    
    // Add concept completion activities for each concept studied
    if (session.conceptsStudied && session.conceptsStudied.length > 0) {
      session.conceptsStudied.forEach((concept, index) => {
        activitiesList.push({
          id: `concept-${session.id}-${concept}-${index}`,
          type: 'concept',
          title: 'Concept Studied',
          description: concept,
          timestamp: new Date(session.date.getTime() + index * 60000), // Spread out by minute
          metadata: {
            concepts: [concept]
          }
        });
      });
    }
    
    return activitiesList;
  });

  // Add achievement activities for streaks and milestones
  const recentSessionDates = new Set(
    sessions.filter(s => s.date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .map(s => s.date.toDateString())
  );
  
  // Calculate current streak
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (recentSessionDates.has(today) || recentSessionDates.has(yesterday)) {
    let checkDate = new Date(recentSessionDates.has(today) ? today : yesterday);
    while (recentSessionDates.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }
  
  // Add streak achievement
  if (streak >= 7) {
    activities.push({
      id: `streak-${streak}`,
      type: 'achievement',
      title: streak >= 30 ? '30-Day Streak!' : streak >= 14 ? '14-Day Streak!' : '7-Day Streak!',
      description: `${streak} consecutive days of studying`,
      timestamp: new Date(),
      metadata: {
        streak,
        icon: <Zap className="w-5 h-5 text-white" />
      }
    });
  }
  
  // Sort activities by timestamp (newest first)
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const dateKey = activity.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);
  
  // Sort date groups
  const sortedDateGroups = Object.entries(groupedActivities)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDateGroups.map(([date, dayActivities]) => {
            const dateObj = new Date(date);
            const isToday = date === new Date().toDateString();
            const isYesterday = date === new Date(Date.now() - 86400000).toDateString();
            
            const dateLabel = isToday ? 'Today' : 
                            isYesterday ? 'Yesterday' : 
                            dateObj.toLocaleDateString();
            
            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-sm font-medium text-[var(--foreground)]">
                    {dateLabel}
                  </h4>
                  <div className="flex-1 h-px bg-[var(--border)]"></div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {dayActivities.length} activity{dayActivities.length !== 1 ? 'ies' : ''}
                  </span>
                </div>
                
                <div className="space-y-3 pl-4">
                  {dayActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start gap-3 p-3 bg-[var(--background)] rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {activity.metadata?.icon || getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              {activity.title}
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)] mt-1">
                              {activity.description}
                            </p>
                            
                            {activity.metadata && (
                              <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-foreground)]">
                                {activity.metadata.score !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    {Math.round(activity.metadata.score)}%
                                  </span>
                                )}
                                
                                {activity.metadata.xp && activity.metadata.xp > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-yellow-500" />
                                    +{activity.metadata.xp} XP
                                  </span>
                                )}
                                
                                {activity.metadata.duration && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(activity.metadata.duration as number)}
                                  </span>
                                )}
                                
                                {activity.metadata.streak && (
                                  <span className="flex items-center gap-1 font-medium text-[var(--primary)]">
                                    <Zap className="w-3 h-3" />
                                    {activity.metadata.streak} days
                                  </span>
                                )}
                                
                                {activity.metadata.concepts && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {activity.metadata.concepts.length} concept{activity.metadata.concepts.length !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 text-xs text-[var(--muted-foreground)]">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)]">No activities to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}