import { StyleSheet } from 'react-native';

import HomeScreenInfo from '@/components/HomeScreenInfo';
import { Text, View } from '@/components/Themed';
import StatusView from '@/components/StatusView';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
        
        <StatusView />
         <HomeScreenInfo path="app/(tabs)/index.tsx" />
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
