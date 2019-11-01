import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
} from "react-native";

import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const INFINITE_WIDTH = 1000;

const s = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    width: 28,
    height: 20,
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
    overflow: "hidden",
  },
  leftPart: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  rightPart: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  last4: {
    flex: 1,
    marginLeft: 37,
    marginRight: 10,
  },
  numberInput: {
    width: INFINITE_WIDTH,
    marginLeft: 10,
    marginRight: 10,
  },
  expiryInput: {
    width: 60,
  },
  cvcInput: {
    width: 40,
  },
  last4Input: {
  },
  zipInput: {
    width: 80,
    marginLeft: 10,
  },
  input: {
    height: 40,
    color: "black",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "ZIP"
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = field => {
    const {
      inputStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    if (focused === "cvc") return "cvc";
    if (type) return type;
    return "placeholder";
  }

  render() {
    const {
      focused,
      values: { number },
      inputStyle,
      status: {
        number: numberStatus
      }
    } = this.props;

    const validNumber = numberStatus === "valid"
    const showRightPart = focused && focused !== "number" && validNumber;
    
    return (
      <View style={s.container}>
        <Image style={s.icon} source={Icons[this._iconToShow()]} />

        <View style={[showRightPart ? s.hidden : s.expanded]}>
          <CCInput
            {...this._inputProps("number")}
            keyboardType="numeric"
            containerStyle={s.numberInput}
          />
        </View>

        <View style={[s.rightPart]}>
          <TouchableOpacity
            onPress={this._focusNumber}
            style={[
              s.last4,
              showRightPart ? s.expanded : s.hidden,
            ]}
          >
            <View pointerEvents={"none"}>
              <CCInput field="last4"
                keyboardType="numeric"
                value={numberStatus ? number.substr(number.length - 4, 4) : ""}
                inputStyle={[s.input, inputStyle]}
                containerStyle={[s.last4Input, showRightPart ? s.expanded : s.hidden]}
              />
            </View>
          </TouchableOpacity>

          <CCInput
            {...this._inputProps("expiry")}
            keyboardType="numeric"
            containerStyle={s.expiryInput}
          />
          <CCInput
            {...this._inputProps("cvc")}
            keyboardType="numeric"
            containerStyle={s.cvcInput}
          />
          <View style={[
            s.rightPart,
            showRightPart ? s.expanded : s.hidden
          ]}>
            <CCInput
              {...this._inputProps("postalCode")}
              keyboardType="numeric"
              containerStyle={s.zipInput}              
            />
          </View>
        </View>
      </View>
    );
  }
}
