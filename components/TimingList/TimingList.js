import React, { Component } from 'react'
import {
  View,
  Text,
  ListView,
  AsyncStorage,
  StyleSheet
} from 'react-native'
import ps from 'publish-subscribe'
import moment from 'moment'
import svLocale from 'moment/locale/sv'

moment.updateLocale('sv', svLocale)

class TimingList extends Component {
  constructor(props) {
    super(props)
  }

  _formatDate(dateString) {
    const date = moment(dateString)

    return date.format('lll')
  }

  render() {
    const timings = this.props.timings || []
    timings.sort((t1,t2)=> { return new Date(t2.startTime) - new Date(t1.startTime) })

    let totaltime = 0;
    if (timings.length > 0) {
      totaltime = timings.reduce((t1,t2) => { 
        return new Date(t1.endTime - t1.startTime) + new Date(t2.endTime - t2.startTime)
      })
    }

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const source = ds.cloneWithRows(timings)

    return (
      <View style={styles.list}>
        <Text style={styles.h2}>
          Total time: {totaltime}
        </Text>

        <ListView
          dataSource={source}
          renderRow={(data) => <Text>{this._formatDate(data.startTime)}: {data.action} for {data.timeElapsed}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 16,
    textAlign: 'center',
    margin:10
  },
  list: {
    marginBottom: 50,
    height:300
  }
});

module.exports = TimingList
