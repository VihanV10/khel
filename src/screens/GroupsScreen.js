// src/screens/GroupsScreen.js

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Card from '../components/Card';

const groupsData = [
  {
    id: '1',
    name: 'Khel Team',
    date: '24th July',
    location: 'Cooperage Ground',
    time: '10pm',
    members: 7,
    capacity: 8,
    imageUri: 'https://example.com/group1.jpg',
  },
  // Add more group data
];

const GroupsScreen = () => {
  const renderGroup = ({ item }) => (
    <Card
      title={item.name}
      subtitle={`${item.date} | ${item.location} | ${item.time}`}
      imageUri={item.imageUri}
    >
      <Text>{`${item.members}/${item.capacity} members`}</Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Groups</Text>
      <FlatList
        data={groupsData}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default GroupsScreen;
