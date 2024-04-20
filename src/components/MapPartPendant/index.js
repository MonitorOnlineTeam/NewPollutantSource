/**
 * 功  能：地图 按钮 弹框组件
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { RightOutlined, PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import styles from "./style.less"



// 按钮组件
export const BtnList = ({ data, onClick, style }) => {
  const [selectIndex, setSelectIndex] = useState(0)
  const onChange = (index,name) => {
    setSelectIndex(index)
    onClick && onClick(name,index)
  }
  return <div style={{  position: 'absolute', top: 24,left: 0, right: 0, textAlign: 'center',marginBottom:24, ...style }}>
    {data?.[0]&&data.map((item, index) => {
      return <div key={index} onClick={() => onChange(index,item.name)} style={{ display: 'inline-block', marginLeft: 12, marginRight: index + 1 == data?.length ? 12 : 0, width: 130, height: 34, lineHeight: '34px', color: index == selectIndex ? '#fff' : '#6397D1', background: `url(/currencyResOver/mapbtn_${index == selectIndex ? 's' : 'd'}.png)`, backgroundSize: '100% 100%', cursor: 'pointer' }}>{item.name} <span>{item.value}</span></div>
    })
    }
  </div>
};

//小圆点
const  Dot = ()=><div  style={{textAlign:'center'}} ><span className={styles.circle} style={{ display:'inline-block',marginTop:16, width: 10,height: 10,background: 'rgba(0, 141, 253, 1)', boxShadow:' 0 0 4px 4px rgba(0, 141, 253, .1)',borderRadius: '50%'}}></span></div>

// 弹框组件
export const RegPopver = ({ regionName, data, isEnter,style }) => { //tksf.png
  return <div style={{position:'relative',marginTop:'-50%',marginLeft:'-50%',padding: '0 14px', width: 197, height: 128, background: `url(/currencyResOver/tksf.png)`, backgroundSize: '100% 100%',...style }}>
    <Row align='middle' style={{ height: 29, opacity: .9, color: '#52F2FF' }} justify='space-between'><div className='textOverflow' style={{ width: isEnter ? 'calc(100% - 14px)' : '100%', paddingRight: isEnter ? 6 : 0 }} title={regionName}>{regionName}</div> {isEnter && <RightOutlined style={{ cursor: 'pointer' }} />}</Row>
    <Row align='middle' style={{ height: 'calc(100% - 29px - 12px)' }}>
      {data?.[0] && data.map((item, index) => <Col key={index} span={12} style={{ paddingLeft: index == 0 ? 0 : 6 }}>
        <div style={{ color: '#30FDFF' }}><span style={{ fontSize: 24 }}>{item.value}</span> <span>{item.unit}</span></div>
        <div>{item.name}</div>
      </Col>)}
    </Row>
    <Dot />
  </div>;
};
// 二级弹框组件 办事处 备件库等
export const SecondPopver = ({ data,style,isIcon  }) => { 
  return <div style={{ padding: '0 14px', width: 199, height: 44, background: `url(/currencyResOver/bsc.png)`, backgroundSize: '100% 100%',...style  }}>
    <Row justify='space-between' align='middle' style={{ height: 'calc(100% - 12px)' }}>
      <span className='textOverflow' style={{ width: 'calc(100% - 48px)' }} title={data?.name}>{data?.name}</span>
      <span>{data?.value}</span>
    </Row>
    {isIcon? <div  style={{textAlign:'center',marginTop:8}} > <img src='/currencyResOver/bjkIcon.png'/> </div> :  <Dot /> }
  </div>;
};

// 下拉列表
export const MapSelect = ({...props}) => {
  return <Select size='small' getPopupContainer={trigger => trigger.parentNode} className={styles.selectSty}  {...props}/>
};
