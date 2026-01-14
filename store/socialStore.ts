import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  StudyGroup,
  GroupMembership,
  Achievement,
  UserAchievement,
  LeaderboardEntry,
  Streak,
  SocialConnection,
  Post,
  Comment,
  Notification,
  LeaderboardFilter,
  GroupMessage,
  FriendActivity,
  SocialStats,
  GroupAnalytics
} from '../lib/types';
import { ACHIEVEMENTS, getAchievements, checkAndUnlockAchievements, getUserAchievements } from '../lib/achievements';

interface SocialState {
  // User Profiles
  profiles: { [userId: string]: UserProfile };
  currentProfile: UserProfile | null;
  
  // Social Connections
  connections: SocialConnection[];
  followers: { [userId: string]: string[] }; // userId -> followerIds
  following: { [userId: string]: string[] }; // userId -> followingIds
  
  // Study Groups
  groups: { [groupId: string]: StudyGroup };
  groupMemberships: GroupMembership[];
  groupMessages: { [groupId: string]: GroupMessage[] };
  
  // Achievements
  userAchievements: UserAchievement[];
  availableAchievements: Achievement[];
  
  // Leaderboards
  leaderboards: { [filterKey: string]: LeaderboardEntry[] };
  myRank: { [filterKey: string]: LeaderboardEntry | null };
  
  // Social Feed
  posts: Post[];
  friendActivity: FriendActivity[];
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Analytics
  socialStats: SocialStats | null;
  groupAnalytics: { [groupId: string]: GroupAnalytics };
  
  // UI State
  selectedGroup: string | null;
  leaderboardFilter: LeaderboardFilter;
  loading: {
    profiles: boolean;
    groups: boolean;
    leaderboards: boolean;
    achievements: boolean;
  };
}

interface SocialActions {
  // Profile Actions
  updateProfile: (userId: string, profileData: Partial<UserProfile>) => void;
  getProfile: (userId: string) => UserProfile | null;
  setCurrentProfile: (profile: UserProfile | null) => void;
  createProfile: (userData: Partial<UserProfile>) => string;
  
  // Social Connection Actions
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  getFollowers: (userId: string) => string[];
  getFollowing: (userId: string) => string[];
  getFollowerCount: (userId: string) => number;
  getFollowingCount: (userId: string) => number;
  
  // Group Actions
  createGroup: (groupData: Partial<StudyGroup>) => string;
  joinGroup: (groupId: string, userId: string) => void;
  leaveGroup: (groupId: string, userId: string) => void;
  updateGroup: (groupId: string, groupData: Partial<StudyGroup>) => void;
  getGroup: (groupId: string) => StudyGroup | null;
  getUserGroups: (userId: string) => StudyGroup[];
  searchGroups: (query: string) => StudyGroup[];
  
  // Group Messages
  sendGroupMessage: (groupId: string, userId: string, content: string) => void;
  getGroupMessages: (groupId: string) => GroupMessage[];
  deleteGroupMessage: (groupId: string, messageId: string, userId: string) => void;
  
  // Achievement Actions
  unlockAchievement: (userId: string, achievementId: string) => void;
  getUserAchievements: (userId: string) => (UserAchievement & { achievement: Achievement })[];
  getAvailableAchievements: () => Achievement[];
  checkAchievements: (userId: string) => UserAchievement[];
  
  // Leaderboard Actions
  updateLeaderboard: (filter: LeaderboardFilter, entries: LeaderboardEntry[]) => void;
  getLeaderboard: (filter: LeaderboardFilter) => LeaderboardEntry[];
  getMyRank: (filter: LeaderboardFilter) => LeaderboardEntry | null;
  
  // Social Feed Actions
  createPost: (userId: string, content: string, groupId?: string) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, userId: string, content: string, parentId?: string) => void;
  getPosts: (userId?: string, groupId?: string) => Post[];
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  
  // Analytics Actions
  updateSocialStats: (stats: SocialStats) => void;
  updateGroupAnalytics: (groupId: string, analytics: GroupAnalytics) => void;
  getSocialStats: () => SocialStats | null;
  
  // Utility Actions
  clearSocialData: () => void;
  exportSocialData: () => string;
  importSocialData: (data: string) => void;
  
  // UI Actions
  setSelectedGroup: (groupId: string | null) => void;
  setLeaderboardFilter: (filter: LeaderboardFilter) => void;
  setLoading: (key: keyof SocialState['loading'], value: boolean) => void;
}

type SocialStore = SocialState & SocialActions;

// Sample data for demonstration
const sampleProfiles: { [key: string]: UserProfile } = {
  'user1': {
    id: 'user1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    class: 10,
    stream: 'science',
    specialization: 'pcm',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    theme: 'light',
    createdAt: new Date('2024-01-15'),
    bio: 'Physics enthusiast and math lover! 🚀',
    joinDate: new Date('2024-01-15'),
    lastActive: new Date(),
    totalXP: 2450,
    currentLevel: 12,
    currentStreak: 25,
    longestStreak: 45,
    totalQuizzes: 87,
    totalConcepts: 156,
    totalStudyTime: 2340, // minutes
    averageQuizScore: 87.5,
    favoriteSubject: 'Physics',
    achievementsCount: 8,
    followersCount: 23,
    followingCount: 18,
    groupsCount: 3,
    privacy: {
      showProfile: true,
      showProgress: true,
      showAchievements: true,
      showStats: true
    }
  },
  'user2': {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    class: 11,
    stream: 'science',
    specialization: 'pcb',
    subjects: ['Biology', 'Chemistry', 'Physics'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    theme: 'dark',
    createdAt: new Date('2024-02-01'),
    bio: 'Future doctor 🩺 | Biology nerd | Coffee addict',
    joinDate: new Date('2024-02-01'),
    lastActive: new Date(),
    totalXP: 3200,
    currentLevel: 16,
    currentStreak: 12,
    longestStreak: 38,
    totalQuizzes: 124,
    totalConcepts: 203,
    totalStudyTime: 3100,
    averageQuizScore: 91.2,
    favoriteSubject: 'Biology',
    achievementsCount: 12,
    followersCount: 45,
    followingCount: 32,
    groupsCount: 5,
    privacy: {
      showProfile: true,
      showProgress: true,
      showAchievements: true,
      showStats: true
    }
  }
};

const sampleGroups: { [key: string]: StudyGroup } = {
  'group1': {
    id: 'group1',
    name: 'Physics Champions',
    description: 'For all physics enthusiasts to discuss concepts, solve problems together!',
    type: 'study',
    subject: 'Physics',
    class: 10,
    isPrivate: false,
    memberIds: ['user1', 'user2', 'user3', 'user4'],
    adminIds: ['user1'],
    moderatorIds: ['user2'],
    rules: ['Be respectful to all members', 'No spam or irrelevant content', 'Help each other learn'],
    createdAt: new Date('2024-01-20'),
    lastActivity: new Date(),
    totalXP: 12400,
    achievementsCount: 15,
    postCount: 89,
    tags: ['Physics', 'Problem Solving', 'Exam Prep'],
    memberCount: 4
  },
  'group2': {
    id: 'group2',
    name: 'Math Wizards',
    description: 'Master mathematics together! From algebra to calculus.',
    type: 'study',
    subject: 'Mathematics',
    class: 11,
    isPrivate: false,
    memberIds: ['user1', 'user5', 'user6'],
    adminIds: ['user5'],
    moderatorIds: [],
    rules: ['Share solutions with explanations', 'Encourage each other', 'Practice daily'],
    createdAt: new Date('2024-02-10'),
    lastActivity: new Date(),
    totalXP: 8900,
    achievementsCount: 8,
    postCount: 56,
    tags: ['Mathematics', 'Calculus', 'Algebra'],
    memberCount: 3
  }
};

const initialState: SocialState = {
  profiles: sampleProfiles,
  currentProfile: null,
  connections: [],
  followers: { user1: ['user2', 'user3'], user2: ['user1', 'user4'] },
  following: { user1: ['user2', 'user4'], user2: ['user1'] },
  groups: sampleGroups,
  groupMemberships: [
    {
      userId: 'user1',
      groupId: 'group1',
      role: 'admin',
      joinedAt: new Date('2024-01-20'),
      lastActive: new Date(),
      contributionScore: 3400,
      postsCount: 23,
      achievementsCount: 4
    },
    {
      userId: 'user2',
      groupId: 'group1',
      role: 'moderator',
      joinedAt: new Date('2024-01-25'),
      lastActive: new Date(),
      contributionScore: 2800,
      postsCount: 18,
      achievementsCount: 3
    }
  ],
  groupMessages: {
    group1: [
      {
        id: 'msg1',
        groupId: 'group1',
        userId: 'user1',
        content: 'Welcome everyone! Let\'s make this the best physics study group! 🚀',
        type: 'text',
        mentions: [],
        reactions: { '👍': ['user2'], '🎉': ['user3'] },
        createdAt: new Date('2024-01-20T10:00:00Z')
      },
      {
        id: 'msg2',
        groupId: 'group1',
        userId: 'user2',
        content: 'Thanks for creating this group! Looking forward to learning together.',
        type: 'text',
        mentions: [],
        reactions: { '❤️': ['user1'] },
        createdAt: new Date('2024-01-20T10:15:00Z')
      }
    ]
  },
  userAchievements: [
    {
      userId: 'user1',
      achievementId: 'first-concept',
      earnedAt: new Date('2024-01-16'),
      progress: 100
    },
    {
      userId: 'user1',
      achievementId: 'dedicated',
      earnedAt: new Date('2024-01-22'),
      progress: 100
    }
  ],
  availableAchievements: getAchievements(),
  leaderboards: {},
  myRank: {},
  posts: [
    {
      id: 'post1',
      userId: 'user1',
      content: 'Just unlocked the "Century Club" achievement! 🎉 100 XP milestone reached!',
      type: 'achievement',
      likes: ['user2', 'user3'],
      comments: [],
      createdAt: new Date('2024-01-22T14:30:00Z'),
      visibility: 'public'
    }
  ],
  friendActivity: [
    {
      userId: 'user2',
      activity: {
        type: 'achievement_unlocked',
        description: 'Unlocked "Quiz Expert" achievement!',
        timestamp: new Date('2024-01-22T16:45:00Z')
      }
    }
  ],
  notifications: [
    {
      id: 'notif1',
      userId: 'user1',
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "Century Club" badge!',
      data: { achievementId: 'century-club' },
      isRead: false,
      createdAt: new Date('2024-01-22T14:30:00Z'),
      actionUrl: '/profile/me/achievements'
    }
  ],
  unreadCount: 1,
  socialStats: {
    totalUsers: 1247,
    activeUsers24h: 156,
    totalGroups: 89,
    totalAchievements: 18,
    averageStreak: 8.5,
    topSubjects: [
      { subject: 'Mathematics', count: 423 },
      { subject: 'Physics', count: 389 },
      { subject: 'Chemistry', count: 356 },
      { subject: 'Biology', count: 234 }
    ],
    newUsersThisWeek: 23
  },
  groupAnalytics: {
    group1: {
      groupId: 'group1',
      memberCount: 4,
      activeMembers7d: 3,
      averageActivity: 8.5,
      topPerformers: ['user1', 'user2'],
      groupXP: 12400,
      achievementsUnlocked: 15,
      messagesCount: 89,
      joinRate: 1.2
    }
  },
  selectedGroup: null,
  leaderboardFilter: {
    type: 'global',
    timePeriod: 'week',
    metric: 'xp'
  },
  loading: {
    profiles: false,
    groups: false,
    leaderboards: false,
    achievements: false
  }
};

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Profile Actions
      updateProfile: (userId, profileData) => {
        set((state) => ({
          profiles: {
            ...state.profiles,
            [userId]: { ...state.profiles[userId], ...profileData }
          }
        }));
      },

      getProfile: (userId) => {
        const state = get();
        return state.profiles[userId] || null;
      },

      setCurrentProfile: (profile) => {
        set({ currentProfile: profile });
      },

      createProfile: (userData) => {
        const userId = `user_${Date.now()}`;
        const newProfile: UserProfile = {
          id: userId,
          name: userData.name || '',
          email: userData.email || '',
          class: userData.class || 9,
          stream: userData.stream,
          specialization: userData.specialization,
          subjects: userData.subjects || [],
          avatar: userData.avatar,
          theme: userData.theme || 'light',
          createdAt: new Date(),
          bio: userData.bio,
          joinDate: new Date(),
          lastActive: new Date(),
          totalXP: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalQuizzes: 0,
          totalConcepts: 0,
          totalStudyTime: 0,
          averageQuizScore: 0,
          achievementsCount: 0,
          followersCount: 0,
          followingCount: 0,
          groupsCount: 0,
          privacy: {
            showProfile: true,
            showProgress: true,
            showAchievements: true,
            showStats: true
          },
          ...userData
        };

        set((state) => ({
          profiles: { ...state.profiles, [userId]: newProfile }
        }));

        return userId;
      },

      // Social Connection Actions
      followUser: (userId) => {
        const currentUserId = get().currentProfile?.id;
        if (!currentUserId || currentUserId === userId) return;

        const connection: SocialConnection = {
          id: `conn_${Date.now()}`,
          followerId: currentUserId,
          followingId: userId,
          createdAt: new Date(),
          status: 'active'
        };

        set((state) => ({
          connections: [...state.connections, connection],
          followers: {
            ...state.followers,
            [userId]: [...(state.followers[userId] || []), currentUserId]
          },
          following: {
            ...state.following,
            [currentUserId]: [...(state.following[currentUserId] || []), userId]
          }
        }));

        // Update follower counts
        get().updateProfile(userId, {
          followersCount: (get().getFollowerCount(userId))
        });
        get().updateProfile(currentUserId, {
          followingCount: (get().getFollowingCount(currentUserId))
        });
      },

      unfollowUser: (userId) => {
        const currentUserId = get().currentProfile?.id;
        if (!currentUserId) return;

        set((state) => ({
          connections: state.connections.filter(
            conn => !(conn.followerId === currentUserId && conn.followingId === userId)
          ),
          followers: {
            ...state.followers,
            [userId]: (state.followers[userId] || []).filter(id => id !== currentUserId)
          },
          following: {
            ...state.following,
            [currentUserId]: (state.following[currentUserId] || []).filter(id => id !== userId)
          }
        }));

        // Update follower counts
        get().updateProfile(userId, {
          followersCount: (get().getFollowerCount(userId))
        });
        get().updateProfile(currentUserId, {
          followingCount: (get().getFollowingCount(currentUserId))
        });
      },

      getFollowers: (userId) => {
        const state = get();
        return state.followers[userId] || [];
      },

      getFollowing: (userId) => {
        const state = get();
        return state.following[userId] || [];
      },

      getFollowerCount: (userId) => {
        return get().getFollowers(userId).length;
      },

      getFollowingCount: (userId) => {
        return get().getFollowing(userId).length;
      },

      // Group Actions
      createGroup: (groupData) => {
        const groupId = `group_${Date.now()}`;
        const currentUserId = get().currentProfile?.id;
        if (!currentUserId) throw new Error('No current user');

        const newGroup: StudyGroup = {
          id: groupId,
          name: groupData.name || '',
          description: groupData.description || '',
          type: groupData.type || 'study',
          subject: groupData.subject,
          class: groupData.class,
          isPrivate: groupData.isPrivate || false,
          memberIds: [currentUserId],
          adminIds: [currentUserId],
          moderatorIds: [],
          rules: groupData.rules || [],
          createdAt: new Date(),
          lastActivity: new Date(),
          totalXP: 0,
          achievementsCount: 0,
          postCount: 0,
          tags: groupData.tags || [],
          memberCount: 1,
          ...groupData
        };

        const membership: GroupMembership = {
          userId: currentUserId,
          groupId,
          role: 'owner',
          joinedAt: new Date(),
          lastActive: new Date(),
          contributionScore: 0,
          postsCount: 0,
          achievementsCount: 0
        };

        set((state) => ({
          groups: { ...state.groups, [groupId]: newGroup },
          groupMemberships: [...state.groupMemberships, membership]
        }));

        // Update user's group count
        get().updateProfile(currentUserId, {
          groupsCount: (get().getUserGroups(currentUserId).length)
        });

        return groupId;
      },

      joinGroup: (groupId, userId) => {
        const group = get().groups[groupId];
        if (!group || group.memberIds.includes(userId)) return;

        const membership: GroupMembership = {
          userId,
          groupId,
          role: 'member',
          joinedAt: new Date(),
          lastActive: new Date(),
          contributionScore: 0,
          postsCount: 0,
          achievementsCount: 0
        };

        set((state) => ({
          groups: {
            ...state.groups,
            [groupId]: {
              ...group,
              memberIds: [...group.memberIds, userId],
              memberCount: group.memberCount + 1,
              lastActivity: new Date()
            }
          },
          groupMemberships: [...state.groupMemberships, membership]
        }));

        // Update user's group count
        get().updateProfile(userId, {
          groupsCount: (get().getUserGroups(userId).length)
        });
      },

      leaveGroup: (groupId, userId) => {
        const group = get().groups[groupId];
        if (!group) return;

        const isAdmin = group.adminIds.includes(userId);
        const isModerator = group.moderatorIds.includes(userId);

        set((state) => ({
          groups: {
            ...state.groups,
            [groupId]: {
              ...group,
              memberIds: group.memberIds.filter(id => id !== userId),
              adminIds: isAdmin ? group.adminIds.filter(id => id !== userId) : group.adminIds,
              moderatorIds: isModerator ? group.moderatorIds.filter(id => id !== userId) : group.moderatorIds,
              memberCount: Math.max(0, group.memberCount - 1)
            }
          },
          groupMemberships: state.groupMemberships.filter(
            membership => !(membership.userId === userId && membership.groupId === groupId)
          )
        }));

        // Update user's group count
        get().updateProfile(userId, {
          groupsCount: (get().getUserGroups(userId).length)
        });
      },

      updateGroup: (groupId, groupData) => {
        set((state) => ({
          groups: {
            ...state.groups,
            [groupId]: { ...state.groups[groupId], ...groupData }
          }
        }));
      },

      getGroup: (groupId) => {
        const state = get();
        return state.groups[groupId] || null;
      },

      getUserGroups: (userId) => {
        const state = get();
        return Object.values(state.groups).filter(group => 
          group.memberIds.includes(userId)
        );
      },

      searchGroups: (query) => {
        const state = get();
        const searchTerm = query.toLowerCase();
        return Object.values(state.groups).filter(group =>
          group.name.toLowerCase().includes(searchTerm) ||
          group.description.toLowerCase().includes(searchTerm) ||
          group.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      },

      // Group Messages
      sendGroupMessage: (groupId, userId, content) => {
        const message: GroupMessage = {
          id: `msg_${Date.now()}`,
          groupId,
          userId,
          content,
          type: 'text',
          mentions: [],
          reactions: {},
          createdAt: new Date()
        };

        set((state) => ({
          groupMessages: {
            ...state.groupMessages,
            [groupId]: [...(state.groupMessages[groupId] || []), message]
          },
          groups: {
            ...state.groups,
            [groupId]: {
              ...state.groups[groupId],
              lastActivity: new Date()
            }
          }
        }));
      },

      getGroupMessages: (groupId) => {
        const state = get();
        return state.groupMessages[groupId] || [];
      },

      deleteGroupMessage: (groupId, messageId, userId) => {
        set((state) => ({
          groupMessages: {
            ...state.groupMessages,
            [groupId]: (state.groupMessages[groupId] || []).filter(
              msg => !(msg.id === messageId && msg.userId === userId)
            )
          }
        }));
      },

      // Achievement Actions
      unlockAchievement: (userId, achievementId) => {
        const existing = get().userAchievements.find(
          ua => ua.userId === userId && ua.achievementId === achievementId
        );
        if (existing) return;

        const newAchievement: UserAchievement = {
          userId,
          achievementId,
          earnedAt: new Date(),
          progress: 100
        };

        set((state) => ({
          userAchievements: [...state.userAchievements, newAchievement]
        }));

        // Update user's achievement count
        const userAchievements = get().userAchievements.filter(ua => ua.userId === userId);
        get().updateProfile(userId, {
          achievementsCount: userAchievements.length
        });

        // Add notification
        get().addNotification({
          userId,
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: `You earned a new achievement!`,
          data: { achievementId },
          isRead: false
        });
      },

      getUserAchievements: (userId) => {
        const state = get();
        return getUserAchievements(userId, state.userAchievements);
      },

      getAvailableAchievements: () => {
        return get().availableAchievements;
      },

      checkAchievements: (userId) => {
        const profile = get().getProfile(userId);
        if (!profile) return [];

        const existingAchievements = get().userAchievements.filter(ua => ua.userId === userId);
        const newAchievements = checkAndUnlockAchievements(profile, existingAchievements);

        newAchievements.forEach(achievement => {
          get().unlockAchievement(userId, achievement.achievementId);
        });

        return newAchievements;
      },

      // Leaderboard Actions
      updateLeaderboard: (filter, entries) => {
        const filterKey = JSON.stringify(filter);
        set((state) => ({
          leaderboards: { ...state.leaderboards, [filterKey]: entries }
        }));
      },

      getLeaderboard: (filter) => {
        const state = get();
        const filterKey = JSON.stringify(filter);
        return state.leaderboards[filterKey] || [];
      },

      getMyRank: (filter) => {
        const state = get();
        const filterKey = JSON.stringify(filter);
        return state.myRank[filterKey] || null;
      },

      // Social Feed Actions
      createPost: (userId, content, groupId) => {
        const post: Post = {
          id: `post_${Date.now()}`,
          userId,
          content,
          type: 'general',
          likes: [],
          comments: [],
          createdAt: new Date(),
          visibility: 'public',
          groupId
        };

        set((state) => ({
          posts: [post, ...state.posts]
        }));
      },

      likePost: (postId, userId) => {
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              const likes = post.likes.includes(userId)
                ? post.likes.filter(id => id !== userId)
                : [...post.likes, userId];
              return { ...post, likes };
            }
            return post;
          })
        }));
      },

      addComment: (postId, userId, content, parentId) => {
        const comment: Comment = {
          id: `comment_${Date.now()}`,
          postId,
          userId,
          content,
          parentId,
          likes: [],
          createdAt: new Date()
        };

        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return { ...post, comments: [...post.comments, comment] };
            }
            return post;
          })
        }));
      },

      getPosts: (userId, groupId) => {
        const state = get();
        let posts = state.posts;

        if (groupId) {
          posts = posts.filter(post => post.groupId === groupId);
        }

        return posts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      // Notification Actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif_${Date.now()}`,
          createdAt: new Date()
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },

      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notif => ({ ...notif, isRead: true })),
          unreadCount: 0
        }));
      },

      getNotifications: (userId) => {
        const state = get();
        return state.notifications.filter(notif => notif.userId === userId);
      },

      getUnreadCount: (userId) => {
        const state = get();
        return state.notifications.filter(notif => notif.userId === userId && !notif.isRead).length;
      },

      // Analytics Actions
      updateSocialStats: (stats) => {
        set({ socialStats: stats });
      },

      updateGroupAnalytics: (groupId, analytics) => {
        set((state) => ({
          groupAnalytics: { ...state.groupAnalytics, [groupId]: analytics }
        }));
      },

      getSocialStats: () => {
        const state = get();
        return state.socialStats;
      },

      // Utility Actions
      clearSocialData: () => {
        set({
          connections: [],
          followers: {},
          following: {},
          groups: {},
          groupMemberships: [],
          groupMessages: {},
          userAchievements: [],
          posts: [],
          friendActivity: [],
          notifications: [],
          unreadCount: 0,
          socialStats: null,
          groupAnalytics: {}
        });
      },

      exportSocialData: () => {
        const state = get();
        return JSON.stringify({
          profiles: state.profiles,
          connections: state.connections,
          groups: state.groups,
          groupMemberships: state.groupMemberships,
          userAchievements: state.userAchievements,
          posts: state.posts,
          notifications: state.notifications
        }, null, 2);
      },

      importSocialData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set((state) => ({
            ...state,
            ...parsed
          }));
        } catch (error) {
          console.error('Failed to import social data:', error);
        }
      },

      // UI Actions
      setSelectedGroup: (groupId) => {
        set({ selectedGroup: groupId });
      },

      setLeaderboardFilter: (filter) => {
        set({ leaderboardFilter: filter });
      },

      setLoading: (key, value) => {
        set((state) => ({
          loading: { ...state.loading, [key]: value }
        }));
      }
    }),
    {
      name: 'learnsmart-social',
      partialize: (state) => ({
        profiles: state.profiles,
        connections: state.connections,
        followers: state.followers,
        following: state.following,
        groups: state.groups,
        groupMemberships: state.groupMemberships,
        userAchievements: state.userAchievements,
        posts: state.posts,
        notifications: state.notifications,
        socialStats: state.socialStats,
        groupAnalytics: state.groupAnalytics
      })
    }
  )
);