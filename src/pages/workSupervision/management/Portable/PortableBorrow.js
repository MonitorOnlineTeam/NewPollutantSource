import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import {
  Card,
  Col,
  Row,
  Button,
  Space,
  Select,
  DatePicker,
  message,
  Tag,
  Radio,
  Tooltip,
  Divider,
  Popconfirm,
} from 'antd';
import { ExportOutlined, ImportOutlined, FileTextOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import StandbyRecordModal from './PortableRecordModal';

import Cookie from 'js-cookie';

const CONFIGID = 'T_Bas_PortableInstrument';
const dvaPropsData = ({ loading, autoform }) => ({
  autoform: autoform,
});

const PortableBorrow = props => {
  const { dispatch } = props;
  const [visible, setVisible] = useState(false);
  const [insCode, setInsCode] = useState('');

  useEffect(() => {
  }, []);

  // 关闭使用记录弹窗
  const onHandleCancel = () => {
    setVisible(false);
  };

  // 借出、归还
  const onHandle = row => {
    const ID = row['dbo.T_Bas_PortableInstrument.ID'];
    dispatch({
      type: 'wordSupervisionManage/StandbyAndInsLendOrReturn',
      payload: {
        ID,
        type: 0,
      },
      callback: () => {
        dispatch({
          type: 'autoForm/getAutoFormData',
          payload: {
            configId: CONFIGID,
          },
        });
      },
    });
  };

  return (
    <BreadcrumbWrapper>
      <Card>
        <SearchWrapper configId={CONFIGID} />
        <AutoFormTable
          noload
          getPageConfig
          handleMode="modal"
          style={{ marginTop: 10 }}
          configId={CONFIGID}
          isFixedOpera
          isCenter
          hideBtns
          appendHandleRows={row => {
            return (
              <>
                {row['dbo.T_Bas_PortableInstrument.UseState'] === 0 ? (
                  <Tooltip title="借出">
                    <Popconfirm title="确认是否借出?" onConfirm={() => onHandle(row)}>
                      <a>
                        <ExportOutlined style={{ fontSize: 16 }} />
                      </a>
                    </Popconfirm>
                  </Tooltip>
                ) : (
                  <Tooltip title="归还">
                    <Popconfirm title="确认是否归还?" onConfirm={() => onHandle(row)}>
                      <a>
                        <ImportOutlined style={{ fontSize: 16 }} />
                      </a>
                    </Popconfirm>
                  </Tooltip>
                )}
                <Divider type="vertical" />
                <Tooltip title="查看使用记录">
                  <a
                    onClick={() => {
                      setVisible(true);
                      setInsCode(row['dbo.T_Bas_PortableInstrument.InsCode']);
                    }}
                  >
                    <FileTextOutlined style={{ fontSize: 16 }} />
                  </a>
                </Tooltip>
              </>
            );
          }}
        />
        <StandbyRecordModal visible={visible} onCancel={onHandleCancel} insCode={insCode} />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(PortableBorrow);
