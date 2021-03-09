import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, Pressable } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

const NUM_ITEMS = 10;

function getColor(i: number) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const exampleData: Item[] = [...Array(20)].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `item-${backgroundColor}`,
    label: String(index),
    backgroundColor,
  };
});

type Item = {
  key: string,
  label: string,
  backgroundColor: string,
};

function FlatList() {
  const [data, setData] = useState(exampleData);

  const renderItem = useCallback(
    ({ item, index, drag, isActive }: RenderItemParams<Item>) => {
      return (
        <Pressable
          style={{
            height: 100,
            backgroundColor: isActive ? 'red' : item.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onLongPress={drag}>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: 32,
            }}>
            index: {index}
          </Text>
        </Pressable>
      );
    },
    [],
  );

  return (
    <DraggableFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `draggable-item-${item.key}`}
      onDragEnd={({ data, from, to }) => {
        if (from !== to) {
          data[to].label = 'index: ' + to;
          alert(JSON.stringify(data[to]));
        } else {
          alert(JSON.stringify(data[from]));
        }
        setData(data);
        //alert('from: ' + from + ' to: ' + to);
      }}
    />
  );
}

export default FlatList;
