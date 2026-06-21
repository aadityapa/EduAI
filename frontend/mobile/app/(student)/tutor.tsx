import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../src/auth/AuthContext';
import { tutorChat } from '../../src/api/services';
import { Screen, tokens } from '../../src/components/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export default function TutorScreen() {
  const { tokens: authTokens } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', text: 'Hi! What would you like to learn today?' },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || !authTokens) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await tutorChat(authTokens.accessToken, userMsg.text);
      setMessages((m) => [
        ...m,
        { id: `${Date.now()}-ai`, role: 'assistant', text: res.reply ?? 'No response' },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-err`,
          role: 'assistant',
          text: e instanceof Error ? e.message : 'AI unavailable',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>AI Tutor</Text>
        <Text style={styles.heroSub}>Learning Hub · Online</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user'
                ? styles.userBubble
                : styles.assistantBubble,
            ]}
          >
            <Text style={item.role === 'user' ? styles.userText : styles.assistantText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask your AI tutor..."
          placeholderTextColor={tokens.colors.textMuted}
          value={input}
          onChangeText={setInput}
        />
        <Pressable style={styles.send} onPress={send} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 0 },
  hero: {
    backgroundColor: tokens.colors.tertiary,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
  },
  heroTitle: { color: '#fff', fontSize: tokens.fontSize.lg, fontWeight: '700' },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: tokens.fontSize.sm, marginTop: 2 },
  list: { padding: tokens.spacing.md, flexGrow: 1, paddingBottom: 8 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: tokens.colors.primaryBright },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: '#e8eaed' },
  userText: { color: '#fff', fontSize: tokens.fontSize.sm },
  assistantText: { color: tokens.colors.text, fontSize: tokens.fontSize.sm },
  inputRow: {
    flexDirection: 'row',
    padding: tokens.spacing.sm,
    borderTopWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
    paddingBottom: 90,
  },
  input: {
    flex: 1,
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  send: {
    backgroundColor: tokens.colors.primaryBright,
    borderRadius: tokens.radius.full,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontWeight: '700', fontSize: tokens.fontSize.sm },
});
