/**
 * 功  能：客户满意度调查
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';
import TitleComponents from '@/components/TitleComponents'


import { API } from '@config/API';
import cuid from 'cuid';
import styles from "../style.less"
const { Step } = Steps;
const namespace = 'installaEquipment'

const dvaPropsData = ({ loading, installaEquipment, global, }) => ({
  installPhotoData: installaEquipment.installPhotoData,
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  configInfo: global.configInfo,
})

const Index = (props) => {





  const {data,} = props;
 




  useEffect(() => {

  }, []);


  const ContentComponents = () => {
    return <Form className='detailForm'>
     <TitleComponents simpleSty text='派单详情' key='1' height={16} style={{ fontSize:16 }} />
      <div>
            {data?.[0] ? data.map((item, index) => {
              return <Row>
                <Col span={8}>
                    <Form.Item label='派单工号'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='项目编号'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='项目名称'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='大区名称'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='省份'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='行业'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='服务工程师'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='工程师行政区域'>
                    2000多年前，中国汉代的张骞从长安出发，伴着驼 2000多年前，中国汉代的张骞从长安出发，伴着驼2000多年前，中国汉代的张骞从长安出发，伴着驼
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='服务主要内容'> 
                    2000多年前，中国汉代的张骞从长安出发，伴着驼铃风沙，一路西行，踏出了一条横贯东西、连接欧亚的丝绸之路。哈萨克斯坦正是古丝绸之路的核心区域。
                    在哈萨克斯坦一个叫扎尔肯特的小城，至今留有中哈文化融合的印记。穿过扎尔肯特古朴的街道，可以看到一座中国传统亭台楼阁和中亚风格拱门“混搭”的博物馆——扎尔肯特清真寺建筑与艺术博物馆。进入院子，回廊、飞檐、宫灯等映入眼帘，满满“中国风”。曾经东西方使节、商队、游客、学者、工匠集聚于此，造就了这座被称为“文明交汇融通见证”的建筑。
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='服务完成日期'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='客户姓名'>
                   </Form.Item> 
                </Col>
                <Col span={8}>
                    <Form.Item label='客户电话'>
                   </Form.Item> 
                </Col>
              </Row>
            })
              :
              <Empty />

            }
      </div>
    </Form>
  }

  

  return (
    <div className={styles.installaEquipmentSty}>
          <ContentComponents />
    </div>
  );
};
export default connect(dvaPropsData)(Index);