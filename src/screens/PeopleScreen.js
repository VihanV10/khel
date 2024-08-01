// src/screens/PeopleScreen.js

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const PeopleScreen = () => {
  const renderPerson = ({ item }) => (
    <View style={styles.personItem}>
      <View style={styles.personImage} />
      <Text>{item.name}</Text>
      <Text>{item.location}</Text>
      <Text>{item.age} years old</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>People you might wanna play with</Text>
      <FlatList
        data={[
          { id: '1', name: 'Dhruva', location: 'Worli', age: 18 },
          // Add more people
        ]}
        renderItem={renderPerson}
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  personImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 20,
  },
});

export default PeopleScreen;
