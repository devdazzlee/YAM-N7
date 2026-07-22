'use client';

import { Float } from '@react-three/drei';
import { forwardRef, ReactNode } from 'react';
import { Group } from 'three';
import { PerfumeBottle, PerfumeBottleProps } from './PerfumeBottle';

type FloatingBottleProps = {
  scent?: PerfumeBottleProps['scent'];
  rotationIntensity?: number;
  floatSpeed?: number;
  floatingRange?: [number, number];
  floatIntensity?: number;
  children?: ReactNode;
};

const FloatingBottle = forwardRef<Group, FloatingBottleProps>(
  (
    {
      scent = 'blackCherry',
      rotationIntensity = 1.5,
      floatSpeed = 7,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}
          <PerfumeBottle scent={scent} />
        </Float>
      </group>
    );
  },
);

FloatingBottle.displayName = 'FloatingBottle';

export default FloatingBottle;
