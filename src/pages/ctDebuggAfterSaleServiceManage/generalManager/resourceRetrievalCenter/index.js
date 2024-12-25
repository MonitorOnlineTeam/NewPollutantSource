/*
 * @Author: outman0611
 * @Date: 2024-10-11 14:38:13
 * @LastEditors: outman0611
 * @LastEditTime: 2024-12-10 16:35:18
 * @Description: 通用管理 问题检索中心
 */
import React, { useState, useEffect, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Spin,
  Form,
  Typography,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import {
  PlusOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SerachInputComponents from './SerachInputComponents';
import styles from './style.less';
import router from 'umi/router';
import { useLocation } from 'umi';
const { Option } = Select;
const { Search } = Input;
const namespace = 'generalManager';

const dvaPropsData = ({ loading, generalManager, global }) => ({
  configInfo: global.configInfo,
  resourceRetrievalCenterSelectIndex:generalManager.resourceRetrievalCenterSelectIndex
});



const Index = props => {


  const placeholderCorres = {
    0: '请输入专家信息，如专家姓名、联系方式、设备型号',
    1: '请输入资源类别、标题',
    2: '请输入问题类别、名称、描述',
  }
  const { resourceRetrievalCenterSelectIndex } = props;
  const [selectIndex, setSelectIndex] = useState(resourceRetrievalCenterSelectIndex ||  0)
  const [searchPlaceholder, setSearchPlaceholder] = useState(placeholderCorres[selectIndex])



  const typeChange = (index) => {
    setSelectIndex(index)
    setSearchPlaceholder(placeholderCorres[index])

  }
  const onClick = () => {
    // switch (selectIndex) {
    //   case 0:
    //     router.push({ pathname: '/ctManage/generalManager/resourceRetrievalCenter/expertInfo', query: { placeholder: searchPlaceholder,selectIndex:selectIndex } })
    //     break;
    //   case 1:
    //     router.push({ pathname: '/ctManage/generalManager/resourceRetrievalCenter/resourceInfo', query: { placeholder: searchPlaceholder,selectIndex:selectIndex  } })
    //     break;
    //   case 2:
    //     router.push({ pathname: '/ctManage/generalManager/resourceRetrievalCenter/problemsSolutions', query: { placeholder: searchPlaceholder,selectIndex:selectIndex  } })
    //     break;
    // }
    router.push({ pathname: '/ctManage/generalManager/resourceRetrievalCenter/detail', query: { placeholder: JSON.stringify(placeholderCorres),selectIndex:selectIndex  } })
    
  }
  const typeList = [
    { title: '专家信息', url: '/generalManager/zjxx.png' },
    { title: '资源信息', url: '/generalManager/cyxx.png' },
    { title: '问题及解决方案', url: '/generalManager/jjfa.png' },
  ]
  const intervalNum = 16


  return (
    <BreadcrumbWrapper>
      <div className={`${styles.resourceRetrievalCenterSty}`}>
        <div className={`${styles.resourceBg}`}>
          <div>
            <p style={{ fontSize: 70 }}>资 源 检 索 中 心</p>
            <p style={{ fontSize: 28 }}>R e s o u r c e &nbsp;&nbsp; R e t r i e v a l  &nbsp;&nbsp;C e n t e r</p>
          </div>
        </div>
        <Row justify='center' style={{ paddingTop: intervalNum }}>
          {typeList.map((item, index) =>
            (<Col span={5} onClick={() => { typeChange(index) }} style={{ textAlign: 'center', padding: index == 1 && `0 ${intervalNum}px` }}>
              <Card className={`${styles.cardSty} ${styles.centerCardSty}`} hoverable bordered={false} style={{ backgroundColor: selectIndex == index ? '#4C91E7' : '#FFFFFF', }}>
                <img src={item.url} />
                <div style={{ fontSize: 24, color: selectIndex == index ? '#FFFFFF' : '#333', }}>{item.title}</div>
              </Card>
            </Col>

            ))}
          <div style={{ width: '62.5%', textAlign: 'center' }} onClick={onClick}>
            <SerachInputComponents
              placeholder={searchPlaceholder}
              style={{ width: '100%', marginTop: 16 }}
            />
          </div>
        </Row>

      </div>
    </BreadcrumbWrapper>
  );
};
export default connect(dvaPropsData)(Index);
