import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// 1. User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['audience', 'admin'], default: 'audience' },
  balanceCoins: { type: Number, default: 2450 },
  balanceGems: { type: Number, default: 380 },
  isPremium: { type: Boolean, default: false },
  achievements: [{ type: String }],
  stripeCustomerId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// 2. Contestant Schema
const ContestantSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['boy', 'girl'], required: true },
  avatar: { type: String, required: true }, // Emoji or Avatar ID
  avatarColor: { type: String, default: '#7C3AED' },
  imageUrl: { type: String },
  popularity: { type: Number, default: 50 },
  votes: { type: Number, default: 0 },
  followers: { type: String, default: '0' },
  fanbaseMembers: { type: String, default: '0' },
  location: { type: String, default: 'Villa Lounge' },
  mbti: { type: String, default: 'Mysterious • XXXX' },
  bio: { type: String },
  interests: [{ type: String }],
  moments: [{ type: String }],
});

// 3. Show Schema
const ShowSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
});

// 4. Episode Schema
const EpisodeSchema = new Schema({
  showId: { type: Schema.Types.ObjectId, ref: 'Show' },
  title: { type: String, required: true },
  episodeNumber: { type: Number, required: true },
  description: { type: String },
  mediaUrl: { type: String },
  liveStreamActive: { type: Boolean, default: false },
  viewerCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  votesCount: { type: Number, default: 0 },
});

// 5. Vote Schema
const VoteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  contestantId: { type: Schema.Types.ObjectId, ref: 'Contestant' },
  episodeId: { type: Schema.Types.ObjectId, ref: 'Episode' },
  coinsDeducted: { type: Number, default: 10 },
  timestamp: { type: Date, default: Date.now },
});

// 6. Fanbase Schema
const FanbaseSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  contestantId: { type: Schema.Types.ObjectId, ref: 'Contestant' },
  membersCount: { type: String, default: '0' },
});

// 7. Follower Schema
const FollowerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  contestantId: { type: Schema.Types.ObjectId, ref: 'Contestant' },
  joinedAt: { type: Date, default: Date.now },
});

// 8. Message Schema
const MessageSchema = new Schema({
  channelId: { type: String, required: true }, // Can map to Channel ID or DM Room ID
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String },
  timestamp: { type: Date, default: Date.now },
});

// 9. Channel Schema
const ChannelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  membersCount: { type: String, default: '0' },
  unreadCount: { type: Number, default: 0 },
});

// 10. Challenge Schema
const ChallengeSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'General' },
  participants: { type: Number, default: 0 },
  timeLeft: { type: String },
  rewardCoins: { type: Number, default: 100 },
  status: { type: String, enum: ['active', 'joined', 'completed'], default: 'active' },
});

// 11. Reward Schema
const RewardSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['free', 'premium'], default: 'free' },
  icon: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
});

// 12. Transaction Schema
const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  amountCoins: { type: Number, default: 0 },
  amountGems: { type: Number, default: 0 },
  pricePaid: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  transactionType: {
    type: String,
    enum: ['deposit', 'purchase', 'withdrawal'],
    default: 'deposit',
  },
  createdAt: { type: Date, default: Date.now },
});

// 13. Notification Schema
const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

// 14. Subscription Schema
const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  plan: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  nextBillingDate: { type: Date },
});

// 15. Gift Schema
const GiftSchema = new Schema({
  name: { type: String, required: true },
  emoji: { type: String, required: true },
  cost: { type: Number, required: true },
  popularityBoost: { type: Number, required: true },
});

// 16. Comment Schema
const CommentSchema = new Schema({
  episodeId: { type: Schema.Types.ObjectId, ref: 'Episode' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// 17. Like Schema
const LikeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  targetId: { type: Schema.Types.ObjectId },
  targetType: { type: String, enum: ['Episode', 'Message', 'Comment'] },
});

// Create Mongoose Models
export const User = mongoose.model('User', UserSchema);
export const Contestant = mongoose.model('Contestant', ContestantSchema);
export const Show = mongoose.model('Show', ShowSchema);
export const Episode = mongoose.model('Episode', EpisodeSchema);
export const Vote = mongoose.model('Vote', VoteSchema);
export const Fanbase = mongoose.model('Fanbase', FanbaseSchema);
export const Follower = mongoose.model('Follower', FollowerSchema);
export const Message = mongoose.model('Message', MessageSchema);
export const Channel = mongoose.model('Channel', ChannelSchema);
export const Challenge = mongoose.model('Challenge', ChallengeSchema);
export const Reward = mongoose.model('Reward', RewardSchema);
export const Transaction = mongoose.model('Transaction', TransactionSchema);
export const Notification = mongoose.model('Notification', NotificationSchema);
export const Subscription = mongoose.model('Subscription', SubscriptionSchema);
export const Gift = mongoose.model('Gift', GiftSchema);
export const Comment = mongoose.model('Comment', CommentSchema);
export const Like = mongoose.model('Like', LikeSchema);
