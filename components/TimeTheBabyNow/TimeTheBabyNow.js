import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage
} from 'react-native'

const MK = require('react-native-material-kit');
const {
  MKButton,
  MKColor,
  MKProgress
} = MK;

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

    if (timeDiff.getSeconds() > -1) {
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
    if (this.state.isTimingTheBaby) {
      this._onPressButtonStop()
    }

    const timerStarted = Date.now()
    const timing = {isTimingTheBaby: true, timerStarted: timerStarted, action: action, timeElapsed: this._formatTime(timerStarted, Date.now())}

    if (boob)
    {
      timing.boob = boob
    } 

    let scope = this;
    let updateTimer = function() {
        timing.timeElapsed = scope._formatTime(timerStarted, Date.now());
        scope.setState(timing);
    }

    this.timer = setInterval(
      updateTimer,
      1000
    );

    updateTimer()
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
            <Text style={styles.instructions}>{this.state.action} for {this.state.timeElapsed}</Text>
            <MKProgress.Indeterminate
              style={styles.progress}
              color={MKColor.Pink} />
            <TimingButton onPress={this._onPressButtonStop}>
              <Text>Done</Text>
            </TimingButton>
          </View>
        ) : (
        <View>
          <Text style={styles.instructions}>
            Don't try this at home
          </Text>
          <View style={styles.buttons}>
            <TimingButton onPress={()=>this._onPressButtonStartBreastFeeding('Left')}>
              <Text>Lefty</Text>
            </TimingButton>
            <TimingButton onPress={()=>this._onPressButtonStartBreastFeeding('Right')}>
              <Text>Righty</Text>
            </TimingButton>
            <TimingButton onPress={this._onPressButtonStartSleeping}>
              <Text>Sleepy</Text>
            </TimingButton>
            <TimingButton onPress={this._onPressButtonStartDancing}>
              <Text>Dancer</Text>
            </TimingButton>
          </View>
        </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection:'row',
    marginTop:10
  },
  button: {
    margin:5
  },
  instructions: {
    textAlign: 'center',
    marginBottom:5
  },
  progress: {
    width:300,
    height:10
  }
});

const TimingButton = MKButton.accentColoredButton()
  .withStyle(styles.button)
  .build();

// const ProgressBar = MKProgress.indeterminate()
//   .withStyle()
//   .build();

module.exports = TimeTheBabyNow
