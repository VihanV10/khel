import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, Text, StyleSheet } from 'react-native';
import { supabase } from '@/app/supabase';

type UserProfile = {
  id: number;
  username: string;
  full_name: string;
  avatar_url: string;
};

const UserSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [senderId, setSenderId] = useState<string | null>(null); 

// Fetch the sender's user ID when the component mounts
useEffect(() => {
  const fetchUserId = async () => {
    const { data } = await supabase.auth.getSession();

    // Safely check if the user exists in the session data
    if (data?.session?.user) {
      const userId = data.session.user.id; // Store the logged-in user's ID
      setSenderId(userId);
      console.log("Logged in user ID:", userId); // Log the user ID
    } else {
      console.log("User is not logged in");
    }
  };

  fetchUserId();
}, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${searchQuery}%`); // Case-insensitive search

    if (error) {
      console.error(error);
      setUserProfiles([]);
    } else {
      setUserProfiles(data);
    }

    setLoading(false);
  };

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
    setMessageContent(''); // Clear the message input when a user is selected
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageContent) return; // Removed senderId check

    // Ensure senderId is available before sending a message
    if (!senderId) {
        console.log("Sender ID is not available");
        return;
    }

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          recipient_id: selectedUser.id,
          content: messageContent,
          timestamp: new Date().toISOString(), // This may be unnecessary if you have a default value
        },
      ]);

    if (error) {
        console.error('Error sending message:', error);
    } else {
        console.log('Message sent:', messageContent);
        setMessageContent(''); // Clear the message input after sending
    }
};


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          {userProfiles.map((user) => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.username} onPress={() => handleUserSelect(user)}>
                {user.username} ({user.full_name})
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
      {selectedUser && (
        <View style={styles.messageContainer}>
          <Text style={styles.selectedUserText}>
            Messaging {selectedUser.username} ({selectedUser.full_name})
          </Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            value={messageContent}
            onChangeText={setMessageContent}
          />
          <Button title="Send Message" onPress={handleSendMessage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  userItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 12,
  },
  selectedUserText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
});

export default UserSearch;
