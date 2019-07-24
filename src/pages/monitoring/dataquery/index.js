import React, { Component, Fragment } from 'react';
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
    Select, Modal, Tag, Divider, Dropdown, Icon, Menu, Popconfirm, message, DatePicker, Switch,
} from 'antd';
import { PointIcon } from '@/utils/icon'
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SdlTable from '../../../components/AutoForm/Table';
import styles from './index.less';
import NavigationTree from '../../../components/NavigationTree'
import RangePicker_ from '../../../components/RangePicker'
import ButtonGroup_ from '../../../components/ButtonGroup'
import PollutantSelect from '../../../components/PollutantSelect'

@connect(({ loading, dataquery }) => ({
    pollutantlist: dataquery.pollutantlist,
}))

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    /** 根据排口dgimn获取它下面的所有污染物 */
    getpointpollutants=() => {
        this.props.dispatch({
          type: 'dataquery/querypollutantlist',
          payload: {
            dgimn: this.props.selectpoint.DGIMN,
          },
        });
    }

    /** 时间类型切换 */
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

    /**获取第一个污染物 */
    getpropspollutantcode = () => {
      if (this.props.pollutantlist[0]) {
        return this.props.pollutantlist[0].pollutantCode;
      }
      return null;
    }

    reloadPage = configId => {
        const { dispatch } = this.props;
        dispatch({
            type: 'autoForm/updateState',
            payload: {
                routerConfig: configId,
            },
        });
        dispatch({
            type: 'autoForm/getPageConfig',
            payload: {
                configId,
            },
        })
    }


    render() {
        if (this.props.loading) {
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
        return (
            <PageHeaderWrapper>
                <div className={styles.cardTitle}>
                <Card
                    extra={
                        <div>
                            {this.getpollutantSelect()}
                            <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} dateValue={this.state.rangeDate} format={this.state.formats} onChange={this._handleDateChange} />
                            <ButtonGroup_ style={{ marginRight: 20 }} checked="realtime" onChange={this._handleDateTypeChange} />
                            <Switch checkedChildren="图表" unCheckedChildren="数据" onChange={this.displayChange} defaultChecked />
                        </div>
                    }
                    style={{ width: '100%', height: 'calc(100vh - 213px)' }}
                >
                    <NavigationTree choice={false} onItemClick={value => {
                        console.log('test=', value)
                        console.log('test1=', this.props.selectTreeKeys)
                    }} />
                </Card>
            </div>
            </PageHeaderWrapper>
        );
    }
}
export default Index;
