import React, { Component } from 'react';
import Realtimedata from '@/pages/monitoring/realtimedata'
import Cookie from 'js-cookie';


class DataFolwChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.match.params.data
    };
  }

  componentDidMount() {
  }

  render() {
    const { MN, vertical, scale } = this.props.location.query;
    console.log('vertical', vertical)
    return <>
      {/* <p>{Cookie.get('ssToken')}</p> */}
      <Realtimedata showMode="modal"
        vertical={vertical == 'true'}
        wrapperStyle={{ height: '100vh' }}
        scale={scale}
        currentTreeItemData={
          [{
            // "key": "62030231rdep11",
            "key": this.props.location.query.MN,
            // "pointName": "北热1号分析小屋",
            // "entName": "华能北京热电厂",
            // "Type": "2",
            // "EntCode": "7526121f-1229-44dd-9de1-429bf6654664",
          }]
        } />
    </>
  }
}

export default DataFolwChart;
