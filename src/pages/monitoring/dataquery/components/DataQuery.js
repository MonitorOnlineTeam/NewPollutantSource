import React, { Component } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import {
    Card,
    Spin,
    message, Empty, Radio, Row, Col,
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
            dgimn: '',
        };
    }

    componentDidMount() {
        this.props.initLoadData && this.changeDgimn(this.props.DGIMN)
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
        // debugger;
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
                date[1].add(1, 'month')
                break;
            case 'hour':
                if (date[1].add(-6, 'month') > date[0]) {
                    message.info('小时数据时间间隔不能超过6个月');
                    return;
                }
                date[1].add(6, 'month')
                break;
            case 'day':
                if (date[1].add(-12, 'month') > date[0]) {
                    message.info('日数据时间间隔不能超过1年个月');
                    return;
                }
                date[1].add(12, 'month')
                break;
            default:
                return;
        }
        console.log('date=', date);
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
        return (<PollutantSelect
            mode="multiple"
            optionDatas={pollutantlist}
            defaultValue={selectP === '' ? this.getpropspollutantcode() : selectP}
            style={{ width: '80%', margin: '5px' }}
            onChange={this.handlePollutantChange}
            placeholder="请选择污染物"
            maxTagCount={2}
            maxTagTextLength={5}
            maxTagPlaceholder="..."
        />);
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
            pollutantCodes: value.length > 0 ? value.toString() : '',
            pollutantNames: res.length > 0 ? res.toString() : '',

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
            dgimn,
        })
        const {
            dispatch,
        } = this.props;
        let { historyparams } = this.props;
        const { rangeDate } = this.state;
        historyparams = {
            ...historyparams,
            pollutantCodes: '',
            pollutantNames: '',
            beginTime: rangeDate[0].format('YYYY-MM-DD HH:mm:ss'),
            endTime: rangeDate[1].format('YYYY-MM-DD HH:mm:ss'),
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
                    style={{ width: '98%', height: this.props.style ? '100%' : 'calc(100vh - 330px)', padding: 20 }}
                />);
            }

            return (<div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>);
        }
        return (<SdlTable
            rowKey={(record, index) => `complete${index}`}
            dataSource={datatable}
            columns={columns}
            scroll={{ y: this.props.tableHeight || 'calc(100vh - 550px)' }}
            Pagination={null}

        />);
    }


    render() {
        console.log('---------------------', this.state.format);
        return (
            <div>
                <Card
                    className={!this.props.style ? 'contentContainer' : null}
                    title={
                        <div>
                            {/* <Row>
                                <Col xxl={6} xl={12} lg={13} md={24}>
                                    {!this.props.isloading && this.getpollutantSelect()}
                                </Col>
                                <Col xxl={7} xl={12} lg={24} md={24}>
                                    <RangePicker_ style={{ width: '80%', margin: '5px', textAlign: 'left' }} dateValue={this.state.rangeDate} format={this.state.format} onChange={this._handleDateChange} allowClear={false} showTime={this.state.format} />
                                </Col>
                                <Col xxl={7} xl={8} lg={12} md={24}>
                                    <ButtonGroup_ style={{ width: '100%', margin: '5px' }} checked="realtime" onChange={this._handleDateTypeChange} />
                                </Col>
                                <Col xxl={3} xl={8} lg={12} md={24}>
                                    <Radio.Group style={{ width: '100%', margin: '5px' }} defaultValue="chart" buttonStyle="solid" onChange={e => {
                                        this.displayChange(e.target.value)
                                    }}>
                                        <Radio.Button value="chart">图表</Radio.Button>
                                        <Radio.Button value="data">数据</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row> */}

                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={7}>
                                    {!this.props.isloading && this.getpollutantSelect()}
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={9}>
                                    <RangePicker_ style={{ width: '90%', margin: '5px', textAlign: 'left' }} dateValue={this.state.rangeDate} format={this.state.format} onChange={this._handleDateChange} allowClear={false} showTime={this.state.format} />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={12} xl={18} xxl={5}>
                                    <ButtonGroup_ style={{ width: '100%', margin: '5px' }} checked="realtime" onChange={this._handleDateTypeChange} />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={3}>
                                    <Radio.Group style={{ width: '100%', margin: '5px' }} defaultValue="chart" buttonStyle="solid" onChange={e => {
                                        this.displayChange(e.target.value)
                                    }}>
                                        <Radio.Button value="chart">图表</Radio.Button>
                                        <Radio.Button value="data">数据</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        </div>
                    }
                >
                    <div style={{ height: '100%', ...this.props.style }}>
                        {this.loaddata()}
                    </div>
                </Card>
            </div >
        );
    }
}
export default DataQuery;
