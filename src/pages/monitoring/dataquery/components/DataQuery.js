import React, { Component } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import {
    Card,
    Spin,
    message, Empty, Radio,
} from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import ButtonGroup_ from '@/components/ButtonGroup'
import PollutantSelect from '@/components/PollutantSelect'
import SdlTable from '@/components/SdlTable'
/**
 * 数据查询组件
 * xpy 2019.07.26
 */
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

class DataQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayType: 'chart',
            displayName: '查看数据',
            rangeDate: [moment(new Date()).add(-60, 'minutes'), moment(new Date())],
            format: 'YYYY-MM-DD HH:mm:ss',
            selectDisplay: false,
            dd: [],
            selectP: '',
        };
    }

    /** dgimn改變時候切換數據源 */
    componentWillReceiveProps = nextProps => {
        if (nextProps.DGIMN !== this.props.DGIMN) {
            this.changeDgimn(nextProps.DGIMN);
        }
    }

    /** 根据排口dgimn获取它下面的所有污染物 */
    getpointpollutants = dgimn => {
        this.props.dispatch({
            type: 'dataquery/querypollutantlist',
            payload: {
                dgimn,
            },
        });
    }

    /** 切换时间 */
    _handleDateChange = (date, dateString) => {
        let { historyparams } = this.props;
        switch (historyparams.datatype) {
            case 'realtime':
                if (date[1].add(-7, 'day') > date[0]) {
                    message.info('实时数据时间间隔不能超过7天');
                    return;
                }
                date[1].add(7, 'day')

                break;
            case 'minute':
                if (date[1].add(-1, 'month') > date[0]) {
                    message.info('分钟数据时间间隔不能超过1个月');
                    return;
                }
                date[1].add(-1, 'month')
                break;
            case 'hour':
                if (date[1].add(-6, 'month') > date[0]) {
                    message.info('小时数据时间间隔不能超过6个月');
                    return;
                }
                date[1].add(-6, 'month')
                break;
            case 'day':
                if (date[1].add(-12, 'month') > date[0]) {
                    message.info('日数据时间间隔不能超过1年个月');
                    return;
                }
                 date[1].add(-12, 'month')
                break;
            default:
                return;
        }
        this.setState({ rangeDate: date });
        historyparams = {
            ...historyparams,
            beginTime: date[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: date[1].format('YYYY-MM-DD HH:mm:ss'),
        }
        this.reloaddatalist(historyparams);
    };

    /** 数据类型切换 */
    _handleDateTypeChange = e => {
        const { rangeDate } = this.state;
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
        if (checked !== 'chart') {
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
        const {
          displayType,
          selectP,
        } = this.state;
        const { pollutantlist } = this.props;
        if (displayType === 'chart') {
            return (<PollutantSelect
                mode = "multiple"
                optionDatas={pollutantlist}
                defaultValue={selectP === '' ? this.getpropspollutantcode() : selectP}
                style={{ width: 300, marginRight: 10 }}
                onChange={this.handlePollutantChange}
                placeholder="请选择污染物"
                maxTagCount={2}
                maxTagTextLength={5}
                maxTagPlaceholder="..."
            />);
        }
        return '';
    }

    /**切换污染物 */
    handlePollutantChange = (value, selectedOptions) => {
        const res = [];
        let { historyparams } = this.props;
        if (selectedOptions.length > 0) {
        selectedOptions.map((item, key) => {
                res.push(item.props.children);
            })
        }
            historyparams = {
              ...historyparams,
              payloadpollutantCode: value.length > 0 ? value.toString() : '',
              payloadpollutantName: res.length > 0 ? res.toString() : '',

        }
        this.setState({
            selectP: value.length > 0 ? value : [],
        })

        this.reloaddatalist(historyparams);
    };

    /** 获取第一个污染物 */
    getpropspollutantcode = () => {
        if (this.props.pollutantlist[0]) {
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
    changeDgimn = dgimn => {
        this.setState({
            selectDisplay: true,
            selectP: '',
        })
        const {
            dispatch,
        } = this.props;
        let { historyparams } = this.props;
        historyparams = {
            ...historyparams,
            payloadpollutantCode: '',
            payloadpollutantName: '',
            pageIndex: 1,
            pageSize: 20,
        }
        dispatch({
            type: 'dataquery/updateState',
            payload: {
                historyparams,
            },
        })
        this.getpointpollutants(dgimn);
    }

    /** 分页 */
     onShowSizeChange = (pageIndex, pageSize) => {
        let { historyparams } = this.props;
        historyparams = {
            ...historyparams,
            pageIndex,
            pageSize,
        }
        this.reloaddatalist(historyparams);
    }

    onChange = (pageIndex, pageSize) => {
        let { historyparams } = this.props;
        historyparams = {
            ...historyparams,
            pageIndex,
            pageSize,
        }
        this.reloaddatalist(historyparams);
    }

    /** 渲染数据展示 */

    loaddata = () => {
        const { dataloading, option, datatable, columns } = this.props;
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
                    theme="light"
                    option={option}
                    lazyUpdate
                    notMerge
                    id="rightLine"
                    style={{ width: '100%', height: 'calc(100vh - 500px)' }}
                />);
            }

            return (<div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>);
        }
        return (<SdlTable
            rowKey={(record, index) => `complete${index}`}
            dataSource={datatable}
            columns={columns}
            scroll={{ y: 'calc(100vh - 550px)' }}
            pagination = {
               {
                 size: 'small',
                 showSizeChanger: true,
                 showQuickJumper: true,
                 total: this.props.total,
                 pageSize: this.props.historyparams.pageSize,
                 current: this.props.historyparams.pageIndex,
                 onChange: this.onChange,
                 onShowSizeChange: this.onShowSizeChange,
                 pageSizeOptions: ['10', '20', '30', '40', '50', '100', '200', '400', '500', '1000'],
               }
             }
        />);
    }

    render() {
        return (
            <div>
                <Card
                    extra={
                        <div>
                            {!this.props.isloading && this.state.selectDisplay && this.getpollutantSelect()}
                            <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate} format={this.state.formats} onChange={this._handleDateChange} allowClear={false} />
                            <ButtonGroup_ style={{ marginRight: 20 }} checked="realtime" onChange={this._handleDateTypeChange} />
                            <Radio.Group defaultValue="chart" buttonStyle="solid" onChange={e => {
                             this.displayChange(e.target.value)
                            }}>
                            <Radio.Button value="chart">图表</Radio.Button>
                            <Radio.Button value="data">数据</Radio.Button>
                            </Radio.Group>
                        </div>
                    }
                >
                    <Card.Grid style={{ width: '100%', height: 'calc(100vh - 100px)', ...this.props.style }}>
                        {this.loaddata()}
                    </Card.Grid>
                </Card>
            </div>
        );
    }
}
export default DataQuery;
