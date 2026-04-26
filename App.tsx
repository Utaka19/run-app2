import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type Run = {
  id: string;
  distance: number;
  date: string;
};

export default function App() {
  const [distance, setDistance] = useState("");
  const [runs, setRuns] = useState<Run[]>([]);
  const total = runs.reduce((sum, run) => sum + run.distance, 0);

  const addRun = () => {
    if (!distance) return;
    if (isNaN(Number(distance))) return;

    const newRun: Run = {
      id: Date.now().toString(),
      distance: Number(distance),
      date: new Date().toLocaleDateString(),
    };

    setRuns((prev) => [newRun, ...prev]);
    setDistance("");
  };

  const deleteRun = (id: string) => {
    setRuns((prev) => prev.filter((run) => run.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212", padding: 20 }}>
      <StatusBar style="light" />

      {/* タイトル */}
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        🏃‍♂️ ランニングログ
      </Text>

      <Text style={{ color: "white", marginBottom: 10 }}>
        合計: {total.toFixed(1)} km
      </Text>

      {/* 入力 */}
      <TextInput
        placeholder="距離 (km)"
        value={distance}
        onChangeText={setDistance}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          marginBottom: 10,
          color: "white",
        }}
        placeholderTextColor="gray"
      />

      {/* ボタン */}
      <Button title="保存" onPress={addRun} />

      {/* リスト */}
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "gray" }}>
            <Text style={{ color: "white" }}>{item.date}</Text>
            <Text style={{ color: "white" }}>{item.distance} km</Text>
            <Button title="削除" onPress={() => deleteRun(item.id)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}