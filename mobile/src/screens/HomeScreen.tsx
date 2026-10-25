import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-4xl font-bold text-slate-900">
        Va saluta dragos! pups:*{' '}
      </Text>
      <Text className="mt-2 text-lg text-slate-500">
        Aici o sa fie HomeScreen-ul
      </Text>
    </View>
  );
}
