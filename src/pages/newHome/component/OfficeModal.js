import React, { PureComponent } from 'react';
import { Modal, Tabs } from "antd";
import { connect } from 'dva'
import SdlTable from '@/components/SdlTable'
import styles from '../index.less'

const { TabPane } = Tabs;

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
      currentKey: 1
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
    // return <div className={styles.modalFooter}>
    //   <ul>
    //     <li>
    //       <img src="/xj/01.png" alt="" />
    //       <p>历史数据</p>
    //     </li>
    //     <li>
    //       <img src="/xj/02.png" alt="" />
    //       <p>运维记录</p>
    //     </li>
    //     <li>
    //       <img src="/xj/03.png" alt="" />
    //       <p>视频预览</p>
    //     </li>
    //     <li>
    //       <img src="/xj/04.png" alt="" />
    //       <p>报警记录</p>
    //     </li>
    //     <li>
    //       <img src="/xj/05.png" alt="" />
    //       <p>异常数据</p>
    //     </li>
    //     <li>
    //       <img src="/xj/06.png" alt="" />
    //       <p>超标数据</p>
    //     </li>
    //     <li>
    //       <img src="/xj/07.png" alt="" />
    //       <p>基本信息</p>
    //     </li>
    //   </ul>
    // </div>
    return <div className={styles.modalFooter}>
      <ul className={styles.center}>
        <li onClick={() => { this.footerItemClick(1) }}>
          <img src="/xj/01.png" alt="" />
          <p>人员列表</p>
        </li>
        <li onClick={() => { this.footerItemClick(2) }}>
          <img src="/xj/02.png" alt="" />
          <p>备品备件耗材</p>
        </li>
      </ul>
    </div>
  }

  footerItemClick = (key) => {
    this.setState({ currentKey: key })
  }

  render() {
    const { officeVisible, officeUserList, officeStockList, title } = this.props;
    const { columns, columns2, currentKey } = this.state;
    console.log('props=', this.props)
    return (
      <Modal
        title={`${title} - 详情`}
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
            columns={columns2}
            dataSource={officeStockList}
          />
        }
        {/* <Tabs defaultActiveKey="1">
          <TabPane tab="人员列表" key="1">
            <SdlTable
              columns={columns}
              dataSource={officeUserList}
            />
          </TabPane>
          <TabPane tab="备品备件耗材" key="2">
            <SdlTable
              columns={columns2}
              dataSource={officeStockList}
            />
          </TabPane>
        </Tabs> */}

      </Modal>
    );
  }
}

export default OfficeModal;