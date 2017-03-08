/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  AsyncStorage
} from 'react-native'
import { TimingList } from './components/TimingList'
import { TimeTheBabyNow } from './components/TimeTheBabyNow'

export default class TimeYourBaby extends Component {

  constructor(props) {
    super(props)

    this.state = { timings: [] }

    AsyncStorage
      .getItem('timings')
      .then((value) => {
        const timings = JSON.parse(value) || []

        const clean = timings.filter(function(timing) {
          return timing && timing.action && timing.startTime && timing.endTime && timing.timeElapsed;
        })

        AsyncStorage.setItem("timings", JSON.stringify(clean))

        this.setState({
          timings: timings
        })
      })
      .done()

    this.saveTiming = this.saveTiming.bind(this)
  }

  saveTiming(timing) {
    AsyncStorage.getItem('timings').then((value) => {
      let timings = JSON.parse(value) || []
      
      timings.push(timing)
      AsyncStorage.setItem("timings", JSON.stringify(timings))

      this.setState({timings: timings})
    }).done();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>
          Time your baby!
        </Text>
        <TimeTheBabyNow save={this.saveTiming}></TimeTheBabyNow>
        <TimingList timings={this.state.timings}></TimingList>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  h1: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('TimeYourBaby', () => TimeYourBaby);
