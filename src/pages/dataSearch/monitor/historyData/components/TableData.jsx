


import React from 'react';

import { Card} from 'antd';

import { connect } from 'dva';

import SdlTable from '@/components/SdlTable'



/**
 * 表格数据组件
 * jab 2020.07.30
 */
@connect(({ loading, dataquery,historyData }) => ({
    pollutantlist: dataquery.pollutantlist,
    dataloading: loading.effects['dataquery/queryhistorydatalist'],
    exportLoading: loading.effects['dataquery/exportHistoryReport'],
    option: dataquery.chartdata,
    selectpoint: dataquery.selectpoint,
    isloading: loading.effects['dataquery/querypollutantlist'],
    columns: dataquery.columns,
    datatable: dataquery.datatable,
    total: dataquery.total,
    tablewidth: dataquery.tablewidth,
    historyparams: dataquery.historyparams,
    testData:historyData.testData
}))

class TableData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          tableList:[{"MonitorTime":"2020-07-06 00:00:00","DGIMN":"aq140421008","PointName":"八义镇计生楼监测点","AQI":"98","AirLevel":"二级","AQI_Color":"#f3dd22","AirQuality":"良","01":"157","01_Value":"98","01_Level":"二","01_LevelColor":"#f3dd22","02":"0.3","02_Value":"9","02_Level":"一","02_LevelColor":"#00e400","03":"7","03_Value":"7","03_Level":"一","03_LevelColor":"#00e400","05":"24","05_Value":"31","05_Level":"一","05_LevelColor":"#00e400","07":"40","07_Value":"40","07_Level":"一","07_LevelColor":"#00e400","08":"16","08_Value":"23","08_Level":"一","08_LevelColor":"#00e400"},{"MonitorTime":"2020-07-07 00:00:00","DGIMN":"aq140421008","PointName":"八义镇计生楼监测点","AQI":"103","AirLevel":"三级","AQI_Color":"#ff7e00","AirQuality":"轻度污染","01":"163","01_Value":"103","01_Level":"三","01_LevelColor":"#ff7e00","02":"0.7","02_Value":"18","02_Level":"一","02_LevelColor":"#00e400","03":"7","03_Value":"7","03_Level":"一","03_LevelColor":"#00e400","05":"34","05_Value":"42","05_Level":"一","05_LevelColor":"#00e400","07":"66","07_Value":"58","07_Level":"二","07_LevelColor":"#f3dd22","08":"36","08_Value":"51","08_Level":"二","08_LevelColor":"#f3dd22"},{"MonitorTime":"2020-07-08 00:00:00","DGIMN":"aq140421008","PointName":"八义镇计生楼监测点","AQI":"103","AirLevel":"三级","AQI_Color":"#ff7e00","AirQuality":"轻度污染","01":"163","01_Value":"103","01_Level":"三","01_LevelColor":"#ff7e00","02":"0.8","02_Value":"19","02_Level":"一","02_LevelColor":"#00e400","03":"6","03_Value":"6","03_Level":"一","03_LevelColor":"#00e400","05":"26","05_Value":"33","05_Level":"一","05_LevelColor":"#00e400","07":"71","07_Value":"61","07_Level":"二","07_LevelColor":"#f3dd22","08":"54","08_Value":"75","08_Level":"二","08_LevelColor":"#f3dd22"},{"MonitorTime":"2020-07-09 00:00:00","DGIMN":"aq140421008","PointName":"八义镇计生楼监测点","AQI":"85","AirLevel":"二级","AQI_Color":"#f3dd22","AirQuality":"良","01":"141","01_Value":"85","01_Level":"二","01_LevelColor":"#f3dd22","02":"0.4","02_Value":"11","02_Level":"一","02_LevelColor":"#00e400","03":"3","03_Value":"4","03_Level":"一","03_LevelColor":"#00e400","05":"15","05_Value":"20","05_Level":"一","05_LevelColor":"#00e400","07":"39","07_Value":"39","07_Level":"一","07_LevelColor":"#00e400","08":"31","08_Value":"44","08_Level":"一","08_LevelColor":"#00e400"},{"MonitorTime":"2020-07-10 00:00:00","DGIMN":"aq140421008","PointName":"八义镇计生楼监测点","AQI":"76","AirLevel":"二级","AQI_Color":"#f3dd22","AirQuality":"良","01":"130","01_Value":"75","01_Level":"二","01_LevelColor":"#f3dd22","02":"0.4","02_Value":"10","02_Level":"一","02_LevelColor":"#00e400","03":"3","03_Value":"3","03_Level":"一","03_LevelColor":"#00e400","05":"16","05_Value":"21","05_Level":"一","05_LevelColor":"#00e400","07":"58","07_Value":"55","07_Level":"二","07_LevelColor":"#f3dd22","08":"55","08_Value":"76","08_Level":"二","08_LevelColor":"#f3dd22"},{"MonitorTime":"2020-07-11 00:00:00","DGIMN":"aq140421008","PointName":"八义镇计生楼监测点","AQI":"57","AirLevel":"二级","AQI_Color":"#f3dd22","AirQuality":"良","01":"101","01_Value":"51","01_Level":"二","01_LevelColor":"#f3dd22","02":"0.5","02_Value":"13","02_Level":"一","02_LevelColor":"#00e400","03":"3","03_Value":"4","03_Level":"一","03_LevelColor":"#00e400","05":"22","05_Value":"28","05_Level":"一","05_LevelColor":"#00e400","07":"48","07_Value":"48","07_Level":"一","07_LevelColor":"#00e400","08":"40","08_Value":"57","08_Level":"二","08_LevelColor":"#f3dd22"},{"MonitorTime":"2020-07-12 00:00:00","DGIMN":"aq140421008","PointName":"八义镇计生楼监测点","AQI":"56","AirLevel":"二级","AQI_Color":"#f3dd22","AirQuality":"良","01":"106","01_Value":"56","01_Level":"二","01_LevelColor":"#f3dd22","02":"0.4","02_Value":"11","02_Level":"一","02_LevelColor":"#00e400","03":"3","03_Value":"4","03_Level":"一","03_LevelColor":"#00e400","05":"13","05_Value":"16","05_Level":"一","05_LevelColor":"#00e400","07":"20","07_Value":"21","07_Level":"一","07_LevelColor":"#00e400","08":"12","08_Value":"18","08_Level":"一","08_LevelColor":"#00e400"},{"MonitorTime":"2020-07-13 00:00:00","DGIMN":"aq140421008","PointName":"八义镇计生楼监测点","AQI":"75","AirLevel":"二级","AQI_Color":"#f3dd22","AirQuality":"良","01":"129","01_Value":"75","01_Level":"二","01_LevelColor":"#f3dd22","02":"0.7","02_Value":"17","02_Level":"一","02_LevelColor":"#00e400","03":"10","03_Value":"10","03_Level":"一","03_LevelColor":"#00e400","05":"19","05_Value":"25","05_Level":"一","05_LevelColor":"#00e400","07":"42","07_Value":"42","07_Level":"一","07_LevelColor":"#00e400","08":"22","08_Value":"32","08_Level":"一","08_LevelColor":"#00e400"}],

        };
    }
    static getDerivedStateFromProps(props, state) {
      // 只要当前 testData 变化，
      // 重置所有跟 testData 相关的状态。
      if (props.testData !== state.testData) {
        return {
          testData: props.testData,
        };
      }
      return null;
    }
  render() {
    return (
           <SdlTable
              // rowKey={(record, index) => `complete${index}`}
              // dataSource={datatable}
              // columns={columns}
              resizable
              defaultWidth={80}
              scroll={{ y: this.props.tableHeight || undefined}}
              pagination={{ pageSize: 20 }}

          />
    );
  }
}

export default TableData;