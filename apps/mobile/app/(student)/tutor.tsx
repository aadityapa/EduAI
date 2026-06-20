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
import { useTheme } from '../../src/theme/ThemeProvider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export default function TutorScreen() {
  const { tokens } = useAuth();
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || !tokens) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await tutorChat(tokens.accessToken, userMsg.text);
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
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user'
                ? { alignSelf: 'flex-end', backgroundColor: theme.primaryColor }
                : { alignSelf: 'flex-start', backgroundColor: '#e2e8f0' },
            ]}
          >
            <Text style={{ color: item.role === 'user' ? '#fff' : '#1e293b' }}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask your AI tutor..."
          value={input}
          onChangeText={setInput}
        />
        <Pressable
          style={[styles.send, { backgroundColor: theme.primaryColor }]}
          onPress={send}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  list: { padding: 16, flexGrow: 1 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 8 },
  inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#e2e8f0' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, marginRight: 8 },
  send: { borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: '600' },
});
