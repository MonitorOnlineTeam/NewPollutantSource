


import React from 'react';

import { Card} from 'antd';

import { connect } from 'dva';

import ReactEcharts from 'echarts-for-react';


/**
 * 多图表数据组件
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

class MultiChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
      <>
      <p>这是多参数图表</p>
      {/* <ReactEcharts
       option={this.getOptions()}
       lazyUpdate={true}
       style={{ height: 'calc(100vh - 250px)', width: '100%' }}
       className="echarts-for-echarts"
       theme="my_theme"
   />  */}
  </>
    );
  }
}

export default MultiChart;