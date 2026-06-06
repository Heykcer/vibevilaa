import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image,
  Animated,
  ActivityIndicator } from
'react-native';
import { useNavigate } from 'react-router-dom';
import { ThemedText } from '@/components/themed-text';
import Toast from '@/components/toast';
import { useAuth } from '@/hooks/use-auth';
import { AuthColors, Spacing } from '@/constants/theme';












const CONTESTANTS = [
{
  id: 'luna',
  name: 'Luna',
  popularity: 98,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  followers: '1.2M',
  fanbase: '125K',
  bio: 'I may be quiet, but I see everything. Mysterious • INTJ',
  interests: ['Anime', 'Gaming', 'Music', 'Dance']
},
{
  id: 'ethan',
  name: 'Ethan',
  popularity: 95,
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  followers: '980K',
  fanbase: '95K',
  bio: 'Playing the game with heart. Athlete • ENFP',
  interests: ['Fitness', 'Adventure', 'Music', 'Cooking']
},
{
  id: 'maya',
  name: 'Maya',
  popularity: 94,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
  followers: '870K',
  fanbase: '82K',
  bio: 'Spilling the tea since day 1. Journalist • ESTJ',
  interests: ['Fashion', 'Drama', 'Travel', 'Singing']
},
{
  id: 'zayn',
  name: 'Zayn',
  popularity: 89,
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  followers: '760K',
  fanbase: '68K',
  bio: 'No drama, just vibe. Musician • ISFP',
  interests: ['Guitar', 'Surfing', 'Art', 'Vibe']
},
{
  id: 'kira',
  name: 'Kira',
  popularity: 85,
  avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
  followers: '650K',
  fanbase: '54K',
  bio: 'Living my best life. Influencer • ESFP',
  interests: ['Blogging', 'Makeup', 'Dance', 'Fitness']
}];










const INITIAL_CHAT = [
{ id: '1', user: 'Alex', message: 'That challenge was crazy! 🔥', time: '2m', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150' },
{ id: '2', user: 'NovaFan', message: 'Vote Luna! She deserves it ❤️', time: '1m', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
{ id: '3', user: 'ShadowArmy', message: 'No wayyyyy 😲', time: '1m', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150' },
{ id: '4', user: 'KiraWorld', message: 'Kira & Shadow forever! 💖', time: 'now', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=150' }];


const CHAT_POOL = [
'Luna is carrying Season 3 honestly! 👑',
'Ethan compatability with Maya is so high! 📈',
'Did Zayn just say that?? OMG 🤯',
'Cast your votes guys! Double coin event active!',
'ShadowArmy assemble! ✊',
'Kira is absolute queen this episode!',
'I am casting 50 coins for Ethan right now!',
'Is the Live Stream lagging for anyone?',
'Nah it is smooth! Go VibeVilla! 📺',
'Episode 12 is the best one yet!'];


const CHAT_USERS = [
{ name: 'VibeKing', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
{ name: 'RealityCheck', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
{ name: 'LunaSimp', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
{ name: 'VoterPro', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150' },
{ name: 'SuperFan99', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=150' }];


export default function HomeDashboard() {
  const navigate = useNavigate();
  const { userProfile, signOut } = useAuth();
  const { width } = useWindowDimensions();

  // User simulated coins & gems
  const [coins, setCoins] = useState(2450);
  const [gems, setGems] = useState(380);

  // Dynamic modules
  const [activeTab, setActiveTab] = useState('stream');
  const [selectedContestant, setSelectedContestant] = useState(CONTESTANTS[0]);

  // Simulated live chat state
  const [chatList, setChatList] = useState(INITIAL_CHAT);

  // Voting state
  const [voteTarget, setVoteTarget] = useState('luna');
  const [votingInProgress, setVotingInProgress] = useState(false);

  // Alerts
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Animation values
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(25));

  const isDesktop = width >= 1024;

  useEffect(() => {
    // Page load animation
    Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: Platform.OS !== 'web'
    }),
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: Platform.OS !== 'web'
    })]
    ).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    // Set custom welcome coins based on user profile if available
    if (userProfile) {
      const timer = setTimeout(() => {
        setCoins(userProfile.coins || 100);
        setGems(userProfile.gems || 10);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [userProfile]);

  // Simulate scrolling Live Chat messages
  useEffect(() => {
    if (activeTab !== 'stream') return;

    const interval = setInterval(() => {
      const user = CHAT_USERS[Math.floor(Math.random() * CHAT_USERS.length)];
      const message = CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)];
      const newMessage = {
        id: Math.random().toString(),
        user: user.name,
        message: message,
        time: 'now',
        avatar: user.avatar
      };

      setChatList((prev) => [...prev.slice(1), newMessage]);
    }, 3200);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      setToastMessage('Signed out successfully');
      setToastType('success');
      setToastVisible(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 600);
    } catch (error) {
      console.error('Logout error:', error);
      setToastMessage('Logout failed');
      setToastType('error');
      setToastVisible(true);
    }
  }, [signOut, navigate]);

  const castVote = useCallback(() => {
    if (coins < 10) {
      setToastMessage('Insufficient Coins! Please top up in the Wallet.');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    setVotingInProgress(true);
    const targetName = CONTESTANTS.find((c) => c.id === voteTarget)?.name || 'Contestant';

    setTimeout(() => {
      setCoins((prev) => prev - 10);
      setVotingInProgress(false);
      setToastMessage(`Cast 10 Coins! Successfully voted for ${targetName}! 🎉`);
      setToastType('success');
      setToastVisible(true);
    }, 1200);
  }, [coins, voteTarget]);

  const buySimulatedPack = useCallback((amount, price) => {
    setCoins((prev) => prev + amount);
    setToastMessage(`Purchased package! Successfully added ${amount} Coins! 🪙`);
    setToastType('success');
    setToastVisible(true);
  }, []);

  const renderDashboardHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.logoText}>VibeVilla</ThemedText>
          <View style={styles.liveIndicator}>
            <View style={styles.liveIndicatorDot} />
            <ThemedText style={styles.liveIndicatorText}>LIVE</ThemedText>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Coins balance */}
          <View style={styles.balanceBadge}>
            <ThemedText style={styles.balanceIcon}>🪙</ThemedText>
            <ThemedText style={styles.balanceValue}>{coins.toLocaleString()}</ThemedText>
          </View>

          {/* Gems balance */}
          <View style={styles.balanceBadge}>
            <ThemedText style={styles.balanceIcon}>💎</ThemedText>
            <ThemedText style={styles.balanceValue}>{gems.toLocaleString()}</ThemedText>
          </View>

          {/* Profile & Logout */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <ThemedText style={styles.logoutButtonText}>Log Out</ThemedText>
          </TouchableOpacity>
        </View>
      </View>);

  };

  const renderHomeBanner = () => {
    return (
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200'
          }}
          style={styles.bannerImage} />
        
        <View style={styles.bannerOverlay} />

        <View style={styles.bannerContent}>
          <View style={styles.bannerHeader}>
            <View style={styles.episodeTag}>
              <ThemedText style={styles.episodeTagText}>SEASON 3 • EPISODE 12</ThemedText>
            </View>
            <View style={styles.liveViewerTag}>
              <ThemedText style={styles.liveViewerTagText}>🔴 245K Live Fans</ThemedText>
            </View>
          </View>

          <View style={styles.bannerFooter}>
            <View style={styles.bannerText}>
              <ThemedText style={styles.bannerTitle}>The Truth Game</ThemedText>
              <ThemedText style={styles.bannerSubtitle}>
                {"Drama, Romance, Secrets. Who will survive tonight's critical voting round?"}
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={() => {
                setActiveTab('stream');
                setToastMessage('Streaming Live VibeVilla Cast...');
                setToastType('success');
                setToastVisible(true);
              }}
              style={styles.watchLiveBtn}>
              <ThemedText style={styles.watchLiveBtnText}>▶ Watch Live</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>);

  };

  const renderTrendingSection = () => {
    return (
      <View style={styles.trendingContainer}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Trending Contestants</ThemedText>
          <TouchableOpacity onPress={() => setToastMessage('Showing all 16 Contestants')}>
            <ThemedText style={styles.sectionLink}>See All</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingAvatars}>
          {CONTESTANTS.map((c) => {
            const isSelected = selectedContestant?.id === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedContestant(c)}
                style={styles.avatarWrapper}>
                <View
                  style={[
                  styles.avatarBorder,
                  isSelected && styles.avatarBorderActive]
                  }>
                  <Image source={{ uri: c.avatar }} style={styles.avatarImage} />
                </View>
                <ThemedText style={styles.avatarName}>{c.name}</ThemedText>
                <View style={styles.avatarPopularityBadge}>
                  <ThemedText style={styles.avatarPopularityText}>⭐ {c.popularity}</ThemedText>
                </View>
              </TouchableOpacity>);

          })}
        </ScrollView>
      </View>);

  };

  const renderContestantProfileModal = () => {
    if (!selectedContestant) return null;
    return (
      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: selectedContestant.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileHeaderInfo}>
            <View style={styles.profileNameRow}>
              <ThemedText style={styles.profileName}>{selectedContestant.name}</ThemedText>
              <ThemedText style={styles.verifiedCheck}>☑</ThemedText>
            </View>
            <ThemedText style={styles.profileSubtitle}>{selectedContestant.bio}</ThemedText>

            <View style={styles.profileStatsRow}>
              <View style={styles.profileStatItem}>
                <ThemedText style={styles.profileStatValue}>{selectedContestant.fanbase}</ThemedText>
                <ThemedText style={styles.profileStatLabel}>Fanbase</ThemedText>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <ThemedText style={styles.profileStatValue}>{selectedContestant.followers}</ThemedText>
                <ThemedText style={styles.profileStatLabel}>Followers</ThemedText>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <ThemedText style={styles.profileStatValue}>⭐ {selectedContestant.popularity}</ThemedText>
                <ThemedText style={styles.profileStatLabel}>Score</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.interestsContainer}>
          <ThemedText style={styles.interestsTitle}>Interests</ThemedText>
          <View style={styles.tagGroup}>
            {selectedContestant.interests.map((tag) =>
            <View key={tag} style={styles.interestTag}>
                <ThemedText style={styles.interestTagText}>{tag}</ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.profileActions}>
          <TouchableOpacity
            onPress={() => {
              setVoteTarget(selectedContestant.id);
              setActiveTab('vote');
            }}
            style={styles.profileVoteBtn}>
            <ThemedText style={styles.profileVoteBtnText}>Vote to Save</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (gems >= 5) {
                setGems((prev) => prev - 5);
                setToastMessage(`Sent a luxury Rose Gift to ${selectedContestant.name}! 🌹`);
                setToastType('success');
                setToastVisible(true);
              } else {
                setToastMessage('Not enough Gems to buy Roses! 🌹');
                setToastType('error');
                setToastVisible(true);
              }
            }}
            style={styles.profileGiftBtn}>
            <ThemedText style={styles.profileGiftBtnText}>🎁 Send Gift (5 Gems)</ThemedText>
          </TouchableOpacity>
        </View>
      </View>);

  };

  const renderModuleTabs = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('stream')}
          style={[styles.tabButton, activeTab === 'stream' && styles.tabButtonActive]}>
          <ThemedText
            style={[styles.tabButtonText, activeTab === 'stream' && styles.tabButtonTextActive]}>
            📺 Live Stream
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('vote')}
          style={[styles.tabButton, activeTab === 'vote' && styles.tabButtonActive]}>
          <ThemedText
            style={[styles.tabButtonText, activeTab === 'vote' && styles.tabButtonTextActive]}>
            🗳️ Cast Vote
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('leaderboard')}
          style={[styles.tabButton, activeTab === 'leaderboard' && styles.tabButtonActive]}>
          <ThemedText
            style={[
            styles.tabButtonText,
            activeTab === 'leaderboard' && styles.tabButtonTextActive]
            }>
            🏆 Leaderboard
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('wallet')}
          style={[styles.tabButton, activeTab === 'wallet' && styles.tabButtonActive]}>
          <ThemedText
            style={[styles.tabButtonText, activeTab === 'wallet' && styles.tabButtonTextActive]}>
            💼 Wallet Shop
          </ThemedText>
        </TouchableOpacity>
      </View>);

  };

  const renderModuleContent = () => {
    switch (activeTab) {
      case 'stream':
        return (
          <View style={styles.moduleCard}>
            {/* Live Video Mockup */}
            <View style={styles.videoPlayerMock}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&q=80&w=600'
                }}
                style={styles.videoPlayerImage} />
              
              <View style={styles.videoPlayerOverlay} />

              <View style={styles.playerBadgeRow}>
                <View style={styles.liveStreamBadge}>
                  <ThemedText style={styles.liveStreamBadgeText}>🔴 EPISODE 12 IN PROGRESS</ThemedText>
                </View>
              </View>

              <View style={styles.playIconWrapper}>
                <ThemedText style={styles.playIcon}>▶</ThemedText>
              </View>

              <View style={styles.playerStatsOverlay}>
                <ThemedText style={styles.playerStatsText}>👁️ 245K Viewers | 📈 3.4M Daily Votes</ThemedText>
              </View>
            </View>

            {/* Live chat */}
            <ThemedText style={styles.chatSectionTitle}>⚡ Live Fan Chat</ThemedText>
            <View style={styles.chatBox}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                ref={(ref) => ref?.scrollToEnd({ animated: true })}
                contentContainerStyle={styles.chatScrollContent}>
                {chatList.map((msg) =>
                <View key={msg.id} style={styles.chatMessageRow}>
                    <Image source={{ uri: msg.avatar }} style={styles.chatAvatar} />
                    <View style={styles.chatTextContent}>
                      <View style={styles.chatUserRow}>
                        <ThemedText style={styles.chatUserName}>{msg.user}</ThemedText>
                        <ThemedText style={styles.chatTime}>{msg.time}</ThemedText>
                      </View>
                      <ThemedText style={styles.chatMessageText}>{msg.message}</ThemedText>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>);


      case 'vote':
        return (
          <View style={styles.moduleCard}>
            <ThemedText style={styles.moduleTitle}>Vote to Save</ThemedText>
            <ThemedText style={styles.moduleSubtitle}>
              Which contestant should stay in the VibeVilla house? Each vote costs 10 Coins.
            </ThemedText>

            <View style={styles.voteList}>
              {CONTESTANTS.map((c) => {
                const isSelected = voteTarget === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setVoteTarget(c.id)}
                    style={[styles.voteItemCard, isSelected && styles.voteItemCardActive]}>
                    <View style={styles.voteItemLeft}>
                      <Image source={{ uri: c.avatar }} style={styles.voteItemAvatar} />
                      <View>
                        <ThemedText style={styles.voteItemName}>{c.name}</ThemedText>
                        <ThemedText style={styles.voteItemPopularity}>
                          Current Score: ⭐ {c.popularity}
                        </ThemedText>
                      </View>
                    </View>
                    <View
                      style={[styles.voteRadioOuter, isSelected && styles.voteRadioOuterActive]}>
                      {isSelected && <View style={styles.voteRadioInner} />}
                    </View>
                  </TouchableOpacity>);

              })}
            </View>

            <View style={styles.castVoteSection}>
              <View style={styles.castCostRow}>
                <ThemedText style={styles.castCostLabel}>Vote Cost:</ThemedText>
                <ThemedText style={styles.castCostValue}>🪙 10 Coins</ThemedText>
              </View>
              <View style={styles.castCostRow}>
                <ThemedText style={styles.castCostLabel}>Your Coins:</ThemedText>
                <ThemedText style={styles.castCostValue}>🪙 {coins}</ThemedText>
              </View>

              <TouchableOpacity
                onPress={castVote}
                disabled={votingInProgress}
                style={[styles.castVoteButton, votingInProgress && styles.castVoteButtonDisabled]}>
                {votingInProgress ?
                <ActivityIndicator color="#ffffff" /> :

                <ThemedText style={styles.castVoteButtonText}>Cast My Vote</ThemedText>
                }
              </TouchableOpacity>
            </View>
          </View>);


      case 'leaderboard':
        return (
          <View style={styles.moduleCard}>
            <ThemedText style={styles.moduleTitle}>Weekly Ranking</ThemedText>
            <ThemedText style={styles.moduleSubtitle}>
              Weekly updates based on live viewer votes and daily challenges.
            </ThemedText>

            <View style={styles.leaderboardList}>
              {CONTESTANTS.map((c, index) => {
                const rank = index + 1;
                return (
                  <View key={c.id} style={styles.leaderboardRow}>
                    <View style={styles.leaderboardRankWrapper}>
                      <ThemedText
                        style={[
                        styles.leaderboardRank,
                        rank === 1 && styles.rankGold,
                        rank === 2 && styles.rankSilver,
                        rank === 3 && styles.rankBronze]
                        }>
                        {rank}
                      </ThemedText>
                    </View>

                    <Image source={{ uri: c.avatar }} style={styles.leaderboardAvatar} />

                    <View style={styles.leaderboardCenter}>
                      <ThemedText style={styles.leaderboardName}>{c.name}</ThemedText>
                      <ThemedText style={styles.leaderboardStats}>
                        {c.followers} Followers • {c.fanbase} Fanbase
                      </ThemedText>
                    </View>

                    <View style={styles.leaderboardRight}>
                      <ThemedText style={styles.leaderboardScoreValue}>{c.popularity}</ThemedText>
                      <ThemedText style={styles.leaderboardScoreLabel}>Popularity</ThemedText>
                    </View>
                  </View>);

              })}
            </View>
          </View>);


      case 'wallet':
        return (
          <View style={styles.moduleCard}>
            <ThemedText style={styles.moduleTitle}>Top Up Coins</ThemedText>
            <ThemedText style={styles.moduleSubtitle}>
              Buy coins packages to cast votes and send roses/gifts to your favorite contestants.
            </ThemedText>

            <View style={styles.walletStatsRow}>
              <View style={styles.walletStatBox}>
                <ThemedText style={styles.walletStatIcon}>🪙</ThemedText>
                <ThemedText style={styles.walletStatValue}>{coins}</ThemedText>
                <ThemedText style={styles.walletStatLabel}>Total Coins</ThemedText>
              </View>
              <View style={styles.walletStatBox}>
                <ThemedText style={styles.walletStatIcon}>💎</ThemedText>
                <ThemedText style={styles.walletStatValue}>{gems}</ThemedText>
                <ThemedText style={styles.walletStatLabel}>Total Gems</ThemedText>
              </View>
            </View>

            <View style={styles.packagesGrid}>
              {[
              { coins: 100, price: '$0.99', popular: false },
              { coins: 500, price: '$4.99', popular: true },
              { coins: 1000, price: '$8.99', popular: false },
              { coins: 2500, price: '$19.99', popular: false }].
              map((pkg, idx) =>
              <TouchableOpacity
                key={idx}
                onPress={() => buySimulatedPack(pkg.coins, pkg.price)}
                style={[styles.packageCard, pkg.popular && styles.packageCardPopular]}>
                  {pkg.popular &&
                <View style={styles.popularBadge}>
                      <ThemedText style={styles.popularBadgeText}>POPULAR</ThemedText>
                    </View>
                }
                  <ThemedText style={styles.packageCoins}>🪙 {pkg.coins} Coins</ThemedText>
                  <ThemedText style={styles.packagePrice}>{pkg.price}</ThemedText>
                  <View style={styles.buyBtn}>
                    <ThemedText style={styles.buyBtnText}>Purchase</ThemedText>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>);

    }
  };

  return (
    <View style={styles.container}>
      {/* Floating Background Blobs for Glassmorphism Background Glow */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {renderDashboardHeader()}

      {isDesktop ?
      <View style={styles.desktopContainer}>
          <ScrollView
          style={styles.leftColumn}
          showsVerticalScrollIndicator={false}>
            {renderHomeBanner()}
            {renderTrendingSection()}
            {renderContestantProfileModal()}
          </ScrollView>

          <View style={styles.rightColumn}>
            {renderModuleTabs()}
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderModuleContent()}
            </ScrollView>
          </View>
        </View> :

      <ScrollView
        style={styles.mobileScrollContainer}
        showsVerticalScrollIndicator={false}>
          {renderHomeBanner()}
          {renderTrendingSection()}
          {renderContestantProfileModal()}
          {renderModuleTabs()}
          {renderModuleContent()}
          <View style={{ height: 100 }} />
        </ScrollView>
      }

      {/* Toast Notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={() => setToastVisible(false)} />
      
    </View>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.background,
    overflow: 'hidden'
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four
  },
  leftColumn: {
    flex: 1.2,
    height: '100%'
  },
  rightColumn: {
    flex: 1,
    height: '100%',
    paddingBottom: Spacing.four
  },
  mobileScrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.three
  },

  /* Header Section */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(108, 76, 241, 0.12)',
    zIndex: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0
      }
    })
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: AuthColors.primary,
    letterSpacing: -0.5
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444'
  },
  liveIndicatorText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 76, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.15)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4
  },
  balanceIcon: {
    fontSize: 14
  },
  balanceValue: {
    fontSize: 13,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: 12
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600'
  },

  /* Banner Section */
  bannerContainer: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: Spacing.three
  },
  bannerImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%'
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 6, 32, 0.55)',
    backgroundImage: 'linear-gradient(to right, rgba(10, 6, 32, 0.9) 30%, rgba(108, 76, 241, 0.2) 100%)',
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(to right, rgba(10, 6, 32, 0.9) 25%, rgba(108, 76, 241, 0.2) 75%, transparent 100%)'
      }
    })
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.four,
    zIndex: 2
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  episodeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 6
  },
  episodeTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700'
  },
  liveViewerTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 6
  },
  liveViewerTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700'
  },
  bannerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  bannerText: {
    flex: 1,
    marginRight: Spacing.two
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    lineHeight: 18
  },
  watchLiveBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8
  },
  watchLiveBtnText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '700'
  },

  /* Trending Section */
  trendingContainer: {
    marginBottom: Spacing.four
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  sectionLink: {
    fontSize: 13,
    color: AuthColors.primary,
    fontWeight: '600'
  },
  trendingAvatars: {
    gap: Spacing.three,
    paddingRight: Spacing.four
  },
  avatarWrapper: {
    alignItems: 'center',
    position: 'relative',
    marginRight: 6
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  avatarBorderActive: {
    borderColor: AuthColors.primary
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '600',
    color: AuthColors.textPrimary,
    marginTop: 6
  },
  avatarPopularityBadge: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.1)'
  },
  avatarPopularityText: {
    fontSize: 8,
    fontWeight: '700',
    color: AuthColors.primary
  },

  /* Contestant Profile Card */
  profileCard: {
    backgroundColor: AuthColors.glass,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: AuthColors.border,
    marginBottom: Spacing.four,
    shadowColor: AuthColors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4
  },
  profileHeader: {
    flexDirection: 'row',
    gap: Spacing.three
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(108, 76, 241, 0.2)'
  },
  profileHeaderInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  verifiedCheck: {
    color: AuthColors.primary,
    fontSize: 14
  },
  profileSubtitle: {
    fontSize: 12,
    color: AuthColors.textSecondary,
    marginBottom: Spacing.two
  },
  profileStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center'
  },
  profileStatValue: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  profileStatLabel: {
    fontSize: 9,
    color: AuthColors.textSecondary
  },
  profileStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(108, 76, 241, 0.15)'
  },
  interestsContainer: {
    marginTop: Spacing.three
  },
  interestsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: AuthColors.textPrimary,
    marginBottom: Spacing.one
  },
  tagGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  interestTag: {
    backgroundColor: 'rgba(108, 76, 241, 0.06)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 8
  },
  interestTagText: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '600'
  },
  profileActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.four
  },
  profileVoteBtn: {
    flex: 1.2,
    backgroundColor: AuthColors.primary,
    backgroundImage: `linear-gradient(135deg, ${AuthColors.primary} 0%, ${AuthColors.primaryLight} 100%)`,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileVoteBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  profileGiftBtn: {
    flex: 1,
    backgroundColor: 'rgba(108, 76, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.15)',
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileGiftBtnText: {
    color: AuthColors.primary,
    fontSize: 12,
    fontWeight: '600'
  },

  /* Modules Section */
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.1)',
    marginBottom: Spacing.three
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(108,76,241,0.1)',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: AuthColors.textSecondary
  },
  tabButtonTextActive: {
    color: AuthColors.primary,
    fontWeight: '700'
  },
  moduleCard: {
    backgroundColor: AuthColors.glass,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: AuthColors.border,
    shadowColor: AuthColors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)'
      }
    })
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AuthColors.textPrimary,
    marginBottom: 2
  },
  moduleSubtitle: {
    fontSize: 12,
    color: AuthColors.textSecondary,
    marginBottom: Spacing.four
  },

  /* Simulated Live Stream Tab */
  videoPlayerMock: {
    height: 180,
    backgroundColor: '#0a0a0f',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.four
  },
  videoPlayerImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    opacity: 0.65
  },
  videoPlayerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(108, 76, 241, 0.15)'
  },
  playerBadgeRow: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two
  },
  liveStreamBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  liveStreamBadgeText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  playIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(108, 76, 241, 0.3)',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12
  },
  playIcon: {
    fontSize: 20,
    color: AuthColors.primary,
    marginLeft: 3
  },
  playerStatsOverlay: {
    position: 'absolute',
    bottom: Spacing.two,
    backgroundColor: 'rgba(10, 6, 28, 0.75)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 8
  },
  playerStatsText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600'
  },
  chatSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textPrimary,
    marginBottom: Spacing.two
  },
  chatBox: {
    height: 180,
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.1)',
    borderRadius: 14,
    backgroundColor: 'rgba(108, 76, 241, 0.02)',
    padding: Spacing.two,
    overflow: 'hidden'
  },
  chatScrollContent: {
    gap: Spacing.two
  },
  chatMessageRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start'
  },
  chatAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12
  },
  chatTextContent: {
    flex: 1
  },
  chatUserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chatUserName: {
    fontSize: 11,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  chatTime: {
    fontSize: 8,
    color: AuthColors.textSecondary
  },
  chatMessageText: {
    fontSize: 10,
    color: AuthColors.textSecondary,
    marginTop: 1
  },

  /* Simulated Voting Tab */
  voteList: {
    gap: Spacing.two,
    marginBottom: Spacing.four
  },
  voteItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.1)',
    borderRadius: 16,
    padding: Spacing.two
  },
  voteItemCardActive: {
    borderColor: AuthColors.primary,
    backgroundColor: 'rgba(108, 76, 241, 0.03)'
  },
  voteItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two
  },
  voteItemAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  voteItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  voteItemPopularity: {
    fontSize: 11,
    color: AuthColors.textSecondary
  },
  voteRadioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'rgba(108, 76, 241, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  voteRadioOuterActive: {
    borderColor: AuthColors.primary
  },
  voteRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AuthColors.primary
  },
  castVoteSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(108, 76, 241, 0.1)',
    paddingTop: Spacing.three
  },
  castCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.one
  },
  castCostLabel: {
    fontSize: 12,
    color: AuthColors.textSecondary
  },
  castCostValue: {
    fontSize: 12,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  castVoteButton: {
    backgroundColor: AuthColors.primary,
    backgroundImage: `linear-gradient(135deg, ${AuthColors.primary} 0%, ${AuthColors.primaryLight} 100%)`,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
    shadowColor: 'rgba(108, 76, 241, 0.25)',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12
  },
  castVoteButtonDisabled: {
    opacity: 0.6
  },
  castVoteButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },

  /* Leaderboard Tab */
  leaderboardList: {
    gap: Spacing.two
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.08)',
    borderRadius: 16,
    padding: Spacing.two
  },
  leaderboardRankWrapper: {
    width: 24,
    alignItems: 'center'
  },
  leaderboardRank: {
    fontSize: 13,
    fontWeight: '700',
    color: AuthColors.textSecondary
  },
  rankGold: { color: '#F59E0B' },
  rankSilver: { color: '#9CA3AF' },
  rankBronze: { color: '#B45309' },
  leaderboardAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 4
  },
  leaderboardCenter: {
    flex: 1,
    marginLeft: Spacing.two
  },
  leaderboardName: {
    fontSize: 13,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  leaderboardStats: {
    fontSize: 9,
    color: AuthColors.textSecondary
  },
  leaderboardRight: {
    alignItems: 'flex-end'
  },
  leaderboardScoreValue: {
    fontSize: 14,
    fontWeight: '700',
    color: AuthColors.primary
  },
  leaderboardScoreLabel: {
    fontSize: 8,
    color: AuthColors.textSecondary
  },

  /* Wallet Tab */
  walletStatsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.four
  },
  walletStatBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.1)',
    padding: Spacing.two,
    alignItems: 'center'
  },
  walletStatIcon: {
    fontSize: 20,
    marginBottom: 2
  },
  walletStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: AuthColors.textPrimary
  },
  walletStatLabel: {
    fontSize: 10,
    color: AuthColors.textSecondary
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two
  },
  packageCard: {
    width: '47.5%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.1)',
    padding: Spacing.three,
    alignItems: 'center',
    position: 'relative',
    flexGrow: 1
  },
  packageCardPopular: {
    borderColor: AuthColors.primary,
    backgroundColor: 'rgba(108, 76, 241, 0.02)'
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: AuthColors.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  popularBadgeText: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '700'
  },
  packageCoins: {
    fontSize: 13,
    fontWeight: '700',
    color: AuthColors.textPrimary,
    marginBottom: 4
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: AuthColors.primary,
    marginBottom: Spacing.two
  },
  buyBtn: {
    backgroundColor: 'rgba(108, 76, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(108, 76, 241, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: Spacing.two,
    borderRadius: 8
  },
  buyBtnText: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '600'
  },

  /* Background Glow Blobs */
  blob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.1,
    zIndex: 0
  },
  blob1: {
    top: -50,
    right: -40,
    backgroundColor: '#6C4CF1',
    ...Platform.select({
      web: { filter: 'blur(100px)' },
      default: { backgroundColor: 'rgba(108, 76, 241, 0.1)' }
    })
  },
  blob2: {
    bottom: -50,
    left: -40,
    backgroundColor: '#8A6CFF',
    ...Platform.select({
      web: { filter: 'blur(100px)' },
      default: { backgroundColor: 'rgba(138, 108, 255, 0.1)' }
    })
  }
});