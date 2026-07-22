'use client';

import { View } from '@react-three/drei';

import { Bounded } from './Bounded';
import SkyDiveScene from './SkyDiveScene';

export default function SkyDive() {
  return (
    <Bounded className="skydive h-screen">
      <View className="h-screen w-screen">
        <SkyDiveScene scent="grape" sentence="Find Your Signature Scent" />
      </View>
      <h2 className="sr-only">Find Your Signature Scent</h2>
    </Bounded>
  );
}
