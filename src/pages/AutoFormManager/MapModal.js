import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Card, Row, Col, Modal } from 'antd';
import { object } from 'prop-types';
import MapContent from './MapContent';

const FormItem = Form.Item;
@Form.create()
class MapModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MapVisible: true,
      MarkerObje: {
        Longitude: 0,
        Latitude: 0,
      },
      MapPolygon: [],
    };
    this.getMapMarker = this.getMapMarker.bind(this);
    this.getMapPolygon = this.getMapPolygon.bind(this);
  }

  componentWillMount() {}

  getMapMarker(obj) {
    if (obj) {
      this.setState({
        MarkerObje: {
          Longitude: obj[0],
          Latitude: obj[1],
        },
      });
    } else {
      this.setState({
        MarkerObje: {
          Longitude: '',
          Latitude: '',
        },
      });
    }
  }

  getMapPolygon(obj) {
    if (obj) {
      this.setState({
        MapPolygon: obj,
      });
    } else {
      this.setState({
        MapPolygon: [],
      });
    }
  }

  render() {
    let {
      longitude,
      latitude,
      EditMarker,
      EditPolygon,
      setMapVisible,
      setPoint,
      MapVisible,
      setMapPolygon,
      polygon,
    } = this.props;
    return (
      <div>
        <Modal
          visible={MapVisible}
          title="编辑位置信息"
          width="70%"
          destroyOnClose={true} // 清除上次数据
          onOk={() => {
            setMapVisible(false);
            EditMarker && setPoint(this.state.MarkerObje);
            EditPolygon && setMapPolygon(polygon);
          }}
          onCancel={() => {
            setMapVisible(false);
          }}
        >
          <MapContent
            getMapMarker={this.getMapMarker}
            getMapPolygon={this.getMapPolygon}
            getMapAddress={this.getMapAddress}
            mapHeight="calc(100vh - 500px)"
            longitude={longitude || 0}
            latitude={latitude || 0}
            polygon={polygon || []}
            EditMarker={EditMarker}
            EditPolygon={EditPolygon}
          />
        </Modal>
      </div>
    );
  }
}
export default MapModal;
