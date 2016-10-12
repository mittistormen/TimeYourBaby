/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

export default class TimeYourBaby extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>
          Time your baby!
        </Text>
        <TimeTheBabyNow></TimeTheBabyNow>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

class TimeTheBabyNow extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isTimingTheBaby: false,
      timeElapsed: undefined
    };

    this._onPressButtonStop = this._onPressButtonStop.bind(this)
    this._onPressButtonStart = this._onPressButtonStart.bind(this)
  }

  _onPressButtonStop () {
    this.setState({isTimingTheBaby: false, timeElapsed: undefined})

    clearInterval(this.timer)
  }

  _onPressButtonStart () {
    const timerStarted = Date.now()

    this.setState({isTimingTheBaby: true})

    this.timer = setInterval(
      () => { 
        const timeDiff = new Date(Date.now() - timerStarted)
        let timeElapsed = '';

        if (timeDiff.getMinutes() > 0) {
          timeElapsed = timeDiff.getMinutes() + ' minutes and '
        }

        if (timeDiff.getSeconds() > 0) {
          timeElapsed += timeDiff.getSeconds() + ' seconds'
        }

        this.setState({timeElapsed: timeElapsed});
      },
      1000
    );
  }
  
  _renderButton () {
    if (this.state.isTimingTheBaby) {
      return (
        <TouchableHighlight onPress={this._onPressButtonStop} style={styles.button}>
          <Text>Stop timing</Text>
        </TouchableHighlight>
      )
    } else {
      return (
        <TouchableHighlight onPress={this._onPressButtonStart} style={styles.button}>
          <Text>Start timing</Text>
        </TouchableHighlight>
      )
    }
  }

  render() {
    return (
      <View>
        {this._renderButton()}
        <Text style={styles.elapsed}>Elapsed time: {this.state.timeElapsed}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  elapsed: {
    alignItems: 'center',
    marginBottom:10
  },
  button: {
    alignItems: 'center',
    marginBottom:10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  h1: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('TimeYourBaby', () => TimeYourBaby);
