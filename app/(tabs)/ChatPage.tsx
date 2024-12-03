import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { supabase } from '@/app/supabase';

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  timestamp: string;
  senderUsername?: string; // Optional to hold the username
  recipientUsername?: string; // Optional to hold the username
};

type RouteParams = {
  recipientId: string;
  username: string;
  senderId: string;
};

const ChatPage: React.FC = () => {
  const route = useRoute();
  const { recipientId, username, senderId } = route.params as RouteParams;
  console.log('ChatPage params:', { recipientId, username, senderId });

  const [messagesWithUsernames, setMessagesWithUsernames] = useState<Message[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const fetchMessages = async () => {
    console.log('Fetching messages...');
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session?.user) {
        const loggedInUserId = sessionData.session.user.id;

        // Fetch messages where the logged-in user is the sender
        const { data: sentMessages, error: sentMessagesError } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${loggedInUserId}`);

        // Fetch messages where the logged-in user is the recipient
        const { data: receivedMessages, error: receivedMessagesError } = await supabase
            .from('messages')
            .select('*')
            .or(`recipient_id.eq.${loggedInUserId}`);

        // Handle errors if any
        if (sentMessagesError) {
            console.error('Error fetching sent messages:', sentMessagesError);
            return;
        }

        if (receivedMessagesError) {
            console.error('Error fetching received messages:', receivedMessagesError);
            return;
        }

        // Combine the results
        const messagesData = [...sentMessages, ...receivedMessages];

        // Manually filter messages to keep only those exchanged between the logged-in user and the recipient
        const filteredMessages = messagesData.filter(message => 
            (message.sender_id === loggedInUserId && message.recipient_id === recipientId) || 
            (message.sender_id === recipientId && message.recipient_id === loggedInUserId)
        );

        console.log('Filtered messages:', filteredMessages);

        // Fetch profiles for username mapping
        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username');

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            return;
        }

        const userIdToUsernameMap = profilesData
            ? Object.fromEntries(profilesData.map(profile => [profile.id, profile.username]))
            : {};

        // Sort messages by timestamp
        const sortedMessages = filteredMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        // Map messages to include usernames
        const messagesWithUsernames = sortedMessages.map(message => ({
            ...message,
            senderUsername: userIdToUsernameMap[message.sender_id],
            recipientUsername: userIdToUsernameMap[message.recipient_id],
        }));

        console.log('Messages with usernames:', messagesWithUsernames);
        setMessagesWithUsernames(messagesWithUsernames || []);
    }
};





  useEffect(() => {
    fetchMessages();
  }, [recipientId, senderId]);

  const handleSendMessage = async () => {
    if (messageInput.trim() === '') return;

    console.log('Sending message:', messageInput);
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: senderId,
          recipient_id: recipientId,
          content: messageInput,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    setLog(prevLog => [...prevLog, `Sent: "${messageInput}" at ${timestamp}`]);

    console.log('Message sent successfully. Fetching messages again...');
    setMessageInput('');
    fetchMessages(); // Fetch messages again after sending to update the chat
  };

  return (
    <View style={styles.container}>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text style={styles.header}>Chat with {username}</Text>
      <FlatList
        data={messagesWithUsernames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender_id === senderId ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageInput}
          onChangeText={setMessageInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logContainer}>
        <Text style={styles.logHeader}>Message Log:</Text>
        <FlatList
          data={log}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.logItem}>{item}</Text>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6', // Light green for sent messages
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0', // Light gray for received messages
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 2,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  logContainer: {
    marginTop: 16,
  },
  logHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logItem: {
    fontSize: 14,
    color: '#333',
  },
});

export default ChatPage;
