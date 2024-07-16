/*
*方案及核查信息
*/
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Form, Input, Upload, Tag, Skeleton } from 'antd';
import cuid from 'cuid';
import ImageView from '@/components/ImageView';
import styles from '@/pages/AbnormalIdentifyModel/styles.less';

const dvaPropsData = ({ loading }) => ({
  queryLoading: loading.effects['AbnormalIdentifyModel/GetCheckedView'],
});

const ProgrammeCheck = props => {
  const { dispatch, id, queryLoading } = props;

  useEffect(() => {
    loadData();
  }, []);

  const [dataSource, setDataSource] = useState();
  const loadData = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetCheckedView',
      payload: { id,type:1 },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  const SeeUploadComponents = ({ item }) => {
    return (
      <div>
        <Upload {...seeUploadProps(item ? item : [])} style={{ width: '100%' }} />
      </div>
    );
  };

  const [previewVisible, setPreviewVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0); //预览图片Index
  const [imgUrlList, setImgUrlList] = useState([]); //预览图片列表
  //返回的核查动作图片
  const seeUploadProps = imgList => {
    const imgLists = imgList.map(item => {
      return {
        uid: cuid(),
        status: 'done',
        url: `/${item}`,
      };
    });
    return {
      listType: 'picture-card',
      showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
      onPreview: file => {
        //预览
        const imageList = imgLists;
        let imageListIndex = 0;
        imageList.map((item, index) => {
          if (item.uid === file.uid) {
            imageListIndex = index;
          }
        });
        if (imageList && imageList[0]) {
          //拼接放大的图片地址列表
          const imgData = [];
          imageList.map((item, key) => {
            imgData.push(item.url);
          });
          setImgUrlList(imgData);
        }
        setPhotoIndex(imageListIndex);
        setPreviewVisible(true);
      },
      fileList: imgLists,
    };
  };

  const checkStatus = {
    核查完成: <Tag color="success">核查完成</Tag>,
    待确认: <Tag color="processing">待确认</Tag>,
    待核查: <Tag color="error">待核查</Tag>,
  };
  const isRectificationRecord = dataSource?.checkInfo?.IsRectificationRecord == 1; //需要现场核查
  return (
    <Card
      title={<span style={{ fontWeight: 'bold' }}>方案及核查信息</span>}
      style={{ marginTop: 8 }}
      className={styles.verificationTaskDetailWrapper}
    >
      {queryLoading ? (
        <Skeleton paragraph={{ rows: 4 }} />
      ) : (
          <>
            <Row>
              <Col span={6}>
                <Form.Item label="核查状态">
                  {checkStatus[(dataSource?.checkInfo?.StatusName)] || (
                    <Tag color="volcano">待核查</Tag>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item   className='checkedDesLabel' label="核查结论">{dataSource?.checkInfo?.CheckedDes || '-'}</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="核查人">{dataSource?.checkInfo?.CheckUserName || '-'}</Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="核查时间">{dataSource?.checkInfo?.CheckedTime || '-'}</Form.Item>
              </Col>
            </Row>
            {isRectificationRecord == 1 ? <div><Form.Item label="方案及核查信息" className="programmeLabel">
              <div
                dangerouslySetInnerHTML={{
                  __html: dataSource?.Plan?.ContentBody || '<span>-</span>',
                }}
              ></div>
            </Form.Item>
              <Form  id='checkAction' layout="vertical">
                {dataSource?.Plan?.PlanItem.length ? (
                  <div style={{ fontSize: 16, fontWeight: 'bold', padding: '12px 0 10px 69px' }}>
                    核查动作
                  </div>
                ) : (
                    ''
                  )}
                <div style={{ paddingLeft: 112 }}>
                  {dataSource?.Plan?.PlanItem.map((item, index) => {
                    return (
                      <div style={{ paddingBottom: 12 }}>
                        <Form.Item label={`${index + 1}.${item.QTitle}`}>{item.QContent}</Form.Item>
                        {item.QAttachment?.ImgList?.[0] && (
                          <div>
                            <SeeUploadComponents item={item.QAttachment?.ImgList} />
                          </div>
                        )}
                        <Row>
                         {item.ReContent&&<Col span={12} style={{ paddingRight: 8 }}>
                            <Form.Item label="填写核查结果">{item.ReContent}</Form.Item>
                          </Col>}
                         {item.ReAttachment?.ImgList?.[0]&&<Col span={12}>
                            <div style={{ marginTop: 30 }}>
                              <SeeUploadComponents item={item.ReAttachment.ImgList} />
                            </div>
                          </Col>}
                        </Row>
                      </div>
                    );
                  })}
                </div>
              </Form>
            </div>
              : 
              <>
                <Form.Item label="核查结果与线索是否符合"  >
                  {dataSource?.checkInfo?.CheckedResult}
                </Form.Item>
                <Form.Item label="核查原因" className='programmeLabel2' >
                  <div dangerouslySetInnerHTML={{ __html: dataSource?.checkInfo?.UntruthReason }}></div>
                </Form.Item>
              </>
            }
          </>
        )}
      <ImageView
        isOpen={previewVisible}
        images={imgUrlList?.length ? imgUrlList : []}
        imageIndex={photoIndex}
        onCloseRequest={() => {
          setPreviewVisible(false);
        }}
      />
    </Card>
  );
};

export default connect(dvaPropsData)(ProgrammeCheck);
