import React from 'react';
import { StyleSheet, View, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Avatar from './components/avatar';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { AirbnbRating } from '@rneui/themed';

export default function HomeScreen() {
  type UserProfile = {
    id: number;
    updated_at: string;
    username: string;
    full_name: string;
    avatar_url: string; // Ensure this is a string
    Cricket: string;
    Pickleball: string;
  };
  
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfiles = async (): Promise<UserProfile[]> => {
    try {
      let { data: profiles, error } = await supabase.from('profiles').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return profiles as UserProfile[];
    } catch (err) {
      console.error(err);
      
      return [];
    }
  };

  useEffect(() => {
    const getProfiles = async () => {
      const profilesData = await fetchUserProfiles();
      setProfiles(profilesData);
      setLoading(false);
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
      <Avatar size={100} url={item.avatar_url} onUpload={(url: string) => {}} showUploadButton={false} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoArea} />
        <TouchableOpacity style={styles.dmsButton}>
          <Text style={styles.dmsText}>DMs</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcomeText}>Hi, Shubhayan</Text>

        {/* Sports Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sports you'd like {'>'}</Text>
        </View>

        {/* People Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>People you might wanna play with {'>'}</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#FF0000" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <FlatList
              data={profiles}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              contentContainerStyle={styles.profileListContainer}
            />
          )}
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>Home</Text>
        <Text style={styles.navItem}>Place</Text>
        <Text style={styles.navItem}>Ppl</Text>
        <Text style={styles.navItem}>GCs</Text>
        <Text style={styles.navItem}>Profile</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#1E1E1E',
  },
  logoArea: {
    width: 40,
    height: 40,
    backgroundColor: '#FF0000', // Placeholder for logo
  },
  dmsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF0000',
    borderRadius: 8,
  },
  dmsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    color: '#FF0000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileListContainer: {
    paddingVertical: 10,
  },
  profileItem: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    marginRight: 16,
    padding: 10,
    width: Dimensions.get('window').width * 0.6, // Adjust width as needed
  },
  header: {
    marginBottom: 10,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 10,
  },
  detailText: {
    color: '#FFFFFF',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#1E1E1E',
  },
  navItem: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 20,
  },
});
