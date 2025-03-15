import React, { useState } from 'react';
import { List, Divider } from 'react-native-paper';
import { StyleSheet, View, ScrollView } from 'react-native';

const items = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
  'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
  'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
  'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
  'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
  'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
  'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake',
  'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop',
  'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
  'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
];

export default function FilterOutdoor() {
  const [toggledItems, setToggledItems] = useState(
    Object.fromEntries(items.map((item) => [item, true]))
  );

  const toggleItem = (item) => {
    setToggledItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <List.Section style={styles.section}>
          <List.Subheader style={styles.subheader}>Select what you want to hear</List.Subheader>
          {items.map((item, index) => (
            <React.Fragment key={item}>
              <List.Item
                title={`${item.charAt(0).toUpperCase() + item.slice(1)} - ${toggledItems[item] ? 'ON' : 'OFF'}`}
                left={() => (
                  <List.Icon
                    icon={toggledItems[item] ? 'check-circle' : 'close-circle'}
                    color={toggledItems[item] ? '#4CAF50' : '#F44336'}
                    style={styles.icon}
                  />
                )}
                onPress={() => toggleItem(item)}
                style={styles.item}
              />
              {index < items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, 
    height: 800
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  subheader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    padding: 12,
  },
  item: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 16,
    size: 28,
  },
});
