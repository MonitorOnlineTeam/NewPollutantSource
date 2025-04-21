import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Empty, Button, message } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import SdlUpload from '@/pages/AutoFormManager/SdlUpload';
import FORM_CONST from './FORM_CONST';
import styles from './styles.less';

const dvaPropsData = ({ loading, task }) => ({});

const CEM = props => {
  const { dispatch, typeID, taskID } = props;
  const [formData, setFormData] = useState({});
  const [formInfo, setFormInfo] = useState({});
  const [formConfig, setFormConfig] = useState(FORM_CONST[typeID].formConfig);
  const [fileList, setFileList] = useState({
    ZFQJZP_PIC: [],
    WHGGDYGZGCZP_PIC: [],
  });

  // 任务信息
  const taskInfo = FORM_CONST[typeID].taskInfo;
  // 基础信息
  const basicInfo = FORM_CONST[typeID].basicInfo;

  useEffect(() => {
    loadData();
  }, [typeID, taskID]);

  const loadData = () => {
    let actionType = '';
    switch (typeID + '') {
      case '76': // 完全抽取法
        actionType = 'GetAllExInspectionRecord';
        break;
      case '77': // 稀释采样法
        actionType = 'GetXSExInspectionRecord';
        break;
      case '78': // 直接测量法
        actionType = 'GetZJExInspectionRecord';
        break;
      case '79': // VOCs
        actionType = 'GetVOCsExInspectionRecord';
        break;
      case '80': // 废水
        actionType = 'GetFSExInspectionRecord';
        break;
    }
    dispatch({
      type: 'task/GetPatrolAllRecord',
      actionType,
      payload: {
        taskID,
        typeID,
      },
      callback: result => {
        let data = result?.[0] || {};
        let RecordList = data?.RecordList?.[0] || {};
        setFormData(RecordList.Data || {});
        setFormInfo({
          ...data.Main,
        });

        // 处理图片
        let ZFQJZP_PIC = [],
          ZFQJZP_AttachID = '',
          WHGGDYGZGCZP_PIC = [],
          WHGGDYGZGCZP_AttachID = '';
        RecordList.ZFQJZP_PIC.ImgList.map((item, index) => {
          ZFQJZP_AttachID = RecordList.ZFQJZP_PIC.AttachID;
          ZFQJZP_PIC.push({
            uid: RecordList.ZFQJZP_PIC.AttachID,
            name: RecordList.ZFQJZP_PIC.ImgNameList[index],
            status: 'done',
            url: `/${item}`,
          });
        });
        RecordList.WHGGDYGZGCZP_PIC.ImgList.map((item, index) => {
          WHGGDYGZGCZP_AttachID = RecordList.WHGGDYGZGCZP_PIC.AttachID;
          WHGGDYGZGCZP_PIC.push({
            uid: RecordList.WHGGDYGZGCZP_PIC.AttachID,
            name: RecordList.WHGGDYGZGCZP_PIC.ImgNameList[index],
            status: 'done',
            url: `/${item}`,
          });
        });
        setFileList({
          ZFQJZP_AttachID,
          ZFQJZP_PIC,
          WHGGDYGZGCZP_AttachID,
          WHGGDYGZGCZP_PIC,
        });
      },
    });
  };

  if (!formConfig.length) {
    return <Empty description="暂无数据" />;
  }

  // 渲染表体
  const renderTableBody = () => {
    const rows = [];

    formConfig.forEach(section => {
      // 将 items 分为普通项和备注项
      const normalItems = section.items.filter(item => !item.type || item.type === 'input');
      const remarkItem = section.items.find(item => item.type === 'textarea');

      // 渲染普通项
      normalItems.forEach((item, index) => {
        const text =
          formData[item.id] === 1 ? '√' : formData[item.id] === 0 ? '×' : formData[item.id];
        const textColor =
          formData[item.id] === 1 ? '#52c41a' : formData[item.id] === 0 ? '#ff4d4f' : '';
        rows.push(
          <tr key={`${section.id}-${item.id}`} style={{ cursor: 'pointer' }}>
            {index === 0 && <td rowSpan={normalItems.length}>{section.title}</td>}
            <td>{item.title}</td>
            <td style={{ color: textColor }}>{text}</td>
            {index === 0 && remarkItem ? (
              <td rowSpan={normalItems.length}>{formData[remarkItem.id]}</td>
            ) : (
              !remarkItem && <td></td>
            )}
          </tr>,
        );
      });
    });

    return rows;
  };

  // 渲染表头信息
  const renderHeaderInfo = () => {
    // 合并 taskInfo 和 basicInfo
    const allInfo = {
      ...taskInfo,
      ...basicInfo,
    };

    const allInfoEntries = Object.entries(allInfo);
    const rows = [];

    // 每行显示4个td（2组）
    for (let i = 0; i < allInfoEntries.length; i += 2) {
      const firstGroup = allInfoEntries[i];
      const secondGroup = allInfoEntries[i + 1];

      // 处理工作时间的特殊显示
      const getValue = key => {
        const value = formInfo[key] || formInfo?.Content?.[key];
        if (key === 'GZSJ') {
          const beginDate = formInfo?.Content?.WorkingDateBegin;
          const endDate = formInfo?.Content?.WorkingDateEnd;
          if (beginDate && endDate) {
            return `${beginDate} ～ ${endDate}`;
          }
          return beginDate || endDate || '';
        }
        return value;
      };

      rows.push(
        <tr key={i}>
          <td>{firstGroup[1]}：</td>
          <td>{getValue(firstGroup[0])}</td>
          {secondGroup ? (
            <>
              <td>{secondGroup[1]}：</td>
              <td>{getValue(secondGroup[0])}</td>
            </>
          ) : (
            <>
              <td></td>
              <td></td>
            </>
          )}
        </tr>,
      );
    }

    return rows;
  };

  // 渲染图片上传组件
  const renderUploadSections = () => {
    return formConfig
      .filter(section => section.items.some(item => item.type === 'upload'))
      .map(section => {
        const uploadItem = section.items.find(item => item.type === 'upload');
        const fileKey = uploadItem.id;
        const fileData = fileList[fileKey + '_PIC'] || [];
        const attachId = fileList[fileKey + '_AttachID'] || '';

        return (
          <div key={section.id} className={styles.uploadSection}>
            <div className={styles.uploadTitle}>{section.title}</div>
            <SdlUpload
              cuid={attachId}
              fileList={fileData}
              // disabled={true}
              accept="image/*"
              isView={true}
            />
          </div>
        );
      });
  };

  // 渲染签名图片
  const renderSignature = () => {
    const signatureSection = formConfig.find(section =>
      section.items.some(item => item.type === 'signature'),
    );

    if (!signatureSection || !formInfo.SignContent) {
      return null;
    }

    return (
      <div className={styles.signatureSection}>
        <div className={styles.signatureTitle}>{signatureSection.title}</div>
        <img src={`${formInfo.SignContent}`} alt="签名" className={styles.signatureImage} />
      </div>
    );
  };

  // 渲染异常情况处理记录
  const renderExceptionRecord = () => {
    const exceptionRecordSection = formConfig.find(section =>
      section.items.some(item => item.type === 'exceptionRecord'),
    );
    //
    // 结果：{
    //     "id": 15,
    //     "title": "异常情况处理记录",
    //     "items": [
    //         {
    //             "id": "ExceptionRecord",
    //             "title": "异常情况处理记录",
    //             "type": "exceptionRecord"
    //         }
    //     ]
    // }
    return (
      <div className={styles.signatureSection}>
        <div className={styles.signatureTitle}>{exceptionRecordSection.title}</div>
        <div className={styles.signatureContent}>
          <div className={styles.signatureImage}>
            {formData[exceptionRecordSection.items[0].id]}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{FORM_CONST[typeID].title}</div>
        <div className={styles.info}>
          <div>
            <span>企业名称：{formInfo?.Content?.EntName}</span>
            <span style={{ marginLeft: 20 }}>排口名称：{formInfo?.Content?.PoingName}</span>
          </div>
          <div>巡检日期：{formInfo?.Content?.InspectionDate}</div>
        </div>
      </div>

      {/* 表头信息 */}
      <table className={styles.headerTable}>
        <tbody>{renderHeaderInfo()}</tbody>
      </table>

      <div className={styles.subtitle}>运行维护内容及处理说明：</div>

      {/* 运行维护内容及处理说明 */}
      <table className={styles.mainTable}>
        <thead>
          <tr>
            <th>项目</th>
            <th>内容</th>
            <th>维护情况</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>

      {/* 图片上传部分 */}
      {renderUploadSections()}

      {/* 签名图片 */}
      {renderSignature()}

      {/* 异常情况处理记录 */}
      {renderExceptionRecord()}
    </div>
  );
};

export default connect(dvaPropsData)(CEM);
