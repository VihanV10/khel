// src/components/Carousel.js

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

const Carousel = ({ children }) => {
  return (
    <ScrollView horizontal style={styles.carousel}>
      <View style={styles.carouselContainer}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carousel: {
    padding: 10,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Carousel;
