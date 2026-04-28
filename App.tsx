import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}
      edges={['top', 'bottom']}
    >
      <StatusBar style="light" />

      {/* タイトル */}
      <Text
        style={{
          color: 'white',
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        🏃‍♂️ ランニングログ
      </Text>

      <View
        style={{
          backgroundColor: '#1e1e1e',
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      >
        <Text style={{ color: '#aaa', marginBottom: 5 }}>合計距離</Text>

        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {total.toFixed(1)} km
        </Text>
      </View>

      {/* 入力 */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ color: '#aaa', marginBottom: 5 }}>距離 (km)</Text>

        <TextInput
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
          placeholder="例: 5.0"
          placeholderTextColor="#666"
          style={{
            backgroundColor: '#1e1e1e',
            color: 'white',
            padding: 12,
            borderRadius: 10,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#333',
          }}
        />
      </View>

      {/* ボタン */}
      <TouchableOpacity
        onPress={addOrUpdateRun}
        style={{
          backgroundColor: editingId ? '#FF9800' : '#2196F3',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {editingId ? '更新する' : '保存する'}
        </Text>
      </TouchableOpacity>

      {/* リスト */}
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#1e1e1e',
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,

              // 影（iOS）
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },

              // 影（Android）
              elevation: 3,
            }}
          >
            {/* 日付 */}
            <Text style={{ color: '#aaa', marginBottom: 5 }}>{item.date}</Text>

            {/* 距離 */}
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
              }}
            >
              {item.distance} km
            </Text>

            {/* ボタンエリア */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => startEdit(item)}
                style={{
                  backgroundColor: '#4CAF50',
                  padding: 10,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 5,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>編集</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteRun(item.id)}
                style={{
                  backgroundColor: '#F44336',
                  padding: 10,
                  borderRadius: 8,
                  flex: 1,
                  marginLeft: 5,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
