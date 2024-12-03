import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/app/supabase';

type ConnectionRequest = {
  requester_id: string; // User ID who sent the request
  recipient_id: string; // User ID who received the request
  request_accepted: boolean; // Status of the request
};

type UserProfile = {
  id: string; // User ID
  username: string; // User's username
};

// Fetch incoming requests
const fetchIncomingRequests = async (userId: string): Promise<ConnectionRequest[]> => {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('recipient_id', userId)
    .is('request_accepted', false); // Only fetch pending requests

  if (error) {
    console.error('Error fetching incoming requests:', error);
    return [];
  }
  return data as ConnectionRequest[];
};

// Fetch profiles
const fetchProfiles = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username');

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return data as UserProfile[];
};

// Invites Page Component
const InvitesPage: React.FC = () => {
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    fetchUserId();
  }, []);

  // Fetch incoming requests and profiles when user ID is set
  useEffect(() => {
    const getData = async () => {
      if (userId) {
        const requestsData = await fetchIncomingRequests(userId);
        const profilesData = await fetchProfiles();
        setIncomingRequests(requestsData);
        setProfiles(profilesData);
      }
    };
    getData();
  }, [userId]);

  // Accept connection request
  const acceptConnectionRequest = async (requesterId: string) => {
    if (!userId) {
      console.error('User ID is null when accepting connection request');
      return; // Early exit if userId is null
    }

    console.log(`Accepting connection request from: ${requesterId} for user: ${userId}`);

    const { error } = await supabase
      .from('connections')
      .update({ request_accepted: true })
      .eq('requester_id', requesterId)
      .eq('recipient_id', userId);

    if (error) {
      console.error('Error accepting connection request:', error);
      Alert.alert('Error', 'Could not accept connection request.');
      return;
    }

    Alert.alert('Success', 'Connection request accepted!');
    
    // Log for debugging
    console.log('Connection request accepted, updating incoming requests.');

    // Refresh incoming requests after acceptance
    const updatedRequests = await fetchIncomingRequests(userId);
    setIncomingRequests(updatedRequests);
  };

  // Map requester IDs to usernames
  const getRequesterUsername = (requesterId: string) => {
    const profile = profiles.find((profile) => profile.id === requesterId);
    return profile ? profile.username : requesterId; // Fallback to ID if username is not found
  };

  const renderRequestItem = ({ item }: { item: ConnectionRequest }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>
        Connection request from: {getRequesterUsername(item.requester_id)}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => acceptConnectionRequest(item.requester_id)}>
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={incomingRequests}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item.requester_id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  requestItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  requestText: {
    fontSize: 16,
  },
  button: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
  },
});

export default InvitesPage;
