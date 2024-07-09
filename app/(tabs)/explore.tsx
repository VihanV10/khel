import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../supabase';
import Avatar from './components/avatar';

type UserProfile = {
  id: number;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string; // Ensure this is a string
  Cricket: string;
  Pickleball: string;
};

const fetchUserProfiles = async (): Promise<UserProfile[]> => {
  let { data: profiles, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error(error);
    return [];
  }
  return profiles as UserProfile[];
};

const UserProfileList: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    const getProfiles = async () => {
      const profilesData = await fetchUserProfiles();
      console.log('Fetched Profiles:', profilesData); // Log profiles data
      setProfiles(profilesData);
    };

    getProfiles();
  }, []);

  const renderItem = ({ item }: { item: UserProfile }) => (
    <View style={styles.profileItem}>
      <View style={styles.header}>
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailText}>Cricket: {item.Cricket}</Text>
        <Text style={styles.detailText}>Pickleball: {item.Pickleball}</Text>
      </View>
      {/* Pass showUploadButton={false} to hide the upload button */}
      <Avatar size={200} url={item.avatar_url} onUpload={(url: string) => {}} showUploadButton={false} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    marginBottom: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
  },
});

export default UserProfileList;
