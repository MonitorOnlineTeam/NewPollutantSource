import React, { PureComponent } from 'react';
import { Card, DatePicker, Button, Row, Select } from "antd"
import Preview from "./Preview"
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
    this.playback.onBackPlay("76ffb866c7f74b7491ea1f96ce50b97b", date[0], date[1])
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
            playMode === "realtime" ? <Preview cameraIndexCode={'76ffb866c7f74b7491ea1f96ce50b97b'} style={{ marginTop: 300 }} /> :
              <Playback ref={playback => this.playback = playback} style={{ marginTop: 300 }} />
          }
        </Card>
      </BreadcrumbWrapper>
    );
  }
}

export default index;