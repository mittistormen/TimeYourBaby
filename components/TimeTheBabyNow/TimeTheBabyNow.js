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

  _startDoingSomething (action, boob) {
    const timerStarted = Date.now()
    const timing = {isTimingTheBaby: true, timerStarted: timerStarted, action: action, timeElapsed: this._formatTime(timerStarted, Date.now())}

    if (boob)
    {
      timing.boob = boob
    } 

    this.setState(timing)

    this.timer = setInterval(
      () => { 
        let timeElapsed = this._formatTime(timerStarted, Date.now());
        this.setState({timeElapsed: timeElapsed});
      },
      500
    );
  }
  
  _onPressButtonStartBreastFeeding (boob) {
    this._startDoingSomething('Breastfeeding', boob)
  }

  _onPressButtonStartSleeping () {
    this._startDoingSomething('Sleeping')
  }

  _onPressButtonStartDancing () {
    this._startDoingSomething('Dancing')
  }

  render() {
    return (
      <View>
        {this.state.isTimingTheBaby ? (
          <View>
            <TouchableHighlight onPress={this._onPressButtonStop} style={styles.button}>
              <Text>Stop timing</Text>
            </TouchableHighlight>
            <Text style={styles.elapsed}>{this.state.action} for {this.state.timeElapsed}</Text>
          </View>
        ) : (
          <View></View>
        )}
        <View style={styles.buttons}>
          <TouchableHighlight onPress={()=>this._onPressButtonStartBreastFeeding('Left')} style={styles.button}>
            <Text>Lefty</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={()=>this._onPressButtonStartBreastFeeding('Right')} style={styles.button}>
            <Text>Righty</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onPressButtonStartSleeping} style={styles.button}>
            <Text>Sleepy</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onPressButtonStartDancing} style={styles.button}>
            <Text>Dancer</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection:'row'
  },
  button: {
    alignItems: 'center',
    margin:10
  },
  elapsed: {
    alignItems: 'center',
    marginBottom:10
  }
});

module.exports = TimeTheBabyNow
