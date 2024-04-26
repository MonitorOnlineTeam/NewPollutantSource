/**
 * 功  能：设备安装审核 处理人意见区
 * 创建人：jab
 * 创建时间：2024.03
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Radio,Result, Steps, Image, Form, Tag, Skeleton, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Spin, Empty } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, AuditOutlined, } from '@ant-design/icons';
import { connect } from "dva";
const { RangePicker } = DatePicker;
import Cookie from 'js-cookie';
import config from '@/config';
import ImageView from '@/components/ImageView';


import { API } from '@config/API';
import cuid from 'cuid';
import styles from "../style.less"
const { Step } = Steps;
const namespace = 'installEquipment'

const dvaPropsData = ({ loading, installEquipment, global, }) => ({
  installPhotoData: installEquipment.installPhotoData,
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  configInfo: global.configInfo,
})

const Index = (props) => {





  const {type, auditPhotoLoading, installPhotoData,} = props;
 

  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);


  useEffect(() => {

  }, []);


  const HandlingSuggesComponents = () => {
    return <Row className='handlingSuggesSty' style={{  width: type==1?'90%':'100%',margin:  type==1? '18px auto' : '18px 0', backgroundColor: '#fff' }}>
      <div style={{ lineHeight: '40px', width: '100%', backgroundColor: '#E8F2FD', paddingLeft: 18, borderTop: '1px solid #BBDAF9' }}>
        处理人意见区
     </div>
      <div style={{ width: '100%', boxShadow: '0px 0px 8px 0px rgba(153,153,153,0.14)', backgroundColor: '#fff',   }}>
        {auditPhotoLoading ?
          <div style={{ padding: 24 }}><Skeleton active avatar paragraph={{ rows: 8 }} /></div>
          :
          <>
            <Row style={{ flex: 1, height: 24 }} />
            {installPhotoData?.OpinionList?.[0] ? installPhotoData?.OpinionList.map((item, index) => {
              return <><div>
                <Row style={{ lineHeight: '40px', padding: '0 24px', backgroundColor: '#F4F5F8' }}>
                  <span style={{ color: '#4D97F3', paddingRight: 24 }}>{item.UserName}</span>   <span style={{ color: item.StatusName == '驳回' ? '#FF5959' : item.StatusName == '申诉' ? '#F89F2D' : '#242425', paddingRight: 24 }}>{item.StatusName}</span>  <span style={{ color: '#999', paddingRight: 24 }}>{item.Time}</span>
                </Row>
                <Row style={{ padding: '12px 24px' }}>
                  <div style={{ width: 'calc(100% - 42px)' }}>
                    {item.Opinion}
                  </div>
                </Row>
              </div>
                <div style={{padding:'0 24px 8px 24px'}}>
                       <Upload
                      listType="picture-card"
                      showUploadList={{ showRemoveIcon: false }}
                      fileList={         
                        item?.FilesList?.ImgList[0]? item.FilesList.ImgList.map((imgItem, index) => {
                            return {
                              uid: index,
                              status: 'done',
                              url: `/${imgItem}`
                            }
                          }) : []
                        }
                      onPreview={file => {
                        setIsImageViewOpen(true);
                        let imageListIndex = 0,imageData=[];
                        item?.FilesList?.ImgList?.map((item, index) => {
                          imageData.push(`/${item}`)
                          if (index === file.uid) {
                            imageListIndex = index;
                           } 
                        });
                        setImageIndex(imageListIndex);
                        setImageList(imageData);
                      }}
                    />
                </div>
              </>
            })
              :
              <Empty />

            }</>
        }
      </div>
    </Row>
  }

  

  return (
    <div className={styles.installEquipmentSty}>
          <HandlingSuggesComponents />
        {/* 查看照片弹窗 */}
        <ImageView
          isOpen={isImageViewOpen}
          images={imageList?.length ? imageList : []}
          imageIndex={imageIndex}
          onCloseRequest={() => {
            setIsImageViewOpen(false);
          }}
          />
    </div>
  );
};
export default connect(dvaPropsData)(Index);