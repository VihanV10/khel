// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Carousel from '../components/Carousel';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi, Shubhayana</Text>
      <Text style={styles.sectionTitle}>Sports you’d like </Text>
      <Carousel>
        <Card title="Football" subtitle="Play near you" imageUri="https://example.com/football.jpg" />
        <Card title="Basketball" subtitle="Find courts" imageUri="https://example.com/basketball.jpg" />
      </Carousel>
      <Text style={styles.sectionTitle}>People you might wanna play with </Text>
      <Carousel>
        <Card title="John Doe" subtitle="Available this weekend" imageUri="https://example.com/johndoe.jpg" />
        <Card title="Jane Smith" subtitle="Looking for a team" imageUri="https://example.com/janesmith.jpg" />
      </Carousel>
      <View style={styles.navBar}>
        <CustomButton title="Home" onPress={() => navigation.navigate('Home')} />
        <CustomButton title="Places" onPress={() => navigation.navigate('Places')} />
        <CustomButton title="People" onPress={() => navigation.navigate('People')} />
        <CustomButton title="Groups" onPress={() => navigation.navigate('Groups')} />
        <CustomButton title="Profile" onPress={() => navigation.navigate('Profile')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#ccc',
  },
});

export default HomeScreen;
