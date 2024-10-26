import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { supabase } from '@/app/supabase';

type Message = {
  id: string; // Message ID
  sender_id: string; // Sender's user ID
  recipient_id: string; // Recipient's user ID
  content: string; // Message content
  timestamp: string; // Timestamp of the message
};

const ChatPage: React.FC<{ recipientId: string }> = ({ recipientId }) => {
  const [messages, setMessages] = useState<Message[]>([]); // State for messages
  const [senderId, setSenderId] = useState<string | null>(null); // State for sender ID
  const [messagesWithUsernames, setMessagesWithUsernames] = useState<any[]>([]); // State for messages with usernames

  // Fetch the user's ID and messages
  useEffect(() => {
    const fetchUserIdAndMessages = async () => {
      const { data } = await supabase.auth.getSession();

      // Safely check if the user exists in the session data
      if (data?.session?.user) {
        const userId = data.session.user.id; // Store the logged-in user's ID
        setSenderId(userId);
        console.log("Logged in user ID:", userId); // Log the user ID

        // Log the recipient ID
        console.log("Recipient ID:", recipientId);

        // Fetch messages for the logged-in user and the recipient
        let { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          return; // Exit if there's an error
        }

        // Ensure messagesData is not null or undefined
        if (messagesData) {
          console.log("Fetched messages:", messagesData); // Log fetched messages

          // Fetch profiles to map recipient IDs and sender IDs to usernames
          let { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username');

          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            return; // Exit if there's an error
          }

          // Ensure profilesData is not null or undefined
          if (profilesData) {
            // Create a mapping of user IDs to usernames
            const userIdToUsernameMap = Object.fromEntries(
              profilesData.map(profile => [profile.id, profile.username])
            );

            // Map messages to include usernames
            const messagesWithUsernames = messagesData.map(message => ({
              ...message,
              senderUsername: userIdToUsernameMap[message.sender_id],
              recipientUsername: userIdToUsernameMap[message.recipient_id],
            }));

            setMessagesWithUsernames(messagesWithUsernames); // Set messages with usernames
          } else {
            console.warn("No profiles found.");
          }
        } else {
          console.warn("No messages found.");
        }
      } else {
        console.log("User is not logged in");
      }
    };

    fetchUserIdAndMessages();
  }, [recipientId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messagesWithUsernames}
        keyExtractor={(item) => item.id.toString()} // Ensure id is valid
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender_id === senderId ? styles.sentMessage : styles.receivedMessage]}>
            <Text style={styles.usernameText}>
              From: {item.senderUsername} To: {item.recipientUsername}
            </Text>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.timestampText}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  usernameText: {
    fontSize: 12,
    color: '#555',
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});

export default ChatPage;

