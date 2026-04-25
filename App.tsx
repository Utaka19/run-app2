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

export default function App() {
  const [distance, setDistance] = useState("");

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
      <Button title="保存" onPress={() => {}} />

      {/* リスト（まだ空） */}
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderColor: "gray",
            }}
          >
            <Text style={{ color: "white" }}>2026/04/25</Text>
            <Text style={{ color: "white" }}>5 km</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}