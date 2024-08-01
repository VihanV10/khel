// src/screens/ProfileScreen.js

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profilePicture} />
      <Text style={styles.profileItem}>Sports you play</Text>
      <Text style={styles.profileItem}>Proficiency</Text>
      <Text style={styles.profileItem}>Location</Text>
      <Text style={styles.profileItem}>Radius</Text>
      <Button title="Preview" onPress={() => { /* Preview logic */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileItem: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default ProfileScreen;
