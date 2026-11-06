import { View } from 'react-native';

type PageDotsProps = {
  count: number;
  activeIndex: number;
};

export function PageDots({ count, activeIndex }: PageDotsProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="flex-row items-center justify-center gap-[6px]"
    >
      {Array.from({ length: count }, (_item, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            index === activeIndex ? 'w-[22px] bg-navy' : 'w-2 bg-steel/[0.45]'
          }`}
        />
      ))}
    </View>
  );
}
