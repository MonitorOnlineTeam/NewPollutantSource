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
  
  const { text } = props;
  return (
     <>
     { props.simpleSty?
       <div  key={props.key} style={{ display: 'inline-block', fontWeight: 'bold',  marginBottom: 12,...props.style }} >
       <div style={{width:3,height:14, display:'inline-block',verticalAlign:'middle',background:'#1890FF',margin:'0 4px 4px 0'}}/> 
       {text}
     </div>
      :
      <div  key={props.key} style={{ display: 'inline-block', fontWeight: 'bold', paddingBottom: '2px', marginBottom: 12, borderBottom: '1px solid rgba(0,0,0,.1)',...props.style }} >
      {text}
     </div> 
     }
    </>
  );
};
export default (Index);


