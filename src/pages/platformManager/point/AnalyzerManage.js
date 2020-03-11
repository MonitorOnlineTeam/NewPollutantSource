
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

  }

  render() {
    
    }
    return (
      <div style={{ margin: "-24px -24px 0" }}>
        <div style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        </div>
      </div>
    );
  }
}

export default VehicleTrajectory;