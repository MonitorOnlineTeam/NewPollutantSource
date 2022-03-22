/*
 * @Author: Jiaqi 
 * @Date: 2019-10-22 17:12:44 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-10-22 17:13:09
 * @desc: 车辆轨迹页面
 */
import React, { Component } from 'react';
import { Table, Card, Tag } from 'antd';
import { Map, Polygon, Marker } from 'react-amap';
import { connect } from 'dva';
import PageLoading from '@/components/PageLoading'
import MapUI from './MapUI'


@connect(({ loading, operations }) => ({
  railData: operations.railData,
  longlatList: operations.longlatList,
  speedList: operations.speedList,
  recordingTimeList: operations.recordingTimeList,
  loading: loading.effects["operations/getVehicleTrajectory"]
}))
class VehicleTrajectory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const ApplicantID = this.props.match.params.ApplicantID;
    this.props.dispatch({
      type: "operations/getVehicleTrajectory",
      payload: {
        // ApplicantID: "0eaa322b-268c-49d8-8b1a-a452b5affe1b"
        ApplicantID: ApplicantID
      }
    })
  }

  // 绘制电子围栏
  getpolygon = () => {
    let res = [];
    if (this.props.railData) {
      let arr = eval(this.props.railData);
      for (let i = 0; i < arr.length; i++) {
        res.push(<Polygon
          key={i}
          style={{
            strokeColor: 'red',
            // strokeOpacity: 0.2,
            strokeWeight: 5,
            fillColor: '#1791fc',
            fillOpacity: 0,
          }}
          path={
            arr[i]
          }
        />);
      }
    }
    return res;
  }
  render() {
    const { longlatList, speedList, recordingTimeList, loading } = this.props;
    if (loading) {
      return <PageLoading />
    }
    return (
      <div style={{ margin: "-24px -24px 0" }}>
        <div style={{ width: "100%", height: "calc(100vh - 64px)" }}>
          <Map zoom={6} center={[120, 30]} useAMapUI={true}>
            {
              longlatList.length && speedList.length && recordingTimeList.length && <MapUI />
            }
            {this.getpolygon()}
            {/* <Marker
              position={{ longitude: 116.299426, latitude: 40.110719 }}
            // render={this.renderMarker}
            // events={this.markerEvents}
            // extData={this.markerExtData}
            /> */}
          </Map>
        </div>
      </div>
    );
  }
}

export default VehicleTrajectory;