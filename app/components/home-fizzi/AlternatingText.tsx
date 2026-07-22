'use client';

import { View } from '@react-three/drei';
import clsx from 'clsx';

import { Bounded } from './Bounded';
import AlternatingTextScene from './AlternatingTextScene';

const SECTIONS = [
  {
    heading: 'Long-Lasting Wear',
    body: 'A single spritz carries from morning meetings to midnight plans, without needing a top-up.',
  },
  {
    heading: 'Clean, Skin-Safe Formula',
    body: 'Alcohol-balanced and dermatologist-tested, our fragrance oils are gentle enough for daily wear.',
  },
  {
    heading: 'Bottled Like Art',
    body: "Each flacon is hand-finished, a piece you'll want on display, not tucked away in a drawer.",
  },
];

export default function AlternatingText() {
  return (
    <Bounded className="alternating-text-container relative bg-yellow-300 text-sky-950">
      <div>
        <div className="relative z-[100] grid">
          <View className="alternating-text-view absolute left-0 top-0 h-screen w-full">
            <AlternatingTextScene />
          </View>

          {SECTIONS.map((item, index) => (
            <div
              key={item.heading}
              className="alternating-section grid h-screen place-items-center gap-x-12 md:grid-cols-2"
            >
              <div
                className={clsx(
                  index % 2 === 0 ? 'col-start-1' : 'md:col-start-2',
                  'rounded-lg p-4 backdrop-blur-lg max-md:bg-white/1',
                )}
              >
                <div className="text-balance text-6xl font-bold">{item.heading}</div>
                <div className="mt-4 text-xl">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Bounded>
  );
}
