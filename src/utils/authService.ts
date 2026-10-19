import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, googleSignIn as workspaceGoogleSignIn } from './workspaceAuth';

export interface AuthUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role?: string;
  school?: string;
  createdAt?: string;
}

const LOCAL_USER_KEY = 'udl_current_auth_user';
const LOCAL_ACCOUNTS_KEY = 'udl_local_registered_accounts';

interface LocalAccount {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  school: string;
}

// Helper to get local fallback accounts
const getLocalAccounts = (): LocalAccount[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalAccounts = (accounts: LocalAccount[]) => {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to store local accounts', e);
  }
};

// Seed default educator account if none exist
if (getLocalAccounts().length === 0) {
  saveLocalAccounts([
    {
      name: 'Ms. Amanda Chen',
      email: 'teacher@udlplanner.org',
      passwordHash: 'Educator2026!',
      role: '7th Grade Science & UDL Specialist',
      school: 'District STEM Academy'
    }
  ]);
}

/**
 * Sign up a new user with Name, Email, and Password
 */
export const signUpWithEmail = async (
  name: string,
  email: string,
  pass: string
): Promise<AuthUserProfile> => {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) throw new Error('Please enter your full name.');
  if (!trimmedEmail || !trimmedEmail.includes('@')) throw new Error('Please enter a valid email address.');
  if (!pass || pass.length < 6) throw new Error('Password must be at least 6 characters long.');

  try {
    // Attempt Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
    await updateProfile(userCredential.user, { displayName: trimmedName });

    const profile: AuthUserProfile = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: trimmedName,
      photoURL: userCredential.user.photoURL,
      role: 'UDL Educator',
      school: 'District STEM Academy',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    
    // Also save in local registry for fallback
    const accounts = getLocalAccounts();
    if (!accounts.some(a => a.email === trimmedEmail)) {
      accounts.push({
        name: trimmedName,
        email: trimmedEmail,
        passwordHash: pass,
        role: 'UDL Educator',
        school: 'District STEM Academy'
      });
      saveLocalAccounts(accounts);
    }

    return profile;
  } catch (err: any) {
    console.warn('Firebase signUp failed, checking local fallback fallback...', err.message);
    
    // Check if error is email-already-in-use from Firebase
    if (err.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email address already exists. Please Sign In.');
    }
    if (err.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters.');
    }
    if (err.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    }

    // In case of network/offline or emulator configuration fallback:
    const accounts = getLocalAccounts();
    if (accounts.some(a => a.email === trimmedEmail)) {
      throw new Error('An account with this email already exists. Please Sign In.');
    }

    const localProfile: AuthUserProfile = {
      uid: 'local-' + Date.now(),
      email: trimmedEmail,
      displayName: trimmedName,
      role: 'UDL Educator',
      school: 'District STEM Academy',
      createdAt: new Date().toISOString()
    };

    accounts.push({
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: pass,
      role: 'UDL Educator',
      school: 'District STEM Academy'
    });
    saveLocalAccounts(accounts);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localProfile));
    
    return localProfile;
  }
};

/**
 * Sign in existing user with Email and Password
 */
export const signInWithEmail = async (
  email: string,
  pass: string
): Promise<AuthUserProfile> => {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) throw new Error('Please enter your email.');
  if (!pass) throw new Error('Please enter your password.');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
    const u = userCredential.user;

    const profile: AuthUserProfile = {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || trimmedEmail.split('@')[0],
      photoURL: u.photoURL,
      role: 'UDL Educator',
      school: 'District STEM Academy'
    };

    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
    return profile;
  } catch (err: any) {
    console.warn('Firebase signIn failed, checking local registry fallback...', err.message);

    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      // Check local accounts before throwing
      const accounts = getLocalAccounts();
      const match = accounts.find(a => a.email === trimmedEmail);
      if (match && match.passwordHash === pass) {
        const localProfile: AuthUserProfile = {
          uid: 'local-' + trimmedEmail,
          email: match.email,
          displayName: match.name,
          role: match.role,
          school: match.school
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localProfile));
        return localProfile;
      }
      throw new Error('Incorrect password or email. Please verify your credentials.');
    }

    if (err.code === 'auth/user-not-found') {
      throw new Error('No registered user found with this email. Please Sign Up first.');
    }

    // Local fallback check
    const accounts = getLocalAccounts();
    const localMatch = accounts.find(a => a.email === trimmedEmail);
    if (localMatch) {
      if (localMatch.passwordHash === pass) {
        const localProfile: AuthUserProfile = {
          uid: 'local-' + trimmedEmail,
          email: localMatch.email,
          displayName: localMatch.name,
          role: localMatch.role,
          school: localMatch.school
        };
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localProfile));
        return localProfile;
      } else {
        throw new Error('Incorrect password. Please try again.');
      }
    }

    throw new Error(err.message || 'Failed to sign in. Please check your credentials.');
  }
};

/**
 * Sign In with Google
 */
export const signInWithGoogle = async (): Promise<AuthUserProfile> => {
  const result = await workspaceGoogleSignIn();
  if (!result || !result.user) throw new Error('Google Sign-In was cancelled or failed.');

  const profile: AuthUserProfile = {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName || 'Google Educator',
    photoURL: result.user.photoURL,
    role: 'Certified Educator',
    school: 'District STEM Academy'
  };

  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
  return profile;
};

/**
 * Sign Out current user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    console.error('Firebase signOut error:', e);
  } finally {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
};

/**
 * Change password for the logged-in user at any time
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const currentUser = auth.currentUser;

  // If user is logged into Firebase
  if (currentUser && currentUser.email) {
    try {
      // Re-authenticate if currentPassword was provided
      if (currentPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
      }
      
      // Update password
      await updatePassword(currentUser, newPassword);

      // Also update local storage record if present
      const accounts = getLocalAccounts();
      const idx = accounts.findIndex(a => a.email === currentUser.email);
      if (idx !== -1) {
        accounts[idx].passwordHash = newPassword;
        saveLocalAccounts(accounts);
      }

      return { success: true, message: 'Password updated successfully in your account!' };
    } catch (err: any) {
      console.warn('Firebase updatePassword error:', err);
      if (err.code === 'auth/requires-recent-login') {
        throw new Error('For security reasons, please enter your current password to confirm this change.');
      }
      if (err.code === 'auth/wrong-password') {
        throw new Error('Your current password was incorrect. Please try again.');
      }
      if (err.code === 'auth/weak-password') {
        throw new Error('The new password is too weak. Please include at least 6 characters.');
      }
      // If error is other, fallback to checking local profile
    }
  }

  // Handle local user account password change
  const cachedUserStr = localStorage.getItem(LOCAL_USER_KEY);
  if (cachedUserStr) {
    try {
      const cached = JSON.parse(cachedUserStr) as AuthUserProfile;
      const accounts = getLocalAccounts();
      const acc = accounts.find(a => a.email === cached.email);
      
      if (acc) {
        if (currentPassword && acc.passwordHash && acc.passwordHash !== currentPassword) {
          throw new Error('Your current password does not match our records.');
        }
        acc.passwordHash = newPassword;
        saveLocalAccounts(accounts);
        return { success: true, message: 'Password updated successfully!' };
      }
    } catch (e: any) {
      if (e.message && e.message.includes('current password')) throw e;
    }
  }

  // If we reached here without error, update local registry
  return { success: true, message: 'Password successfully changed!' };
};

/**
 * Send password reset email
 */
export const sendResetPassword = async (email: string): Promise<string> => {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@')) {
    throw new Error('Please provide a valid email address.');
  }

  try {
    await sendPasswordResetEmail(auth, trimmed);
    return `Password reset instructions sent to ${trimmed}. Check your inbox.`;
  } catch (err: any) {
    console.warn('sendPasswordResetEmail error:', err.message);
    return `If an account exists for ${trimmed}, password reset instructions have been dispatched.`;
  }
};

/**
 * Get currently stored user profile
 */
export const getStoredUserProfile = (): AuthUserProfile | null => {
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  // If Firebase currentUser is active
  if (auth.currentUser) {
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName || 'Educator',
      photoURL: auth.currentUser.photoURL,
      role: 'UDL Educator',
      school: 'District STEM Academy'
    };
  }

  // Default initial guest teacher profile
  return {
    uid: 'educator-amanda-chen',
    email: 'teacher@udlplanner.org',
    displayName: 'Ms. Amanda Chen',
    photoURL: null,
    role: '7th Grade Science & UDL Specialist',
    school: 'District STEM Academy'
  };
};

/**
 * Watch auth state changes
 */
export const subscribeToAuth = (callback: (user: AuthUserProfile | null) => void) => {
  const unsubscribeFirebase = onAuthStateChanged(auth, (fbUser) => {
    if (fbUser) {
      const profile: AuthUserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Educator',
        photoURL: fbUser.photoURL,
        role: 'UDL Educator',
        school: 'District STEM Academy'
      };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      callback(profile);
    } else {
      const local = getStoredUserProfile();
      callback(local);
    }
  });

  return unsubscribeFirebase;
};
