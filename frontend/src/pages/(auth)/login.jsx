import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  Image,
  Animated } from
'react-native';
import { useNavigate } from 'react-router-dom';
import { ThemedText } from '@/components/themed-text';
import AuthInput from '@/components/auth/auth-input';
import AuthButton from '@/components/auth/auth-button';
import SocialButton from '@/components/auth/social-button';
import CheckboxInput from '@/components/auth/checkbox-input';
import FormError from '@/components/auth/form-error';
import Toast from '@/components/toast';
import { useAuth } from '@/hooks/use-auth';
import { validateEmail } from '@/lib/validation';
import { AuthColors, Spacing, Fonts } from '@/constants/theme';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, loading, error, clearError } = useAuth();
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Animations
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(35));

  const isDesktop = width >= 768;

  useEffect(() => {
    // Run enter animation
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
    if (error) {
      const timer = setTimeout(() => {
        setToastMessage(error);
        setToastType('error');
        setToastVisible(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateForm = useCallback(() => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await signIn(email, password);
      setToastMessage('Welcome back to VibeVilla!');
      setToastType('success');
      setToastVisible(true);
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 800);
    } catch (err) {
      console.error('Login error:', err);
    }
  }, [email, password, validateForm, signIn, navigate]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      setToastMessage('Google login successful!');
      setToastType('success');
      setToastVisible(true);
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 800);
    } catch (err) {
      console.error('Google sign-in error:', err);
      setToastMessage('Google sign-in failed');
      setToastType('error');
      setToastVisible(true);
    } finally {
      setGoogleLoading(false);
    }
  }, [signInWithGoogle, navigate]);

  const renderLoginForm = () => {
    return (
      <Animated.View
        style={[
        styles.formContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        isDesktop && styles.desktopFormContainer]
        }>
        <View style={styles.card}>
          {/* Mobile-only Logo */}
          {!isDesktop &&
          <View style={styles.mobileLogoContainer}>
              <ThemedText style={styles.mobileLogo}>VibeVilla</ThemedText>
              <View style={styles.mobileBadge}>
                <ThemedText style={styles.mobileBadgeText}>🔴 Season 3 Live</ThemedText>
              </View>
            </View>
          }

          <ThemedText style={styles.title}>Welcome Back</ThemedText>
          <ThemedText style={styles.subtitle}>Sign in to your VibeVilla fan account</ThemedText>

          {/* Form Error */}
          {error && <FormError message={error} />}

          {/* Email Input */}
          <AuthInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
              clearError();
            }}
            keyboardType="email-address"
            error={emailError}
            autoComplete="email" />
          

          {/* Password Input */}
          <AuthInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
              clearError();
            }}
            secureTextEntry
            error={passwordError}
            autoComplete="password" />
          

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsContainer}>
            <CheckboxInput
              label="Remember me"
              value={rememberMe}
              onValueChange={setRememberMe} />
            
            <TouchableOpacity onPress={() => {
              setToastMessage('Password reset link sent to your email.');
              setToastType('success');
              setToastVisible(true);
            }}>
              <ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <AuthButton
            title={loading ? '' : 'Log In to VibeVilla'}
            onPress={handleLogin}
            loading={loading}
            disabled={loading || googleLoading} />
          

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>OR CONTINUE WITH</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <View style={{ flex: 1, marginRight: Spacing.two }}>
              <SocialButton
                provider="google"
                onPress={handleGoogleSignIn}
                loading={googleLoading}
                disabled={loading} />
              
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.two }}>
              <SocialButton
                provider="apple"
                onPress={() => {
                  setToastMessage('Apple Sign-In is for iOS devices only in this demo.');
                  setToastType('error');
                  setToastVisible(true);
                }}
                disabled={loading || googleLoading} />
              
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <ThemedText style={styles.signupText}>{"Don't have an account? "}</ThemedText>
            <TouchableOpacity onPress={() => navigate('/signup')}>
              <ThemedText style={styles.signupLink}>Sign Up</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Social Proof Stats on Mobile */}
        {!isDesktop &&
        <View style={styles.mobileStatsContainer}>
            <ThemedText style={styles.mobileStatsText}>
              ⚡ Join 1.2M+ fans already voting live!
            </ThemedText>
          </View>
        }
      </Animated.View>);

  };

  const renderHeroSection = () => {
    return (
      <View style={styles.heroSection}>
        {/* Cover portrait */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200'
          }}
          style={styles.heroImage} />
        
        <View style={styles.heroOverlay} />

        {/* Content Overlay */}
        <View style={styles.heroContent}>
          {/* Header row */}
          <View style={styles.heroHeader}>
            <ThemedText style={styles.heroLogo}>VibeVilla</ThemedText>
            <View style={styles.liveBadge}>
              <ThemedText style={styles.liveBadgeText}>🟢 SEASON 3 LIVE NOW</ThemedText>
            </View>
          </View>

          {/* Bottom text */}
          <View>
            <ThemedText style={styles.heroTitle}>Watch. Vote. Connect.</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Join millions of fans supporting their favorite contestants in the ultimate reality showdown.
            </ThemedText>

            {/* Premium Stat Badges */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>1.2M+</ThemedText>
                <ThemedText style={styles.statLabel}>Active Fans</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>245K</ThemedText>
                <ThemedText style={styles.statLabel}>Live Viewers</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>125K</ThemedText>
                <ThemedText style={styles.statLabel}>Daily Votes</ThemedText>
              </View>
            </View>
          </View>
        </View>
      </View>);

  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      {/* Floating Background Blobs for Glassmorphism Background Glow */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />

      {isDesktop ?
      <View style={styles.desktopSplitScreen}>
          {renderHeroSection()}
          <View style={styles.desktopFormWrapper}>
            <ScrollView
            contentContainerStyle={styles.desktopScrollContent}
            showsVerticalScrollIndicator={false}>
              {renderLoginForm()}
            </ScrollView>
          </View>
        </View> :

      <ScrollView
        contentContainerStyle={styles.mobileScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
          {renderLoginForm()}
        </ScrollView>
      }

      {/* Toast Notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={() => setToastVisible(false)} />
      
    </KeyboardAvoidingView>);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuthColors.background,
    overflow: 'hidden'
  },
  desktopSplitScreen: {
    flex: 1,
    flexDirection: 'row',
    height: '100%'
  },
  desktopFormWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center'
  },
  desktopScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.six,
    paddingHorizontal: Spacing.five
  },
  mobileScrollContent: {
    flexGrow: 1,
    padding: Spacing.four,
    paddingTop: Spacing.five,
    justifyContent: 'center'
  },
  formContainer: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    zIndex: 1
  },
  desktopFormContainer: {
    maxWidth: 450
  },
  card: {
    backgroundColor: AuthColors.glass,
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: AuthColors.border,
    shadowColor: AuthColors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)'
      }
    })
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: AuthColors.textPrimary,
    marginBottom: Spacing.one,
    fontFamily: Fonts?.rounded
  },
  subtitle: {
    fontSize: 14,
    color: AuthColors.textSecondary,
    marginBottom: Spacing.four
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three
  },
  forgotPassword: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '600'
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.three
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  dividerText: {
    marginHorizontal: Spacing.two,
    color: AuthColors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.two
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  signupText: {
    color: AuthColors.textSecondary,
    fontSize: 13
  },
  signupLink: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '600'
  },

  /* Hero Section (Left panel on Desktop) */
  heroSection: {
    flex: 1.1,
    position: 'relative',
    overflow: 'hidden',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#0a0a0f'
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%'
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 11, 20, 0.6)',
    backgroundImage: 'linear-gradient(to top, rgba(11, 11, 20, 0.95) 20%, rgba(139, 92, 246, 0.15) 100%)',
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(to top, rgba(11, 11, 20, 0.98) 15%, rgba(139, 92, 246, 0.2) 60%, transparent 100%)'
      }
    })
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.five,
    zIndex: 2
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heroLogo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(236, 72, 153, 0.6)', // Magenta glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16
  },
  liveBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8
  },
  liveBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: Spacing.two,
    lineHeight: 56
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    maxWidth: 550,
    marginBottom: Spacing.five
  },

  /* Hero Social Stats Badges (Left Panel) */
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)'
      }
    })
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 11,
    fontWeight: '500'
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },

  /* Background Glow Blobs */
  blob: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.15,
    zIndex: 0
  },
  blob1: {
    top: -100,
    right: -100,
    backgroundColor: '#8B5CF6',
    ...Platform.select({
      web: {
        filter: 'blur(120px)'
      },
      default: {
        backgroundColor: 'rgba(139, 92, 246, 0.15)'
      }
    })
  },
  blob2: {
    bottom: -100,
    left: -100,
    backgroundColor: '#EC4899',
    ...Platform.select({
      web: {
        filter: 'blur(130px)'
      },
      default: {
        backgroundColor: 'rgba(236, 72, 153, 0.15)'
      }
    })
  },

  /* Mobile-only Styling */
  mobileLogoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.three
  },
  mobileLogo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: Spacing.one,
    textShadowColor: 'rgba(236, 72, 153, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12
  },
  mobileBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  mobileBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700'
  },
  mobileStatsContainer: {
    marginTop: Spacing.four,
    alignItems: 'center'
  },
  mobileStatsText: {
    color: AuthColors.textSecondary,
    fontSize: 12,
    fontWeight: '600'
  }
});