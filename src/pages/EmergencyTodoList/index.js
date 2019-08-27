// import React, { Component } from 'react';
// import PointList from '../../components/PointList/PointsList';
// import {Button, Table, Select, Card, Form, Row, Col, Icon, message} from 'antd';
// import EmergencyDataList from '../../mockdata/EmergencyTodoList/EmergencyDataList.json';
// import moment from 'moment';
// import { connect } from 'dva';
// import RangePicker_ from '../../components/PointDetail/RangePicker_';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styless from '../ReplacementPartAdd/index.less';
// import {routerRedux} from 'dva/router';
// const FormItem = Form.Item;

//   @Form.create()
//   @connect()
// export default class EmergencyTodoList extends Component {
//       constructor(props) {
//           super(props);
//           this.state = {
//               EmergencyData: EmergencyDataList.EDataList.filter((item) => {
//                   return item.CheckState !== '审核通过';
//               }),
//               RangeDate: [moment().subtract(7, 'days'), moment()],
//               TargetStatus: '',
//               OpeartionPerson: '',
//               DGIMNS: [],
//               selectid: ''
//           };
//       }

//     SearchEmergencyDataList = (value) => {
//         this.setState({
//             EmergencyData: [],
//             DGIMNS: value
//         });

//         let dataList = [];
//         EmergencyDataList.EDataList.map((item, _key) => {
//             let isexist = false;
//             if (item.CheckState !== '审核通过' && value.indexOf(item.DGIMN) > -1) {
//                 isexist = true;
//             }

//             if (isexist) { dataList.push(item); }
//         });
//         this.setState({
//             EmergencyData: dataList,
//         });
//     };

//       // 时间范围
//     _handleDateChange=(_date, dateString) => {
//         this.state.RangeDate = dateString;
//     };

//        // 任务状态
//        _handleTargetChange=(value) => {
//            this.setState({
//                TargetStatus: value
//            });
//        };

//     // 运维人
//     _handleOperationChange=(value) => {
//         this.setState({
//             OpeartionPerson: value
//         });
//     };

//     toggleForm = () => {
//         this.setState({
//             expandForm: !this.state.expandForm,
//         });
//     };

//     SearchInfo=() => {

//     }

//     handleFormReset = () => {
//         const { form } = this.props;
//         form.resetFields();
//         this.setState({
//             formValues: {},
//         });
//     };

//     renderSimpleForm() {
//         const { getFieldDecorator } = this.props.form;
//         return (
//             <Form layout="inline">
//                 <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
//                     <Col md={9} sm={24}>
//                         <FormItem label="开始时间">
//                             {getFieldDecorator(`MaterialName`)(
//                                 <RangePicker_ dateValue={this.state.RangeDate} format="YYYY-MM-DD" onChange={this._handleDateChange} style={{ width: '100%' }} />
//                             )}
//                         </FormItem>
//                     </Col>
//                     <Col md={5} sm={24}>
//                         <FormItem label="任务状态">
//                             {getFieldDecorator('Brand')(
//                                 <Select placeholder="请选择"
//                                     onChange={this._handleTargetChange} style={{ width: '100%' }}>
//                                     <Option value="">全部</Option>
//                                     <Option value="处理中">处理中</Option>
//                                     <Option value="未审核">未审核</Option>
//                                     <Option value="正在审核">正在审核</Option>
//                                     <Option value="未通过">未通过</Option>
//                                     <Option value="审核通过">审核通过</Option>
//                                 </Select>
//                             )}
//                         </FormItem>
//                     </Col>
//                     <Col md={5} sm={24}>
//                         <FormItem label="处理人">
//                             {getFieldDecorator(`Specifications`)(
//                                 <Select placeholder="请选择"
//                                     onChange={this._handleOperationChange}
//                                     style={{ width: '100%' }}>
//                                     <Option value="">全部</Option>
//                                     <Option value="小李">小李</Option>
//                                     <Option value="小王">小王</Option>
//                                 </Select>
//                             ) }
//                         </FormItem>
//                     </Col>
//                     <Col md={5} sm={24}>
//                         <Button type="primary" htmlType="submit" onClick={this.SearchInfo}>
//                 查询 </Button>
//                         <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
//                 重置
//                         </Button>
//                     </Col>
//                 </Row>
//             </Form>
//         );
//     }

//     renderForm() {
//         return this.renderSimpleForm();
//     }

//     render() {
//         const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
//         const SCREEN_WIDTH = document.querySelector('body').offsetWidth;
//         const thata = this;
//         const EColumn = [
//             {
//                 title: '故障类型',
//                 width: '15%',
//                 dataIndex: 'ExceptionType',
//                 align: 'center'
//             }, {
//                 title: '处理人',
//                 width: '15%',
//                 dataIndex: 'User_Name',
//                 align: 'center'
//             }, {
//                 title: '开始时间',
//                 width: '20%',
//                 dataIndex: 'BeginHandleTime',
//                 align: 'center'
//             }, {
//                 title: '结束时间',
//                 width: '20%',
//                 dataIndex: 'EndHandleTime',
//                 align: 'center'
//             }, {
//                 title: '签到',
//                 width: '20%',
//                 dataIndex: 'SignFlag',
//                 align: 'center'
//             }, {
//                 title: '任务状态',
//                 width: '10%',
//                 dataIndex: 'CheckState',
//                 align: 'center'
//             }
//         ];

//         const rowSelection = {
//             onChange: (selectedRowKeys, selectedRows) => {
//                 let keys = [];
//                 selectedRowKeys.map(t => {
//                     if (Array.isArray(t)) {
//                         t.map(a => {
//                             if (a !== '') { keys.push(a); }
//                         });
//                     } else {
//                         if (t !== '') { keys.push(t); }
//                     }
//                 });
//             },
//             getCheckboxProps: record => ({
//                 disabled: record.name === 'Disabled User', // Column configuration not to be checked
//                 name: record.name,
//             }),
//             selectedRowKeys: [this.state.selectid]
//         };

//         return (
//             <PointList handleChange={this.SearchEmergencyDataList}>
//                 <PageHeaderLayout title="待办列表">
//                     <Card bordered={false} >
//                         <div>
//                             <div className={styless.tableListForm}>{this.renderForm()}</div>
//                             <Button style={{marginLeft: 10, marginBottom: 10}} onClick={() => {
//                                 if (this.state.selectid === '') {
//                                     message.info('请选择应急任务！');
//                                 } else {
//                                     this.props.dispatch(routerRedux.push(`/emergency/emergencydetailinfolayout/${this.state.selectid}`));
//                                 }
//                             }}> 查看 </Button>
//                             <Table
//                                 columns={EColumn}
//                                 dataSource={this.state.EmergencyData}
//                                 rowKey="ExceptionHandleId"
//                                 pagination={{
//                                     showSizeChanger: true,
//                                     showQuickJumper: true,
//                                     'total': this.state.EmergencyData.length,
//                                     'pageSize': 20,
//                                     'current': 1
//                                 }}
//                                 rowSelection={rowSelection}
//                                 scroll={
//                                     {
//                                         y: 'calc(100vh - 458px)'
//                                     }
//                                 }
//                                 onRow={(record, index) => {
//                                     return {
//                                         onClick: (a, b, c) => {
//                                             this.setState({selectid: record.ExceptionHandleId});
//                                         }, // 点击行
//                                         onMouseEnter: () => {}, // 鼠标移入行
//                                     };
//                                 }}
//                             />
//                         </div></Card>
//                 </PageHeaderLayout>
//             </PointList>
//         );
//     }
//   }
