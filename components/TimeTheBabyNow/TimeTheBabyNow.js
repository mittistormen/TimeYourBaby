import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage
} from 'react-native'

class TimeTheBabyNow extends Component {
  constructor(props) {
    super(props)

    this.state = {isTimingTheBaby: false, timeElapsed: '0 seconds', timerStarted:false}

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

    this.props.save(timing)
      
    this.setState({isTimingTheBaby:false})

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

  render() {
    if (this.state.isTimingTheBaby) {
      return (
        <View>
          <TouchableHighlight onPress={this._onPressButtonStop} style={styles.button}>
            <Text>Stop timing</Text>
          </TouchableHighlight>
          <Text style={styles.elapsed}>{this.state.action} for {this.state.timeElapsed}</Text>
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
  button: {
    alignItems: 'center',
    marginBottom:10
  },
  elapsed: {
    alignItems: 'center',
    marginBottom:10
  }
});

module.exports = TimeTheBabyNow
