/**
 * 功  能：编号
 * 创建人：贾安波
 * 创建时间：2022.2.21
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Tooltip,Popover   } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";




const Index = (props) => {





  return (
    <Popover content={props.content} title={null}>
            <QuestionCircleOutlined style={{position:'absolute',right:-18,top:9,zIndex:999,...props.style}}/>
    </Popover>
  );
};
const content =  <div>
    <p style={{marginBottom:5}}>编号从1依次开始,系统会自动给出</p>
    <p style={{marginBottom:0}}>最新编号,无特殊情况切勿修改。</p>
  </div>
Index.defaultProps={
  content:content
}
export default (Index);


