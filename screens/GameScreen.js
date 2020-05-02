import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import NumberContainer from "../components/NumberContainer";
import Card from "../components/Card";
import TitleText from "../components/TitleText";
import BodyText from "../components/BodyText";
import StartButton from "../components/StartButton";

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;
  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
};

const renderListItems = (value, numberOfRounds) => (
  <View key={value} style={styles.listItem}>
    <BodyText>#{numberOfRounds}</BodyText>
    <BodyText>{value}</BodyText>
  </View>
);

const GameScreen = props => {
  const initialGuess = generateRandomBetween(1, 100, props.userChoice);

  const [currentGuess, setCurrentGuess] = useState(initialGuess);

  const [passGuesses, setPastGuesses] = useState([initialGuess]);

  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );

  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props;

  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };
    Dimensions.addEventListener("change", updateLayout);
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

  useEffect(() => {
    if (currentGuess === props.userChoice) {
      props.onGameOver(passGuesses.length);
    }
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = direction => {
    if (
      (direction === "lower" && currentGuess < props.userChoice) ||
      (direction === "greater" && currentGuess > props.userChoice)
    ) {
      Alert.alert("Don't lie!", "You know that this is wrong .... ", [
        { title: "Sorry!", style: "cancel" }
      ]);
      return;
    }
    if (direction === "lower") {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }
    const nextNumber = generateRandomBetween(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );
    setCurrentGuess(nextNumber);

    setPastGuesses(curPastGuess => [nextNumber, ...curPastGuess]);
  };

  if (availableDeviceHeight < 500) {
    return (
      <View style={styles.screen}>
        <TitleText>Opponent's Guess</TitleText>
        <View style={styles.controls}>
          <StartButton onPress={nextGuessHandler.bind(this, "lower")}>
            <Ionicons name="md-remove" size={24} color="white" />
          </StartButton>
          <NumberContainer>{currentGuess}</NumberContainer>
          <StartButton onPress={nextGuessHandler.bind(this, "greater")}>
            <Ionicons name="md-add" size={24} color="white" />
          </StartButton>
        </View>
        <View style={styles.listContainer}>
          <ScrollView contentContainerStyle={styles.list}>
            {passGuesses.map((guess, index) =>
              renderListItems(guess, passGuesses.length - index)
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TitleText>Opponent's Guess</TitleText>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={styles.buttonContainer}>
        <StartButton onPress={nextGuessHandler.bind(this, "lower")}>
          <Ionicons name="md-remove" size={24} color="white" />
        </StartButton>
        <StartButton onPress={nextGuessHandler.bind(this, "greater")}>
          <Ionicons name="md-add" size={24} color="white" />
        </StartButton>
      </Card>
      <View style={styles.listContainer}>
        <ScrollView contentContainerStyle={styles.list}>
          {passGuesses.map((guess, index) =>
            renderListItems(guess, passGuesses.length - index)
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Dimensions.get("window").height > 600 ? 20 : 10,
    width: 400,
    maxWidth: "90%"
  },
  listItem: {
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%"
  },
  listContainer: {
    flex: 1,
    width: "80%"
  },
  list: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    alignItems: "center"
  }
});

export default GameScreen;
