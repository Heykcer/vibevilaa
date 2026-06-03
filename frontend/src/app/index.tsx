import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  Modal,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/use-theme';
import { Fonts, Spacing } from '../constants/theme';
import { io } from 'socket.io-client';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// 1. Data Constants
const INITIAL_CONTESTANTS = [
  {
    id: 'luna',
    name: 'Luna',
    gender: 'girl',
    avatar: '👩‍🦰',
    avatarColor: '#EC4899',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    popularity: 98,
    votes: 125000,
    followers: '1.2M',
    fanbaseMembers: '125K',
    location: 'Tokyo, Japan',
    mbti: 'Mysterious • INTJ',
    bio: 'I may be quiet, but I see everything.',
    interests: ['Anime', 'Gaming', 'Music', 'Dance'],
    moments: [
      'Just finished the morning lounge challenge! Who watched it? 🏋️‍♀️',
      'Quiet nights in the villa garden are my favorite... 🌌✨',
      'Thanks for everyone voting to save me this week! Truly blessed ❤️',
    ],
  },
  {
    id: 'ethan',
    name: 'Ethan',
    gender: 'boy',
    avatar: '👱‍♂️',
    avatarColor: '#3B82F6',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    popularity: 95,
    votes: 98000,
    followers: '1.0M',
    fanbaseMembers: '95K',
    location: 'London, UK',
    mbti: 'Outgoing • ESTP',
    bio: 'Living life one day at a time! Down for any adventure.',
    interests: ['Fitness', 'Travel', 'Surfing', 'Comedy'],
    moments: [
      'Villa pool jump session was crazy! Zayn almost lost his keys 😂',
      'Morning workout routine check. No days off! 💪🔥',
    ],
  },
  {
    id: 'maya',
    name: 'Maya',
    gender: 'girl',
    avatar: '👩',
    avatarColor: '#10B981',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    popularity: 94,
    votes: 87000,
    followers: '890K',
    fanbaseMembers: '85K',
    location: 'Los Angeles, USA',
    mbti: 'Creative • INFJ',
    bio: 'Artist, dreamer, believer in true, deep connections.',
    interests: ['Art', 'Yoga', 'Writing', 'Astrology'],
    moments: [
      'Art session in the lounge today. Tried painting the pool view! 🎨',
      'Looking for someone who speaks the language of souls ✨',
    ],
  },
  {
    id: 'zayn',
    name: 'Zayn',
    gender: 'boy',
    avatar: '🧔',
    avatarColor: '#8B5CF6',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    popularity: 89,
    votes: 75000,
    followers: '750K',
    fanbaseMembers: '70K',
    location: 'Dubai, UAE',
    mbti: 'Charming • ENFJ',
    bio: "Let's bring positive vibes, deep talks, and good energy.",
    interests: ['Music', 'Fitness', 'Cooking', 'Fashion'],
    moments: [
      'Prepared dinner for the lounge today. Rate my chef skills! 🍛',
      'Compatibility test was interesting today. What do you guys think? 😉',
    ],
  },
  {
    id: 'kira',
    name: 'Kira',
    gender: 'girl',
    avatar: '👩‍🦱',
    avatarColor: '#F59E0B',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    popularity: 85,
    votes: 65000,
    followers: '680K',
    fanbaseMembers: '60K',
    location: 'Paris, France',
    mbti: 'Energetic • ESFP',
    bio: 'Dance is my language, drama is my art. Ready to shine!',
    interests: ['Dance', 'Fashion', 'Theater', 'Parties'],
    moments: [
      'Dance battle in the courtyard tonight! Be there! 💃🕺',
      'Villa fashion show outfit ready! Let the drama begin 👑💅',
    ],
  },
  {
    id: 'noah',
    name: 'Noah',
    gender: 'boy',
    avatar: '👨',
    avatarColor: '#64748B',
    imageUrl:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
    popularity: 82,
    votes: 48000,
    followers: '500K',
    fanbaseMembers: '45K',
    location: 'Sydney, Australia',
    mbti: 'Calm • ISTJ',
    bio: "Still waters run deep. Let's get to know each other.",
    interests: ['Books', 'Hiking', 'Photography', 'Nature'],
    moments: [
      'Found a peaceful reading spot in the library lounge. 📚☕',
      'Took some snaps of the sunrise over the sea today. 📸🌅',
    ],
  },
];

const INITIAL_COUPLES = [
  {
    id: 'cp1',
    boy: 'Ethan',
    girl: 'Luna',
    compatibility: 92,
    boyAvatar: '👱‍♂️',
    girlAvatar: '👩‍🦰',
  },
  {
    id: 'cp2',
    boy: 'Zayn',
    girl: 'Maya',
    compatibility: 76,
    boyAvatar: '🧔',
    girlAvatar: '👩',
  },
];

const INITIAL_CHALLENGES = [
  {
    id: 'ch1',
    title: 'Treasure Hunt',
    type: 'Team Challenge',
    participants: 24,
    timeLeft: '12h left',
    rewardCoins: 500,
    status: 'active', // active, joined, completed
  },
  {
    id: 'ch2',
    title: 'Love Quiz',
    type: 'Love Challenge',
    participants: 18,
    timeLeft: '6h left',
    rewardCoins: 300,
    status: 'active',
  },
  {
    id: 'ch3',
    title: 'Secret Mission',
    type: 'Secret Challenge',
    participants: 12,
    timeLeft: '1d left',
    rewardCoins: 700,
    status: 'active',
  },
];

const HOME_TRENDING_SHOWS = [
  {
    id: 'truth-game',
    title: 'The Truth Game',
    viewers: '24.3K',
    imageUrl: require('../../assets/images/truth_game.png'),
  },
  {
    id: 'love-connection',
    title: 'Love Connection',
    viewers: '18.7K',
    imageUrl: require('../../assets/images/love_connection.png'),
  },
  {
    id: 'secret-mission',
    title: 'Secret Mission',
    viewers: '15.2K',
    imageUrl: require('../../assets/images/secret_mission.png'),
  },
  {
    id: 'treasure-hunt',
    title: 'Treasure Hunt',
    viewers: '12.1K',
    imageUrl: require('../../assets/images/treasure_hunt.png'),
  },
  {
    id: 'voice-vibevilla',
    title: 'Voice of VibeVilla',
    viewers: '9.8K',
    imageUrl: require('../../assets/images/voice_of_vibevilla.png'),
  },
  {
    id: 'stars-unplugged',
    title: 'Stars Unplugged',
    viewers: '8.6K',
    imageUrl: require('../../assets/images/stars_unplugged.png'),
  },
];

const HOME_STATS = [
  { id: 'members', label: 'Active Members', value: '125K+', icon: '👥' },
  { id: 'views', label: 'Monthly Views', value: '3.4M+', icon: '👁️' },
  { id: 'likes', label: 'Likes Today', value: '125K+', icon: '💖' },
  { id: 'gifts', label: 'Gifts Sent', value: '890K+', icon: '🎁' },
  { id: 'countries', label: 'Countries', value: '150+', icon: '🌍' },
];

const HOME_CATEGORIES = [
  { id: 'reality', label: 'Reality Shows', icon: '🎬' },
  { id: 'dating', label: 'Dating', icon: '💖' },
  { id: 'music', label: 'Music', icon: '🎵' },
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'talent', label: 'Talent', icon: '⭐' },
  { id: 'talk', label: 'Talk Shows', icon: '💬' },
  { id: 'competition', label: 'Competition', icon: '🏆' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '💎' },
];

const CHANNELS_LIST = [
  { id: 'general', name: '# general-chat', members: '12.3K', count: 4 },
  { id: 'discussion', name: '# episode-discussion', members: '8.2K', count: 0 },
  { id: 'memes', name: '# memes', members: '6.1K', count: 2 },
  { id: 'theories', name: '# fan-theories', members: '4.8K', count: 0 },
  { id: 'highlights', name: '# clips-highlights', members: '3.2K', count: 1 },
];

const FANBASES_LIST = [
  { id: 'luna-fanbase', name: '# luna-fanbase', members: '20.4K', count: 12 },
  { id: 'ethan-fanbase', name: '# ethan-fanbase', members: '18.7K', count: 5 },
  { id: 'maya-fanbase', name: '# maya-fanbase', members: '15.9K', count: 2 },
];

const DM_LIST = [
  {
    id: 'dm-luna',
    name: 'Luna',
    avatar: '👩‍🦰',
    status: 'Online',
    lastMessage: 'Hey! Thanks for the support ❤️',
    time: '2m',
    unread: true,
  },
  {
    id: 'dm-ethan',
    name: 'Ethan',
    avatar: '👱‍♂️',
    status: 'Offline',
    lastMessage: 'Check out this clip 😂',
    time: '10m',
    unread: false,
  },
  {
    id: 'dm-maya',
    name: 'Maya',
    avatar: '👩',
    status: 'Online',
    lastMessage: "Can't wait for tomorrow!",
    time: '1h',
    unread: false,
  },
  {
    id: 'dm-vibevilla',
    name: 'VibeVilla',
    avatar: '👑',
    status: 'Official',
    lastMessage: 'New challenge is live!',
    time: '2d',
    unread: false,
  },
  {
    id: 'dm-kira',
    name: 'Kira',
    avatar: '👩‍🦱',
    status: 'Online',
    lastMessage: 'Vote now!',
    time: '3d',
    unread: false,
  },
];

const PREPOPULATED_CHAT = {
  general: [
    { id: 'g1', sender: 'Alex', text: 'That challenge was crazy! 🔥', time: '2m ago' },
    { id: 'g2', sender: 'NovaFan', text: 'Vote Luna! She deserves it.', time: '2m ago' },
    { id: 'g3', sender: 'ShadowArmy', text: 'No wayyyyy 😱', time: '1m ago' },
    { id: 'g4', sender: 'KiraWorld', text: 'Kira & Shadow forever! ❤️', time: '1m ago' },
  ],
  discussion: [
    {
      id: 'd1',
      sender: 'DramaKing',
      text: 'Luna was so silent but lethal in that discussion.',
      time: '10m ago',
    },
    {
      id: 'd2',
      sender: 'VibeWatcher',
      text: 'Zayn compatibility with Maya is 76%, but they look cute together.',
      time: '8m ago',
    },
  ],
  memes: [
    {
      id: 'm1',
      sender: 'MemeLord',
      text: 'Me waiting for the voting results... 💀',
      time: '30m ago',
    },
    {
      id: 'm2',
      sender: 'LaughOut',
      text: "Luna's reaction is my absolute mood today.",
      time: '12m ago',
    },
  ],
  theories: [
    {
      id: 't1',
      sender: 'Detective',
      text: 'I think Noah is hiding a secret mission from all of us!',
      time: '1h ago',
    },
  ],
  highlights: [
    {
      id: 'h1',
      sender: 'VibeVilla',
      text: 'Check out the pool jump highlight! 🏊‍♂️',
      time: '2h ago',
    },
  ],
  'luna-fanbase': [
    {
      id: 'lf1',
      sender: 'LunaStarlight',
      text: "Queen Luna must win! Let's save her in active vote.",
      time: '5m ago',
    },
  ],
  'ethan-fanbase': [
    {
      id: 'ef1',
      sender: 'GymGuy',
      text: "Ethan carrying the team as always. Let's go boys!",
      time: '10m ago',
    },
  ],
  'maya-fanbase': [
    {
      id: 'mf1',
      sender: 'ArtStudio',
      text: "Maya's paintings are beautiful. She is a real gem.",
      time: '12m ago',
    },
  ],
  'dm-luna': [{ id: 'dl1', sender: 'Luna', text: 'Hey! Thanks for the support ❤️', time: '10:40' }],
  'dm-ethan': [{ id: 'de1', sender: 'Ethan', text: 'Check out this clip 😂', time: '10:30' }],
  'dm-maya': [{ id: 'dm1', sender: 'Maya', text: "Can't wait for tomorrow!", time: '09:15' }],
  'dm-vibevilla': [
    { id: 'dv1', sender: 'VibeVilla', text: 'New challenge is live!', time: 'Yesterday' },
  ],
  'dm-kira': [{ id: 'dk1', sender: 'Kira', text: 'Vote now!', time: '3 days ago' }],
};

const LIVE_SHOW_CHAT = [
  { id: 'l1', sender: 'Alex', text: 'That challenge was crazy! 🔥', time: '2m' },
  { id: 'l2', sender: 'NovaFan', text: 'Vote Luna! She deserves it', time: '2m' },
  { id: 'l3', sender: 'ShadowArmy', text: 'No wayyyyy 😱', time: '1m' },
  { id: 'l4', sender: 'KiraWorld', text: 'Kira & Shadow forever! ❤️', time: '1m' },
];

const COIN_PACKAGES = [
  { id: 'p1', coins: 100, price: '$0.99', tag: null },
  { id: 'p2', coins: 500, price: '$4.99', tag: 'Popular' },
  { id: 'p3', coins: 1000, price: '$8.99', tag: null },
  { id: 'p4', coins: 2500, price: '$19.99', tag: null },
  { id: 'p5', coins: 5000, price: '$34.99', tag: null },
];

const REWARDS_PASS_ITEMS = [
  { id: 'r1', name: 'Emerald Frame', type: 'free', icon: '🟢', unlocked: true },
  { id: 'r2', name: 'Silver Badge', type: 'free', icon: '🪙', unlocked: true },
  { id: 'r3', name: 'Violet Gem', type: 'free', icon: '💎', unlocked: true },
  { id: 'r4', name: 'Speech Bubble', type: 'free', icon: '💬', unlocked: true },
  { id: 'r5', name: 'Golden Crown', type: 'premium', icon: '👑', unlocked: false },
  { id: 'r6', name: 'Neon Glint', type: 'premium', icon: '✨', unlocked: false },
  { id: 'r7', name: 'VIP Ticket', type: 'premium', icon: '🎟️', unlocked: false },
  { id: 'r8', name: 'Pegasus Pet', type: 'premium', icon: '🦄', unlocked: false },
];

const DIRECT_MESSAGE_RESPONSES = {
  Luna: [
    "Thank you so much! Let's stay in this together! 🥰",
    'I saw your vote! Means the absolute world to me. ❤️',
    'Just relaxing in the lounge. What are you up to?',
  ],
  Ethan: [
    'Haha, absolute legend! Appreciate the support! 👊💥',
    'Thanks mate! Ready to smash the next challenge!',
    "Let's keep those votes rolling! We're winning this!",
  ],
  Maya: [
    'Aww, you are so sweet! Thank you! ✨🎨',
    "Let's connect more! Your energy is wonderful.",
    'I just finished a new sketch, hope you like it when it airs!',
  ],
  Kira: [
    "Yay! You're the best! Let's dance! 💃🎉",
    'Drama? Who, me? Never! 😂 Thanks for voting!',
    "Can't wait for the villa party tonight, keep supporting!",
  ],
  VibeVilla: [
    'Official broadcast: Make sure to check the active voting polls!',
    'Stay updated on daily challenges to earn bonus coins!',
  ],
};

const GIFT_SHOP = [
  { id: 'g1', name: 'Rose', emoji: '🌹', cost: 5, popularityBoost: 5 },
  { id: 'g2', name: 'Heart', emoji: '❤️', cost: 20, popularityBoost: 25 },
  { id: 'g3', name: 'Crown', emoji: '👑', cost: 100, popularityBoost: 150 },
  { id: 'g4', name: 'Yacht', emoji: '🛳️', cost: 500, popularityBoost: 800 },
];

const FloatingEmojiItem = ({ emoji, left }: { emoji: string; left: number }) => {
  const animatedY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animatedY, {
        toValue: -300,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animatedY, opacity]);

  return (
    <Animated.View
      style={[
        styles.floatingContainer,
        {
          left: `${left}%`,
          opacity: opacity,
          transform: [{ translateY: animatedY }],
        },
      ]}
    >
      <Text style={styles.floatingText}>{emoji}</Text>
    </Animated.View>
  );
};

export default function App() {
  const theme = useTheme();
  const socketRef = useRef<any>(null);

  // Navigation Stack: keeps track of history
  const [viewHistory, setViewHistory] = useState([{ type: 'tab', id: 'home' }]);

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('You (Audience)');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Global Interactive State
  const [coins, setCoins] = useState(2450);
  const [gems, setGems] = useState(380);
  const [xp, setXp] = useState(850);
  const [userLevel, setUserLevel] = useState(14);
  const [isPremium, setIsPremium] = useState(false);
  const [contestants, setContestants] = useState<any[]>(INITIAL_CONTESTANTS);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);

  // Authentication Modals states
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const [loginEmail, setLoginEmail] = useState('audience@vibevilla.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');  // Tab states
  const [activeTab, setActiveTab] = useState('home');
  const [profileDetailTab, setProfileDetailTab] = useState('About');
  const [rankingsTab, setRankingsTab] = useState('Weekly');
  const [challengesTab, setChallengesTab] = useState('Active');
  const [communityTab, setCommunityTab] = useState('Channels');

  // Specific screen data references
  const [activeContestantId, setActiveContestantId] = useState('luna');
  const [joinedFanbases, setJoinedFanbases] = useState<string[]>([]);
  const [hasVotedInSavePoll, setHasVotedInSavePoll] = useState(false);
  const [activeVoteSelectedId, setActiveVoteSelectedId] = useState('luna');
  const [evictionVotes, setEvictionVotes] = useState({
    luna: 42,
    ethan: 31,
    maya: 28,
    zayn: 15,
    kira: 9,
  });

  // Live stream state
  const [liveShowChat, setLiveShowChat] = useState(LIVE_SHOW_CHAT);
  const [liveNewMessage, setLiveNewMessage] = useState('');
  const [liveViewerCount, setLiveViewerCount] = useState(245230);
  const [liveLikes, setLiveLikes] = useState(125430);
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [activeGiftGiver, setActiveGiftGiver] = useState<string | null>(null);
  const heroFloat = useRef(new Animated.Value(0)).current;
  const heroPulse = useRef(new Animated.Value(1)).current;
  const cardsFade = useRef(new Animated.Value(0)).current;

  // Chat/DM channel states
  const [activeChannelId, setActiveChannelId] = useState('general');
  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>(PREPOPULATED_CHAT);
  const [channelInput, setChannelInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [contestantSearch, setContestantSearch] = useState('');
  const [contestantFilter, setContestantFilter] = useState('All'); // All, Girls, Boys

  // Floating animations
  const [floatingEmojis, setFloatingEmojis] = useState<
    { id: number; emoji: string; left: number }[]
  >([]);
  const [timerText, setTimerText] = useState('02:34:10');

  // Timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewerCount((prev) => prev + Math.floor(Math.random() * 31) - 15);
      setTimerText((prev) => {
        let [h, m, s] = prev.split(':').map(Number);
        if (s > 0) {
          s--;
        } else {
          s = 59;
          if (m > 0) {
            m--;
          } else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return [
          String(h).padStart(2, '0'),
          String(m).padStart(2, '0'),
          String(s).padStart(2, '0'),
        ].join(':');
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(heroFloat, {
            toValue: -10,
            duration: 5200,
            useNativeDriver: true,
          }),
          Animated.timing(heroFloat, {
            toValue: 0,
            duration: 5200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(heroPulse, {
            toValue: 1.03,
            duration: 3200,
            useNativeDriver: true,
          }),
          Animated.timing(heroPulse, {
            toValue: 1,
            duration: 3200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    Animated.timing(cardsFade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      delay: 260,
    }).start();
  }, [heroFloat, heroPulse, cardsFade]);

  // WebSockets and Auth integration
  useEffect(() => {
    // 1. Establish socket connection
    const socket = io(API_BASE_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      socket.emit('join_room', activeChannelId);
    });

    // 2. Socket event listeners
    socket.on('broadcast_live_chat', (data: any) => {
      if (data.roomId === 'live') {
        setLiveShowChat((prev) => {
          const exists = prev.some((m) => m.text === data.text && m.sender === data.senderName);
          if (exists) return prev;
          return [
            ...prev,
            {
              id: `socket-live-${Date.now()}-${Math.random()}`,
              sender: data.senderName,
              text: data.text,
              time: data.time,
            },
          ];
        });
      } else {
        setChatMessages((prev) => {
          const currentMessages = prev[data.roomId] || [];
          const exists = currentMessages.some(
            (m) => m.text === data.text && m.sender === data.senderName
          );
          if (exists) return prev;
          return {
            ...prev,
            [data.roomId]: [
              ...currentMessages,
              {
                id: `socket-msg-${Date.now()}-${Math.random()}`,
                sender: data.senderName,
                text: data.text,
                time: data.time,
              },
            ],
          };
        });
      }
      triggerFloatEmoji('💬');
    });

    socket.on('broadcast_reaction', (data: any) => {
      triggerFloatEmoji(data.emoji);
    });

    socket.on('update_rankings', (data: any) => {
      setContestants((prev) =>
        prev.map((c) => {
          if (c.dbId === data.contestantId || c.id === data.contestantId) {
            return {
              ...c,
              votes: data.votesCount,
              popularity: data.popularity,
            };
          }
          return c;
        })
      );
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Update eviction votes when contestants state updates
  useEffect(() => {
    const updatedVotes: any = {};
    contestants.forEach((c: any) => {
      if (c.id) {
        updatedVotes[c.id] = c.votes || 0;
      }
    });
    setEvictionVotes(updatedVotes);
  }, [contestants]);

  // Active channel room joining and message fetching
  useEffect(() => {
    const fetchChannelMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/channels/${activeChannelId}/messages`);
        const json = await response.json();
        if (json.success && json.data) {
          const mapped = json.data.map((m: any) => ({
            id: m._id,
            sender: m.senderName,
            text: m.text,
            time:
              m.time ||
              new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setChatMessages((prev) => ({
            ...prev,
            [activeChannelId]: mapped,
          }));
        }
      } catch (err) {
        console.error('Error fetching messages for channel', activeChannelId, err);
      }
    };

    fetchChannelMessages();

    if (socketRef.current) {
      socketRef.current.emit('join_room', activeChannelId);
    }
  }, [activeChannelId]);

  // Load contestants on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/contestants`);
        const json = await response.json();
        if (json.success && json.data) {
          const mapped = json.data.map((c: any) => ({
            ...c,
            id: c.name.toLowerCase(),
            dbId: c._id,
          }));
          setContestants(mapped);
        }
      } catch (err) {
        console.error('Error fetching initial contestants:', err);
      }
    };
    fetchInitialData();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const user = json.data;
        setUserId(user._id);
        setUserName(user.name);
        setCoins(user.balanceCoins);
        setGems(user.balanceGems);
        setIsPremium(user.isPremium || false);
        setIsLoggedIn(true);
        setLoginModalVisible(false);
        Alert.alert('Success! ✅', `Welcome back, ${user.name}!`);
      } else {
        const errMsg = json.message || 'Login failed. Please check your credentials.';
        Alert.alert('Login Failed ❌', errMsg);
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error ❌', 'Unable to connect to the server.');
    }
  };

  const handleRegister = async () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const user = json.data;
        setUserId(user._id);
        setUserName(user.name);
        setCoins(user.balanceCoins);
        setGems(user.balanceGems);
        setIsPremium(user.isPremium || false);
        setIsLoggedIn(true);
        setSignupModalVisible(false);
        Alert.alert('Success! ✅', `Welcome to VibeVilla, ${user.name}!`);
      } else {
        const errMsg = json.message || 'Registration failed.';
        Alert.alert('Registration Failed ❌', errMsg);
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error ❌', 'Unable to connect to the server.');
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setUserName('You (Audience)');
    setIsLoggedIn(false);
    setIsPremium(false);
    Alert.alert('Logged Out', 'You have been logged out.');
  };

  // Navigation Logic
  const currentView = viewHistory[viewHistory.length - 1];

  const navigateTo = (viewId: string, extraData: any = null) => {
    setViewHistory((prev) => [...prev, { type: 'subview', id: viewId, extraData }]);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      setViewHistory((prev) => prev.slice(0, -1));
    }
  };

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    setViewHistory([{ type: 'tab', id: tabId }]);
  };

  // Interactions
  const handleBuyCoins = async (packageCoins: number, price: string) => {
    const numericPrice = parseFloat(price.replace('$', ''));
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallet/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          coinsAmount: packageCoins,
          price: numericPrice,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const { newBalanceCoins } = json.data;
        setCoins(newBalanceCoins);

        Alert.alert(
          'Purchase Success! 🪙',
          `You bought ${packageCoins} coins for ${price}. Balances updated!`,
          [{ text: 'Awesome' }]
        );
      } else {
        const errMsg = json.message || 'Failed to buy coins';
        Alert.alert('Purchase Failed ❌', errMsg);
      }
    } catch (err) {
      console.error('Failed to buy coins:', err);
      Alert.alert('Purchase Error ❌', 'Unable to reach the server. Please try again.');
    }
  };

  const handleCastVote = async () => {
    if (coins < 10) {
      Alert.alert(
        'Insufficient Coins 🪙',
        'You need at least 10 coins to cast a vote. Go to the wallet to top up!',
        [
          { text: 'Go to Wallet', onPress: () => navigateTo('wallet') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    const targetContestant = contestants.find((c) => c.id === activeVoteSelectedId);
    if (!targetContestant || !targetContestant.dbId) {
      Alert.alert('Error', 'Contestant not found in database.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/votes/cast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contestantId: targetContestant.dbId,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const { newBalanceCoins, contestantVotes, contestantPopularity } = json.data;
        setCoins(newBalanceCoins);

        setContestants((prev) =>
          prev.map((c) => {
            if (c.id === activeVoteSelectedId) {
              return {
                ...c,
                popularity: contestantPopularity,
                votes: contestantVotes,
              };
            }
            return c;
          })
        );

        setHasVotedInSavePoll(true);
        triggerFloatEmoji('🗳️');

        socketRef.current?.emit('cast_vote', {
          contestantId: targetContestant.dbId,
          votesCount: contestantVotes,
          popularity: contestantPopularity,
        });

        Alert.alert(
          'Vote Cast! ✅',
          `You used 10 coins to support ${activeVoteSelectedId.toUpperCase()}! Your vote has been compiled in the database.`
        );
      } else {
        const errMsg = json.message || 'Failed to cast vote';
        Alert.alert('Voting Failed ❌', errMsg);
      }
    } catch (err) {
      console.error('Failed to cast vote:', err);
      Alert.alert('Voting Error ❌', 'Unable to reach the server. Please try again.');
    }
  };

  const handleSendGift = async (gift: (typeof GIFT_SHOP)[0]) => {
    if (coins < gift.cost) {
      Alert.alert('Insufficient Coins 🪙', 'You need more coins to send this gift.', [
        {
          text: 'Buy Coins',
          onPress: () => {
            setGiftModalVisible(false);
            navigateTo('wallet');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    const targetContestant = contestants.find((c) => c.id === activeGiftGiver);
    if (!targetContestant || !targetContestant.dbId) {
      Alert.alert('Error', 'Contestant not found in database.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/contestants/${targetContestant.dbId}/gift`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            cost: gift.cost,
            popularityBoost: gift.popularityBoost,
          }),
        }
      );

      const json = await response.json();
      if (json.success && json.data) {
        const { newBalanceCoins, contestantVotes, contestantPopularity } = json.data;
        setCoins(newBalanceCoins);

        setContestants((prev) =>
          prev.map((c) => {
            if (c.id === activeGiftGiver) {
              return {
                ...c,
                popularity: contestantPopularity,
                votes: contestantVotes,
              };
            }
            return c;
          })
        );

        triggerFloatEmoji(gift.emoji);
        setGiftModalVisible(false);

        socketRef.current?.emit('cast_vote', {
          contestantId: targetContestant.dbId,
          votesCount: contestantVotes,
          popularity: contestantPopularity,
        });

        socketRef.current?.emit('send_live_chat', {
          roomId: 'live',
          senderName: userName || 'You (Audience)',
          text: `sent ${gift.name} ${gift.emoji} to ${targetContestant.name}! 🎁`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        socketRef.current?.emit('trigger_reaction', {
          roomId: activeChannelId,
          emoji: gift.emoji,
        });

        Alert.alert(
          'Gift Dispatched! 🎁',
          `Sent ${gift.name} ${gift.emoji} to ${activeGiftGiver?.toUpperCase()}! Popularity score has been boosted +${gift.popularityBoost}!`
        );
      } else {
        const errMsg = json.message || 'Failed to send gift';
        Alert.alert('Gifting Failed ❌', errMsg);
      }
    } catch (err) {
      console.error('Failed to send gift:', err);
      Alert.alert('Gifting Error ❌', 'Unable to reach the server. Please try again.');
    }
  };

  const triggerFloatEmoji = (emoji: string) => {
    const id = Date.now();
    const left = Math.floor(Math.random() * 80) + 10;
    setFloatingEmojis((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2000);
  };

  const handleJoinChallenge = (challengeId: string, reward: number) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) return { ...ch, status: 'joined' };
        return ch;
      })
    );

    // Simulate complete in 4 seconds
    setTimeout(() => {
      setChallenges((prev) =>
        prev.map((ch) => {
          if (ch.id === challengeId && ch.status === 'joined') {
            setCoins((c) => c + reward);
            setXp((x) => {
              const nextXp = x + 150;
              if (nextXp >= 1000) {
                setUserLevel((lvl) => lvl + 1);
                Alert.alert(
                  'LEVEL UP! 🎉',
                  `You reached Level ${userLevel + 1}! unlocked standard frame reward!`
                );
                return nextXp - 1000;
              }
              return nextXp;
            });
            Alert.alert(
              'Challenge Completed! 🏆',
              `Congratulations! You finished "${ch.title}" and gained +${reward} coins and +150 XP!`,
              [{ text: 'Claim!' }]
            );
            return { ...ch, status: 'completed' };
          }
          return ch;
        })
      );
    }, 4000);
  };

  const handleUpgradePremium = async () => {
    if (gems < 150) {
      Alert.alert(
        'Insufficient Gems 💎',
        'Premium pass upgrade costs 150 gems. Buy packages in the wallet!',
        [
          { text: 'Go to Wallet', onPress: () => navigateTo('wallet') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/wallet/premium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const { newBalanceGems, isPremium: premiumStatus } = json.data;
        setGems(newBalanceGems);
        setIsPremium(premiumStatus);

        triggerFloatEmoji('👑');
        Alert.alert(
          'VIP Season Pass Activated! 👑',
          'All premium season rewards are now unlocked! Verified borders applied.'
        );
      } else {
        const errMsg = json.message || 'Failed to upgrade to Premium';
        Alert.alert('Upgrade Failed ❌', errMsg);
      }
    } catch (err) {
      console.error('Failed to upgrade to Premium:', err);
      Alert.alert('Upgrade Error ❌', 'Unable to reach the server. Please try again.');
    }
  };

  const handleSendMessage = async (
    targetRoom: string,
    text: string,
    clearFn: (s: string) => void,
    isLive: boolean = false
  ) => {
    if (!text.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isLive) {
      socketRef.current?.emit('send_live_chat', {
        roomId: 'live',
        senderName: userName || 'You (Audience)',
        text: text.trim(),
        time: timeString,
      });

      const newMsg = {
        id: `m-live-${Date.now()}`,
        sender: `${userName || 'You (Audience)'} 👁️`,
        text: text.trim(),
        time: timeString,
      };
      setLiveShowChat((prev) => [...prev, newMsg]);
      clearFn('');
      triggerFloatEmoji('💬');

      setTimeout(() => {
        const responders = contestants.filter((c) => c.id !== 'noah');
        const randomContestant = responders[Math.floor(Math.random() * responders.length)];
        const systemResponses = [
          'Wow, the chat is moving so fast! Thanks guys! 🔥',
          'Villa vibes are incredible today! 💜',
          "Keep voting for me! Let's do this!",
          'Did someone send a rose? Appreciate you! 🌹',
        ];
        const replyMsg = {
          id: `live-reply-${Date.now()}`,
          sender: `${randomContestant.name} ${randomContestant.avatar}`,
          text: systemResponses[Math.floor(Math.random() * systemResponses.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        socketRef.current?.emit('send_live_chat', {
          roomId: 'live',
          senderName: replyMsg.sender,
          text: replyMsg.text,
          time: replyMsg.time,
        });
      }, 2000);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/api/channels/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelId: targetRoom,
            senderName: userName || 'You (Audience)',
            text: text.trim(),
          }),
        });

        const json = await response.json();
        if (json.success && json.data) {
          const m = json.data;
          const newMsg = {
            id: m._id,
            sender: m.senderName,
            text: m.text,
            time: m.time || timeString,
          };

          setChatMessages((prev) => ({
            ...prev,
            [targetRoom]: [...(prev[targetRoom] || []), newMsg],
          }));

          socketRef.current?.emit('send_live_chat', {
            roomId: targetRoom,
            senderName: m.senderName,
            text: m.text,
            time: m.time || timeString,
          });
        }
      } catch (err) {
        console.error('Failed to send message:', err);
      }

      clearFn('');
      triggerFloatEmoji('💬');

      if (targetRoom.startsWith('dm-')) {
        const contestantId = targetRoom.split('-')[1];
        const matchedContestant = contestants.find((c) => c.id === contestantId);
        if (matchedContestant) {
          setTimeout(async () => {
            const replies = DIRECT_MESSAGE_RESPONSES[matchedContestant.name as 'Luna'] || [
              'Thanks for your message! Tune into the live stream tonight! 🎭',
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];

            try {
              const res = await fetch(`${API_BASE_URL}/api/channels/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  channelId: targetRoom,
                  senderName: `${matchedContestant.name} ${matchedContestant.avatar}`,
                  text: randomReply,
                }),
              });
              const js = await res.json();
              if (js.success && js.data) {
                const rm = js.data;
                const replyMsg = {
                  id: rm._id,
                  sender: rm.senderName,
                  text: rm.text,
                  time: rm.time || timeString,
                };
                setChatMessages((prev) => ({
                  ...prev,
                  [targetRoom]: [...(prev[targetRoom] || []), replyMsg],
                }));
                socketRef.current?.emit('send_live_chat', {
                  roomId: targetRoom,
                  senderName: rm.senderName,
                  text: rm.text,
                  time: rm.time || timeString,
                });
              }
            } catch (err) {
              console.error('Failed to send DM reply:', err);
            }
            triggerFloatEmoji('❤️');
          }, 1500);
        }
      }
    }
  };

  // Helper render components
  const renderHeader = (title: string, showBack = false) => {
    return (
      <View
        style={[
          styles.headerContainer,
          { borderBottomColor: '#1e1c3a', backgroundColor: '#09071a' },
        ]}
      >
        <View style={styles.headerLeftContainer}>
          {showBack ? (
            <TouchableOpacity onPress={goBack} style={styles.backBtn}>
              <Text style={[styles.backText, { color: '#a855f7' }]}>◀ Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => switchTab('home')}>
              <Text style={styles.vibeVillaLogoText}>VibeVilla</Text>
            </TouchableOpacity>
          )}

          {/* Navigation Links in middle */}
          <View style={styles.headerNavMenu}>
            <TouchableOpacity onPress={() => {
              if (!isLoggedIn) {
                setLoginModalVisible(true);
              } else {
                switchTab('live');
              }
            }} style={styles.headerNavLink}>
              <Text style={styles.headerNavLinkText}>Live Shows</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              navigateTo('contestants_grid');
            }} style={styles.headerNavLink}>
              <Text style={styles.headerNavLinkText}>Contestants</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              if (!isLoggedIn) {
                setLoginModalVisible(true);
              } else {
                switchTab('community');
              }
            }} style={styles.headerNavLink}>
              <Text style={styles.headerNavLinkText}>Community</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              navigateTo('rankings_all');
            }} style={styles.headerNavLink}>
              <Text style={styles.headerNavLinkText}>Ranking</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              if (!isLoggedIn) {
                setLoginModalVisible(true);
              } else {
                navigateTo('rewards_pass');
              }
            }} style={styles.headerNavLink}>
              <Text style={styles.headerNavLinkText}>Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerNavLink}>
              <Text style={styles.headerNavLinkText}>•••</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right tools and buttons */}
        <View style={styles.headerRightContainer}>
          {/* Search bar */}
          <View style={styles.headerSearchBar}>
            <Text style={styles.searchIconSymbol}>🔍</Text>
            <TextInput
              style={styles.headerSearchInput}
              placeholder="Search..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Notification bell */}
          <TouchableOpacity style={styles.headerBellBtn}>
            <Text style={{ fontSize: 16 }}>🔔</Text>
          </TouchableOpacity>

          {/* Auth buttons */}
          {!isLoggedIn ? (
            <View style={styles.headerAuthButtonsRow}>
              <TouchableOpacity onPress={() => setLoginModalVisible(true)} style={styles.headerLoginBtn}>
                <Text style={styles.headerLoginBtnText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSignupModalVisible(true)} style={styles.headerSignupBtn}>
                <Text style={styles.headerSignupBtnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.headerUserSessionRow}>
              <TouchableOpacity
                onPress={() => navigateTo('wallet')}
                style={styles.headerWalletDisplay}
              >
                <Text style={{ fontSize: 13, marginRight: 2 }}>🪙</Text>
                <Text style={styles.headerWalletValueText}>{coins}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo('wallet')}
                style={styles.headerWalletDisplay}
              >
                <Text style={{ fontSize: 13, marginRight: 2 }}>💎</Text>
                <Text style={styles.headerWalletValueText}>{gems}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => switchTab('profile')} style={styles.headerUserProfileBtn}>
                <Text style={styles.headerUserGreetingText}>Hi, {userName.split(' ')[0]}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout} style={styles.headerLogoutBtn}>
                <Text style={styles.headerLogoutBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  // VIEW 1: Home Screen
  const renderHomeView = () => {
    return (
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { backgroundColor: '#060515' }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION WITH IMAGE */}
        <View style={styles.homeHeroContainer}>
          {/* Left side - Text content */}
          <View style={styles.homeHeroLeft}>
            <View style={styles.liveNowBadge}>
              <Text style={styles.liveNowBadgeText}>🔥 LIVE NOW</Text>
              <Text style={styles.liveNowEpisodeText}>Season 3 • Episode 12</Text>
            </View>
            <Text style={styles.homeHeroLine1}>Real People.</Text>
            <Text style={styles.homeHeroLine2}>Real Stories.</Text>
            <Text style={styles.homeHeroLine3}>Real Vibes.</Text>
            <Text style={[styles.homeHeroDescription, { color: 'rgba(255,255,255,0.7)' }]}>
              Watch live shows, support your favorite contestants, and be part of the VibeVilla community.
            </Text>
            <View style={styles.homeHeroButtonRow}>
              <TouchableOpacity 
                onPress={() => {
                  if (!isLoggedIn) {
                    setLoginModalVisible(true);
                  } else {
                    switchTab('live');
                  }
                }} 
                style={styles.heroPlayBtn}
              >
                <Text style={styles.heroPlayBtnText}>▶ Watch Live Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  navigateTo('contestants_grid');
                }} 
                style={styles.heroOutlineBtnLarge}
              >
                <Text style={styles.heroOutlineBtnText}>Explore Shows</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activeViewersRow}>
              <View style={styles.avatarStackSmall}>
                {['👩‍🦰', '👱‍♂️', '👩', '🧔', '👩‍🦱'].map((avatar, idx) => (
                  <Text key={idx} style={[styles.avatarSmall, { marginLeft: idx > 0 ? -10 : 0 }]}>
                    {avatar}
                  </Text>
                ))}
              </View>
              <Text style={[styles.activeViewerText, { color: 'rgba(255,255,255,0.6)' }]}>125K+ Active Viewers</Text>
            </View>
          </View>

          {/* Right side - Hero image with overlay card */}
          <View style={styles.homeHeroRight}>
            <Image
              source={require('../../assets/images/vibe_villa_hero.png')}
              style={styles.homeHeroImage}
            />
            {/* Overlay card for The Truth Game */}
            <View style={styles.truthGameCard}>
              <View style={styles.truthGameLiveTag}>
                <View style={styles.liveTagRedDot} />
                <Text style={styles.truthGameLiveText}>LIVE</Text>
              </View>
              <Text style={styles.truthGameTitle}>The Truth Game</Text>
              <Text style={styles.truthGameSubtitle}>Drama, Romance, Secrets. Who will survive tonight?</Text>
              <View style={styles.truthGameStats}>
                <View style={styles.truthGameAvatarRow}>
                  {['👩‍🦰', '👱‍♂️', '👩', '🧔'].map((avatar, idx) => (
                    <Text key={idx} style={[styles.truthGameAvatar, { marginLeft: idx > 0 ? -6 : 0 }]}>
                      {avatar}
                    </Text>
                  ))}
                  <Text style={styles.truthGameAvatarPlus}>+5</Text>
                </View>
                <View style={styles.truthGameViewersRow}>
                  <Text style={{ fontSize: 11, marginRight: 2 }}>📈</Text>
                  <Text style={styles.truthGameViewers}>24.3K Viewers</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.truthGameWatchBtn} 
                onPress={() => {
                  if (!isLoggedIn) {
                    setLoginModalVisible(true);
                  } else {
                    switchTab('live');
                  }
                }}
              >
                <Text style={styles.truthGameWatchBtnText}>▶ Watch Live</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* TRENDING SHOWS SECTION */}
        <View style={styles.trendingSectionHeader}>
          <Text style={styles.trendingSectionTitle}>Trending Live Shows 🔥</Text>
          <TouchableOpacity onPress={() => switchTab('live')}>
            <Text style={styles.seeAllShowsText}>See All Shows →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingShowsScroll}>
          {HOME_TRENDING_SHOWS.map((show) => (
            <TouchableOpacity
              key={show.id}
              style={styles.trendingShowCard}
              onPress={() => {
                if (!isLoggedIn) {
                  setLoginModalVisible(true);
                } else {
                  switchTab('live');
                }
              }}
            >
              <Image source={show.imageUrl} style={styles.trendingShowCardImage} />
              <View style={styles.trendingShowLiveTag}>
                <View style={styles.liveTagRedDot} />
                <Text style={styles.liveTagText}>LIVE</Text>
              </View>
              <View style={styles.trendingShowCardContent}>
                <Text style={styles.trendingShowCardTitle}>{show.title}</Text>
                <View style={styles.trendingShowViewersRow}>
                  <Text style={styles.trendingShowViewersIcon}>👁️</Text>
                  <Text style={styles.trendingShowViewersNum}>{show.viewers}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* STATS AND PREMIUM CTA SIDE-BY-SIDE CONTAINER */}
        <View style={styles.homeStatsAndPremiumRow}>
          {/* STATS BAR */}
          <View style={styles.statsBarContainer}>
            {HOME_STATS.map((stat) => (
              <View key={stat.id} style={styles.statBarItem}>
                <Text style={styles.statBarEmoji}>{stat.icon}</Text>
                <Text style={styles.statBarValue}>{stat.value}</Text>
                <Text style={styles.statBarLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* PREMIUM MEMBER PANEL */}
          <View style={styles.premiumMemberPanel}>
            <Text style={styles.premiumMemberEmoji}>👑</Text>
            <Text style={styles.premiumMemberTitle}>Become a Premium Member</Text>
            <Text style={styles.premiumMemberDesc}>Unlock exclusive perks, badges, and premium rewards.</Text>
            <TouchableOpacity 
              onPress={() => {
                if (!isLoggedIn) {
                  setLoginModalVisible(true);
                } else {
                  handleUpgradePremium();
                }
              }} 
              style={styles.upgradeNowBtn}
            >
              <Text style={styles.upgradeNowBtnText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* EXPLORE BY CATEGORY */}
        <View style={styles.exploreCategoryContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.exploreCategoryTitle}>Explore by Category</Text>
            <TouchableOpacity onPress={() => navigateTo('contestants_grid')}>
              <Text style={styles.seeAllShowsText}>View All Categories →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryGridHome}>
            {HOME_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCardHome}
                onPress={() => {
                  navigateTo('contestants_grid');
                }}
              >
                <Text style={styles.categoryIconHome}>{category.icon}</Text>
                <Text style={styles.categoryLabelHome}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  // VIEW 2: Live Show Screen
  const renderLiveView = () => {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mock Video Player */}
          <View style={styles.liveVideoPlayer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
              }}
              style={styles.liveVideoFrame}
            />
            <View style={styles.videoPlayerOverlay}>
              <View style={styles.videoHeader}>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.videoTimer}>⏱ {timerText}</Text>
              </View>
              <Text style={styles.videoTitle}>VibeVilla Courtyard • Night Lounge Cam</Text>
            </View>
          </View>

          {/* Stats Bar */}
          <View
            style={[
              styles.liveStatsBar,
              { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
            ]}
          >
            <View style={styles.liveStatItem}>
              <Text style={[styles.liveStatVal, { color: theme.text }]}>
                👁️ {liveViewerCount.toLocaleString()}
              </Text>
              <Text style={styles.liveStatLabel}>Viewers</Text>
            </View>
            <View style={styles.liveStatItem}>
              <Text style={[styles.liveStatVal, { color: theme.text }]}>🗳️ 3.4M</Text>
              <Text style={styles.liveStatLabel}>Votes Today</Text>
            </View>
            <View style={styles.liveStatItem}>
              <Text style={[styles.liveStatVal, { color: theme.text }]}>
                💖 {liveLikes.toLocaleString()}
              </Text>
              <Text style={styles.liveStatLabel}>Likes</Text>
            </View>
            <View style={styles.liveStatItem}>
              <Text style={[styles.liveStatVal, { color: theme.text }]}>🎁 890</Text>
              <Text style={styles.liveStatLabel}>Gifts Sent</Text>
            </View>
          </View>

          {/* Live Chat Frame */}
          <Text style={[styles.liveChatTitle, { color: theme.text }]}>Live Audience Chat</Text>
          <View
            style={[
              styles.liveChatContainer,
              { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
            ]}
          >
            <FlatList
              data={liveShowChat}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 180 }}
              renderItem={({ item }) => (
                <View style={styles.chatBubble}>
                  <Text style={[styles.chatSender, { color: theme.primary }]}>{item.sender}: </Text>
                  <Text style={[styles.chatBodyText, { color: theme.text }]}>{item.text}</Text>
                </View>
              )}
            />
          </View>

          {/* Reaction Bar */}
          <View style={styles.reactionRow}>
            {['🔥', '💖', '😂', '😮', '💀'].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => {
                  triggerFloatEmoji(emoji);
                  setLiveLikes((l) => l + 1);
                  socketRef.current?.emit('trigger_reaction', {
                    roomId: 'live',
                    emoji,
                  });
                }}
                style={[styles.reactionBtn, { backgroundColor: theme.lightGray }]}
              >
                <Text style={{ fontSize: 22 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => {
                const defaultGiver = contestants.find((c) => c.gender === 'girl')?.id || 'luna';
                setActiveGiftGiver(defaultGiver);
                setGiftModalVisible(true);
              }}
              style={[styles.reactionBtn, { backgroundColor: theme.primary }]}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>🎁 Gift</Text>
            </TouchableOpacity>
          </View>

          {/* Chat message input */}
          <View
            style={[
              styles.liveInputBar,
              { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
            ]}
          >
            <TextInput
              style={[styles.liveInput, { color: theme.text }]}
              placeholder="Send message to live villa..."
              placeholderTextColor={theme.textMuted}
              value={liveNewMessage}
              onChangeText={setLiveNewMessage}
            />
            <TouchableOpacity
              onPress={() => handleSendMessage('live', liveNewMessage, setLiveNewMessage, true)}
              style={[styles.liveSendBtn, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.liveSendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  // VIEW 3: Vote Screen
  const renderVoteView = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.voteHero,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.voteTitle, { color: theme.text }]}>Vote to Save</Text>
          <Text style={[styles.voteSubtitle, { color: theme.textMuted }]}>
            Which contestant should stay in the villa? Your votes directly determine who gets
            evicted tonight.
          </Text>
          <View style={[styles.timerPill, { backgroundColor: theme.lightGray }]}>
            <Text style={[styles.timerPillText, { color: theme.accent }]}>
              ⏰ Round ends in {timerText}
            </Text>
          </View>
        </View>

        {/* Contestants selection */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, marginLeft: Spacing.two, marginBottom: Spacing.one },
          ]}
        >
          Contestants in Danger
        </Text>
        <View style={styles.voteCandidates}>
          {contestants.slice(0, 5).map((c) => {
            const votesCount = evictionVotes[c.id as 'luna'] || 0;
            const totalVotes = Object.values(evictionVotes).reduce((a, b) => a + b, 0);
            const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
            const isSelected = activeVoteSelectedId === c.id;

            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.voteRow,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: isSelected ? theme.primary : theme.cardBorder,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => setActiveVoteSelectedId(c.id)}
              >
                <View style={styles.voteRowLeft}>
                  <Text style={styles.voteCandidateEmoji}>{c.avatar}</Text>
                  <View style={{ marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.voteCandidateName, { color: theme.text }]}>
                        {c.name}
                      </Text>
                      <Text style={{ color: theme.primary, marginLeft: 4 }}>✓</Text>
                    </View>
                    <Text style={[styles.voteCandidateBio, { color: theme.textMuted }]}>
                      {c.mbti}
                    </Text>
                  </View>
                </View>

                <View style={styles.voteRowRight}>
                  <Text style={[styles.votePercent, { color: theme.primary }]}>{percentage}%</Text>
                  <View style={[styles.radioOutline, { borderColor: theme.primary }]}>
                    {isSelected && (
                      <View style={[styles.radioFill, { backgroundColor: theme.primary }]} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Casting votes coins calculation */}
        <View
          style={[
            styles.walletCompute,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.computeRow}>
            <Text style={[styles.computeLabel, { color: theme.text }]}>Your Coins Balance</Text>
            <Text style={[styles.computeVal, { color: theme.yellow }]}>🪙 {coins}</Text>
          </View>
          <View style={styles.computeRow}>
            <Text style={[styles.computeLabel, { color: theme.text }]}>Vote Cost</Text>
            <Text style={[styles.computeVal, { color: theme.text }]}>10 Coins</Text>
          </View>
          <TouchableOpacity
            onPress={handleCastVote}
            style={[styles.castVoteBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.castVoteBtnText}>Cast Vote to Save</Text>
          </TouchableOpacity>
        </View>

        {/* Voting history */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              marginLeft: Spacing.two,
              marginTop: Spacing.two,
              marginBottom: Spacing.one,
            },
          ]}
        >
          Your Voting History
        </Text>
        <View
          style={[
            styles.historyContainer,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          {hasVotedInSavePoll ? (
            <View style={styles.historyRow}>
              <Text style={{ fontSize: 20 }}>🗳️</Text>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.historyAction, { color: theme.text }]}>
                  Saved {activeVoteSelectedId.toUpperCase()}
                </Text>
                <Text style={[styles.historyTime, { color: theme.textMuted }]}>
                  Just now • Deducted 10 Coins
                </Text>
              </View>
              <Text style={[styles.historyStatus, { color: theme.teal }]}>Processed</Text>
            </View>
          ) : (
            <Text style={[styles.noHistoryText, { color: theme.textMuted }]}>
              No votes cast in this episode yet. Use coins above to save your favorite!
            </Text>
          )}
        </View>
      </ScrollView>
    );
  };

  // VIEW 4: Contestants Screen
  const renderContestantsView = () => {
    const filteredList = contestants
      .filter((c) => {
        if (contestantFilter === 'Girls') return c.gender === 'girl';
        if (contestantFilter === 'Boys') return c.gender === 'boy';
        return true;
      })
      .filter((c) => c.name.toLowerCase().includes(contestantSearch.toLowerCase()));

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Villa Contestants</Text>
          <Text style={{ color: theme.textMuted }}>Season 3 Active Pool</Text>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchBarContainer,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={{ marginRight: 8, fontSize: 16 }}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search contestants..."
            placeholderTextColor={theme.textMuted}
            value={contestantSearch}
            onChangeText={setContestantSearch}
          />
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          {['All', 'Girls', 'Boys'].map((f) => {
            const isSelected = contestantFilter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setContestantFilter(f)}
                style={[
                  styles.filterBtn,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardBackground,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[styles.filterBtnText, { color: isSelected ? '#FFFFFF' : theme.text }]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Grid List */}
        <View style={styles.contestantsGrid}>
          {filteredList.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.gridCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
              ]}
              onPress={() => {
                setActiveContestantId(c.id);
                navigateTo('profile_detail');
              }}
            >
              <Image source={{ uri: c.imageUrl }} style={styles.gridImage} />
              <View style={styles.gridOverlay} />
              <View style={styles.gridBody}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.gridName}>{c.name}</Text>
                  <Text style={styles.gridBadge}>✓</Text>
                </View>
                <Text style={styles.gridMBTI}>{c.mbti.split('•')[1] || c.mbti}</Text>
                <View style={styles.gridPopularityContainer}>
                  <Text style={styles.gridPopularity}>🔥 Popularity: {c.popularity}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // VIEW 5: Contestant Profile Screen
  const renderContestantProfileView = () => {
    const c = contestants.find((item) => item.id === activeContestantId) || contestants[0];
    const isFanbaseJoined = joinedFanbases.includes(c.id);

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Back navigation header */}
        <View style={styles.profileHeaderNavigation}>
          <TouchableOpacity onPress={goBack} style={styles.profileBackBtn}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>◀ Back</Text>
          </TouchableOpacity>
          <Text style={styles.profileTitleHeader}>Contestant Profile</Text>
        </View>

        {/* Hero image and overlay card */}
        <View style={styles.profileHeroContainer}>
          <Image source={{ uri: c.imageUrl }} style={styles.profileHeroImg} />
          <View style={styles.profileHeroOverlay} />
          <View style={styles.profileBriefDetails}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.profileBriefName}>{c.name}</Text>
              <View style={[styles.verifiedBadge, { backgroundColor: theme.primary }]}>
                <Text style={{ color: '#FFF', fontSize: 10 }}>✓</Text>
              </View>
            </View>
            <Text style={styles.profileBriefLocation}>
              📍 {c.location} • {c.mbti}
            </Text>
          </View>
        </View>

        {/* Social Metrics */}
        <View
          style={[
            styles.profileStatsBar,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <View style={styles.profileStatCol}>
            <Text style={[styles.profileStatNum, { color: theme.text }]}>🔥 {c.popularity}%</Text>
            <Text style={styles.profileStatLbl}>Popularity</Text>
          </View>
          <View style={styles.profileStatCol}>
            <Text style={[styles.profileStatNum, { color: theme.text }]}>{c.fanbaseMembers}</Text>
            <Text style={styles.profileStatLbl}>Fanbase</Text>
          </View>
          <View style={styles.profileStatCol}>
            <Text style={[styles.profileStatNum, { color: theme.text }]}>{c.followers}</Text>
            <Text style={styles.profileStatLbl}>Followers</Text>
          </View>
        </View>

        {/* Action triggers buttons row */}
        <View style={styles.profileActionRow}>
          <TouchableOpacity
            onPress={() => {
              if (isFanbaseJoined) {
                setJoinedFanbases((prev) => prev.filter((id) => id !== c.id));
                Alert.alert('Left Fanbase', `You left #${c.id}-fanbase.`);
              } else {
                setJoinedFanbases((prev) => [...prev, c.id]);
                Alert.alert(
                  'Joined Fanbase! 🎉',
                  `Welcome to #${c.id}-fanbase! Earn exclusive chat multipliers.`
                );
              }
            }}
            style={[
              styles.profileActionBtn,
              { backgroundColor: isFanbaseJoined ? theme.teal : theme.primary },
            ]}
          >
            <Text style={styles.profileActionText}>
              {isFanbaseJoined ? 'Joined Fanbase' : 'Join Fanbase'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveGiftGiver(c.id);
              setGiftModalVisible(true);
            }}
            style={[styles.profileActionBtnMuted, { backgroundColor: theme.lightGray }]}
          >
            <Text style={[styles.profileActionTextMuted, { color: theme.text }]}>Send Gift 🎁</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveVoteSelectedId(c.id);
              switchTab('vote');
            }}
            style={[styles.profileActionBtnMuted, { backgroundColor: theme.lightGray }]}
          >
            <Text style={[styles.profileActionTextMuted, { color: theme.text }]}>Vote 🗳️</Text>
          </TouchableOpacity>
        </View>

        {/* Detail Tabs selector */}
        <View style={styles.profileTabRow}>
          {['About', 'Moments', 'Fanbase', 'Stats'].map((tab) => {
            const isSelected = profileDetailTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setProfileDetailTab(tab)}
                style={[
                  styles.profileTabBtn,
                  {
                    borderBottomColor: isSelected ? theme.primary : 'transparent',
                    borderBottomWidth: isSelected ? 3 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.profileTabText,
                    { color: isSelected ? theme.primary : theme.textMuted },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sub tab rendering content */}
        <View
          style={[
            styles.profileTabContentCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          {profileDetailTab === 'About' && (
            <View>
              <Text style={[styles.tabContentHeading, { color: theme.text }]}>About Me</Text>
              <Text style={[styles.tabContentBio, { color: theme.textMuted }]}>{c.bio}</Text>
              <Text style={[styles.tabContentHeading, { color: theme.text, marginTop: 12 }]}>
                Interests
              </Text>
              <View style={styles.tagsContainer}>
                {c.interests.map((interest: string) => (
                  <View
                    key={interest}
                    style={[styles.tagPill, { backgroundColor: theme.lightGray }]}
                  >
                    <Text style={[styles.tagText, { color: theme.primary }]}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {profileDetailTab === 'Moments' && (
            <View>
              <Text style={[styles.tabContentHeading, { color: theme.text }]}>Recent Moments</Text>
              {c.moments.map((m: string, idx: number) => (
                <View
                  key={idx}
                  style={[styles.momentRowItem, { borderBottomColor: theme.cardBorder }]}
                >
                  <Text style={{ fontSize: 24 }}>💬</Text>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={[styles.momentText, { color: theme.text }]}>{m}</Text>
                    <Text style={[styles.momentTime, { color: theme.textMuted }]}>
                      {idx + 1}d ago • Official Moment
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {profileDetailTab === 'Fanbase' && (
            <View>
              <Text style={[styles.tabContentHeading, { color: theme.text }]}>
                #{c.name.toLowerCase()}-fanbase
              </Text>
              <Text style={[styles.tabContentBio, { color: theme.textMuted }]}>
                Join other fans supporting {c.name}! Members earn double XP multipliers on active
                challenges and exclusive chat badges!
              </Text>
              <View style={styles.fanbaseStatRow}>
                <Text style={[styles.fanbaseStatVal, { color: theme.primary }]}>
                  Active Members: {c.fanbaseMembers}
                </Text>
              </View>
            </View>
          )}

          {profileDetailTab === 'Stats' && (
            <View>
              <Text style={[styles.tabContentHeading, { color: theme.text }]}>
                Performance Analytics
              </Text>
              <Text style={[styles.tabContentBio, { color: theme.textMuted }]}>
                Overall eviction votes secured: {c.votes.toLocaleString()} votes
              </Text>
              <View style={[styles.statProgBg, { backgroundColor: theme.lightGray }]}>
                <View
                  style={[
                    styles.statProgFill,
                    { backgroundColor: theme.primary, width: `${c.popularity}%` },
                  ]}
                />
              </View>
              <Text style={[styles.statProgLbl, { color: theme.text }]}>
                Popularity Index: {c.popularity}%
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  // VIEW 6: Rankings Tab
  const renderRankingsView = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Villa Leaderboards</Text>
          <Text style={{ color: theme.textMuted }}>Calculated popularity index</Text>
        </View>

        {/* Rankings selector tabs */}
        <View style={styles.rankTabRow}>
          {['Weekly', 'All Time', 'Fanbases'].map((r) => {
            const isSelected = rankingsTab === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => setRankingsTab(r)}
                style={[
                  styles.rankTabBtn,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardBackground,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.rankTabText, { color: isSelected ? '#FFFFFF' : theme.text }]}>
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Ranked contestants list */}
        <View
          style={[
            styles.rankListCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          {contestants
            .sort((a, b) => b.popularity - a.popularity)
            .map((c, index) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.rankListRow, { borderBottomColor: theme.cardBorder }]}
                onPress={() => {
                  setActiveContestantId(c.id);
                  navigateTo('profile_detail');
                }}
              >
                <Text style={[styles.rankNumberText, { color: theme.primary }]}>#{index + 1}</Text>
                <Text style={styles.rankAvatarBubble}>{c.avatar}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.rankName, { color: theme.text }]}>{c.name}</Text>
                  <Text style={[styles.rankDesc, { color: theme.textMuted }]}>{c.mbti}</Text>
                </View>
                <View style={styles.rankScoreCol}>
                  <Text style={[styles.rankScoreVal, { color: theme.primary }]}>
                    {c.popularity}%
                  </Text>
                  <Text style={[styles.rankScoreLbl, { color: theme.textMuted }]}>Score</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    );
  };

  // VIEW 7: Challenges Screen
  const renderChallengesView = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Daily Challenges</Text>
          <Text style={{ color: theme.textMuted }}>
            Support your favorites by completing quests
          </Text>
        </View>

        <View style={styles.challengesTabRow}>
          {['Active', 'Upcoming', 'Completed'].map((cTab) => {
            const isSelected = challengesTab === cTab;
            return (
              <TouchableOpacity
                key={cTab}
                onPress={() => setChallengesTab(cTab)}
                style={[
                  styles.challengeTabBtn,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.cardBackground,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[styles.challengeTabText, { color: isSelected ? '#FFFFFF' : theme.text }]}
                >
                  {cTab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active List */}
        <View style={styles.challengesList}>
          {challengesTab === 'Active' &&
            challenges.map((ch) => (
              <View
                key={ch.id}
                style={[
                  styles.challengeCard,
                  { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
                ]}
              >
                <View style={styles.challengeCardBody}>
                  <Text style={{ fontSize: 32 }}>⚡</Text>
                  <View style={{ marginLeft: 16, flex: 1 }}>
                    <Text style={[styles.challengeTitle, { color: theme.text }]}>{ch.title}</Text>
                    <Text style={[styles.challengeMeta, { color: theme.textMuted }]}>
                      {ch.type} • {ch.participants} joined • {ch.timeLeft}
                    </Text>
                    <Text style={[styles.challengeReward, { color: theme.yellow }]}>
                      🪙 Reward: {ch.rewardCoins} Coins
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleJoinChallenge(ch.id, ch.rewardCoins)}
                  disabled={ch.status !== 'active'}
                  style={[
                    styles.challengeActionBtn,
                    {
                      backgroundColor:
                        ch.status === 'active'
                          ? theme.primary
                          : ch.status === 'joined'
                            ? theme.yellow
                            : theme.teal,
                    },
                  ]}
                >
                  <Text style={styles.challengeActionBtnText}>
                    {ch.status === 'active'
                      ? 'Join'
                      : ch.status === 'joined'
                        ? 'In Progress...'
                        : 'Completed'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

          {challengesTab === 'Upcoming' && (
            <Text style={[styles.emptyTabMessage, { color: theme.textMuted }]}>
              New challenges unlock tomorrow at morning lounge check-in.
            </Text>
          )}

          {challengesTab === 'Completed' && (
            <View>
              {challenges.filter((c) => c.status === 'completed').length > 0 ? (
                challenges
                  .filter((c) => c.status === 'completed')
                  .map((ch) => (
                    <View
                      key={ch.id}
                      style={[
                        styles.challengeCard,
                        {
                          backgroundColor: theme.cardBackground,
                          borderColor: theme.teal,
                          borderWidth: 1.5,
                        },
                      ]}
                    >
                      <View style={styles.challengeCardBody}>
                        <Text style={{ fontSize: 32 }}>🏆</Text>
                        <View style={{ marginLeft: 16 }}>
                          <Text style={[styles.challengeTitle, { color: theme.text }]}>
                            {ch.title}
                          </Text>
                          <Text style={[styles.challengeReward, { color: theme.teal }]}>
                            Claimed {ch.rewardCoins} Coins!
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
              ) : (
                <Text style={[styles.emptyTabMessage, { color: theme.textMuted }]}>
                  No challenges finished yet. Join one under Active tab!
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  // VIEW 8: Community Screen
  const renderCommunityView = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Vibe Community</Text>
          <TouchableOpacity
            onPress={() => navigateTo('dms_inbox')}
            style={[styles.dmBubbleBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>DMs ✉</Text>
          </TouchableOpacity>
        </View>

        {/* Subtabs: Channels or Fanbases */}
        <View style={styles.commTabRow}>
          {['Channels', 'Fanbases'].map((tab) => {
            const isSelected = communityTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setCommunityTab(tab)}
                style={[
                  styles.commTabBtn,
                  {
                    borderBottomColor: isSelected ? theme.primary : 'transparent',
                    borderBottomWidth: isSelected ? 3 : 0,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.commTabText,
                    { color: isSelected ? theme.primary : theme.textMuted },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Channels List rendering */}
        {communityTab === 'Channels' && (
          <View style={styles.channelsList}>
            {CHANNELS_LIST.map((chan) => (
              <TouchableOpacity
                key={chan.id}
                style={[
                  styles.chanRow,
                  { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
                ]}
                onPress={() => {
                  setActiveChannelId(chan.id);
                  navigateTo('chat_room');
                }}
              >
                <Text style={{ fontSize: 24, marginRight: 12 }}>💬</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.chanName, { color: theme.text }]}>{chan.name}</Text>
                  <Text style={[styles.chanMembers, { color: theme.textMuted }]}>
                    {chan.members} Members active
                  </Text>
                </View>
                {chan.count > 0 && (
                  <View style={[styles.chanBadge, { backgroundColor: theme.accent }]}>
                    <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>
                      {chan.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Fanbases List rendering */}
        {communityTab === 'Fanbases' && (
          <View style={styles.channelsList}>
            {FANBASES_LIST.map((fan) => (
              <TouchableOpacity
                key={fan.id}
                style={[
                  styles.chanRow,
                  { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
                ]}
                onPress={() => {
                  setActiveChannelId(fan.id);
                  navigateTo('chat_room');
                }}
              >
                <Text style={{ fontSize: 24, marginRight: 12 }}>👑</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.chanName, { color: theme.text }]}>{fan.name}</Text>
                  <Text style={[styles.chanMembers, { color: theme.textMuted }]}>
                    {fan.members} Fans registered
                  </Text>
                </View>
                {fan.count > 0 && (
                  <View style={[styles.chanBadge, { backgroundColor: theme.primary }]}>
                    <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>
                      {fan.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  // VIEW 9: Wallet Screen
  const renderWalletView = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation header back */}
        <View style={styles.profileHeaderNavigation}>
          <TouchableOpacity onPress={goBack} style={styles.profileBackBtn}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>◀ Back</Text>
          </TouchableOpacity>
          <Text style={styles.profileTitleHeader}>Villa Wallet</Text>
        </View>

        {/* Balances card */}
        <View
          style={[
            styles.balancesCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.balancesCardTitle, { color: theme.text }]}>My Balance</Text>
          <View style={styles.balancesRowContainer}>
            <View style={styles.balanceValContainer}>
              <Text style={{ fontSize: 28 }}>🪙</Text>
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.balValTxt, { color: theme.text }]}>
                  {coins.toLocaleString()}
                </Text>
                <Text style={[styles.balValLbl, { color: theme.textMuted }]}>Coins</Text>
              </View>
            </View>
            <View style={styles.balanceValContainer}>
              <Text style={{ fontSize: 28 }}>💎</Text>
              <View style={{ marginLeft: 8 }}>
                <Text style={[styles.balValTxt, { color: theme.text }]}>{gems}</Text>
                <Text style={[styles.balValLbl, { color: theme.textMuted }]}>Gems</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buy Coins Packages */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, marginLeft: Spacing.two, marginBottom: Spacing.one },
          ]}
        >
          Buy Coins
        </Text>
        <View style={styles.coinPackagesList}>
          {COIN_PACKAGES.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard,
                { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
              ]}
              onPress={() => handleBuyCoins(pkg.coins, pkg.price)}
            >
              {pkg.tag && (
                <View style={[styles.packageTag, { backgroundColor: theme.accent }]}>
                  <Text style={styles.packageTagTxt}>{pkg.tag}</Text>
                </View>
              )}
              <Text style={{ fontSize: 32, marginBottom: Spacing.one }}>🪙</Text>
              <Text style={[styles.pkgCoinsText, { color: theme.text }]}>{pkg.coins} Coins</Text>
              <View style={[styles.pkgPriceBtn, { backgroundColor: theme.primary }]}>
                <Text style={styles.pkgPriceText}>{pkg.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stripe simulation */}
        <View
          style={[
            styles.paymentBanner,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={{ fontSize: 24 }}>💳</Text>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={[styles.paymentTitle, { color: theme.text }]}>
              Safe Checkout Guaranteed
            </Text>
            <Text style={[styles.paymentSub, { color: theme.textMuted }]}>
              Supports Apple Pay, Google Pay, and Stripe credit systems.
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  // VIEW 10: Rewards Pass Screen
  const renderRewardsPassView = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Back navigation */}
        <View style={styles.profileHeaderNavigation}>
          <TouchableOpacity onPress={goBack} style={styles.profileBackBtn}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>◀ Back</Text>
          </TouchableOpacity>
          <Text style={styles.profileTitleHeader}>Season Pass</Text>
        </View>

        {/* Level card */}
        <View
          style={[
            styles.rewardsPassHero,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.seasonPassTitle, { color: theme.text }]}>Season 3 Pass</Text>
          <View style={styles.passLevelRow}>
            <Text style={[styles.passLevelNum, { color: theme.primary }]}>Level {userLevel}</Text>
            <Text style={[styles.passXpRatio, { color: theme.textMuted }]}>{xp}/1000 XP</Text>
          </View>
          <View style={[styles.xpBarBg, { backgroundColor: theme.lightGray }]}>
            <View
              style={[
                styles.xpBarFill,
                { backgroundColor: theme.primary, width: `${(xp / 1000) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Rewards grid */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, marginLeft: Spacing.two, marginBottom: Spacing.one },
          ]}
        >
          Season Rewards items
        </Text>
        <View style={styles.rewardsGrid}>
          {REWARDS_PASS_ITEMS.map((item) => {
            const isItemUnlocked = item.type === 'free' || isPremium;
            return (
              <View
                key={item.id}
                style={[
                  styles.rewardPassItemCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: isItemUnlocked ? theme.teal : theme.cardBorder,
                  },
                ]}
              >
                <Text style={{ fontSize: 32 }}>{item.icon}</Text>
                <Text style={[styles.rewardItemName, { color: theme.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.rewardItemType,
                    { color: item.type === 'free' ? theme.teal : theme.accent },
                  ]}
                >
                  {item.type.toUpperCase()}
                </Text>
                <TouchableOpacity
                  disabled={!isItemUnlocked}
                  onPress={() =>
                    Alert.alert('Claimed! 🎁', `Unlocked and equipped "${item.name}"!`)
                  }
                  style={[
                    styles.rewardClaimBtn,
                    { backgroundColor: isItemUnlocked ? theme.primary : theme.lightGray },
                  ]}
                >
                  <Text style={styles.rewardClaimBtnTxt}>
                    {isItemUnlocked ? 'Equip' : '🔒 Locked'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Premium Upgrade Button */}
        {!isPremium && (
          <TouchableOpacity
            onPress={handleUpgradePremium}
            style={[styles.upgradePassBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.upgradePassBtnText}>Upgrade to Premium Pass (150 Gems)</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  // VIEW 11: Direct Messages Inbox Screen
  const renderDMsInboxView = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation header back */}
        <View style={styles.profileHeaderNavigation}>
          <TouchableOpacity onPress={goBack} style={styles.profileBackBtn}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>◀ Back</Text>
          </TouchableOpacity>
          <Text style={styles.profileTitleHeader}>Direct Messages</Text>
        </View>

        {/* DM Conversations List */}
        <View style={styles.dmInboxList}>
          {DM_LIST.map((dm) => (
            <TouchableOpacity
              key={dm.id}
              style={[
                styles.dmInboxRow,
                { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
              ]}
              onPress={() => {
                setActiveChannelId(dm.id);
                navigateTo('chat_room');
              }}
            >
              <View style={styles.trendingBorder}>
                <Text style={{ fontSize: 28 }}>{dm.avatar}</Text>
                {dm.status === 'Online' && (
                  <View style={[styles.statusDot, { backgroundColor: theme.green }]} />
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={[styles.dmInboxName, { color: theme.text }]}>{dm.name}</Text>
                  <Text style={[styles.dmInboxTime, { color: theme.textMuted }]}>{dm.time}</Text>
                </View>
                <Text
                  style={[
                    styles.dmInboxMsgText,
                    { color: theme.textMuted, fontWeight: dm.unread ? 'bold' : 'normal' },
                  ]}
                  numberOfLines={1}
                >
                  {dm.lastMessage}
                </Text>
              </View>
              {dm.unread && (
                <View style={[styles.dmInboxBadge, { backgroundColor: theme.accent }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // VIEW 12: Chat Room view
  const renderChatRoomView = () => {
    const isDM = activeChannelId.startsWith('dm-');
    let title = '';
    if (isDM) {
      const contestantId = activeChannelId.split('-')[1];
      const matched = contestants.find((c) => c.id === contestantId);
      title = matched ? `${matched.name} ${matched.avatar}` : 'VibeVilla official';
    } else {
      const matchedChan =
        CHANNELS_LIST.find((c) => c.id === activeChannelId) ||
        FANBASES_LIST.find((f) => f.id === activeChannelId);
      title = matchedChan ? matchedChan.name : 'Channel Room';
    }

    const messages = chatMessages[activeChannelId] || [];

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.profileHeaderNavigation}>
          <TouchableOpacity onPress={goBack} style={styles.profileBackBtn}>
            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>◀ Back</Text>
          </TouchableOpacity>
          <Text style={styles.profileTitleHeader}>{title}</Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: Spacing.two }}
          renderItem={({ item }) => {
            const isMe = item.sender.startsWith('You');
            return (
              <View
                style={[
                  styles.msgRow,
                  {
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    backgroundColor: isMe ? theme.primary : theme.cardBackground,
                  },
                ]}
              >
                <Text style={[styles.msgSender, { color: isMe ? '#FFFFFF' : theme.primary }]}>
                  {item.sender}
                </Text>
                <Text style={[styles.msgText, { color: isMe ? '#FFFFFF' : theme.text }]}>
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.msgTime,
                    { color: isMe ? 'rgba(255,255,255,0.7)' : theme.textMuted },
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            );
          }}
        />

        {/* Message Input bar */}
        <View
          style={[
            styles.chatInputBar,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <TextInput
            style={[styles.chatInput, { color: theme.text }]}
            placeholder="Type your message..."
            placeholderTextColor={theme.textMuted}
            value={channelInput}
            onChangeText={setChannelInput}
          />
          <TouchableOpacity
            onPress={() => handleSendMessage(activeChannelId, channelInput, setChannelInput, false)}
            style={[styles.chatSendBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.chatSendBtnTxt}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };

  // VIEW 13: Profile Screen
  const renderProfileView = () => {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View
          style={[
            styles.userCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={{ fontSize: 56, marginBottom: 8 }}>🧔</Text>
          <Text style={[styles.userName, { color: theme.text }]}>Alex Johnson</Text>
          <Text style={[styles.userStatus, { color: theme.teal }]}>● Audience Gold Level</Text>
          <View style={styles.userStatsRow}>
            <View style={styles.userStatCol}>
              <Text style={[styles.userStatNum, { color: theme.text }]}>12</Text>
              <Text style={styles.userStatLbl}>Votes Cast</Text>
            </View>
            <View style={styles.userStatCol}>
              <Text style={[styles.userStatNum, { color: theme.text }]}>420</Text>
              <Text style={styles.userStatLbl}>Gifts Dispatched</Text>
            </View>
            <View style={styles.userStatCol}>
              <Text style={[styles.userStatNum, { color: theme.text }]}>Level {userLevel}</Text>
              <Text style={styles.userStatLbl}>Rewards Pass</Text>
            </View>
          </View>
        </View>

        {/* Settings Links */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.text, marginLeft: Spacing.two, marginBottom: Spacing.one },
          ]}
        >
          Application Shortcuts
        </Text>
        <View
          style={[
            styles.shortcutsCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigateTo('wallet')}
            style={[styles.shortcutRow, { borderBottomColor: theme.cardBorder }]}
          >
            <Text style={{ fontSize: 20 }}>🪙</Text>
            <Text style={[styles.shortcutText, { color: theme.text }]}>
              Villa Wallet balance ({coins} Coins)
            </Text>
            <Text style={{ color: theme.textMuted }}>▶</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateTo('rewards_pass')}
            style={[styles.shortcutRow, { borderBottomColor: theme.cardBorder }]}
          >
            <Text style={{ fontSize: 20 }}>🎟️</Text>
            <Text style={[styles.shortcutText, { color: theme.text }]}>
              Claim season rewards & pass items
            </Text>
            <Text style={{ color: theme.textMuted }}>▶</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateTo('challenges_all')}
            style={[styles.shortcutRow, { borderBottomColor: theme.cardBorder }]}
          >
            <Text style={{ fontSize: 20 }}>⚡</Text>
            <Text style={[styles.shortcutText, { color: theme.text }]}>Join active challenges</Text>
            <Text style={{ color: theme.textMuted }}>▶</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateTo('rankings_all')}
            style={[styles.shortcutRow, { borderBottomColor: theme.cardBorder }]}
          >
            <Text style={{ fontSize: 20 }}>🏆</Text>
            <Text style={[styles.shortcutText, { color: theme.text }]}>
              Contestants Leaderboard Rankings
            </Text>
            <Text style={{ color: theme.textMuted }}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* User Achievements */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              marginLeft: Spacing.two,
              marginTop: Spacing.two,
              marginBottom: Spacing.one,
            },
          ]}
        >
          Unlocked Achievements
        </Text>
        <View style={styles.achievementsGrid}>
          <View
            style={[
              styles.achievementCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
            ]}
          >
            <Text style={{ fontSize: 28 }}>🔥</Text>
            <Text style={[styles.achievementTitle, { color: theme.text }]}>Vibe Master</Text>
            <Text style={[styles.achievementDesc, { color: theme.textMuted }]}>
              Voted in 5 eviction saves
            </Text>
          </View>
          <View
            style={[
              styles.achievementCard,
              { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder },
            ]}
          >
            <Text style={{ fontSize: 28 }}>👑</Text>
            <Text style={[styles.achievementTitle, { color: theme.text }]}>Gift Sovereign</Text>
            <Text style={[styles.achievementDesc, { color: theme.textMuted }]}>
              Dispatched a Crown gift
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  // Main UI render logic based on layout history
  const renderCurrentView = () => {
    if (currentView.type === 'subview') {
      switch (currentView.id) {
        case 'profile_detail':
          return renderContestantProfileView();
        case 'contestants_grid':
          return renderContestantsView();
        case 'chat_room':
          return renderChatRoomView();
        case 'wallet':
          return renderWalletView();
        case 'rewards_pass':
          return renderRewardsPassView();
        case 'challenges_all':
          return renderChallengesView();
        case 'rankings_all':
          return renderRankingsView();
        case 'dms_inbox':
          return renderDMsInboxView();
        default:
          return renderHomeView();
      }
    }

    // Active bottom navigation switcher
    switch (activeTab) {
      case 'home':
        return renderHomeView();
      case 'live':
        return renderLiveView();
      case 'vote':
        return renderVoteView();
      case 'community':
        return renderCommunityView();
      case 'profile':
        return renderProfileView();
      default:
        return renderHomeView();
    }
  };

  // Render floating overlay
  const renderFloatingOverlay = () => {
    return (
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
        {floatingEmojis.map((item) => (
          <FloatingEmojiItem key={item.id} emoji={item.emoji} left={item.left} />
        ))}
      </View>
    );
  };

  // Render bottom bar
  const renderBottomTabBar = () => {
    return null;
  };

  return (
    <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />
      {/* Universal header */}
      {currentView.id !== 'profile_detail' &&
        renderHeader('VibeVilla', currentView.type === 'subview')}

      <View style={{ flex: 1 }}>{renderCurrentView()}</View>

      {renderBottomTabBar()}

      {/* Floating Animations particles */}
      {renderFloatingOverlay()}

      {/* Gift shop modal */}
      <Modal visible={giftModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.giftShopCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.giftShopTitle, { color: theme.text }]}>
              Send a Support Gift 🎁
            </Text>
            <Text style={[styles.giftShopSubtitle, { color: theme.textMuted }]}>
              Supports contestant directly. Boost popularity scores instantly.
            </Text>

            <View style={styles.giftShopList}>
              {GIFT_SHOP.map((gift) => (
                <TouchableOpacity
                  key={gift.id}
                  style={[styles.giftCardItem, { backgroundColor: theme.lightGray }]}
                  onPress={() => handleSendGift(gift)}
                >
                  <Text style={{ fontSize: 32 }}>{gift.emoji}</Text>
                  <Text style={[styles.giftItemName, { color: theme.text }]}>{gift.name}</Text>
                  <Text style={[styles.giftItemCost, { color: theme.yellow }]}>🪙 {gift.cost}</Text>
                  <Text style={[styles.giftItemBoost, { color: theme.teal }]}>
                    +{gift.popularityBoost} Boost
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setGiftModalVisible(false)}
              style={[styles.closeModalBtn, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Log In Modal */}
      <Modal visible={loginModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.authModalCard}>
            <Text style={styles.authModalTitle}>Log In to VibeVilla</Text>
            <Text style={styles.authModalSubtitle}>Support your favorite contestants and watch live cams.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Enter email"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={loginEmail}
                onChangeText={setLoginEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Enter password"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry
                value={loginPassword}
                onChangeText={setLoginPassword}
              />
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.authSubmitBtn}>
              <Text style={styles.authSubmitBtnText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                setLoginModalVisible(false);
                setSignupModalVisible(true);
              }} 
              style={styles.authSwitchBtn}
            >
              <Text style={styles.authSwitchBtnText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setLoginModalVisible(false)} style={styles.authCancelBtn}>
              <Text style={styles.authCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sign Up Modal */}
      <Modal visible={signupModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.authModalCard}>
            <Text style={styles.authModalTitle}>Sign Up for VibeVilla</Text>
            <Text style={styles.authModalSubtitle}>Join the community and start voting!</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Enter name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={signupName}
                onChangeText={setSignupName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Enter email"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={signupEmail}
                onChangeText={setSignupEmail}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.authInput}
                placeholder="Create password"
                placeholderTextColor="rgba(255,255,255,0.4)"
                secureTextEntry
                value={signupPassword}
                onChangeText={setSignupPassword}
              />
            </View>

            <TouchableOpacity onPress={handleRegister} style={styles.authSubmitBtn}>
              <Text style={styles.authSubmitBtnText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                setSignupModalVisible(false);
                setLoginModalVisible(true);
              }} 
              style={styles.authSwitchBtn}
            >
              <Text style={styles.authSwitchBtnText}>Already have an account? Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSignupModalVisible(false)} style={styles.authCancelBtn}>
              <Text style={styles.authCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  backBtn: {
    padding: Spacing.one,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vibeVillaLogoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#a855f7',
    fontStyle: 'italic',
    ...Platform.select({
      web: {
        textShadow: '0 0 10px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.4)',
      },
    }),
  },
  headerNavMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    ...Platform.select({
      web: {
        marginLeft: Spacing.three,
      },
    }),
  },
  headerNavLink: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  headerNavLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#110f2c',
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    height: 36,
    width: 180,
    borderWidth: 1,
    borderColor: '#1e1c3a',
  },
  searchIconSymbol: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginRight: 6,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#ffffff',
    padding: 0,
  },
  headerBellBtn: {
    padding: Spacing.one,
    marginRight: Spacing.one,
  },
  headerAuthButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  headerLoginBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  headerLoginBtnText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerSignupBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#ff6b35',
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(135deg, #f43f5e, #f97316)',
      },
    }),
  },
  headerSignupBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerUserSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.oneHalf,
  },
  headerWalletDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 58, 0.6)',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1e1c3a',
  },
  headerWalletValueText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  headerUserProfileBtn: {
    paddingHorizontal: Spacing.one,
  },
  headerUserGreetingText: {
    color: '#a855f7',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerLogoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerLogoutBtnText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: Spacing.four,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.two,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.oneHalf,
    height: 48,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filterButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 14,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  homeHeroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.two,
    marginTop: Spacing.two,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
  },
  appSubtitle: {
    fontSize: 13,
    marginTop: Spacing.half,
  },
  notifyBellCard: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: Spacing.one,
  },
  heroBadgeLabel: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroBadgeMeta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    marginTop: 2,
  },
  heroTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStatsRow: {
    flexDirection: 'row',
    marginTop: Spacing.two,
  },
  heroStatPill: {
    borderRadius: 18,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    minWidth: 106,
    marginRight: Spacing.two,
  },
  heroStatValue: {
    fontSize: 14,
    fontWeight: '900',
  },
  heroStatLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  heroActionRow: {
    flexDirection: 'row',
    marginTop: Spacing.two,
    alignItems: 'center',
  },
  heroGlassStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  heroGlassStat: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.oneHalf,
    marginRight: Spacing.one,
  },
  heroGlassStatLast: {
    marginRight: 0,
  },
  heroGlassLabel: {
    color: '#F8FAFC',
    fontSize: 10,
    marginBottom: 2,
    fontWeight: '600',
  },
  heroGlassValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  heroOutlineBtn: {
    marginLeft: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 16,
    borderWidth: 1,
  },
  heroOutlineText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  glassFeatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  glassFeatureCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.two,
    marginRight: Spacing.one,
    marginBottom: Spacing.one,
    minHeight: 110,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 3,
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
    flexWrap: 'wrap',
  },
  miniStatCard: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.two,
    marginRight: Spacing.one,
    minWidth: 104,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 3,
  },
  miniStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  miniStatValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  miniStatHint: {
    fontSize: 11,
    lineHeight: 16,
  },
  pulseCard: {
    marginHorizontal: Spacing.two,
    borderRadius: 28,
    borderWidth: 1,
    padding: Spacing.two,
    marginBottom: Spacing.two,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 5,
  },
  pulseTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.one,
  },
  pulseTag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    marginRight: Spacing.one,
    marginBottom: Spacing.one,
  },
  pulseTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pulseHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: Spacing.one,
    lineHeight: 20,
  },
  pulseStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pulseStatItem: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: Spacing.one,
    marginRight: Spacing.one,
  },
  pulseStatLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  pulseStatValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  featurePanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.two,
    marginBottom: Spacing.three,
  },
  panelCard: {
    width: '48%',
    borderRadius: 28,
    borderWidth: 1,
    padding: Spacing.two,
    marginBottom: Spacing.two,
    minHeight: 210,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: Spacing.one,
  },
  panelItem: {
    marginBottom: Spacing.one,
    paddingBottom: Spacing.one,
    borderBottomWidth: 1,
  },
  panelItemTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  panelItemMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  panelBtn: {
    marginTop: Spacing.two,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: Spacing.half,
  },
  trendingCard: {
    width: 140,
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.two,
    marginRight: Spacing.one,
    alignItems: 'center',
  },
  trendingCardAvatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  trendingCardEmoji: {
    fontSize: 34,
  },
  trendingCardName: {
    fontSize: 14,
    fontWeight: '800',
  },
  trendingCardSub: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  trendingFooter: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  trendingFooterText: {
    fontSize: 10,
  },
  trendingFooterValue: {
    fontSize: 10,
    fontWeight: '900',
  },
  popularRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.two,
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  coupleMiniCard: {
    width: '48%',
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.two,
  },
  coupleMiniAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  coupleMiniText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  coupleMiniMeta: {
    fontSize: 11,
    marginTop: Spacing.one,
  },
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.two,
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.two,
  },
  quickCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: Spacing.one,
  },
  quickMetric: {
    fontSize: 18,
    fontWeight: '900',
  },
  quickMeta: {
    fontSize: 11,
    marginTop: Spacing.one,
    lineHeight: 16,
  },
  heroContainer: {
    height: 260,
    marginHorizontal: Spacing.two,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: Spacing.three,
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(30, 27, 75, 0.45)',
  },
  heroContent: {
    position: 'absolute',
    bottom: Spacing.two,
    left: Spacing.two,
    right: Spacing.two,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F43F5E',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  heroTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroMainTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 2,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginBottom: Spacing.one,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  homeLogo: {
    fontSize: 28,
    fontWeight: '900',
  },
  homeSubtitle: {
    fontSize: 13,
    marginTop: Spacing.one,
    maxWidth: SCREEN_WIDTH * 0.65,
    lineHeight: 20,
  },
  homeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeIconButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.one,
  },
  homeIcon: {
    fontSize: 18,
  },
  homeNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.two,
    marginBottom: Spacing.two,
    flexWrap: 'wrap',
  },
  homeNavItem: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: Spacing.one,
  },
  homeNavText: {
    fontSize: 12,
    fontWeight: '900',
  },
  heroSection: {
    marginBottom: Spacing.three,
  },
  heroPanel: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    minHeight: 320,
    marginHorizontal: Spacing.two,
    marginBottom: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  heroPanelImage: {
    width: '100%',
    height: 260,
  },
  heroPanelOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 17, 34, 0.42)',
  },
  heroPanelContent: {
    position: 'absolute',
    left: Spacing.two,
    right: Spacing.two,
    bottom: Spacing.two,
  },
  heroPanelTag: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.one,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: Spacing.one,
  },
  heroPanelTagText: {
    color: '#E9D5FF',
    fontSize: 11,
    fontWeight: '900',
  },
  heroPanelTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: Spacing.one,
  },
  heroPanelDesc: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A78BFA',
    marginRight: Spacing.one,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: Spacing.two,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.two,
    marginBottom: Spacing.one,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  trendingShowImage: {
    width: 140,
    height: 110,
    borderRadius: 20,
    marginBottom: Spacing.one,
  },
  homeSplitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.two,
    marginBottom: Spacing.three,
  },
  categoryPanel: {
    flex: 1,
    minWidth: SCREEN_WIDTH * 0.48,
    borderRadius: 28,
    borderWidth: 1,
    padding: Spacing.two,
    marginBottom: Spacing.two,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.two,
    marginBottom: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: Spacing.one,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  premiumCard: {
    flex: 1,
    minWidth: SCREEN_WIDTH * 0.44,
    borderRadius: 28,
    borderWidth: 1,
    padding: Spacing.two,
    justifyContent: 'space-between',
  },
  premiumText: {
    fontSize: 12,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  premiumButton: {
    borderRadius: 18,
    paddingVertical: Spacing.one,
    alignItems: 'center',
  },
  premiumButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  homeHeroContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    marginBottom: Spacing.three,
    alignItems: 'center',
    gap: Spacing.four,
    backgroundColor: '#060515',
    ...Platform.select({
      web: {
        minHeight: 480,
      },
    }),
  },
  homeHeroLeft: {
    flex: 1.1,
    paddingRight: Spacing.two,
  },
  liveNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: Spacing.three,
  },
  liveNowBadgeText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 6,
  },
  liveNowEpisodeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '600',
  },
  homeHeroLine1: {
    fontSize: 52,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 60,
  },
  homeHeroLine2: {
    fontSize: 52,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 60,
  },
  homeHeroLine3: {
    fontSize: 52,
    fontWeight: '900',
    color: '#a855f7',
    lineHeight: 60,
    marginBottom: Spacing.three,
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(45deg, #a855f7, #f97316)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
    }),
  },
  homeHeroDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.four,
  },
  homeHeroButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  heroPlayBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 26,
    backgroundColor: '#f43f5e',
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(135deg, #f43f5e, #f97316)',
      },
    }),
  },
  heroPlayBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  heroOutlineBtnLarge: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
  },
  heroOutlineBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 13,
  },
  activeViewersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarStackSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    fontSize: 22,
    borderWidth: 2,
    borderColor: '#060515',
    borderRadius: 15,
    backgroundColor: '#110f2c',
    padding: 2,
  },
  activeViewerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  homeHeroRight: {
    flex: 0.9,
    position: 'relative',
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeHeroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  truthGameCard: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 250,
    padding: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2d1b54',
    backgroundColor: '#0a081e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  truthGameLiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: Spacing.one,
  },
  liveTagRedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginRight: 4,
  },
  truthGameLiveText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
  },
  truthGameTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  truthGameSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: Spacing.two,
  },
  truthGameStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  truthGameAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truthGameAvatar: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#0a081e',
    borderRadius: 10,
    backgroundColor: '#110f2c',
    padding: 1,
  },
  truthGameAvatarPlus: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  truthGameViewersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  truthGameViewers: {
    color: '#60a5fa',
    fontSize: 10,
    fontWeight: 'bold',
  },
  truthGameWatchBtn: {
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#7c3aed',
  },
  truthGameWatchBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  trendingSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.two,
    marginTop: Spacing.four,
  },
  trendingSectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
  },
  seeAllShowsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#60a5fa',
  },
  trendingShowsScroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  trendingShowCard: {
    width: 170,
    marginRight: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e1c3a',
    backgroundColor: '#0a081e',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  trendingShowCardImage: {
    width: '100%',
    height: 110,
  },
  trendingShowLiveTag: {
    position: 'absolute',
    top: Spacing.oneHalf,
    left: Spacing.oneHalf,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  liveTagText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  trendingShowCardContent: {
    padding: Spacing.oneHalf,
  },
  trendingShowCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  trendingShowViewersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingShowViewersIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  trendingShowViewersNum: {
    fontSize: 11,
    fontWeight: '900',
    color: '#60a5fa',
  },
  homeStatsAndPremiumRow: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    marginTop: Spacing.three,
    gap: Spacing.three,
    ...Platform.select({
      web: {
        flexDirection: 'row',
      },
      default: {
        flexDirection: 'column',
      },
    }),
  },
  statsBarContainer: {
    flex: 1.8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.three,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e1c3a',
    backgroundColor: '#0a081e',
  },
  statBarItem: {
    alignItems: 'center',
  },
  statBarEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  statBarValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 2,
  },
  statBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  premiumMemberPanel: {
    flex: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2d1b54',
    backgroundColor: '#0f0a2a',
    alignItems: 'center',
  },
  premiumMemberEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  premiumMemberTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 4,
  },
  premiumMemberDesc: {
    fontSize: 11,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.two,
    lineHeight: 16,
  },
  upgradeNowBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#f43f5e',
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(135deg, #f43f5e, #7c3aed)',
      },
    }),
  },
  upgradeNowBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  exploreCategoryContainer: {
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    marginTop: Spacing.three,
  },
  exploreCategoryTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  categoryGridHome: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  categoryCardHome: {
    width: '23%',
    aspectRatio: 1.2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e1c3a',
    backgroundColor: '#0a081e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  categoryIconHome: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryLabelHome: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  authModalCard: {
    width: 320,
    padding: Spacing.four,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2d1b54',
    backgroundColor: '#0a081e',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  authModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  authModalSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  inputGroup: {
    marginBottom: Spacing.two,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  authInput: {
    backgroundColor: '#110f2c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e1c3a',
    paddingHorizontal: Spacing.two,
    height: 40,
    color: '#ffffff',
    fontSize: 13,
  },
  authSubmitBtn: {
    backgroundColor: '#7c3aed',
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  authSubmitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  authSwitchBtn: {
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  authSwitchBtnText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '600',
  },
  authCancelBtn: {
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authCancelBtnText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.one,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  seeAllText: {
    fontWeight: 'bold',
  },
  horizontalScroll: {
    paddingLeft: Spacing.two,
    paddingRight: Spacing.one,
    marginBottom: Spacing.three,
  },
  trendingBubbleContainer: {
    alignItems: 'center',
    marginRight: Spacing.two,
  },
  trendingBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  trendingEmoji: {
    fontSize: 32,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  trendingName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  trendingSub: {
    fontSize: 10,
  },
  couplesContainer: {
    paddingHorizontal: Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coupleCard: {
    width: '48%',
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.oneHalf,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  coupleAvatars: {
    flexDirection: 'row',
  },
  coupleEmoji: {
    fontSize: 24,
  },
  coupleInfo: {
    marginLeft: 8,
    flex: 1,
  },
  coupleNames: {
    fontSize: 12,
    fontWeight: '800',
  },
  couplePercent: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  continueSection: {
    paddingHorizontal: Spacing.two,
  },
  continueCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 5,
  },
  continueThumb: {
    width: 90,
    height: 70,
  },
  continueBody: {
    flex: 1,
    padding: Spacing.one,
  },
  continueTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  continueSub: {
    fontSize: 11,
    marginTop: 2,
  },
  clipsScroll: {
    paddingLeft: Spacing.two,
  },
  clipCard: {
    width: 150,
    height: 100,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.oneHalf,
    padding: Spacing.one,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  clipTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
    textAlign: 'center',
  },
  bottomTabBar: {
    height: 70,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#E6E8F0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.one,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 8,
  },
  tabBtnItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: Spacing.one,
  },
  tabBtnLabel: {
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
  },
  liveVideoPlayer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  liveVideoFrame: {
    width: '100%',
    height: '100%',
  },
  videoPlayerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: Spacing.oneHalf,
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  videoTimer: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  liveStatsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: Spacing.oneHalf,
  },
  liveStatItem: {
    alignItems: 'center',
  },
  liveStatVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  liveStatLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  liveChatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: Spacing.two,
    marginBottom: Spacing.one,
  },
  liveChatContainer: {
    height: 180,
    marginHorizontal: Spacing.two,
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.oneHalf,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  chatBubble: {
    flexDirection: 'row',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  chatSender: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  chatBodyText: {
    fontSize: 12,
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    marginVertical: Spacing.oneHalf,
    alignItems: 'center',
  },
  reactionBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.oneHalf,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveInputBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.half,
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  liveInput: {
    flex: 1,
    height: 40,
    paddingLeft: Spacing.one,
  },
  liveSendBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 16,
  },
  liveSendBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 80,
    zIndex: 9999,
  },
  floatingText: {
    fontSize: 32,
  },
  voteHero: {
    margin: Spacing.two,
    borderRadius: 26,
    borderWidth: 1,
    padding: Spacing.two,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
  },
  voteTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  voteSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: Spacing.one,
  },
  timerPill: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
  },
  timerPillText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  voteCandidates: {
    paddingHorizontal: Spacing.two,
  },
  voteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.oneHalf,
    marginBottom: Spacing.oneHalf,
  },
  voteRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCandidateEmoji: {
    fontSize: 32,
  },
  voteCandidateName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  voteCandidateBio: {
    fontSize: 11,
    marginTop: 2,
  },
  voteRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  votePercent: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  radioOutline: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  walletCompute: {
    margin: Spacing.two,
    borderRadius: 26,
    borderWidth: 1,
    padding: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  computeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  computeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  computeVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  castVoteBtn: {
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  castVoteBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  historyContainer: {
    marginHorizontal: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.oneHalf,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyAction: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  historyTime: {
    fontSize: 11,
    marginTop: 2,
  },
  historyStatus: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  noHistoryText: {
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: Spacing.one,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  filterBtn: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: Spacing.one,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  contestantsGrid: {
    paddingHorizontal: Spacing.two,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.two,
  },
  gridImage: {
    width: '100%',
    height: 180,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  gridBody: {
    padding: Spacing.oneHalf,
  },
  gridName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  gridBadge: {
    color: '#3B82F6',
    marginLeft: 4,
  },
  gridMBTI: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  gridPopularityContainer: {
    marginTop: 6,
  },
  gridPopularity: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F43F5E',
  },
  profileHeaderNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    backgroundColor: '#7C3AED',
  },
  profileBackBtn: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.oneHalf,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  profileTitleHeader: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  profileHeroContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  profileHeroImg: {
    width: '100%',
    height: '100%',
  },
  profileHeroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  profileBriefDetails: {
    position: 'absolute',
    bottom: Spacing.two,
    left: Spacing.two,
  },
  profileBriefName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  profileBriefLocation: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  profileStatsBar: {
    flexDirection: 'row',
    margin: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: Spacing.oneHalf,
  },
  profileStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatNum: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileStatLbl: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  profileActionRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.two,
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  profileActionBtn: {
    flex: 2,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.one,
  },
  profileActionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  profileActionBtnMuted: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.half,
  },
  profileActionTextMuted: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  profileTabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  profileTabBtn: {
    paddingVertical: Spacing.one,
    marginRight: Spacing.three,
  },
  profileTabText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  profileTabContentCard: {
    marginHorizontal: Spacing.two,
    borderRadius: 26,
    borderWidth: 1,
    padding: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  tabContentHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  tabContentBio: {
    fontSize: 12,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.one,
  },
  tagPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  momentRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.one,
    borderBottomWidth: 1,
  },
  momentText: {
    fontSize: 12,
    lineHeight: 18,
  },
  momentTime: {
    fontSize: 10,
    marginTop: 2,
  },
  fanbaseStatRow: {
    marginTop: Spacing.one,
  },
  fanbaseStatVal: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statProgBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    marginVertical: Spacing.one,
  },
  statProgFill: {
    height: '100%',
    borderRadius: 4,
  },
  statProgLbl: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  rankTabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  rankTabBtn: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: Spacing.one,
  },
  rankTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rankListCard: {
    marginHorizontal: Spacing.two,
    borderRadius: 24,
    borderWidth: 1,
  },
  rankListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.oneHalf,
    borderBottomWidth: 1,
  },
  rankNumberText: {
    fontSize: 16,
    fontWeight: '900',
    width: 32,
  },
  rankAvatarBubble: {
    fontSize: 28,
  },
  rankName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  rankDesc: {
    fontSize: 11,
  },
  rankScoreCol: {
    alignItems: 'flex-end',
  },
  rankScoreVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rankScoreLbl: {
    fontSize: 9,
  },
  challengesTabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  challengeTabBtn: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: Spacing.one,
  },
  challengeTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  challengesList: {
    paddingHorizontal: Spacing.two,
  },
  challengeCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.oneHalf,
    marginBottom: Spacing.oneHalf,
  },
  challengeCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  challengeMeta: {
    fontSize: 11,
    marginVertical: 2,
  },
  challengeReward: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  challengeActionBtn: {
    borderRadius: 12,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  challengeActionBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyTabMessage: {
    textAlign: 'center',
    marginTop: Spacing.three,
    fontSize: 12,
  },
  dmBubbleBtn: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.oneHalf,
    borderRadius: 12,
  },
  commTabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  commTabBtn: {
    paddingVertical: Spacing.one,
    marginRight: Spacing.three,
  },
  commTabText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  channelsList: {
    paddingHorizontal: Spacing.two,
  },
  chanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.oneHalf,
    marginBottom: Spacing.one,
  },
  chanName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  chanMembers: {
    fontSize: 11,
    marginTop: 2,
  },
  chanBadge: {
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  balancesCard: {
    margin: Spacing.two,
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.two,
  },
  balancesCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  balancesRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceValContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
  },
  balValTxt: {
    fontSize: 20,
    fontWeight: '900',
  },
  balValLbl: {
    fontSize: 10,
    marginTop: 2,
  },
  coinPackagesList: {
    paddingHorizontal: Spacing.two,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  packageCard: {
    width: '48%',
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    padding: Spacing.two,
    position: 'relative',
    marginBottom: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  packageTag: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  packageTagTxt: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  pkgCoinsText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: Spacing.one,
  },
  pkgPriceBtn: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
  },
  pkgPriceText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  paymentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.oneHalf,
  },
  paymentTitle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  paymentSub: {
    fontSize: 10,
    marginTop: 2,
  },
  rewardsPassHero: {
    margin: Spacing.two,
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.two,
  },
  seasonPassTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passLevelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.one,
  },
  passLevelNum: {
    fontSize: 18,
    fontWeight: '900',
  },
  passXpRatio: {
    fontSize: 12,
  },
  xpBarBg: {
    height: 10,
    borderRadius: 5,
    width: '100%',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  rewardsGrid: {
    paddingHorizontal: Spacing.two,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rewardPassItemCard: {
    width: '48%',
    borderRadius: 26,
    borderWidth: 1,
    padding: Spacing.oneHalf,
    alignItems: 'center',
    marginBottom: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  rewardItemName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
  },
  rewardItemType: {
    fontSize: 9,
    fontWeight: '900',
    marginVertical: 4,
  },
  rewardClaimBtn: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.oneHalf,
    borderRadius: 8,
    marginTop: 4,
  },
  rewardClaimBtnTxt: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  upgradePassBtn: {
    margin: Spacing.two,
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradePassBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  dmInboxList: {
    paddingHorizontal: Spacing.two,
  },
  dmInboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    padding: Spacing.oneHalf,
    marginBottom: Spacing.one,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  dmInboxName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  dmInboxTime: {
    fontSize: 9,
  },
  dmInboxMsgText: {
    fontSize: 11,
    marginTop: 2,
  },
  dmInboxBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    right: Spacing.two,
    top: 24,
  },
  msgRow: {
    borderRadius: 16,
    padding: Spacing.one,
    marginBottom: Spacing.one,
    maxWidth: '75%',
  },
  msgSender: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  msgText: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  msgTime: {
    fontSize: 8,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputBar: {
    flexDirection: 'row',
    padding: Spacing.half,
    borderWidth: 1,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: Spacing.one,
  },
  chatSendBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 12,
  },
  chatSendBtnTxt: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  userCard: {
    margin: Spacing.two,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    padding: Spacing.two,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  userStatsRow: {
    flexDirection: 'row',
    marginTop: Spacing.two,
  },
  userStatCol: {
    flex: 1,
    alignItems: 'center',
  },
  userStatNum: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  userStatLbl: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  shortcutsCard: {
    marginHorizontal: Spacing.two,
    borderRadius: 26,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.oneHalf,
    borderBottomWidth: 1,
  },
  shortcutText: {
    flex: 1,
    fontSize: 13,
    marginLeft: 12,
    fontWeight: 'bold',
  },
  achievementsGrid: {
    paddingHorizontal: Spacing.two,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    borderRadius: 26,
    borderWidth: 1,
    padding: Spacing.oneHalf,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },
  achievementDesc: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  giftShopCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.two,
    maxHeight: '60%',
  },
  giftShopTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  giftShopSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 6,
  },
  giftShopList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: Spacing.one,
  },
  giftCardItem: {
    width: '48%',
    borderRadius: 22,
    alignItems: 'center',
    padding: Spacing.oneHalf,
    marginBottom: Spacing.oneHalf,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  giftItemName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  giftItemCost: {
    fontSize: 11,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  giftItemBoost: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  closeModalBtn: {
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  closeModalText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
