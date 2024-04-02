/**
 * 功  能：设备安装审核 设备安装规范性
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
const namespace = 'installaEquipment'

const dvaPropsData = ({ loading, installaEquipment, global, }) => ({
  installPhotoData: installaEquipment.installPhotoData,
  auditPhotoLoading: loading.effects[`${namespace}/GetAuditPhoto`],
  configInfo: global.configInfo,
})

const Index = (props) => {





  const { auditPhotoLoading, installPhotoData,} = props;
 

  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);


  useEffect(() => {

  }, []);




  const ViewPhotosComponents = () => {
    return <Row className='seePhotoSty'>
      {auditPhotoLoading ?
        <Skeleton active avatar paragraph={{ rows: 8 }} />
        :
        <>{installPhotoData?.PhotosList?.[0] ? installPhotoData.PhotosList.map((item, index) => {
          return <Col span={6} style={{ padding: '0 18px 14px 0' }}>
            <div style={{ padding: '12px 0 12px 12px', borderRadius: 8, boxShadow: '0px 0px 16px 0px rgba(153,153,153,0.16)' }}>
              <Row align='middle'>
                <Image preview={false} src={`/ctInstallaEquipmentImg/installPhotos/${index}.png`} />
                <div style={{ paddingLeft: 8, width: 'calc(100% - 58px)' }}>
                  <div style={{ fontSize: 16, fontWeight: 400 }} className='textOverflow'>{item.Name}</div>
                <div className='textOverflow'>备注：{item.Remark ? 
                   <Tooltip placement="bottomLeft" title={item.Remark}>{item.Remark}</Tooltip> 
                   :
                   '无'}</div>
                </div>
                <Row style={{ marginTop: 4, width:'100%' }}>
                       <Upload
                      listType="picture-card"
                      showUploadList={{ showRemoveIcon: false }}
                      fileList={         
                        item?.FilesList?.ImgList?.[0]? item.FilesList.ImgList.map((imgItem, index) => {
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
                </Row>

              </Row>
            </div>
          </Col>

        })
          :
          <Empty />

        }</>
      }
    </Row>
  }
  

  return (
    <div className={styles.installaEquipmentSty}>
          <ViewPhotosComponents />
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