import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  ScrollView
} from "react-native";

import TitleText from "../components/TitleText";
import BodyText from "../components/BodyText";
import StartButton from "../components/StartButton";
import Colors from "../constants/colors";

const GameOverScreen = props => {
  const [deviceDimension, setDeviceDimension] = useState(Dimensions.get('window').width * 0.7)
  const [imageVerticalMargin, setImageVerticalMargin] = useState(Dimensions.get("window").height / 30)
  const [imageBorderRadius, setImageBorderRadius] = useState((Dimensions.get('window').width * 0.7) / 2 )

  useEffect(() => {
    const updateLayout = () => {
      setDeviceDimension(Dimensions.get('window').width * 0.7)
      setImageBorderRadius((Dimensions.get('window').width * 0.7)/ 2)
      setImageVerticalMargin(Dimensions.get("window").height / 30)
    }

    Dimensions.addEventListener('change', updateLayout)

    return () => {
      Dimensions.removeEventListener('change', updateLayout)
    }
  })

  return (
    <ScrollView>
      <View style={styles.screen}>
        <TitleText>The Game Is Over!</TitleText>
        <View style={{...styles.imageContainer, width : deviceDimension, height : deviceDimension, borderRadius : imageBorderRadius, marginVertical : imageVerticalMargin}}>
          <Image
            source={require("../assets/success.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.resultContainer}>
          <BodyText style={styles.resultText}>
            Your phone needed{" "}
            <Text style={styles.highlight}>{props.roundsNumber}</Text> rounds to
            guess the number{" "}
            <Text style={styles.highlight}>{props.userNumber}</Text>
          </BodyText>
        </View>

        <StartButton onPress={props.onRestart}>NEW GAME</StartButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical : 10
  },
  image: {
    width: "100%",
    height: "100%"
  },
  imageContainer: {
    // width: Dimensions.get("window").width * 0.7,
    // height: Dimensions.get("window").width * 0.7,
    borderWidth: 3,
    borderColor: "black",
    // borderRadius: (Dimensions.get("window").width * 0.7) / 2,
    overflow: "hidden",
    // marginVertical: Dimensions.get("window").height / 30
  },
  highlight: {
    color: Colors.primary,
    fontFamily: "open-sans-bold",
    marginHorizontal: 30
  },
  resultText: {
    textAlign: "center",
    fontSize: Dimensions.get("window").height < 400 ? 16 : 20
  },
  resultContainer: {
    marginHorizontal: 10,
    marginVertical: Dimensions.get("window").height / 60
  }
});

export default GameOverScreen;
