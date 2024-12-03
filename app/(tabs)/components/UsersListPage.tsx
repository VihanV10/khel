import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/app/supabase';

// Define types for Profile
type Profile = {
  id: string;
  username: string;
};

const UsersListPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [senderId, setSenderId] = useState<string | null>(null); // State to store the logged-in user's ID
  const navigation = useNavigation<any>(); // Use 'any' to avoid navigation type errors

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

  useEffect(() => {
    // Fetch user ID when the component mounts
    fetchUserId();
  }, []); // Empty dependency array ensures it only runs on mount

  useEffect(() => {
    const fetchConnections = async () => {
      if (!senderId) return; // Ensure senderId is available

      const { data: connections, error } = await supabase
        .from('connections')
        .select('recipient_id, requester_id')
        .or(`recipient_id.eq.${senderId},requester_id.eq.${senderId}`)
        .eq('request_accepted', true); // Only accepted connections

      if (error) {
        console.error('Error fetching connections:', error);
        return;
      }

      // Extract connected user IDs
      const connectedUserIds = connections?.map(connection => 
        connection.requester_id === senderId ? connection.recipient_id : connection.requester_id
      );

      return connectedUserIds;
    };

    const fetchProfiles = async () => {
      const connectedUserIds = await fetchConnections();

      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('id, username');

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        console.log('Fetched profiles data:', profilesData); // Log profiles data if fetched successfully
      }

      // Filter profiles based on connected user IDs
      const filteredProfiles = profilesData?.filter(profile => 
        connectedUserIds?.includes(profile.id)
      );

      setProfiles(filteredProfiles ?? []); // Handle null profilesData
    };

    // Only fetch profiles when senderId is available
    if (senderId) {
      fetchProfiles();
    }
  }, [senderId]); // Add senderId as a dependency to re-fetch profiles when it changes

  const goToChatPage = (recipientId: string, username: string) => {
    console.log('Navigating to ChatPage with:', { recipientId, username }); // Log navigation parameters

    // Use 'navigate' with 'as any' to prevent type errors without modifying other files
    navigation.navigate('ChatPage' as any, { recipientId, username, senderId });
  };

  return (
    <View style={styles.container}>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      <Text style={styles.header}>Select a User to Chat With</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userButton}
            onPress={() => goToChatPage(item.id, item.username)}
          >
            <Text style={styles.userText}>{item.username}</Text>
          </TouchableOpacity>
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginBottom: 8,
    alignItems: 'center',
  },
  userText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default UsersListPage;
