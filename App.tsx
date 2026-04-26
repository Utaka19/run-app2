import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Run = {
  id: string;
  distance: number;
  date: string;
};

export default function App() {
  const [distance, setDistance] = useState('');
  const [runs, setRuns] = useState<Run[]>([]);
  const total = runs.reduce((sum, run) => sum + run.distance, 0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addOrUpdateRun = () => {
    if (!distance) return;
    if (isNaN(Number(distance))) return;

    if (editingId) {
      // ✏️ 更新
      setRuns((prev) =>
        prev.map((run) =>
          run.id === editingId ? { ...run, distance: Number(distance) } : run,
        ),
      );
      setEditingId(null);
    } else {
      // ➕ 追加
      const newRun: Run = {
        id: Date.now().toString(),
        distance: Number(distance),
        date: new Date().toLocaleDateString(),
      };

      setRuns((prev) => [newRun, ...prev]);
    }

    setDistance('');
  };

  const deleteRun = (id: string) => {
    setRuns((prev) => prev.filter((run) => run.id !== id));
  };

  const startEdit = (run: Run) => {
    setDistance(run.distance.toString());
    setEditingId(run.id);
  };

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem('runs');

      if (data) {
        setRuns(JSON.parse(data));
      }

      setIsLoaded(true);
    };

    load();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const save = async () => {
      await AsyncStorage.setItem('runs', JSON.stringify(runs));
    };

    save();
  }, [runs, isLoaded]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      <StatusBar style="light" />

      {/* タイトル */}
      <Text
        style={{
          color: 'white',
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        🏃‍♂️ ランニングログ
      </Text>

      <Text style={{ color: 'white', marginBottom: 10 }}>
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
          borderColor: 'gray',
          padding: 10,
          marginBottom: 10,
          color: 'white',
        }}
        placeholderTextColor="gray"
      />

      {/* ボタン */}
      <Button title={editingId ? '更新' : '保存'} onPress={addOrUpdateRun} />

      {/* リスト */}
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderColor: 'gray',
            }}
          >
            <Text style={{ color: 'white' }}>{item.date}</Text>
            <Text style={{ color: 'white' }}>{item.distance} km</Text>

            {/* ボタンエリア */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <View style={{ marginRight: 10 }}>
                <Button title="編集" onPress={() => startEdit(item)} />
              </View>

              <Button title="削除" onPress={() => deleteRun(item.id)} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
