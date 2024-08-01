// src/screens/PlacesScreen.js

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Card from '../components/Card';

const placesData = [
  {
    id: '1',
    name: 'Cooperage Ground',
    location: '101 Johnson St',
    capacity: 20,
    imageUri: 'https://example.com/place1.jpg',
  },
  // Add more place data
];

const PlacesScreen = ({ navigation }) => {
  const renderPlace = ({ item }) => (
    <Card
      title={item.name}
      subtitle={`Capacity: ${item.capacity}`}
      imageUri={item.imageUri}
      onPress={() => navigation.navigate('PlaceDetail', { placeId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Places to Play</Text>
      <FlatList
        data={placesData}
        renderItem={renderPlace}
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

export default PlacesScreen;
