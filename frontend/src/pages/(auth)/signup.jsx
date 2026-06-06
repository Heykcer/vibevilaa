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
import PasswordStrength from '@/components/auth/password-strength';
import Toast from '@/components/toast';
import { useAuth } from '@/hooks/use-auth';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePasswordMatch } from
'@/lib/validation';
import { AuthColors, Spacing, Fonts } from '@/constants/theme';

export default function SignupScreen() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, loading, error, clearError } = useAuth();
  const { width } = useWindowDimensions();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const [fullNameError, setFullNameError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Animations
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(35));

  const isDesktop = width >= 768;

  useEffect(() => {
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
    setFullNameError(null);
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!fullName.trim()) {
      setFullNameError('Full name is required');
      isValid = false;
    } else if (fullName.length < 2) {
      setFullNameError('Full name must be at least 2 characters');
      isValid = false;
    }

    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      const usernameValidation = validateUsername(username);
      if (usernameValidation) {
        setUsernameError(usernameValidation);
        isValid = false;
      }
    }

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
    } else {
      const passwordValidation = validatePassword(password);
      if (passwordValidation) {
        setPasswordError(passwordValidation);
        isValid = false;
      }
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!acceptTerms) {
      setToastMessage('Please accept the Terms & Conditions');
      setToastType('error');
      setToastVisible(true);
      isValid = false;
    }

    if (!acceptPrivacy) {
      setToastMessage('Please accept the Privacy Policy');
      setToastType('error');
      setToastVisible(true);
      isValid = false;
    }

    return isValid;
  }, [fullName, username, email, password, confirmPassword, acceptTerms, acceptPrivacy]);

  const handleSignup = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await signUp(email, password, fullName, username);
      setToastMessage('Welcome to the VibeVilla Fan club!');
      setToastType('success');
      setToastVisible(true);
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 800);
    } catch (err) {
      console.error('Signup error:', err);
    }
  }, [email, password, fullName, username, validateForm, signUp, navigate]);

  const handleGoogleSignUp = useCallback(async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      setToastMessage('Account created with Google!');
      setToastType('success');
      setToastVisible(true);
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 800);
    } catch (err) {
      console.error('Google sign-up error:', err);
      setToastMessage('Google registration failed');
      setToastType('error');
      setToastVisible(true);
    } finally {
      setGoogleLoading(false);
    }
  }, [signInWithGoogle, navigate]);

  const renderSignupForm = () => {
    return (
      <Animated.View
        style={[
        styles.formContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        isDesktop && styles.desktopFormContainer]
        }>
        <View style={styles.card}>
          {/* Back button */}
          <TouchableOpacity onPress={() => navigate(-1)} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>← Back to Login</ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.title}>Create Account</ThemedText>
          <ThemedText style={styles.subtitle}>Join VibeVilla to support & vote for your favorites</ThemedText>

          {/* Form Error */}
          {error && <FormError message={error} />}

          {/* Full Name */}
          <AuthInput
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setFullNameError(null);
              clearError();
            }}
            error={fullNameError} />
          

          {/* Username */}
          <AuthInput
            label="Username"
            placeholder="john_doe"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError(null);
              clearError();
            }}
            error={usernameError} />
          

          {/* Email */}
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
          

          {/* Password */}
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
          

          {/* Password Strength */}
          {password && <PasswordStrength password={password} />}

          {/* Confirm Password */}
          <AuthInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError(null);
              clearError();
            }}
            secureTextEntry
            error={confirmPasswordError}
            autoComplete="password" />
          

          {/* Terms & Privacy */}
          <View style={styles.checkboxGroup}>
            <CheckboxInput
              label="I agree to the Terms & Conditions"
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              required />
            
            <TouchableOpacity onPress={() => {
              setToastMessage('VibeVilla Terms & Conditions: Voting rules, coin usage policy.');
              setToastType('success');
              setToastVisible(true);
            }}>
              <ThemedText style={styles.link}>View Terms</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxGroup}>
            <CheckboxInput
              label="I agree to the Privacy Policy"
              value={acceptPrivacy}
              onValueChange={setAcceptPrivacy}
              required />
            
            <TouchableOpacity onPress={() => {
              setToastMessage('VibeVilla Privacy Policy: We encrypt and secure your user logs.');
              setToastType('success');
              setToastVisible(true);
            }}>
              <ThemedText style={styles.link}>View Privacy</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <AuthButton
            title={loading ? '' : 'Create My Fan Account'}
            onPress={handleSignup}
            loading={loading}
            disabled={loading || googleLoading} />
          

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>OR SIGN UP WITH</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign Up */}
          <SocialButton
            provider="google"
            onPress={handleGoogleSignUp}
            loading={googleLoading}
            disabled={loading} />
          

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={() => navigate('/login')}>
              <ThemedText style={styles.loginLink}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>);

  };

  const renderHeroSection = () => {
    return (
      <View style={styles.heroSection}>
        {/* Cover portrait */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200'
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
            <ThemedText style={styles.heroTitle}>Vote for your Favorite.</ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Create your account to unlock free coins, join fanbase forums, and cast your votes to save contestants this week.
            </ThemedText>

            {/* Premium Stat Badges */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>100 FREE</ThemedText>
                <ThemedText style={styles.statLabel}>Welcome Coins</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>10 FREE</ThemedText>
                <ThemedText style={styles.statLabel}>Welcome Gems</ThemedText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>1.2M+</ThemedText>
                <ThemedText style={styles.statLabel}>Voters Connected</ThemedText>
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
              {renderSignupForm()}
            </ScrollView>
          </View>
        </View> :

      <ScrollView
        contentContainerStyle={styles.mobileScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
          {renderSignupForm()}
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
    padding: Spacing.four,
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
  backButton: {
    marginBottom: Spacing.three,
    alignSelf: 'flex-start'
  },
  backButtonText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '600'
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
    marginBottom: Spacing.three
  },
  checkboxGroup: {
    marginVertical: Spacing.one
  },
  link: {
    color: AuthColors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 30,
    marginTop: -Spacing.one,
    marginBottom: Spacing.one
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)'
  },
  loginText: {
    color: AuthColors.textSecondary,
    fontSize: 13
  },
  loginLink: {
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
    textShadowColor: 'rgba(236, 72, 153, 0.6)',
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
  }
});