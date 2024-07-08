import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, Stack } from 'expo-router';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase';
import Auth from './components/auth';
import { Session } from '@supabase/supabase-js'
import Account from './components/account';

export default function HomeScreen() {


  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.titleText}>Welcome to Khel!</ThemedText>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.subtitleText}>View Profiles</ThemedText>
        <ThemedText style={styles.descriptionText}>
          Discover and connect with other sports enthusiasts.
          the profiles section.
        </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={styles.subtitleText}>Book Courts</ThemedText>
        <ThemedText style={styles.descriptionText}>
          Book a pitch or join a game
        
        </ThemedText>
        </ThemedView>
        <View>
      
    </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop:40,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    color: '#BB86FC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
