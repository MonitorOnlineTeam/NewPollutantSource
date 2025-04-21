import React, { Component } from 'react';
// import "react-image-lightbox/style.css";
import { MapInteractionCSS } from 'react-map-interaction';
import PatrolCEM from '@/pages/EmergencyTodoList/Patrol/CEM';
import RMR from '@/pages/EmergencyTodoList/RMR';
import ConsumableReplace from '@/pages/EmergencyTodoList/ConsumableReplace';
import BdTestRecordContentZb from '@/pages/EmergencyTodoList/BdTestRecordContent_ZB';
import ZbDeviceRepair from '@/pages/EmergencyTodoList/ZbDeviceRepair';
import ZbValueError from '@/pages/EmergencyTodoList/ZbValueError';
import JzRecordContentZbFs from '@/pages/EmergencyTodoList/ZbJz/JzRecordContentFs';
import JzRecordContentZb from '@/pages/EmergencyTodoList/ZbJz/JzRecordContent';

// 表单组件映射
const FormComponents = {
  '76': PatrolCEM, // 完全抽取法
  '77': PatrolCEM, // 稀释采样法
  '78': PatrolCEM, // 直接测量法
  '79': PatrolCEM, // VOCs
  '80': PatrolCEM, // 废水
  '81': JzRecordContentZbFs, // 废水 CEMS零点量程漂移与校准记录表
  '82': JzRecordContentZb, // 废气 CEMS零点量程漂移与校准记录表
  '83': RMR, // 标准物质更换记录表
  '84': ConsumableReplace, // 废气-易耗品更换
  '85': ConsumableReplace, // 废水-易耗品更换
  '86': BdTestRecordContentZb, // CEMS校验测试记录 - 淄博
  '88': ZbDeviceRepair, // zb设备维修
  '92': ZbValueError, // zb示值误差
};

// 动态表单组件
const DynamicFormRecord = ({ TypeID, TaskID, ...otherProps }) => {
  const FormComponent = FormComponents[TypeID + ''];
  if (!FormComponent) {
    return <div>未找到对应的表单页面 (TypeID: {TypeID})</div>;
  }
  return (
    <>
      {/* <p>AppCommonRecord-otherProps: {JSON.stringify(otherProps)}</p>
      <p>AppCommonRecord-TaskID: {TaskID}</p>
      <p>AppCommonRecord-TypeID: {TypeID}</p> */}
      <FormComponent
        TaskID={TaskID}
        TypeID={TypeID}
        taskID={TaskID}
        typeID={TypeID}
        {...otherProps}
      />
    </>
  );
};

export default class AppCommonRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { match } = this.props;
    return (
      <MapInteractionCSS>
        {/* <p>AppCommonRecord-match: {JSON.stringify(match.params)}</p> */}
        <DynamicFormRecord {...match.params} appStyle={{ overflowY: 'hidden' }} scrolly="none" />
      </MapInteractionCSS>
    );
  }
}
