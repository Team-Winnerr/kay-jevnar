import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  NativeModules,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ReactApp } from './src/ReactApp';

// Extract the host IP where the Metro bundler or Vite server is running
const getDevServerHost = (): string => {
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (typeof scriptURL === 'string' && scriptURL.includes('://')) {
      const address = scriptURL.split('://')[1]?.split('/')[0];
      const host = address?.split(':')[0];
      if (host && host !== 'localhost' && host !== '127.0.0.1') {
        return host;
      }
    }
  } catch {
    // fallback
  }
  return '10.200.56.210';
};

const MobileWebContainer: React.FC = () => {
  const defaultHost = getDevServerHost();
  const defaultUrl = `http://${defaultHost}:5173/`;
  const [url, setUrl] = useState(defaultUrl);
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleReload = () => {
    setHasError(false);
    setErrorMessage('');
    setUrl(inputUrl);
    webViewRef.current?.reload();
  };

  return (
    <SafeAreaView style={styles.mobileSafeContainer} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Discrete Top Status Indicator (if user needs to reload or change IP) */}
      {showConfig && (
        <View style={styles.configBar}>
          <TextInput
            style={styles.urlInput}
            value={inputUrl}
            onChangeText={setInputUrl}
            placeholder="http://<YOUR_IP>:5173/"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.reloadBtn} onPress={handleReload}>
            <Text style={styles.reloadBtnText}>Go</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeConfigBtn}
            onPress={() => setShowConfig(false)}
          >
            <Text style={styles.closeConfigBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasError ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.errorContainer}
        >
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>📡</Text>
            <Text style={styles.errorTitle}>Connecting to Web UI</Text>
            <Text style={styles.errorSubtitle}>
              Could not reach Vite server at:
            </Text>
            <Text style={styles.errorUrl}>{url}</Text>

            {errorMessage ? (
              <Text style={styles.errorDetail}>Error: {errorMessage}</Text>
            ) : null}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Server URL / Host IP:</Text>
              <TextInput
                style={styles.fullInput}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder="http://10.200.56.210:5173/"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity style={styles.retryBtn} onPress={handleReload}>
              <Text style={styles.retryBtnText}>🔄 Retry Connection</Text>
            </TouchableOpacity>

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                💡 Ensure Vite is running (`npm run dev`) and your mobile phone is connected to the same Wi-Fi network.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.webViewWrapper}>
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mixedContentMode="always"
            startInLoadingState={true}
            originWhitelist={['*']}
            setSupportMultipleWindows={false}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#BA2424" />
                <Text style={styles.loadingText}>Loading काय Jevnar? Canteen...</Text>
              </View>
            )}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              setHasError(true);
              setErrorMessage(nativeEvent.description || 'Connection failed');
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              if (nativeEvent.statusCode >= 400) {
                console.warn('WebView HTTP error: ', nativeEvent.statusCode);
                setHasError(true);
                setErrorMessage(`HTTP Error ${nativeEvent.statusCode}`);
              }
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <AuthProvider>
        <CartProvider>
          <ReactApp />
        </CartProvider>
      </AuthProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <MobileWebContainer />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mobileSafeContainer: {
    flex: 1,
    backgroundColor: '#FFFDF9'
  },
  webViewWrapper: {
    flex: 1,
    backgroundColor: '#FFFDF9'
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFDF9'
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#18181B'
  },
  configBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#18181B',
    gap: 8
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: '#18181B'
  },
  reloadBtn: {
    backgroundColor: '#BA2424',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6
  },
  reloadBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13
  },
  closeConfigBtn: {
    padding: 6
  },
  closeConfigBtnText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '700'
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFDF9'
  },
  errorCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#18181B',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6
  },
  errorIcon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 8
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#18181B',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: -0.5
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
    marginTop: 4
  },
  errorUrl: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: '#BA2424',
    textAlign: 'center',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8
  },
  errorDetail: {
    fontSize: 12,
    color: '#DC2626',
    textAlign: 'center',
    marginTop: 6
  },
  inputWrapper: {
    marginTop: 16
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#18181B',
    textTransform: 'uppercase',
    marginBottom: 6
  },
  fullInput: {
    borderWidth: 2,
    borderColor: '#18181B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#18181B',
    backgroundColor: '#FAFAFA'
  },
  retryBtn: {
    backgroundColor: '#BA2424',
    borderWidth: 2,
    borderColor: '#18181B',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    textTransform: 'uppercase'
  },
  tipBox: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#FEF9C3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE047'
  },
  tipText: {
    fontSize: 12,
    color: '#854D0E',
    lineHeight: 16,
    fontWeight: '600'
  }
});
