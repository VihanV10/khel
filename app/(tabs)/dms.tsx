import React from 'react';
import { StyleSheet, View, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Text, TouchableOpacity, ScrollView } from 'react-native';

export default function DMsPage() {
  type Conversation = {
    id: number;
    user_name: string;
    last_message: string;
    last_message_time: string;
  };

  // Sample data for conversations
  const sampleConversations: Conversation[] = [
    { id: 1, user_name: 'Alice', last_message: 'Hey, how are you?', last_message_time: '2m ago' },
    { id: 2, user_name: 'Bob', last_message: 'Let’s meet up later.', last_message_time: '10m ago' },
    { id: 3, user_name: 'Charlie', last_message: 'What’s the plan for today?', last_message_time: '1h ago' },
    { id: 4, user_name: 'Diana', last_message: 'Can you send me the file?', last_message_time: '3h ago' },
  ];

  const renderItem = ({ item }: { item: Conversation }) => (
    <View style={styles.conversationItem}>
      <View style={styles.conversationHeader}>
        <Text style={styles.userName}>{item.user_name}</Text>
        <Text style={styles.lastMessageTime}>{item.last_message_time}</Text>
      </View>
      <Text style={styles.lastMessage}>{item.last_message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Direct Messages</Text>
        <View style={styles.emptySpace} />
      </View>
      
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Sample data is used instead of fetching from an API */}
        <FlatList
          data={sampleConversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.conversationListContainer}
        />
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
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF0000',
    borderRadius: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptySpace: {
    width: 40,
    height: 40,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  conversationListContainer: {
    paddingVertical: 10,
  },
  conversationItem: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    marginBottom: 16,
    padding: 10,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessageTime: {
    color: '#888888',
    fontSize: 14,
  },
  lastMessage: {
    color: '#FFFFFF',
    fontSize: 16,
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
});
