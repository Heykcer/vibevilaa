import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Contestant, Channel, Challenge, Reward, Show, Episode } from '../models/index.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vibevilaa';

const SEED_CONTESTANTS = [
  {
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

const SEED_CHANNELS = [
  { name: '# general-chat', description: 'Main chatroom for audience', membersCount: '12.3K' },
  { name: '# episode-discussion', description: 'Talk about recent events', membersCount: '8.2K' },
  { name: '# memes', description: 'Funny photos and memes from the villa', membersCount: '6.1K' },
  { name: '# fan-theories', description: 'Predictions and conspiracy logs', membersCount: '4.8K' },
  { name: '# clips-highlights', description: 'Slices and short videos', membersCount: '3.2K' },
];

const SEED_CHALLENGES = [
  {
    title: 'Treasure Hunt',
    type: 'Team Challenge',
    participants: 24,
    timeLeft: '12h left',
    rewardCoins: 500,
    status: 'active',
  },
  {
    title: 'Love Quiz',
    type: 'Love Challenge',
    participants: 18,
    timeLeft: '6h left',
    rewardCoins: 300,
    status: 'active',
  },
  {
    title: 'Secret Mission',
    type: 'Secret Challenge',
    participants: 12,
    timeLeft: '1d left',
    rewardCoins: 700,
    status: 'active',
  },
];

const SEED_REWARDS = [
  { name: 'Emerald Frame', type: 'free', icon: '🟢', unlocked: true },
  { name: 'Silver Badge', type: 'free', icon: '🪙', unlocked: true },
  { name: 'Violet Gem', type: 'free', icon: '💎', unlocked: true },
  { name: 'Speech Bubble', type: 'free', icon: '💬', unlocked: true },
  { name: 'Golden Crown', type: 'premium', icon: '👑', unlocked: false },
  { name: 'Neon Glint', type: 'premium', icon: '✨', unlocked: false },
  { name: 'VIP Ticket', type: 'premium', icon: '🎟️', unlocked: false },
  { name: 'Pegasus Pet', type: 'premium', icon: '🦄', unlocked: false },
];

const seedDatabase = async () => {
  try {
    console.log('📡 Seeding database connection opening...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully.');

    // Delete existing records
    await Contestant.deleteMany();
    await Channel.deleteMany();
    await Challenge.deleteMany();
    await Reward.deleteMany();
    await Show.deleteMany();
    await Episode.deleteMany();

    console.log('🧹 Existing database records purged.');

    // Seed Shows
    const show = await Show.create({
      title: 'VibeVilla Reality Show',
      description: 'The premium virtual reality show platform',
    });

    // Seed Episode
    await Episode.create({
      showId: show._id,
      title: 'The Truth Game',
      episodeNumber: 12,
      description: 'Drama, Romance, Secrets. Who survives eviction?',
      viewerCount: 245000,
      likesCount: 125000,
      votesCount: 3400000,
      liveStreamActive: true,
    });

    // Seed Contestants
    await Contestant.insertMany(SEED_CONTESTANTS);
    console.log('🧔 Contestants data seeded successfully.');

    // Seed Channels
    await Channel.insertMany(SEED_CHANNELS);
    console.log('💬 Chat channels seeded successfully.');

    // Seed Challenges
    await Challenge.insertMany(SEED_CHALLENGES);
    console.log('⚡ Challenges list seeded successfully.');

    // Seed Rewards
    await Reward.insertMany(SEED_REWARDS);
    console.log('🎁 Season pass rewards seeded successfully.');

    console.log('🎉 Database seeding completely processed without errors!');
    process.exit(0);
  } catch (error) {
    console.error(`💥 Error while seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
