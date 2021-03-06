import React, { PureComponent } from 'react'
import styles from './index.less';
import { Input, Button, Divider, Row, Col, Card, message, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import { connect } from 'dva'
import KBSMoreModal from './KBSMoreModal'
import OpenFileModal from './OpenFileModal'

const fileTypeMap = {
  "1": "法律法规",
  "2": "流程",
  "3": "疑难问题",
  "4": "其他",
}

@connect(({ KBS, loading }) => ({
  KBSData: KBS.KBSData,
  viewFileModalVisible: KBS.viewFileModalVisible,
  KBSMoreModalVisible: KBS.KBSMoreModalVisible,
}))
class Knowledge extends PureComponent {
  state = {
    keyword: "",
    searchParams: [],
  }

  componentDidMount() {
    this.getKBSData()
  }

  getKBSData = () => {
    this.props.dispatch({
      type: "KBS/getKBSData",
      payload: {
        Name: this.state.keyword
      }
    })
  }

  updViewForKBM = (id, type) => {
    this.props.dispatch({
      type: "KBS/updViewForKBM",
      payload: {
        ID: id,
        Type: type
      }
    })
  }

  onDownload = (data) => {
    if (data.File) {
      this.updViewForKBM(data.ID, "down")
      window.open(`/upload/${data.File}`);
    } else {
      message.error("文件不存在！")
    }
  }

  onOpenViewFileModal = () => {
    // this.props.dispatch({
    //   type: "KBS/updateState",
    //   payload: {
    //     viewFileModalVisible: true
    //   }
    // })
    this.setState({
      visible: true
    })

  }

  onViewFile = (data) => {
    let file = data["File"]
    if (file) {
      let fileName = file;
      if (fileName) {
        let suffix = fileName.split(".")[1];
        this.setState({
          fileType: suffix,
          filePath: fileName
        }, () => {
          this.onOpenViewFileModal()
        })
        let id = data["dbo.T_Bas_Repository.ID"];
        this.updViewForKBM(id, "view")
      } else {
        message.error("文件不存在！")
      }
    } else {
      message.error("文件不存在！")
    }
  }

  render() {
    const { KBSData, KBSMoreModalVisible, viewFileModalVisible } = this.props;
    const { searchParams, fileType, filePath, visible } = this.state;
    return (
      <div>
        <div className={styles.banner}>
          <h1>污染源质控云中心</h1>
          <div className={styles.inputContainer}>
            {/* <img src="/u230.png" alt="" /> */}
            <Input className={styles.input} placeholder="请输入关键字搜索" allowClear onChange={(e) => { this.setState({ keyword: e.target.value }) }} />
            <Divider type="vertical" style={{ height: "100%" }} />
            <Button type="link" onClick={() => this.getKBSData()}>搜索</Button>
          </div>
        </div>
        <Row style={{ paddingTop: "240px", justifyContent: "center" }}>
          {
            Object.keys(KBSData).map(key => {
              return <Col className={styles.cardItem} style={{ width: 300 }} >
                <Card
                  size="small"
                  title={<span style={{ color: "#1890FF" }}>{fileTypeMap[key]}</span>}
                  bodyStyle={{ height: 184, padding: "12px 20px" }}
                >
                  {
                    KBSData[key].map((item, index) => {
                      if (index < 4) {
                        return <div className={styles.fileItem}>
                          <img src="/u236.png" alt="" />
                          <p title="查看" style={{ cursor: 'pointer' }} onClick={() => { this.onViewFile(item) }}>{item.Name}</p>
                          <a href={`/upload/${item.File}`} download onClick={(e) => {
                            e.stopPropagation()
                            if (item.File) {
                              this.updViewForKBM(item.ID, "down")
                              // window.open(`/upload/${data.File}`);
                            } else {
                              message.error("文件不存在！");
                              return;
                            }
                          }}>
                            <DownloadOutlined className={styles.download} />
                          </a>

                        </div>
                      }
                    })
                  }

                  <Button size="small" style={{ marginTop: 4 }} shape="round" onClick={() => {
                    this.setState({
                      searchParams: [{ "Key": "dbo__T_Bas_Repository__RepositoryType", "Value": key, "Where": "$=" }]
                    }, () => {
                      this.props.dispatch({
                        type: "KBS/updateState",
                        payload: {
                          KBSMoreModalVisible: true
                        }
                      })
                    })
                  }}>更多</Button>
                </Card>
              </Col>
            })
          }
        </Row>
        {KBSMoreModalVisible && <KBSMoreModal searchParams={searchParams} />}
        {visible && <OpenFileModal fileType={fileType} filePath={filePath} onClose={() => {
          this.setState({
            visible: false
          })
        }} />}
      </div>
    );
  }
}

export default Knowledge;