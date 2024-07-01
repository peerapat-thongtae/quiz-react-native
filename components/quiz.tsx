import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { QuestionFormatted, QuestionResponse } from "../types/question.type";
import { QUESTION_API_URL } from "../config/api.config";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 36,
    padding: 16,
  },
  separator: {
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    marginVertical: 24,
  },
  quizContainer: {
    flex: 1,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 24,
    textAlign: "left",
    marginBottom: 16,
  },
  textNumberOfQuestions: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  selectedOptionButton: {
    backgroundColor: "#B2F177",
  },
  optionText: {
    fontSize: 18,
    textAlign: "center",
  },
  scoreContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 32,
    marginBottom: 16,
  },
});

const Quiz = () => {
  const [questions, setQuestions] = useState<QuestionFormatted[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const getQuestions = () => {
    fetch(`${QUESTION_API_URL}/questions?limit=20`)
      .then((response) => response.json())
      .then((data: QuestionResponse[]) => {
        const formatQuestions = data.map((question: QuestionResponse) => {
          const incorrectAnswers = question.incorrectAnswers;
          const correctAnswer = question.correctAnswer;
          const questionTitle = question.question.text;
          const options = [...incorrectAnswers, correctAnswer].sort(
            () => Math.random() - 0.5
          );
          return {
            question: questionTitle,
            options,
            answer: correctAnswer,
          };
        });
        setQuestions(formatQuestions);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const currentQuestion = () => {
    return questions[currentQuestionIndex];
  };

  const getTotalAndCurrentQuestionText = () => {
    return `${currentQuestionIndex + 1}/${questions.length}`;
  };

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextPress = () => {
    if (selectedOption === currentQuestion().answer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestartPress = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setLoading(true);
    getQuestions();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="green" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isFinished ? (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            Your Score : {score}/{questions.length}
          </Text>
          <Button title="New Quiz" onPress={handleRestartPress} />
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <View style={styles.separator}>
            <Text style={styles.textNumberOfQuestions}>
              {getTotalAndCurrentQuestionText()}
            </Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion().question}</Text>
          <FlatList
            data={currentQuestion().options}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === item && styles.selectedOptionButton,
                ]}
                onPress={() => handleOptionPress(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
          <Button
            title="Next"
            onPress={handleNextPress}
            disabled={selectedOption === null}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Quiz;
