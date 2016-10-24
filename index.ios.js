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
  TouchableHighlight,
  ListView,
  AsyncStorage
} from 'react-native';

const moment = require('moment')
const svLocale = require('moment/locale/sv');
moment.updateLocale('sv', svLocale)

export default class TimeYourBaby extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>
          Time your baby!
        </Text>
        <TimeTheBabyNow></TimeTheBabyNow>
        <TimingList></TimingList>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

class TimingList extends Component {
  constructor(props) {
    super(props)

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    this.state = {
      source: ds.cloneWithRows([])
    }

    AsyncStorage
      .getItem('timings')
      .then((value) => {
        const timings = JSON.parse(value) || []
        this.setState({source: ds.cloneWithRows(timings.reverse())})
      })
      .done()
  }

  _formatDate(dateString) {
    const date = moment(dateString)

    return date.format('lll')
  }

  render() {
    return (
      <View style={styles.list}>
        <Text style={styles.h2}>
          Previous actions
        </Text>
        <ListView
          dataSource={this.state.source}
          renderRow={(data) => <Text>{this._formatDate(data.startTime)}: {data.action} for {data.timeElapsed}</Text>}
        />
      </View>
    );
  }
}

class TimeTheBabyNow extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isTimingTheBaby: false,
      timeElapsed: undefined,
      action: ''
    }

    this._onPressButtonStop = this._onPressButtonStop.bind(this)
    this._onPressButtonStartBreastFeeding = this._onPressButtonStartBreastFeeding.bind(this)
    this._onPressButtonStartSleeping = this._onPressButtonStartSleeping.bind(this)
    this._onPressButtonStartDancing = this._onPressButtonStartDancing.bind(this)
  }

  _formatTime (startTime, endTime) {
    const timeDiff = new Date(endTime - startTime)
    let timeElapsed = '';

    if (timeDiff.getMinutes() > 0) {
      timeElapsed = timeDiff.getMinutes() + ' minutes and '
    }

    if (timeDiff.getSeconds() > 0) {
      timeElapsed += timeDiff.getSeconds() + ' seconds'
    }

    return timeElapsed
  }

  _onPressButtonStop () {
    const timing = {
      timeElapsed: this.state.timeElapsed,
      startTime: this.state.timerStarted,
      action: this.state.action,
      endTime: Date.now()
    };

    AsyncStorage.getItem('timings').then((value) => {
      timings = JSON.parse(value) || []
      timings.push(timing)

      console.log(timings)

      AsyncStorage.setItem("timings", JSON.stringify(timings))
    }).done();

    this.setState({isTimingTheBaby: false, timeElapsed: undefined, timerStarted:undefined})

    clearInterval(this.timer)
  }

  _startDoingSomething (action) {
    const timerStarted = Date.now()
    this.setState({isTimingTheBaby: true, timerStarted: timerStarted, action: action})

    this.timer = setInterval(
      () => { 
        let timeElapsed = this._formatTime(timerStarted, Date.now());
        this.setState({timeElapsed: timeElapsed});
      },
      1000
    );
  }
  
  _onPressButtonStartBreastFeeding () {
    this._startDoingSomething('Breastfeeding')
  }

  _onPressButtonStartSleeping () {
    this._startDoingSomething('Sleeping')
  }

  _onPressButtonStartDancing () {
    this._startDoingSomething('Dancing')
  }

  _renderMe () {
    if (this.state.isTimingTheBaby) {
      return (
        <TouchableHighlight onPress={this._onPressButtonStop} style={styles.button}>
          <Text>Stop timing</Text>
        </TouchableHighlight>
      )
    } else {
      return (
        <View>
          <TouchableHighlight onPress={this._onPressButtonStartBreastFeeding} style={styles.button}>
            <Text>Start breastfeeding</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onPressButtonStartSleeping} style={styles.button}>
            <Text>Start sleeping</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onPressButtonStartDancing} style={styles.button}>
            <Text>Start dancing</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }

  render() {
    if (this.state.isTimingTheBaby) {
      return (
        <View>
          <TouchableHighlight onPress={this._onPressButtonStop} style={styles.button}>
            <Text>Stop timing</Text>
          </TouchableHighlight>
          <Text style={styles.elapsed}>Elapsed time: {this.state.timeElapsed}</Text>
        </View>
      )
    } else {
      return (
        <View>
          <TouchableHighlight onPress={this._onPressButtonStartBreastFeeding} style={styles.button}>
            <Text>Start breastfeeding</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onPressButtonStartSleeping} style={styles.button}>
            <Text>Start sleeping</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onPressButtonStartDancing} style={styles.button}>
            <Text>Start dancing</Text>
          </TouchableHighlight>
        </View>
      )
    }
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
  h2: {
    fontSize: 16,
    textAlign: 'center',
    margin:10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  list: {
    marginBottom: 50
  }
});

AppRegistry.registerComponent('TimeYourBaby', () => TimeYourBaby);
