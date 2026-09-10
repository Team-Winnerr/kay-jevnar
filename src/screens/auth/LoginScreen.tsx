import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { loginUser, registerUser } from '../../services/authService';

interface LoginScreenProps {
  onSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (isRegister && !name) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await registerUser(name, email, password, role, rollNumber);
      } else {
        await loginUser(email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Branding with Official Logo */}
        <View style={styles.brandHeader}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandSubtitle}>Campus Food & Canteen Ordering System</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {isRegister ? 'Create Account' : (role === 'admin' ? 'Canteen Admin Portal' : 'Welcome Back')}
          </Text>
          <Text style={styles.cardSubtitle}>
            {isRegister
              ? 'Join to skip long canteen queues'
              : (role === 'admin' ? 'Sign in to access KDS & inventory controls' : 'Sign in to order your food')}
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Role Picker (Always visible for both Sign In and Register) */}
          <View style={styles.rolePicker}>
            <TouchableOpacity
              style={[styles.roleTab, role === 'student' && styles.roleTabActive]}
              onPress={() => {
                setRole('student');
                if (email === 'admin@kayjevnar.edu') setEmail('');
              }}
            >
              <Text
                style={[styles.roleTabText, role === 'student' && styles.roleTabTextActive]}
              >
                🎓 Student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleTab, role === 'admin' && styles.roleTabActive]}
              onPress={() => {
                setRole('admin');
                if (!email) {
                  setEmail('admin@kayjevnar.edu');
                  setPassword('Pass123!');
                }
              }}
            >
              <Text
                style={[styles.roleTabText, role === 'admin' && styles.roleTabTextActive]}
              >
                👨‍🍳 Canteen Admin
              </Text>
            </TouchableOpacity>
          </View>

          {isRegister && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Aryan Sharma"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              {role === 'student' && (
                <>
                  <Text style={styles.label}>College Roll Number / ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 2026CS108"
                    value={rollNumber}
                    onChangeText={setRollNumber}
                    autoCapitalize="characters"
                  />
                </>
              )}
            </>
          )}

          <Text style={styles.label}>College Email</Text>
          <TextInput
            style={styles.input}
            placeholder="student@college.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isRegister ? 'Register & Continue' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle between Login and Register */}
          <TouchableOpacity
            style={styles.switchMode}
            onPress={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            <Text style={styles.switchModeText}>
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account? Create One"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'center'
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20
  },
  logoImage: {
    width: 250,
    height: 90,
    alignSelf: 'center',
    marginBottom: 6
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600'
  },
  rolePicker: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  roleTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280'
  },
  roleTabTextActive: {
    color: '#111827',
    fontWeight: '700'
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
    marginTop: 8
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827'
  },
  submitButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  switchMode: {
    marginTop: 16,
    alignItems: 'center'
  },
  switchModeText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600'
  }
});
