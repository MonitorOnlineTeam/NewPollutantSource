/*
 * @Author: JiaQi
 * @Date: 2024-04-02 11:09:09
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-05-22 14:13:10
 * @Description:  投诉内容详情
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Descriptions, Upload } from 'antd';
import styles from '../../index.less';
import ImageView from '@/components/ImageView';

const dvaPropsData = ({ loading, common }) => ({});

const ViewComplaintContent = props => {
  const { dispatch, onCancel, isModalOpen, data, hideTitle } = props;

  const [fileList, setFileList] = useState([]);
  const [isImageViewOpen, setIsImageViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    let fileList = data.files;
    debugger;
    let imgList = fileList?.ImgList.map((img, index) => {
      return {
        index: index,
        uid: index,
        status: 'done',
        url: `/${img}`,
      };
    });
    setFileList(imgList);
  }, [data]);

  const TitleComponents = props => {
    // position:'sticky',top: 0,zIndex:998,background: '#fff',
    return (
      <div
        style={{
          display: 'inline-block',
          fontWeight: 'bold',
          marginTop: 4,
          padding: '2px 0',
          marginBottom: 12,
          borderBottom: '1px solid rgba(0,0,0,.1)',
        }}
      >
        {props.text}
      </div>
    );
  };

  // 查看图片
  const ViewUploadComponents = () => {
    if (!fileList?.length) {
      return '-';
    }
    return (
      <Upload
        listType="picture-card"
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
        fileList={fileList}
        onPreview={file => {
          setIsImageViewOpen(true);
          setImageIndex(file.index);
          setImageList(fileList.map(item => item.url));
        }}
      ></Upload>
    );
  };
  console.log('fileList', fileList);
  return (
    <>
      <Descriptions
        className={styles.complaintsDetailsWrapper}
        title={hideTitle ? '' : <TitleComponents text="投诉内容" />}
        labelStyle={{ fontWeight: 500 }}
      >
        <Descriptions.Item label="大区名称">{data.ServiceAreaName}</Descriptions.Item>
        <Descriptions.Item label="省份">{data.ProvinceName}</Descriptions.Item>
        <Descriptions.Item label="项目编号">{data.ProjectCode}</Descriptions.Item>
        <Descriptions.Item label="项目名称">{data.ProjectName}</Descriptions.Item>
        <Descriptions.Item label="投诉信息录入人">{data.CreateUserName}</Descriptions.Item>
        <Descriptions.Item label="投诉信息录入时间">{data.CreateTime}</Descriptions.Item>
        <Descriptions.Item label="接收投诉日期">{data.ReceiveComplaintDate}</Descriptions.Item>
        <Descriptions.Item label="被投诉人">{data.Complainant}</Descriptions.Item>
        <Descriptions.Item label="投诉单位名称">{data.ComplaintCompanyName}</Descriptions.Item>
        <Descriptions.Item label="投诉客户名称">{data.ComplaintCustomerName}</Descriptions.Item>
        <Descriptions.Item label="投诉客户联系方式">
          {data.ComplaintCustomerPhone}
        </Descriptions.Item>
        <Descriptions.Item label="投诉方式">{data.ComplaintMethods}</Descriptions.Item>
        <Descriptions.Item label="投诉问题内容" span={3}>
          {data.ProblemDescription}
        </Descriptions.Item>
        <Descriptions.Item label="附件" span={3}>
          <ViewUploadComponents />
        </Descriptions.Item>
      </Descriptions>

      {/* 查看附件弹窗 */}
      <ImageView
        isOpen={isImageViewOpen}
        images={imageList}
        imageIndex={imageIndex}
        onCloseRequest={() => {
          setIsImageViewOpen(false);
        }}
      />
    </>
  );
};

export default connect(dvaPropsData)(ViewComplaintContent);
