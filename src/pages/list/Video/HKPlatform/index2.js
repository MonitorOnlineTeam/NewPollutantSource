import React, { PureComponent } from 'react';
import { Card, DatePicker, Button, Row, Select } from "antd"
import Live from "./Live"
import Playback from "./Playback"
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"


const { RangePicker } = DatePicker;
const { Option } = Select

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
    console.log("this.playback=", this.playback)
    this.playback.onBackPlay("18507478f7cf4c2883a75c030d59b847", date[0], date[1])
  }

  render() {
    const { playMode } = this.state;
    return (
      <BreadcrumbWrapper>
        <Card>
          <Row>
            <Select defaultValue="realtime" style={{ width: 120 }} onChange={(value) => {
              this.setState({
                playMode: value
              })
            }}>
              <Option value="realtime">实时视频</Option>
              <Option value="back">视频回放</Option>
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
                  this.onBack()
                }}>回放</Button>
              </>
            }
          </Row>
          {
            playMode === "realtime" ? <Live cameraIndexCode={'27b812ca24bd46c98cca749c834ecac1'} style={{ marginTop: 300 }} /> :
              <Playback ref={playback => this.playback = playback} style={{ marginTop: 300 }} />
          }
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;