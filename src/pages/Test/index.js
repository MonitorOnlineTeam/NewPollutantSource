import React, { PureComponent } from 'react';
import { Card, DatePicker, Button } from "antd"
import Preview from "./Preview"
import Playback from "./Playback"

const { RangePicker } = DatePicker;

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playMode: 'realtime',
      date: [],
    };
  }

  onBack = () => {
    const { date } = this.state;
    this.playback.onBack("18507478f7cf4c2883a75c030d59b847", date[0], date[1])
  }

  render() {
    const { playMode } = this.state;
    return (
      <Card>
        <Row>
          <Select defaultValue="realtime" style={{ width: 120 }} onChange={(value) => {
            this.setState({
              playMode: value
            })
          }}>
            <Option value="realtime">实时视频</Option>
            <Option value="back">视频回访</Option>
          </Select>
          {
            playMode === 'back' &&
            <>
              <RangePicker
                showTime
                onChange={(date) => {
                  this.setState({
                    date: date
                  })
                }}
              />
              <Button type="primary" onClick={() => {

              }}>回放</Button>
            </>
          }
        </Row>
        {
          playMode === "realtime" ? <Preview style={{}} /> :
            <Playback ref={playback => this.playback = playback} style={{}} />
        }
      </Card>
    );
  }
}

export default index;