import React, { useState, useEffect } from 'react';
import { Text, View, Modal, Animated, TouchableOpacity, TouchableWithoutFeedback, Platform, Dimensions } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const window = Dimensions.get('window');
const Button = props => {
  let buttonTextColor = props.destructive === true ? "rgb(242, 10, 10)" : "#222";
  buttonTextColor = props.promoted === true ? "rgb(10, 10, 255)" : buttonTextColor;
  return (
    <AnimatedTouchable
      disabled={props.disabled}
      onPress={props.onPress}
      opacity={props.opacity}
      style={{
        marginTop: props.independent === true ? 10 : 0,
        backgroundColor: "#fff",
        flex: 1,
        margin: 0,
        borderWidth: 0,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: props.buttonHeight,
        borderTopWidth: props.borderTop === true ? 0.6 : 0,
        borderBottomWidth: 0,
        borderTopColor: props.borderTop === true ? "rgba(220,220,220, 1)" : '#fff',
        borderTopLeftRadius: props.borderTopRadius ? props.borderTopRadius : 0,
        borderTopRightRadius: props.borderTopRadius ? props.borderTopRadius : 0,
        borderBottomLeftRadius: props.borderBottomRadius ? props.borderBottomRadius : 0,
        borderBottomRightRadius: props.borderBottomRadius ? props.borderBottomRadius : 0,
      }}>
      <Text style={{ color: buttonTextColor, fontFamily: "System", fontSize: 16 }}>{props.text}</Text>
    </AnimatedTouchable>
  );
};

const ActionSheet = props => {
  const optionsPadding = 25;
  const buttonDesiredHeight = (props.buttonHeight ? props.buttonHeight : 50);
  const buttonHeight = Platform.OS === 'ios' ? buttonDesiredHeight : buttonDesiredHeight - 10;
  const nofOptions = props.options.length;
  const optionsHeight = (nofOptions + 2) * buttonHeight;
  [bounceValue, setBounceValue] = useState(new Animated.Value(0));

  const handleOpen = () => {
    Animated.timing(bounceValue, {
      toValue: -1 * window.height,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    const closeTimeout = 300;
    Animated.timing(bounceValue, {
      toValue: 0,
      duration: closeTimeout,
      useNativeDriver: true,
    }).start();
    setTimeout(() => { props.showActionSheet(false) }, closeTimeout + 50);
  };

  useEffect(() => {
    if (props.isVisible === true) {
      handleOpen();
    }
  }, [props.isVisible]);


  const options = [];
  for (let i = 0; i < nofOptions; i++) {
    let option = props.options[i];
    let onPress = option.onPress ? (option) => {
      option.onPress(option);
    } :
      (option) => {
        props.onPress(option);
      }
    options.push(
      <Button
        key={i}
        borderTopRadius={i === 0 ? buttonHeight / 4 : 0}
        borderBottomRadius={i === nofOptions - 1 ? buttonHeight / 4 : 0}
        buttonHeight={buttonHeight}
        text={option.text}
        value={option}
        onPress={() => { onPress(option); handleClose(); }}
        destructive={option.destructive === true}
        borderTop={nofOptions > 1 && i !== 0}
        promoted={option.promoted === true}
      />
    );
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      fullscreen={true}
      onRequestClose={() => {
        handleClose();
      }}
      {...props}
      visible={props.isVisible}
    ><TouchableWithoutFeedback onPress={() => { handleClose(); }}>
        <View style={{
          flex: 1,
          width: window.width,
          height: window.height,
          backgroundColor: 'rgba(0, 0, 0, .2)',
        }}>
          <Animated.View
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              flexDirection: "column",
              position: "absolute",
              height: window.height,
              left: 0, right: 0,
              bottom: -1 * window.height,
              flex: 1,
              transform: [
                {
                  translateY: bounceValue,
                },
              ],
            }}
            onBlur={() => { handleClose(); }}
          >
            <View style={{ padding: optionsPadding, flexShrink: 1, minHeight: optionsHeight, width: "100%", justifyContent: "flex-end", alignItems: "center", flexDirection: "column" }}>
              {options}
              {Platform.OS === 'ios' && <Button
                independent
                borderTopRadius={buttonHeight / 4}
                borderBottomRadius={buttonHeight / 4}
                buttonHeight={buttonHeight}
                text={props.cancelText ? props.cancelText : "Cancel"}
                onPress={() => { handleClose(); }}
              />}
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ActionSheet;
