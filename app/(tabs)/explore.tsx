import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { supabase } from '../supabase';

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
  let { data: profiles, error } = await supabase
    .from('profiles')
    .select('*');
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
      <Text>{item.username}</Text>
      <Text>Cricket: {item.Cricket}</Text>
      <Text>Pickleball: {item.Pickleball}</Text>
      {item.avatar_url ? (
        <Image
          source={{ uri: item.avatar_url }}
          style={styles.avatar}
          onError={() => console.log('Error loading image:', item.avatar_url)} // Log image loading errors
        />
      ) : (
        <Text>No Image</Text>
      )}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginTop: 8,
  },
});

export default UserProfileList;
