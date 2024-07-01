import { SafeAreaView, StyleSheet } from "react-native";
import Quiz from "./components/quiz";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfd8d6',
    justifyContent: 'center',
    padding: 16,
  },
});

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Quiz />
    </SafeAreaView>
  );
};

export default App;
