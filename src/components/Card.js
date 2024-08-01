// src/components/Card.js

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Card = ({ title, subtitle, imageUri }) => {
  return (
    <View style={styles.card}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default Card;
