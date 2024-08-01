// src/screens/DMsScreen.js

import React from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import CustomButton from '../components/CustomButton';

const DMsScreen = () => {
  const renderMessage = ({ item }) => (
    <View style={styles.messageItem}>
      <Text>{item.sender}</Text>
      <Text>{item.message}</Text>
      <CustomButton title="Book" onPress={() => { /* Booking logic */ }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchBar} placeholder="Search..." />
      <FlatList
        data={[
          { id: '1', sender: 'Abhiboomboom', message: 'Wassup wassup' },
          // Add more messages
        ]}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default DMsScreen;
