// /*
//  * @Author: lzp
//  * @Date: 2019-09-19 11:23:37
//  * @LastEditors: lzp
//  * @LastEditTime: 2019-09-19 11:23:37
//  * @Description: 
//  */
// import React, { Component } from 'react';
// import { Row, Col, Card, List, Tabs, Divider, Modal, Table, Spin } from 'antd';
// import { connect } from 'dva';
// import moment from 'moment';
// import ReactEcharts from 'echarts-for-react';
// import styles from './RealTimeWarning.less';
// import RealTimeWarningModal from './RealTimeWarningModal';

// const pageUrl = {
//     getDataOverWarningData: 'workbenchmodel/getDataOverWarningData',
// };
// const TabPane = Tabs.TabPane;
// @connect(({
//     loading,
//     workbenchmodel
// }) => ({
//     loadingDataOverWarning: loading.effects[pageUrl.getDataOverWarningData],
//     hourDataOverWarningList: workbenchmodel.hourDataOverWarningList,
// }))
// class RealTimeWarning extends Component {
//     constructor(props) {
//         super(props);
//     }

//     componentDidMount() {
//         console.log('this.props=', this.props)
//         const { dispatch, DGIMN, firsttime, lasttime, hourDataOverWarningList } = this.props;
//         dispatch({
//             type: pageUrl.getDataOverWarningData,
//             payload: {
//                 DGIMN: DGIMN
//             }
//         })

//     }

//     componentWillReceiveProps(nextProps) {
//         if (this.props.hourDataOverWarningList !== nextProps.hourDataOverWarningList) {
//             var items = nextProps.hourDataOverWarningList.tableDatas[0]
//             console.log('items=', items)
//             var item = items.OverWarnings[0]
//             this.showModal(items.PointName, items.DGIMNs, item.PollutantCode, item.PollutantName, item.SuggestValue)
//         }
//     }


//     /**
//  * 实时预警和超标汇总(2)
//  */
//     renderHourDataOverWarningList = () => {
//         const listData = [];
//         const { hourDataOverWarningList } = this.props;
//         hourDataOverWarningList.tableDatas.map((items, key) => {
//             //判断报警是否超过4小时
//             listData.push({
//                 title: `${items.PointName}`,
//                 description: (
//                     <div key={key}>
//                         {
//                             items.OverWarnings.map((item, key) => (
//                                 <div key={key}>
//                                     <div key={key} className={styles.warningsData} onClick={(e) => this.showModal(items.PointName, items.DGIMNs, item.PollutantCode, item.PollutantName, item.SuggestValue)}>
//                                         {item.PollutantName}
//                                         <Divider type="vertical" style={{ backgroundColor: '#b3b3b3' }} />
//                                         超标预警值为{item.AlarmValue}{item.Unit}
//                                         <Divider type="vertical" style={{ backgroundColor: '#b3b3b3' }} />
//                                         建议浓度为{item.SuggestValue}{item.Unit}
//                                         <span style={{ float: 'right' }}>{item.AlarmOverTime}</span>
//                                     </div>
//                                 </div>
//                             ))
//                         }
//                     </div>
//                 )
//             });

//         });
//         return (<List
//             itemLayout="vertical"
//             dataSource={listData}
//             renderItem={item => (
//                 <List.Item
//                     key={item.title}
//                     actions={[]}
//                 >
//                     <List.Item.Meta
//                         title={<a href={item.href}>{item.title}</a>}
//                         description={item.description}
//                     />
//                 </List.Item>
//             )}
//         />
//         );


//     }

//     /**
//      * 智能监控_显示预警详情弹窗口
//      */
//     showModal = (name, mn, pollutantCode, pollutantName, SuggestValue) => {
//         this.child.showModal(name, mn, pollutantCode, pollutantName, SuggestValue);
//     }


//     onRef = (ref) => {
//         this.child = ref;
//     }

//     render() {
//         const { loadingDataOverWarning } = this.props;
//         return (
//             <div>
//                 {/* <div>
//                     <Card
//                         // title="实时预警"
//                         style={{ marginBottom: 10 }}
//                         bordered={false}
//                         loading={this.props.loadingDataOverWarning}
//                     >
//                         <div style={{ height: 400, overflow: 'auto' }}>
//                             {
//                                 this.renderHourDataOverWarningList()
//                             }
//                         </div>
//                     </Card>
//                 </div> */}
//                 {/* <RealTimeWarningModal {...this.props} onRef={this.onRef} /> */}
//             </div>
//         );
//     }
// }

// export default RealTimeWarning;