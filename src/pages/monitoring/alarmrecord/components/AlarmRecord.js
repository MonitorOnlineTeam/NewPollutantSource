import React, { Component } from 'react';
import moment from 'moment';
import { formatMoment } from '@/utils/utils';
import {
    Card,
    Spin,
} from 'antd';
import { connect } from 'dva';
import RangePicker_ from '@/components/RangePicker'
import PollutantSelect from '@/components/PollutantSelect'
import SdlTable from '@/components/SdlTable'
/**
 * 报警记录
 * xpy 2019.07.26
 */
@connect(({ loading, alarmrecord }) => ({
   pollutantlist: alarmrecord.pollutantlist,
    isloading: loading.effects['alarmrecord/querypollutantlist'],
    dataloading: loading.effects['alarmrecord/queryoverdatalist'],
    data: alarmrecord.overdata,
    total: alarmrecord.overtotal,
    overdataparams: alarmrecord.overdataparams,
}))

class AlarmRecord extends Component {
    constructor(props) {
        super(props);
        const firsttime = moment(new Date()).add(-1, 'month');
        const lasttime = moment(new Date());
        this.state = {
            rangeDate: [firsttime, lasttime],
            current: 1,
            pageSize: 15,
            // 参数改变让页面刷新
            firsttime,
            lasttime,
            selectDisplay: false,
        };
    }

     componentWillReceiveProps = nextProps => {
          const { DGIMN, lasttime, firsttime } = this.props;
          if (nextProps.lasttime !== undefined && nextProps.firsttime !== undefined) {
                 // 如果传入参数有变化，则重新加载数据
                 if (nextProps.DGIMN !== DGIMN || moment(nextProps.lasttime).format('yyyy-MM-dd HH:mm:ss') !==
                   moment(lasttime).format('yyyy-MM-dd HH:mm:ss') ||
                   moment(nextProps.firsttime).format('yyyy-MM-dd HH:mm:ss') !== moment(firsttime).format('yyyy-MM-dd HH:mm:ss')) {
                   let {
                     overdataparams,
                   } = this.props;
                   overdataparams = {
                     ...overdataparams,
                     DGIMN: nextProps.DGIMN,
                     beginTime: moment(nextProps.firsttime).format('YYYY-MM-DD HH:mm:ss'),
                     endTime: moment(nextProps.lasttime).format('YYYY-MM-DD HH:mm:ss'),
                   }
                   this.setState({
                     rangeDate: [nextProps.firsttime, nextProps.lasttime],
                   })
                   if (nextProps.DGIMN !== '') {
                     this.changeDgimn(nextProps.DGIMN, overdataparams);
                   }
                 }
            } else {
                // 如果传入参数有变化，则重新加载数据
                if (nextProps.DGIMN !== DGIMN) {
                    const { rangeDate } = this.state;
                  let {
                    overdataparams,
                  } = this.props;
                  overdataparams = {
                    ...overdataparams,
                    DGIMN: nextProps.DGIMN,
                    beginTime: moment(rangeDate[0]).format('YYYY-MM-DD HH:mm:ss'),
                    endTime: moment(rangeDate[1]).format('YYYY-MM-DD HH:mm:ss'),
                  }
                  if (nextProps.DGIMN !== '') {
                    this.changeDgimn(nextProps.DGIMN, overdataparams);
                  }
                }
            }
      }

       /** 切换排口 */
    changeDgimn=(dgimn, params) => {
        this.setState({
            selectDisplay: true,
        })
         const {
        dispatch,
      } = this.props;
        params = {
          ...params,
          pollutantCode: '',
          pageIndex: 1,
          pageSiz: 10,
        }
      dispatch({
        type: 'alarmrecord/updateState',
        payload: {
          overdataparams: params,
        },
      })
        this.getpointpollutants(dgimn);
    }

      /** 获取污染物 */
      getpointpollutants = dgimn => {
         this.props.dispatch({
           type: 'alarmrecord/querypollutantlist',
           payload: {
             overdata: false,
             dgimn,
           },
         })
      };

    /** 时间更改 */
    _handleDateChange=(date, dateString) => {
        let { overdataparams } = this.props;
        overdataparams = {
            ...overdataparams,
            beginTime: date[0] && formatMoment(date[0]),
            endTime: date[0] && formatMoment(date[1]),
            pageIndex: 1,
            pageSiz: 10,
        }
        this.setState({
            rangeDate: date,
        })
        if (overdataparams.DGIMN !== null && overdataparams.DGIMN !== '') {
        this.reloaddatalist(overdataparams);
        }
    };


    /** 如果是数据列表则没有选择污染物，而是展示全部污染物 */
    getpollutantSelect = () => {
        const { pollutantlist } = this.props;
        return (<PollutantSelect
            optionDatas={pollutantlist}
            allpollutant
            style={{ width: 150, marginRight: 10 }}
            onChange={this.ChangePollutant}
            placeholder="请选择污染物"
        />);
    }

    /**切换污染物 */
    ChangePollutant = (value, selectedOptions) => {
      let {
        overdataparams,
      } = this.props;
      if (value === -1) {
        value = null;
      }
      overdataparams = {
        ...overdataparams,
        pollutantCode: value,
        pageIndex: 1,
        pageSiz: 10,
      }
      this.reloaddatalist(overdataparams);
    };


    /** 分页 */
    pageIndexChange=(page, pageSize) => {
        const { overdataparams } = this.props;
        overdataparams.pageIndex = page;
        this.reloaddatalist(overdataparams);
    }

    /** 刷新数据 */
    reloaddatalist=overdataparams => {
    const { dispatch } = this.props;
    dispatch({
        type: 'alarmrecord/updateState',
        payload: {
            overdataparams,
        },
    })
    dispatch({
            type: 'alarmrecord/queryoverdatalist',
            payload: {
            },
        });
    }


      render() {
          let tablewidth = 0;
          const colcount = 5;
          let width = (window.screen.availWidth - 120) / colcount;
          if (width < 200) {
              width = 200;
          }
          tablewidth = width * colcount;


          const columns = [{
              title: '报警时间',
              dataIndex: 'FirstTime',
              fixed: 'left',
              width,
              key: 'FirstTime',
          },
           {
             title: '报警类型',
             dataIndex: 'AlarmTypeName',
             width,
             key: 'AlarmTypeName',
           },
          {
              title: '污染物',
              dataIndex: 'PollutantName',
              width,
              key: 'PollutantName',
          },
          {
              title: '报警信息',
              dataIndex: 'AlarmMsg',
              width,
              key: 'AlarmMsg',
          },
          {
              title: '报警次数',
              dataIndex: 'AlarmCount',
              width,
              key: 'AlarmCount',
          }];
           const { isloading, overdataparams } = this.props;
          if (isloading) {
              return (<Spin
                  style={{ width: '100%',
                      height: 'calc(100vh/2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center' }}
                  size="large"
              />);
          }
          return (
              <div>
                  <div>
                      <Card
                          extra={
                              <div>
                                  {!this.props.isloading && this.state.selectDisplay && this.getpollutantSelect()}
                                  <RangePicker_ style={{ width: 350, textAlign: 'left', marginRight: 10 }} format="YYYY-MM-DD HH:mm:ss" onChange={this._handleDateChange} dateValue={this.state.rangeDate} />
                              </div>
                          }
                          style={{ width: '100%', height: 'calc(100vh - 230px)' }}
                      >
                          <SdlTable
                              loading={this.props.dataloading}
                              columns={columns}
                              dataSource={this.props.data}
                              rowKey="key"
                              pagination={{
                                   pageSize: 10,
                              }}
                          />
                      </Card>
                  </div>
              </div>
          );
      }
}
export default AlarmRecord;
