import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../supabase';
import Avatar from './components/avatar';

//add displays of difficulty

type UserProfile = {
  id: string; // User ID
  username: string;
  full_name: string;
  avatar_url: string;
  Cricket: string;
  Pickleball: string;
};

const fetchUserProfiles = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return data as UserProfile[];
};

// Function to check if a connection exists
const checkConnectionExists = async (senderId: string, recipientId: string): Promise<boolean> => {
  // Check if the senderId is the requester and recipientId is the recipient
  const { data: requesterData, error: requesterError } = await supabase
    .from('connections')
    .select('*')
    .eq('requester_id', senderId)
    .eq('recipient_id', recipientId);

  console.log('Requester connection check:', { senderId, recipientId, requesterData, requesterError });

  if (requesterError) {
    console.error('Error checking for requester connection:', requesterError);
    return false;
  }

  // If a connection exists in the first check, return true
  if (requesterData && requesterData.length > 0) {
    const isAccepted = requesterData[0].request_accepted;
    return isAccepted;
  }

  // Now check the reverse case
  const { data: recipientData, error: recipientError } = await supabase
    .from('connections')
    .select('*')
    .eq('requester_id', recipientId)
    .eq('recipient_id', senderId);

  console.log('Recipient connection check:', { requesterId: recipientId, recipientId: senderId, recipientData, recipientError });

  if (recipientError) {
    console.error('Error checking for recipient connection:', recipientError);
    return false;
  }

  // If a connection exists in the second check, return true
  if (recipientData && recipientData.length > 0) {
    const isAccepted = recipientData[0].request_accepted;
    return isAccepted;
  }

  // No connection exists
  return false;
};

// Explore Page Component
const ExplorePage: React.FC = () => {
  const [initial_profiles, setProfiles] = useState<UserProfile[]>([]);
  const [requestsSent, setRequestsSent] = useState<{ [key: string]: boolean }>({});
  const [requestsReceived, setRequestsReceived] = useState<{ [key: string]: boolean }>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<any[]>([]); // State to hold existing connections
  const profiles = initial_profiles.filter(profile => profile.id !== userId);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const getProfiles = async () => {
      const profilesData = await fetchUserProfiles();
      setProfiles(profilesData);
    };
    getProfiles();
  }, []);

  useEffect(() => {
    const getConnections = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('connections')
          .select('*')
          .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
        if (error) {
          console.error('Error fetching connections:', error);
        } else {
          setConnections(data);
          // Update request states based on connections
          const sentRequests: { [key: string]: boolean } = {};
          const receivedRequests: { [key: string]: boolean } = {};
          data.forEach(connection => {
            if (connection.requester_id === userId) {
              sentRequests[connection.recipient_id] = true;
            } else if (connection.recipient_id === userId) {
              receivedRequests[connection.requester_id] = true;
            }
          });
          setRequestsSent(sentRequests);
          setRequestsReceived(receivedRequests);
        }
      }
    };
    getConnections();
  }, [userId]); // Fetch connections whenever userId changes

  const sendConnectionRequest = async (recipientId: string) => {
    if (!userId) {
      Alert.alert('Error', 'You need to be logged in to send a request.');
      return;
    }

    const exists = await checkConnectionExists(userId, recipientId);
    if (exists) {
      Alert.alert('Info', 'Connection request already sent or exists.');
      setRequestsSent((prev) => ({ ...prev, [recipientId]: true }));
      return;
    }

    const { error } = await supabase
      .from('connections')
      .insert([{ requester_id: userId, recipient_id: recipientId, request_accepted: false }]);

    if (error) {
      console.error('Error sending connection request:', error);
      Alert.alert('Error', 'Could not send connection request.');
      return;
    }

    setRequestsSent((prev) => ({ ...prev, [recipientId]: true }));
    Alert.alert('Success', 'Connection request sent!');
  };

  const acceptConnectionRequest = async (requesterId: string) => {
    if (!userId) return; // Add a guard in case userId is null

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

    // Update state to reflect the connection
    setRequestsReceived((prev) => ({ ...prev, [requesterId]: false }));
    setConnections((prev) => [...prev, { requester_id: requesterId, recipient_id: userId, request_accepted: true }]);
    Alert.alert('Success', 'Connection request accepted!');
  };

  const renderItem = ({ item }: { item: UserProfile }) => {
    const requestSent = requestsSent[item.id] || false;
    const requestReceived = requestsReceived[item.id] || false;
    const isConnected = checkIfConnected(item.id);

    return (
      <View style={styles.profileItem}>
        <Avatar size={50} url={item.avatar_url} onUpload={() => {}} showUploadButton={false} />
        <Text style={styles.username}>{item.username}</Text>
        {isConnected ? (
          <Text style={styles.connectedText}>Connected</Text>
        ) : requestSent ? (
          <Text style={styles.requestSentText}>Request Sent</Text>
        ) : requestReceived ? (
          <TouchableOpacity style={styles.button} onPress={() => acceptConnectionRequest(item.id)}>
            <Text style={styles.buttonText}>Accept Invite</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => sendConnectionRequest(item.id)}>
            <Text style={styles.buttonText}>Send Request</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Check if the current user is connected to the given userId
  const checkIfConnected = (userId: string) => {
    return connections.some(connection => 
      (connection.requester_id === userId && connection.request_accepted) || 
      (connection.recipient_id === userId && connection.request_accepted)
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={profiles} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  username: {
    fontSize: 18,
    marginLeft: 12,
  },
  button: {
    marginLeft: 'auto',
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
  },
  requestSentText: {
    color: 'gray',
    fontStyle: 'italic',
  },
  connectedText: {
    color: 'green',
  },
});

export default ExplorePage;
