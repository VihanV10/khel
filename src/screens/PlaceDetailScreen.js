// src/screens/PlaceDetailScreen.js

import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

const PlaceDetailScreen = ({ route }) => {
  const { placeId } = route.params;

  // For demonstration, we'll use static data.
  const placeData = {
    id: '1',
    name: 'Cooperage Ground',
    location: '101 Johnson St',
    capacity: 20,
    imageUri: 'https://example.com/place1.jpg',
    description: 'A great place to play football with well-maintained facilities.',
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: placeData.imageUri }} style={styles.image} />
      <Text style={styles.name}>{placeData.name}</Text>
      <Text style={styles.capacity}>Capacity: {placeData.capacity}</Text>
      <Text style={styles.location}>{placeData.location}</Text>
      <Text style={styles.description}>{placeData.description}</Text>
      <Button title="Book Venue" onPress={() => { /* Booking logic */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  capacity: {
    fontSize: 18,
    marginVertical: 10,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default PlaceDetailScreen;
