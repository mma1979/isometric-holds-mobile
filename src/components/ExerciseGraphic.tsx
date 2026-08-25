import React from 'react';
import { StyleSheet, View, Image, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { exerciseImages } from '../data';
import { theme } from '../theme';

interface ExerciseGraphicProps {
  exerciseId: string;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover';
}

export default function ExerciseGraphic({
  exerciseId,
  style,
  imageStyle,
  resizeMode = 'contain',
}: ExerciseGraphicProps) {
  const imageSource = exerciseImages[exerciseId] || exerciseImages['iron-bridge'];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={imageSource}
        style={[styles.image, imageStyle]}
        resizeMode={resizeMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
