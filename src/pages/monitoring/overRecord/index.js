/*
 * @Author: lzp
 * @Date: 2019-07-25 16:26:18
 * @LastEditors: lzp
 * @LastEditTime: 2019-09-18 11:33:00
 * @Description: 超标记录
 */
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import {
    Button,
    Input,
    Card,
    Row,
    Col,
    Table,
    Form,
    Spin,
    Tooltip,
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, Empty, Switch,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import styles from './index.less';
import NavigationTree from '../../../components/NavigationTree'
import RangePicker_ from '@/components/RangePicker/NewRangePicker'
import ButtonGroup_ from '../../../components/ButtonGroup'
import PollutantSelect from '../../../components/PollutantSelect'
import RecordEchartTableOver from '../../../components/recordEchartTableOver'

@connect(({ loading, dataquery }) => ({
    pollutantlist: dataquery.pollutantlist,
    dataloading: loading.effects['dataquery/queryhistorydatalist'],
    option: dataquery.chartdata,
    selectpoint: dataquery.selectpoint,
    isloading: loading.effects['dataquery/querypollutantlist'],
    columns: dataquery.columns,
    datatable: dataquery.datatable,
    total: dataquery.total,
    tablewidth: dataquery.tablewidth,
    historyparams: dataquery.historyparams,
}))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayType: 'chart',
            displayName: '查看数据',
            rangeDate: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            format: 'YYYY-MM-DD HH:mm:ss',
            selectDisplay: false,
        };
    }

    /** 初始化加载 */
    componentDidMount() {

    }

    /** 根据排口dgimn获取它下面的所有污染物 */
    getpointpollutants=dgimn => {
        this.props.dispatch({
          type: 'dataquery/querypollutantlist',
          payload: {
            dgimn,
          },
        });
    }

    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        if (date) {
            let { historyparams } = this.props;
            // 判断
            switch (historyparams.dataType) {
                case 'realtime':
                    if (date[1].add(-7, 'day') > date[0]) {
                    message.info('实时数据时间间隔不能超过7天');
                    return;
                    }
                    break;
                case 'minute':
                    if (date[1].add(-1, 'month') > date[0]) {
                    message.info('分钟数据时间间隔不能超过1个月');
                    return;
                    }
                    break;
                case 'hour':
                    if (date[1].add(-6, 'month') > date[0]) {
                    message.info('小时数据时间间隔不能超过6个月');
                    return;
                    }
                    break;
               case 'day':
                    if (date[1].add(-12, 'month') > date[0]) {
                       message.info('日数据时间间隔不能超过1年');
                       return;
                    }
               break;
            }
            this.setState({ rangeDate: date });
            historyparams = {
                ...historyparams,
                beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
                endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
            }
            this.reloaddatalist(historyparams);
        }
    };

    /** 数据类型切换 */
    _handleDateTypeChange = e => {
        let formats;
        let beginTime = moment(new Date()).add(-60, 'minutes');
        const endTime = moment(new Date());
        let { historyparams } = this.props;
        switch (e.target.value) {
            case 'realtime':
                beginTime = moment(new Date()).add(-60, 'minutes');
                formats = 'YYYY-MM-DD HH:mm:ss';
                break;
            case 'minute':
                beginTime = moment(new Date()).add(-1, 'day');
                formats = 'YYYY-MM-DD HH:mm';
                break;
            case 'hour':
                beginTime = moment(new Date()).add(-1, 'day');
                formats = 'YYYY-MM-DD HH';
                break;
            case 'day':
                beginTime = moment(new Date()).add(-1, 'month');
                formats = 'YYYY-MM-DD';
                break;
        }
        this.setState({
            rangeDate: [beginTime, endTime],
            format: formats,
        });
        historyparams = {
            ...historyparams,
            beginTime: beginTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
            datatype: e.target.value,
        }
        this.reloaddatalist(historyparams);
    }

    /** 图表转换 */
    displayChange = checked => {
      if (!checked) {
        this.setState({
          displayType: 'table',
          displayName: '查看图表',
        });
      } else {
        this.setState({
          displayType: 'chart',
          displayName: '查看数据',
        });
      }
    };

    /** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
    getpollutantSelect = () => {
        const { displayType } = this.state;
        const { pollutantlist } = this.props;
        if (displayType === 'chart') {
            return (<PollutantSelect
                optionDatas={pollutantlist}
                defaultValue={this.getpropspollutantcode()}
                style={{ width: 150, marginRight: 10 }}
                onChange={this.handlePollutantChange}
            />);
        }
        return '';
    }

    /**切换污染物 */
    handlePollutantChange = (value, selectedOptions) => {
        let { historyparams } = this.props;
        historyparams = {
            ...historyparams,
            payloadpollutantCode: value,
            payloadpollutantName: selectedOptions.props.children,
        }
        this.reloaddatalist(historyparams);
    };

    /** 获取第一个污染物 */
    getpropspollutantcode = () => {
      if (this.props.pollutantlist[0]) {
          console.log('------------------------', this.props.pollutantlist[0].PollutantCode);
        return this.props.pollutantlist[0].PollutantCode;
      }
      return null;
    }

    /** 后台请求数据 */
    reloaddatalist = historyparams => {
      const {
        dispatch,
      } = this.props;
      dispatch({
        type: 'dataquery/updateState',
        payload: {
          historyparams,
        },
      })
      dispatch({
        type: 'dataquery/queryhistorydatalist',
        payload: {},
      });
    }

    /** 切换排口 */
    changeDgimn=dgimn => {
        this.setState({
            selectDisplay: true,
        })
         const {
        dispatch,
      } = this.props;
      let { historyparams } = this.props;
        historyparams = {
            ...historyparams,
            payloadpollutantCode: '',
            payloadpollutantName: '',
        }
      dispatch({
        type: 'dataquery/updateState',
        payload: {
          historyparams,
        },
      })
        this.getpointpollutants(dgimn);
    }

    /** 渲染数据展示 */

    loaddata = () => {
        const { dataloading, option, datatable, columns, tablewidth, total } = this.props;
        const { displayType } = this.state;
        if (dataloading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="large"
            />);
        }

        if (displayType === 'chart') {
            if (option) {
                return (<ReactEcharts
                    option={option}
                    lazyUpdate
                    notMerge
                    id="rightLine"
                    style={{ width: '100%', height: 'calc(100vh - 380px)' }}
                />);
            }

            return (<div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>);
        }
        return (<Table
            rowKey={(record, index) => `complete${index}`}
            dataSource={datatable}
            columns={columns}
            scroll={{ y: 'calc(100vh - 420px)', x: tablewidth }}
            rowClassName={
                (record, index) => {
                    let rtnVal = '';
                    if (index === 0) {
                        rtnVal = '';
                    }
                    if (index % 2 !== 0) {
                        rtnVal = 'light';
                    }
                    return rtnVal;
                }
            }
            pagination={{
                pageSize: 15,
            }}
        />);
    }

    render() {
        return (
            <div id="overrecord">
                {/* selKeys="010000a8900016" */}
            <NavigationTree runState='1'  domId="#overrecord" choice={false} onItemClick={value => {
                if (value.length > 0 && !value[0].IsEnt) {
                    this.setState({
                        dgimn:value[0].key
                    })
                }
            }} />
            <BreadcrumbWrapper>
                <RecordEchartTableOver  DGIMN={this.state.dgimn} noticeState={1}  />
            </BreadcrumbWrapper>

        </div>
        );
    }
}
export default Index;
