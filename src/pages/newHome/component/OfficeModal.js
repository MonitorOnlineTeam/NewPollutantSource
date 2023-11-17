import React, { PureComponent } from 'react';
import { Modal, Tabs, Descriptions, Divider } from "antd";
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import styles from '../index.less'
import SdlMap from '@/pages/AutoFormManager/SdlMap'
const { TabPane } = Tabs;
const tabList = ["人员列表", "备品备件耗材", "基本信息"];


@connect(({ loading, newHome }) => ({
  officeVisible: newHome.officeVisible,
  officeUserList: newHome.officeUserList,
  officeStockList: newHome.officeStockList,
}))
class OfficeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '姓名',
          dataIndex: 'User_Name',
        },
        {
          title: '电话',
          dataIndex: 'Phone',
        },
        {
          title: '性别',
          dataIndex: 'User_Sex',
          render: (text, record) => {
            return text !== undefined ? (text === 1 ? "男" : "女") : "-"
          }
        },
        {
          title: '邮箱',
          dataIndex: 'Email',
        },
      ],
      columns2: [
        {
          title: '备件名称',
          dataIndex: 'PartName',
          key: 'PartName',
          width: 150,
          align: 'center',
        },
        {
          title: '备件型号',
          dataIndex: 'Code',
          key: 'Code',
          width: 150,
          align: 'center',
        },
        {
          title: '编码',
          dataIndex: 'PartCode',
          key: 'PartCode',
          width: 130,
          align: 'center',
        },
        {
          title: '单位',
          dataIndex: 'Unit',
          key: 'Unit',
          width: 80,
          align: 'center',
        },
        {
          title: '设备类型',
          dataIndex: 'EquipmentType',
          key: 'EquipmentType',
          width: 80,
          align: 'center',
          render: (text, row, index) => {
            switch (text) {
              case '1':
                text = "废水";
                break;
              case '2':
                text = "废气";
                break;
              case '5':
                text = "环境质量";
                break;
              case '10':
                text = "VOC";
                break;
              case '12':
                text = "扬尘";
                break;
            }
            return text;
          },
        },
        {
          title: '状态',
          dataIndex: 'IsUsed',
          key: 'IsUsed',
          width: 80,
          align: 'center',
          render: (text, row, index) => {
            switch (text) {
              case 0:
                text = "禁用";
                break;
              case 1:
                text = "启用";
                break;
            }
            return text;
          },
        },
        {
          title: '数量',
          dataIndex: 'Quantity',
          key: 'Quantity',
          width: 100,
          align: 'center',
          sorter: {
            compare: (a, b) => a.Quantity - b.Quantity,
          },
        },
        {
          title: '服务站名称',
          dataIndex: 'SparePartsStationName',
          key: 'SparePartsStationName',
          width: 130,
          align: 'center',
        },
      ],
      currentKey: 1,
      itemTitle: "人员列表",
    };
  }


  close = () => {
    this.props.dispatch({
      type: "newHome/updateState",
      payload: {
        officeVisible: false,
      }
    })
  }

  renderModalFooter = () => {
    return <div className={styles.modalFooter}>
      <ul className={styles.center}>
        {
          tabList.map((item, index) => {
            return <li onClick={() => { this.footerItemClick(index) }}>
              <img src={item === "基本信息" ? `/xj/07.png` : `/xj/0${index + 1}.png`} alt="" />
              <p>{item}</p>
            </li>
          })
        }
        {/* <li onClick={() => { this.footerItemClick(1) }}>
          <img src="/xj/01.png" alt="" />
          <p>人员列表</p>
        </li>
        <li onClick={() => { this.footerItemClick(2) }}>
          <img src="/xj/02.png" alt="" />
          <p>备品备件耗材</p>
        </li> */}
      </ul>
    </div>
  }

  footerItemClick = (key) => {
    this.setState({ currentKey: key + 1, itemTitle: tabList[key] })
  }

  render() {
    const { officeVisible, officeUserList, officeStockList, title, SparePartsStationInfo } = this.props;
    const { columns, columns2, currentKey, itemTitle } = this.state;
    return (
      <Modal
        title={`${title} - ${itemTitle}`}
        // visible={this.props.officeVisible}
        className={styles.detailsModal}
        visible={true}
        destroyOnClose
        footer={this.renderModalFooter()}
        width={"70%"}
        bodyStyle={{ paddingBottom: 0 }}
        // style={{ height: "70vh" }}
        onCancel={this.close}
      >
        <div style={{ height: "60vh", overflow: 'auto' }}>
          {
            currentKey === 1 && <SdlTable
              className="notBorder"
              bordered={false}
              columns={columns}
              dataSource={officeUserList}
            />
          }
          {
            currentKey === 2 && <SdlTable
              className="notBorder"
              bordered={false}
              scroll={{ y: "calc(60vh - 96px)" }}
              columns={columns2}
              dataSource={officeStockList}
            />
          }
          {
            currentKey === 3 &&
            <div style={{ height: "60vh", overflow: 'auto' }}>
              <div className={styles.basisInfo}>
                <div>
                  <img src={"/fuwuzhan.jpg"} alt="" width="100%" />
                </div>
                <div>
                  <Descriptions title={SparePartsStationInfo ? SparePartsStationInfo.Name : null}>
                    <Descriptions.Item span={3} label="地址">{SparePartsStationInfo ? SparePartsStationInfo.Address : null}</Descriptions.Item>
                    <Descriptions.Item span={1.5} label="经度">{SparePartsStationInfo ? SparePartsStationInfo.Longitude : null}</Descriptions.Item>
                    <Descriptions.Item span={1.5} label="纬度">{SparePartsStationInfo ? SparePartsStationInfo.Latitude : null}</Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
              <Divider />
              <SdlMap
                mode="map"
                longitude={SparePartsStationInfo ? SparePartsStationInfo.Longitude : null}
                latitude={SparePartsStationInfo ? SparePartsStationInfo.Latitude : null}
                handleMarker={true}
                handlePolygon={true}
                style={{ height: 450 }}
                zoom={12}
              />
            </div>
          }
        </div>
      </Modal>
    );
  }
}

export default OfficeModal;
