import { Card, WhiteSpace, DatePicker, WingBlank, Badge, Modal, List } from 'antd-mobile';
import { Upload } from 'antd';
import React, { PureComponent } from 'react';
import ReactModal from 'react-modal';
import { connect } from 'dva';
import Lightbox from 'react-image-lightbox-rotate';
import 'react-image-lightbox/style.css';
import { router } from 'umi';
import { Spin } from 'antd';
const Item = List.Item;
@connect(({ task, loading }) => ({
  loading: loading.effects['task/GetOperationFormDetail'],
  OperationFormDetail: task.OperationFormDetail,
  TaskDitailsAttachmentList: task.TaskDitailsAttachmentList,
}))

/*
页面：扫码查运维页面(详情)
*/
class OperationFormDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewVisibleAttach: false,
      photoIndex: 0,
      photoIndexAttach: 0,
    };
  }
  componentWillMount() {
    ReactModal.setAppElement(document.body);
  }
  componentDidMount() {
    this.reloaddata();
    this.GetTaskDitailsAttachment();
  }
  //获取任务详情
  reloaddata = () => {
    this.props.dispatch({
      type: 'task/GetOperationFormDetail',
      payload: {
        TaskID: this.props.match.params.TaskID,
      },
    });
  };
  //处理记录图片列表
  GetTaskDitailsAttachment = () => {
    this.props.dispatch({
      type: 'task/GetTaskDitailsAttachment',
      payload: {
        TaskID: this.props.match.params.TaskID,
      },
    });
  };
  handlePreview = (file, images) => {
    let ImageList = 0;
    images.map((item, index) => {
      if (item.uid === file.uid) {
        ImageList = index;
      }
    });
    this.setState({
      previewVisible: true,
      // previewImage: file.url,
      photoIndex: ImageList,
    });
  };
  handlePreviewAttachment = (file, images) => {
    let ImageListAttachment = 0;
    images.map((item, index) => {
      if (item.uid === file.uid) {
        ImageListAttachment = index;
      }
    });
    this.setState({
      previewVisibleAttach: true,
      // previewImage: file.url,
      photoIndexAttach: ImageListAttachment,
    });
  };
  //跳转运维任务
  backPages = () => {
    router.push(`/appoperation/scanningCode/${this.props.match.params.DGIMN}`);
  };
  render() {
    const { OperationFormDetail, TaskDitailsAttachmentList } = this.props;
    const { photoIndex, photoIndexAttach } = this.state;
    let index = 0;
    let ShowTaskDitailsAttachmentList = [];
    const UrlTaskDitailsAttachmentList = [];
    if (TaskDitailsAttachmentList) {
      TaskDitailsAttachmentList.map((item, key) => {
        index++;
        ShowTaskDitailsAttachmentList.push({
          uid: index,
          name: item.replace('_thumbnail', ''),
          status: 'done',
          url: `/upload/${item}`,
        });
        UrlTaskDitailsAttachmentList.push(`/upload/${item}`);
      });
    }

    const upload = {
      showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
      listType: 'picture-card',
      fileList: [...ShowTaskDitailsAttachmentList],
    };

    let indexAttachment = 0;
    let ShowAttachment = [];
    const URLattachment = [];
    if (
      OperationFormDetail &&
      OperationFormDetail[0] &&
      OperationFormDetail[0].Attachments &&
      OperationFormDetail[0].Attachments.ThumbimgList &&
      OperationFormDetail[0].Attachments.ThumbimgList.length !== 0
    ) {
      OperationFormDetail[0].Attachments.ThumbimgList.map((item, key) => {
        indexAttachment++;
        ShowAttachment.push({
          uid: indexAttachment,
          name: item.replace('_thumbnail', ''),
          status: 'done',
          url: `/upload/${item}`,
        });
        URLattachment.push(`/upload/${item}`);
      });
    }

    const uploadAttachment = {
      showUploadList: { showPreviewIcon: true, showRemoveIcon: false },
      listType: 'picture-card',
      fileList: [...ShowAttachment],
    };
    if (this.props.loading) {
      return (
        <Spin
          style={{
            width: '100%',
            height: 'calc(100vh)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size="large"
        />
      );
    }
    return (
      <Card full style={{ height: '100vh', overflow: 'scroll' }}>
        <Card.Header
          title={
            <span>
              <span style={{ fontSize: 15 }}>任务详情</span>
            </span>
          }
          extra={
            <div style={{ height: 25, width: 90, marginTop: 4, float: 'right' }}>
              <div
                style={{
                  float: 'right',
                  display: 'block',
                  width: 15,
                  height: 15,
                  marginLeft: 8,
                  backgroundImage:
                    'url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMjYnIHZpZXdCb3g9JzAgMCAxNiAyNicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMiAwTDAgMmwxMS41IDExTDAgMjRsMiAyIDE0LTEzeicgZmlsbD0nI0M3QzdDQycgZmlsbC1ydWxlPSdldmVub2RkJy8+PC9zdmc+)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '50% 50%;',
                  marginTop: 3,
                }}
              ></div>
              <div arrow="horizontal" style={{ fontSize: 15, float: 'right' }}>
                <span
                  style={{ fontSize: 15 }}
                  onClick={() => {
                    this.backPages();
                  }}
                >
                  返回
                </span>{' '}
              </div>
            </div>
          }
        />
        <Card.Body>
          <List renderHeader={() => '基本信息'} className="my-list">
            <Item>
              <span style={{ fontSize: 13 }}>
                {' '}
                任务单号：
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].TaskCode
                  : null}
              </span>
            </Item>
            <Item>
              <span style={{ fontSize: 13 }}>
                {' '}
                监控标：
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].EnterpriseName
                  : null}
              </span>
            </Item>
            <Item>
              <span style={{ fontSize: 13 }}>
                {' '}
                监测点名称：
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].PointName
                  : null}
              </span>
            </Item>
            <Item>
              <span style={{ fontSize: 13 }}>
                {' '}
                任务来源：
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].TaskFromText
                  : null}
              </span>
            </Item>
            <Item>
              <span style={{ fontSize: 13 }}>
                {' '}
                任务状态：
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].TaskStatusText
                  : null}
              </span>
            </Item>
            <Item>
              <span style={{ fontSize: 13 }}>
                {' '}
                任务类型：
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].TaskTypeText
                  : null}
              </span>
            </Item>
            <Item>
              <span style={{ fontSize: 13 }}>
                {' '}
                创建人：
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].CreateUserName
                  : null}
              </span>
            </Item>
            <Item>
              <span style={{ fontSize: 13 }}>
                {' '}
                创建时间：
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].CreateTime
                  : null}
              </span>
            </Item>
          </List>
          <List renderHeader={() => '处理说明'} className="my-list">
            <Item wrap>
              <span style={{ fontSize: 13 }}>
                {OperationFormDetail && OperationFormDetail.length > 0
                  ? OperationFormDetail[0].TaskDescription
                  : null}
              </span>
            </Item>
          </List>
          <List renderHeader={() => '处理记录'}>
            <Item>
              <Upload
                {...upload}
                onPreview={file => {
                  this.handlePreview(file, ShowTaskDitailsAttachmentList);
                }}
              />
            </Item>
          </List>
          <List renderHeader={() => '附件'}>
            <Item>
              <Upload
                {...uploadAttachment}
                onPreview={file => {
                  this.handlePreviewAttachment(file, ShowAttachment);
                }}
              />
            </Item>
          </List>
        </Card.Body>
        {/* 处理记录 */}
        {this.state.previewVisible && (
          <Lightbox
            mainSrc={UrlTaskDitailsAttachmentList[photoIndex]}
            nextSrc={
              UrlTaskDitailsAttachmentList[(photoIndex + 1) % UrlTaskDitailsAttachmentList.length]
            }
            prevSrc={
              UrlTaskDitailsAttachmentList[
                (photoIndex + UrlTaskDitailsAttachmentList.length - 1) %
                  UrlTaskDitailsAttachmentList.length
              ]
            }
            onCloseRequest={() => this.setState({ previewVisible: false })}
            onPreMovePrevRequest={() =>
              this.setState({
                photoIndex:
                  (photoIndex + UrlTaskDitailsAttachmentList.length - 1) %
                  UrlTaskDitailsAttachmentList.length,
              })
            }
            onPreMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % UrlTaskDitailsAttachmentList.length,
              })
            }
          />
        )}
        {/* 附件 */}
        {this.state.previewVisibleAttach && (
          <Lightbox
            mainSrc={URLattachment[photoIndexAttach]}
            nextSrc={URLattachment[(photoIndexAttach + 1) % URLattachment.length]}
            prevSrc={
              URLattachment[(photoIndexAttach + URLattachment.length - 1) % URLattachment.length]
            }
            onCloseRequest={() => this.setState({ previewVisibleAttach: false })}
            onPreMovePrevRequest={() =>
              this.setState({
                photoIndexAttach:
                  (photoIndexAttach + URLattachment.length - 1) % URLattachment.length,
              })
            }
            onPreMoveNextRequest={() =>
              this.setState({
                photoIndexAttach: (photoIndexAttach + 1) % URLattachment.length,
              })
            }
          />
        )}
      </Card>
    );
  }
}

export default OperationFormDetail;
