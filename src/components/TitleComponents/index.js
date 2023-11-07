/**
 * 功  能：标题组件
 * 创建人：jab
 * 创建时间：2023.10.18
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Tooltip,Popover   } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";




const Index = (props) => {

  return (
    <div  key={props.key} style={{ display: 'inline-block', fontWeight: 'bold', paddingBottom: '2px', marginBottom: 12, borderBottom: '1px solid rgba(0,0,0,.1)',...props.style }} >{props.text}</div>
  );
};
export default (Index);


