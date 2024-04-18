/**
 * 功  能：地图 按钮 弹框组件
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";



// 按钮组件
export const BtnList = ({ data, onClick,style}) => {
  const [selectIndex,setSelectIndex] = useState(0)
  const onChange = (index)=>{
    setSelectIndex(index)
    onClick&&onClick()
  }
  return <div style={{position:'absolute',left:0,right:0,textAlign:'center',marginBottom:12,top:12,...style}}>
    {data.map((item,index) => {
    return <div onClick={()=>onChange(index)} style={{display:'inline-block',marginLeft:12,marginRight:index+1==data?.length? 12 :0, width: 130, height: 34,lineHeight:'34px',color:index==selectIndex? '#fff':'#6397D1',background: `url(/currencyResOver/mapbtn_${index==selectIndex?'s':'d'}.png)`, backgroundSize: '100% 100%',cursor:'pointer' }}>{item.name} <span>{item.value}</span></div>
  })
  }
  </div>
};
// 弹框组件
export const MapPopver = () => { //tksf.png
  return <div>Component B</div>;
};
