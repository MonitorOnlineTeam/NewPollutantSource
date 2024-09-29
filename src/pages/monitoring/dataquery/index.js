/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2024-06-07 10:56:42
 * @LastEditors: outman0611
 * @LastEditTime: 2024-09-27 11:47:38
 * @FilePath: \merged_master\src\pages\monitoring\dataquery\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { Component } from 'react';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import NavigationTree from '../../../components/NavigationTree';
import DataQuery2 from './components/DataQuery2';
import DataQuery from './components/DataQuery';
import PageLoading from '@/components/PageLoading';
import { connect } from 'dva';
/**
 * 数据查询页面
 * xpy 2019.07.26
 */
@connect(({ userLogin, global, loading }) => ({
  userLogin,
  configInfo: global.configInfo,
}))
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dgimn: '',
      pointName: '',
      entName: '',
      title: '',
    };
  }

  changeDgimn = value => {
    this.setState({
      dgimn: value[0].key,
      pointName: value[0].pointName,
      entName: value[0].entName,
      title: `${value[0].entName} - ${value[0].pointName}`,
      Type: value[0].Type,
    });
  };

  render() {
    const { dgimn, pointName, entName, title, Type } = this.state;
    const {
      location: {
        query: { pollutantCode },
      },
      configInfo: { IsOpera,IsShowProjectRegion },
    } = this.props;
    console.log('location', this.props.location)
    // 是否显示原始和审核
    const isShowSearchDataType = this.props.location.query.isShowSearchDataType == 1 ? true : false;
    const isSdlOpera = IsOpera && !IsShowProjectRegion;

    return (
      <div id="dataquery">
        <BreadcrumbWrapper titles={`【${title}】`}>
          {this.state.dgimn ? (
            this.props.location.query.type == 1 ? (
              <DataQuery2
                DGIMN={this.state.dgimn}
                pointName={pointName}
                entName={entName}
                initLoadData
              />
            ) : (
              <DataQuery
                DGIMN={this.state.dgimn}
                Type={Type}
                pointName={pointName}
                entName={entName}
                isShowSearchDataType={isShowSearchDataType}
                initLoadData
              />
            )
          ) : (
            <PageLoading />
          )}
        </BreadcrumbWrapper>
        <NavigationTree
          checkpPol={pollutantCode}
          runState="1"
          domId="#dataquery"
          choice={false}
          // type='ent' //运维分废气废水子系统后 已经弃用
          isSdlOpera={isSdlOpera} //运维平台 SDL运维
          onItemClick={value => {
            if (value.length > 0 && !value[0].IsEnt) {
              this.changeDgimn(value);
            }
          }}
        />
      </div>
    );
  }
}
export default Index;
