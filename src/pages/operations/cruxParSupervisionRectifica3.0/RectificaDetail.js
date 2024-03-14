/**
 * 功  能：督查管理
 * 创建人：jab
 * 创建时间：2022.04.25
 */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Table, Input, InputNumber, Upload, Popconfirm, Form, Tabs, Checkbox, Typography, Card, Button, Select, Progress, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, LoadingOutlined, DownOutlined, ExportOutlined, QuestionCircleOutlined, ProfileOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import { getBase64, } from '@/utils/utils';
import styles from "./style.less"
import Cookie from 'js-cookie';
import cuid from 'cuid';
import Lightbox from "react-image-lightbox-rotate";
import ImageView from '@/components/ImageView';
import "react-image-lightbox/style.css";
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
import { API } from '@config/API';
import config from '@/config';
import { uploadPrefix } from '@/config'


const namespace = 'cruxParSupervisionRectifica'




const dvaPropsData = ({ loading, cruxParSupervisionRectifica, global, common }) => ({
  detailList: cruxParSupervisionRectifica.detailList,
  tableLoading: loading.effects[`${namespace}/getZGCheckInfoList`],
  updZGRangeCheckLoading: loading.effects[`${namespace}/updZGRangeCheck`],
  updZGCouCheckLoading: loading.effects[`${namespace}/updZGCouCheck`],
  updZGParamCheckLoading: loading.effects[`${namespace}/updZGParamCheck`],
  keyPollutantListLoading: loading.effects[`${namespace}/getKeyPollutantList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    deleteAttach: (file) => { //删除照片
      dispatch({
        type: "autoForm/deleteAttach",
        payload: {
          Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
        }
      })
    },
    getZGCheckInfoList: (payload, callback) => {//详情
      dispatch({
        type: `${namespace}/getZGCheckInfoList`,
        payload: payload,
        callback: callback,
      })
    },
    updZGRangeCheck: (payload, callback) => { //量程一致性核查整改
      dispatch({
        type: `${namespace}/updZGRangeCheck`,
        payload: payload,
        callback: callback
      })
    },
    updZGCouCheck: (payload, callback) => { //数据一致性核查整改
      dispatch({
        type: `${namespace}/updZGCouCheck`,
        payload: payload,
        callback: callback
      })
    },
    updZGParamCheck: (payload, callback) => { //参数一致性核查整改
      dispatch({
        type: `${namespace}/updZGParamCheck`,
        payload: payload,
        callback: callback
      })
    },
    judgeConsistencyRangeCheck: (payload, callback) => { //量程一致性检查 自动判断
      dispatch({
        type: `remoteSupervision/judgeConsistencyRangeCheck`,
        payload: payload,
        callback: callback,
      })
    },
    judgeConsistencyCouCheck: (payload, callback) => { //数据一致性检查 自动判断
      dispatch({
        type: `remoteSupervision/judgeConsistencyCouCheck`,
        payload: payload,
        callback: callback,
      })
    },
    judgeParamCheck: (payload, callback) => { //参数一致性检查 自动判断
      dispatch({
        type: `remoteSupervision/judgeParamCheck`,
        payload: payload,
        callback: callback,
      })
    },
    getKeyPollutantList: (payload, callback) => { //数据量程一致性核查整改 单位
      dispatch({
        type: `${namespace}/getKeyPollutantList`,
        payload: payload,
        callback: callback,
      })
    },





  }
}




const Index = (props) => {

  const { detailList, tableLoading, id, pollutantType, rectificaDetailType, infoData, updZGRangeCheckLoading, updZGCouCheckLoading, updZGParamCheckLoading, keyPollutantListLoading } = props;
  const [selectIndex, setSelectIndex] = useState();
  const [popVisble, setPopVisble] = useState(false);
  const [rangform] = Form.useForm();
  const [dataform] = Form.useForm();
  const [parform] = Form.useForm();
  const [rejectform] = Form.useForm();
  const [couUpload, setCouUpload] = useState()

  useEffect(() => {
    props.getZGCheckInfoList({ id: id })
  }, []);

  const TitleComponents = (props) => {
    return <div style={{ display: 'inline-block', fontWeight: 'bold', padding: '2px 4px', marginBottom: 16, borderBottom: '1px solid rgba(0,0,0,.1)' }}>{props.text}</div>

  }

  const getAttachmentData = (fileInfo) => {
    setPreviewVisible(true)
    const fileList = [];
    fileInfo.map((item, index) => {
      if (!item.IsDelete) {
        fileList.push(`${uploadPrefix}/${item.FileName}`)
      }
    })
    setPhotoIndex(0)
    setImgUrlList(fileList)
  }

  const unitFormat = (record) => {
    return record.Col1 && record.Col1.split(',').map((item, index) => {
      if (record.Name == '流速' && record.isDisplay == 3) { //差压法
        if (index <= 1) { //只取前两个
          return <Option value={item}>{item}</Option>
        }
      } else if (record.Name == '流速' && (record.isDisplay == 4 || !record.isDisplay)) { //直测流速法 或 实时数据一致性核查表 
        if (index > 1) { //只取最后一个
          return <Option value={item}>{item}</Option>
        }
      } else {
        return <Option value={item}>{item}</Option>
      }
    })
  }
  const commonCol1 = [
    {
      title: '序号',
      align: 'center',
      dataIndex: 'Sort',
      key: 'Sort',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '监测参数',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 200,
    },
  ]
  const commonCol2 = (type) => [
    {
      title: '手工修正结果',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 120,
      render: (text, record, index) => {
        if (text === 'NOx' || text === '标干流量') {
          return '—'
        } else {
          let statusData = type == 1 ? record.RangeStatus : type == 2 ? record.CouStatus : record.Uniformity;
          return statusData == 1 ? '是' : statusData == 2 ? '否' : statusData == 3 ? '不适用' : statusData == 4 ? '不规范' : null
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'StatusName',
      key: 'StatusName',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <span style={{ color: text == '整改未通过' || text == '申诉未通过' ? '#f5222d' : text == '整改通过' || text == '申诉通过' ? '#52c41a' : '' }}>{text}</span>

      }
    },
    {
      title: '核查结果',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (text === 'NOx' || text === '标干流量') {
          return '—'
        } else {
          return <div style={{ textAlign: 'left' }}>{type == 1 ? record.RangeRemark : type == 2 ? record.CouRemrak : record.Remark}</div>
        }

      }
    },
    {
      title: '运维人员备注',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (text === 'NOx' || text === '标干流量') {
          return '—'
        } else {
          return <div style={{ textAlign: 'left' }}>{type == 1 ? record.OperationRangeRemark : type == 2 ? record.OperationDataRemark : record.OperationReamrk}</div>
        }

      }
    },

    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      dataIndex: 'StatusName',
      key: 'StatusName',
      width: 150,
      render: (text, record, index) => {
        return (
          <div>{rectificaDetailType == 2 && text == '未整改' ? //运维人员
            <>
              <a onClick={() => { verifica(record, type, 2); }}>整改</a>
              <Divider type="vertical" />
              <a onClick={() => { reject(record, type, '申诉', 5); }}>申诉</a>
            </>
            :
            rectificaDetailType == 1 && (text == '整改待核实' || text == '申诉待核实') &&  //核查人员
            <>
              <Popconfirm
                visible={index == selectIndex && popVisble}
                onCancel={() => { setPopVisble(false) }}
                okButtonProps={{
                  loading: rectificationType == 1 ? updZGRangeCheckLoading : rectificationType == 2 ? updZGCouCheckLoading : updZGParamCheckLoading
                }}
                title={text == '整改待核实' ? "确定要整改通过？" : "确定要申诉通过？"} placement="left"
                onConfirm={() => passOk(type, record, text == '整改待核实' ? 3 : 6)} okText="是" cancelText="否">
                <a onClick={() => { setPopVisble(true); setSelectIndex(index) }}> {text == '整改待核实' ? '整改通过' : '申诉通过'} </a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => { reject(record, type, text == '整改待核实' ? '整改驳回' : '申诉驳回', text == '整改待核实' ? 4 : 7); setPopVisble(false) }}>
                <a> {text == '整改待核实' ? '整改驳回' : '申诉驳回'} </a>
              </a>
            </>
          }</div>
        )
      }

    }
  ]
  let rangCol = [
    ...commonCol1,
    {
      title: '有无显示屏',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 100,
      render: (text, record) => {
        if (text === '颗粒物') {
          return record.Special == 1 ? '有显示屏' : '无显示屏'
        } else if (text === '流速') {
          return record.Special == 1 ? '差压法' : '直测流速法'
        } else {
          return '—'
        }
      }
    },
    {
      title: `分析仪量程`,
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (text === 'NOx' || text === '标干流量') {
          return '—'
        } else {
          return record.AnalyzerMin || record.AnalyzerMin == 0 || record.AnalyzerMax || record.AnalyzerMax == 0 ? `${record.AnalyzerMin}-${record.AnalyzerMax}${record.AnalyzerUnit ? ` ${record.AnalyzerUnit}` : ''}` : null;
        }
      },
    },
    {
      title: '分析仪量程照片',
      dataIndex: 'AnalyzerFileList',
      key: 'AnalyzerFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `DAS量程`,
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (text === 'NOx' || text === '标干流量') {
          return '—'
        } else {
          return record.DASMin || record.DASMin == 0 || record.DASMax || record.DASMax == 0 ? `${record.DASMin}-${record.DASMax}${record.DASUnit ? ` ${record.DASUnit}` : ''}` : null;
        }
      }
    },
    {
      title: 'DAS量程照片',
      dataIndex: 'DASFileList',
      key: 'DASFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `数采仪量程`,
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (text === 'NOx' || text === '标干流量') {
          return '—'
        } else {
          return record.DataMin || record.DataMin == 0 ? `${record.DataMin}-${record.DataMax}${record.DataUnit ? ` ${record.DataUnit}` : ''}` : null;
        }
      }
    },
    {
      title: '数采仪量程照片',
      dataIndex: 'RangeFileList',
      key: 'RangeFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `数采仪量程`,
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (text === 'NOx' || text === '标干流量') {
          return '—'
        } else {
          return record.DataMin || record.DataMin == 0 ? `${record.DataMin}-${record.DataMax}${record.DataUnit ? ` ${record.DataUnit}` : ''}` : null;

        }
      }
    },
    {
      title: '量程一致性(自动判断)',
      align: 'center',
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      width: 150,
      render: (text, record) => {
        if (text === 'NOx' || text === '标干流量') {
          return '—'
        } else {
          return record.RangeAutoStatus == 1 ? '是' : record.RangeAutoStatus == 2 ? '否' : null
        }
      }
    },
    ...commonCol2(1),
  ]

  let dataCol = [
    ...commonCol1,
    {
      title: '浓度类型',
      dataIndex: 'CouType',
      key: 'CouType',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return text == 1 ? '原始浓度' : text == 2 ? '标杆浓度' : '—'

      }
    },
    {
      title: `分析仪示值`,
      dataIndex: 'PollutantName',
      key: 'PollutantName',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (text === 'NOx' || text === '标干流量' || text === '流速' || text === '颗粒物' && record.CouType === 2) {
          return '—'
        }
        return record.AnalyzerCou || record.AnalyzerCou == 0 ? `${record.AnalyzerCou}${record.AnalyzerCouUnit ? `${record.AnalyzerCouUnit}` : ''}` : null;
      }
    },
    {
      title: 'DAS示值',
      dataIndex: 'couCheckList',
      key: 'couCheckList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return record.DASCou || record.DASCou == 0 ? `${record.DASCou}${record.DASCouUnit ? `${record.DASCouUnit}` : ''}` : null;
      }
    },
    {
      title: `数采仪实时数据`,
      dataIndex: 'questionTime',
      key: 'questionTime',
      align: 'center',
      width: 120,
      render: (text, record) => {
        if (text === 'NO' || text === 'NO2') {
          return '—'
        } else {
          return record.DataCou || record.DataCou == 0 ? `${record.DataCou}${record.DataCouUnit ? `${record.DataCouUnit}` : ''}` : null;
        }
      }
    },
    {
      title: '附件',
      dataIndex: 'CouFileList',
      key: 'CouFileList',
      align: 'center',
      width: 120,
      render: (text, record, index) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>;
      }
    },
    {
      title: '量程一致性(自动判断)',
      align: 'center',
      dataIndex: 'level',
      key: 'level',
      width: 150,
      render: (text, record) => {
        return record.CouAutoStatus == 1 ? '是' : record.CouAutoStatus == 2 ? '否' : null
      }
    },
    ...commonCol2(2),
  ]
  let parCol = [
    ...commonCol1,
    {
      title: `仪表设定值`,
      dataIndex: 'SetValue',
      key: 'SetValue',
      align: 'center',
      width: 120,
      render: (text, record, index) => {
        return record.ItemName === '停炉信号接入有备案材料' || record.ItemName === '停炉信号激活时工况真实性' ? '—' : text;
      }
    },
    {
      title: '仪表设定值照片',
      dataIndex: 'SetFileList',
      key: 'SetFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `数采仪设定值`,
      dataIndex: 'DataValue',
      key: 'DataValue',
      align: 'center',
      width: 120,
    },
    {
      title: '数采仪设定值照片',
      dataIndex: 'DataFileList',
      key: 'DataFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `DAS设定值`,
      dataIndex: 'InstrumentSetValue',
      key: 'InstrumentSetValue',
      align: 'center',
      width: 120,
    },
    {
      title: 'DAS设定值照片',
      dataIndex: 'InstrumentFileList',
      key: 'InstrumentFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },
    {
      title: `溯源值`,
      dataIndex: 'TraceabilityValue',
      key: 'TraceabilityValue',
      align: 'center',
      width: 120,
    },
    {
      title: '溯源值照片',
      dataIndex: 'TraceabilityFileList',
      key: 'TraceabilityFileList',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return <div>{text && text[0] && <a onClick={() => { getAttachmentData(text) }}>查看附件</a>}</div>
      },
    },

    ...commonCol2(3),
  ]
  const [previewVisible, setPreviewVisible] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0); //预览附件Index
  const [imgUrlList, setImgUrlList] = useState([]);//预览附件列表
  const [filesList, setFilesList] = useState([]);

  const onPreviewImg = (file, type) => {
    const imageList = filesListObj[type]
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
        imgData.push(item.url)
      })
      setImgUrlList(imgData)
    }
    setPhotoIndex(imageListIndex)
    setPreviewVisible(true)
  }

  /*量程一致性程照片 */
  const [analyzerFile, setAnalyzerFile] = useState() //分析仪照片
  const [analyzerFileList, setAnalyzerFileList] = useState([])

  const [dasRangeFile, setDasRangeFile] = useState() //das量程照片
  const [dasFileList, setDasFileList] = useState([])

  const [dataRangeFile, setDataRangeFile] = useState() //数采仪量程照片
  const [dataRangeFileList, setDataRangeFileList] = useState([])


  /*数据一致性程照片 */
  const [couFile, setCouFile] = useState() //数据一致性程照片
  const [couFileList, setCouFileList] = useState([])

  /*参数一致性程照片 */
  const [settingFile, setSettingFile] = useState() //仪表设定值照片
  const [settingFileList, setSettingFileList] = useState([])

  const [dasSetFile, setDasSetFile] = useState() // DAS设定值照片
  const [dasSetFileList, setDasSetFileList] = useState([])

  const [dataSetFile, setDataSetFile] = useState() //数采仪设定值照片
  const [dataSetFileList, setDataSetFileList] = useState([])

  const [traceabilityFile, setTraceabilityFile] = useState() //溯源值照片
  const [traceabilityFileList, setTraceabilityFileList] = useState([])




  const filesListObj = {
    1: analyzerFileList,
    2: dasFileList,
    3: dataRangeFileList,
    4: couFileList,
    5: settingFileList,
    6: dasSetFileList,
    7: dataSetFileList,
    8: traceabilityFileList,
  }
  const uploadProps = (name, type) => {
    const fileDataFun = () => {
      switch (type) {
        case 1: return analyzerFile;
        case 2: return dasRangeFile;
        case 3: return dataRangeFile;
        case 4: return couFile;
        case 5: return settingFile;
        case 6: return dasSetFile;
        case 7: return dataSetFile;
        case 8: return traceabilityFile;
      }
    }
    const files = fileDataFun()
    return { // 核查问题照片附件 上传
      action: API.UploadApi.UploadPicture,
      headers: { Cookie: null, Authorization: "Bearer " + Cookie.get(config.cookieName) },
      accept: 'image/*',
      listType: 'picture-card',
      locale: { uploading: '上传中' },
      data: {
        FileUuid: files,
        FileActualType: '0',
      },
      beforeUpload: (file) => {
        const fileType = file?.type; //获取文件类型 type  image/*
        if (!(/^image/g.test(fileType))) {
          message.error(`请上传图片格式文件!`);
          return false;
        }
      },
      onChange(info) {
        const fileList = [];
        info.fileList.map(item => {
          if (item.response && item.response.IsSuccess) { //刚上传的
            fileList.push({ ...item, url: `/${item.response.Datas}`, })
          } else if (!item.response) {
            fileList.push({ ...item })
          }
        })

        const settingFilesListFun = () => { //设置图片
          switch (type) {
            case 1: setAnalyzerFileList(fileList); break;
            case 2: setDasFileList(fileList); break;
            case 3: setDataRangeFileList(fileList); break;
            case 4: setCouFileList(fileList); break;
            case 5: setSettingFileList(fileList); break;
            case 6: setDasSetFileList(fileList); break;
            case 7: setDataSetFileList(fileList); break;
            case 8: setTraceabilityFileList(fileList); break;

          }
        }
        const settingFormFilesFun = (filesVal) => { //设置传参值
          switch (type) {
            case 1: case 2: case 3:
              rangform.setFieldsValue({ [name]: filesVal })
              break;
            case 4:
              dataform.setFieldsValue({ [name]: filesVal })
              break;
            case 5: case 6: case 7: case 8:
              parform.setFieldsValue({ [name]: filesVal })
              break;
          }
        }
        if (info.file.status == 'uploading') {
          settingFilesListFun()
          return;
        }
        if (info.file.status === 'done') {
          settingFormFilesFun(files)
          settingFilesListFun()
          message.success(`${info.file.name} 上传成功`);

        } else if (info.file.status === 'error') {
          settingFormFilesFun(fileList && fileList[0] ? files : undefined)//有上传成功的取前面的uid 没有则表示没有上传成功的图片
          message.error(`${info.file.name} ${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
        } else if (info.file.status === 'removed') { //删除状态
          settingFormFilesFun(fileList && fileList[0] ? files : undefined)
          settingFilesListFun()
        }
      },
      onRemove: (file) => {
        if (!file.error) {
          props.deleteAttach(file)
        }

      },
      onPreview: file => { //预览
        onPreviewImg(file, type)
      },
      fileList: filesListObj[type]
    }

  }

  const [rectificationVisible, setRectificationVisible] = useState(false)
  const [rectificationTitle, setRectificationTitle] = useState('')
  const [rectificationType, setRectificationType] = useState(1)
  const [rectificationData, setRectificationData] = useState({})
  const [rectificationUnit, setRectificationUnit] = useState({})

  const verifica = (record, type, status) => { //运维人员整改 或 核查人员核查
    setRectificationVisible(true)
    setRectificationType(type)
    setRectificationTitle(`${type == 1 ? '量程' : type == 2 ? '数据' : '参数'}一致性整改（${record.PollutantName}）`)
    setRectificationData(record)
    props.getKeyPollutantList({ id: record.PollutantCode }, (res) => {
      setRectificationUnit(res?.[0])
    })
    if (type == 1) {
      rangform.resetFields();
      rangform.setFieldsValue({
        analyzerMin: record.AnalyzerMin,
        analyzerMax: record.AnalyzerMax,
        analyzerUnit: record.AnalyzerUnit,
        analyzerFile: record.AnalyzerFileList?.[0]?.FileUuid,
        dasMin: record.DASMin,
        dasMax: record.DASMax,
        dasUnit: record.DASUnit,
        dasFile: record.DASFileList?.[0]?.FileUuid,
        dataMin: record.DataMin,
        dataMax: record.DataMax,
        dataUnit: record.DataUnit,
        dataFile: record.DataFileList?.[0]?.FileUuid,
        rangeAutoStatus: record.RangeAutoStatus,
        operationRangeRemark: record.OperationRangeRemark,
        pollutantCode: record.PollutantCode,
        id: record.ID,
        zgid: record.ZGID,
        status: status,
      })
      // setManualVal(record.RangeStatus ? Array.from(String(record.RangeStatus), Number) : [])
      const analyzerFileList = record.AnalyzerFileList?.[0] ? record.AnalyzerFileList.map(item => {
        return { uid: item.GUID, name: item.FileName, status: 'done', url: `${uploadPrefix}/${item.FileName}`, }
      }) : []
      setAnalyzerFileList(analyzerFileList)
      setAnalyzerFile(record.AnalyzerFileList?.[0]?.FileUuid ? record.AnalyzerFileList[0].FileUuid : cuid())

      const dasFileList = record.DASFileList?.[0] ? record.DASFileList.map(item => {
        return { uid: item.GUID, name: item.FileName, status: 'done', url: `${uploadPrefix}/${item.FileName}`, }
      }) : []
      setDasFileList(dasFileList)
      setDasRangeFile(record.DASFileList?.[0]?.FileUuid ? record.DASFileList[0].FileUuid : cuid())

      const dataFileList = record.RangeFileList?.[0] ? record.RangeFileList.map(item => {//数采仪量程照片
        return { uid: item.GUID, name: item.FileName, status: 'done', url: `${uploadPrefix}/${item.FileName}`, }
      }) : []
      setDataRangeFileList(dataFileList)
      setDataRangeFile(record.RangeFileList?.[0]?.FileUuid ? record.RangeFileList[0].FileUuid : cuid())
    } else if (type == 2) {
      dataform.resetFields();
      dataform.setFieldsValue({
        analyzerCou: record.AnalyzerCou,
        analyzerCouUnit: record.AnalyzerCouUnit,
        dasCou: record.DASCou,
        dasCouUnit: record.DASCouUnit,
        dataCou: record.DataCou,
        dataCouUnit: record.DataCouUnit,
        couFile: record.CouFileList?.[0]?.FileUuid,
        couAutoStatus: record.CouAutoStatus,
        operationDataRemark: record.OperationDataRemark,
        pollutantCode: record.PollutantCode,
        id: record.ID,
        zgid: record.ZGID,
        status: status,
      })
      // setManualVal(record.CouStatus ? Array.from(String(record.CouStatus), Number) : [])
      const couDataFileList = record.CouFileList?.[0] ? record.CouFileList.map(item => {
        return { uid: item.GUID, name: item.FileName, status: 'done', url: `${uploadPrefix}/${item.FileName}`, }
      }) : []
      setCouFileList(couDataFileList)
      setCouFile(record.CouFileList?.[0]?.FileUuid ? record.CouFileList[0].FileUuid : cuid())
    } else {
      parform.resetFields();
      parform.setFieldsValue({
        setValue: record.SetValue,
        setFile: record.SetFileList?.[0]?.FileUuid,
        instrumentSetValue: record.InstrumentSetValue,
        instrumentFile: record.InstrumentFileList?.[0]?.FileUuid,
        dataValue: record.DataValue,
        dataFile: record.DataFileList?.[0]?.FileUuid,
        traceabilityValue: record.TraceabilityValue,
        traceabilityFile: record.TraceabilityFileList?.[0]?.FileUuid,
        autoUniformity: record.AutoUniformity,
        operationReamrk: record.OperationReamrk,
        CheckItem: record.CheckItem,
        id: record.ID,
        zgid: record.ZGID,
        status: status,
      })
      // setManualVal(record.Uniformity ? Array.from(String(record.Uniformity), Number) : [])

      const settingFileData = record.SetFileList?.[0] ? record.SetFileList.map(item => {
        return { uid: item.GUID, name: item.FileName, status: 'done', url: `${uploadPrefix}/${item.FileName}`, }
      }) : []
      setSettingFileList(settingFileData)
      setSettingFile(record.SetFileList?.[0]?.FileUuid ? record.SetFileList[0].FileUuid : cuid())

      const dasSetFileData = record.InstrumentFileList?.[0] ? record.InstrumentFileList.map(item => {
        return { uid: item.GUID, name: item.FileName, status: 'done', url: `${uploadPrefix}/${item.FileName}`, }
      }) : []
      setDasSetFileList(dasSetFileData)
      setDasSetFile(record.InstrumentFileList?.[0]?.FileUuid ? record.InstrumentFileList[0].FileUuid : cuid())

      const dataSetFileData = record.DataFileList?.[0] ? record.DataFileList.map(item => {
        return { uid: item.GUID, name: item.FileName, status: 'done', url: `${uploadPrefix}/${item.FileName}`, }
      }) : []
      setDataSetFileList(dataSetFileData)
      setDataSetFile(record.DataFileList?.[0]?.FileUuid ? record.DataFileList[0].FileUuid : cuid())

      const traceabilityFileData = record.TraceabilityFileList?.[0] ? record.TraceabilityFileList.map(item => {
        return { uid: item.GUID, name: item.FileName, status: 'done', url: `${uploadPrefix}/${item.FileName}`, }
      }) : []
      setTraceabilityFileList(traceabilityFileData)
      setTraceabilityFile(record.TraceabilityFileList?.[0]?.FileUuid ? record.TraceabilityFileList[0].FileUuid : cuid())
    }
  }
  const rectificationOk = async () => { //运维人员整改提交 或 核查人员核查提交
    if (rectificationType == 1) {
      try {
        const values = await rangform.validateFields();
        props.updZGRangeCheck({
          ...values,
          // rangeStatus: manualVal?.toString(),
        }, (isSuccess) => {
          if (isSuccess) {
            setRectificationVisible(false)
            props.getZGCheckInfoList({ id: id })
          }
        })
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
    } else if (rectificationType == 2) {
      try {
        const values = await dataform.validateFields();
        props.updZGCouCheck({
          ...values,
          // couStatus: manualVal?.toString(),
        }, (isSuccess) => {
          if (isSuccess) {
            setRectificationVisible(false)
            props.getZGCheckInfoList({ id: id })
          }
        })
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
    } else {
      try {
        const values = await parform.validateFields();
        console.log(values)
        props.updZGParamCheck({
          ...values,
        }, (isSuccess) => {
          if (isSuccess) {
            setRectificationVisible(false)
            props.getZGCheckInfoList({ id: id })
          }
        })
      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
      }
    }
  }

  let NO, NO2; //获取NOx的值

  const isJudge = () => {

    let values;
    switch (rectificationType) {
      case 1: // 量程一致性核查表 自动判断
        values = rangform.getFieldsValue();
        let analyzerRang1, analyzerRang2, analyzerUnit, analyzerFlag;
        analyzerRang1 = values.analyzerMin, analyzerRang2 = values.analyzerMax, analyzerUnit = values.analyzerUnit;;
        analyzerFlag = (analyzerRang1 || analyzerRang1 == 0) && (analyzerRang2 || analyzerRang2 == 0) && analyzerUnit || rectificationData.PollutantName == 'NOx' || rectificationData.PollutantName == '标干流量' ? true : false;
        let dsRang1 = values.dasMin, dsRang2 = values.dasMax, dsUnit = values.dasUnit;
        let scyRang1 = values.dataMin, scyRang2 = values.dataMax, scyUnit = values.dataUnit;
        let dsRangFlag = (dsRang1 || dsRang1 == 0) && (dsRang2 || dsRang2 == 0) && dsUnit ? true : false;
        let scyRangFlag = (scyRang1 || scyRang1 == 0) && (scyRang2 || scyRang2 == 0) && scyUnit ? true : false;
        const judgeConsistencyRangeCheckFun = (par) => {
          props.judgeConsistencyRangeCheck({
            PollutantCode: rectificationData.PollutantCode,
            Special: rectificationData.Special,
            ...par
          }, (data) => {
            rangform.setFieldsValue({ rangeAutoStatus: data })
          })
        }
        if (analyzerFlag && dsRangFlag && !(scyRang1 || scyRang1 == 0) && !(scyRang2 || scyRang2 == 0)) { //只判断分析仪和DAS量程填完的状态
          judgeConsistencyRangeCheckFun({
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DASMin: dsRang1, DASMax: dsRang2, DASUnit: dsUnit,
          })
        } else if (analyzerFlag && scyRangFlag && !(dsRang1 || dsRang1 == 0) && !(dsRang2 || dsRang2 == 0)) { //只判断分析仪和数采仪量程填完的状态
          judgeConsistencyRangeCheckFun({
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DataMin: scyRang1, DataMax: scyRang2, DataUnit: scyUnit,
          })
        } else if (dsRangFlag && scyRangFlag && !(analyzerRang1 || analyzerRang1 == 0) && !(analyzerRang2 || analyzerRang2 == 0)) { //只判断DAS量程和数采仪量程填完的状态
          judgeConsistencyRangeCheckFun({
            DASMin: dsRang1, DASMax: dsRang2, DASUnit: dsUnit,
            DataMin: scyRang1, DataMax: scyRang2, DataUnit: scyUnit,
          })
        } else if (analyzerFlag && dsRangFlag && scyRangFlag) { //三项都填完的判断
          judgeConsistencyRangeCheckFun({
            AnalyzerMin: analyzerRang1, AnalyzerMax: analyzerRang2, AnalyzerUnit: analyzerUnit,
            DASMin: dsRang1, DASMax: dsRang2, DASUnit: dsUnit,
            DataMin: scyRang1, DataMax: scyRang2, DataUnit: scyUnit,
          })
        } else {
          rangform.setFieldsValue({ rangeAutoStatus: undefined })
        }

        break;
      case 2: // 实时数据一致性核查表 自动判断
        values = dataform.getFieldsValue();

        const indicaVal = (rectificationData.PollutantName == 'NO' && !values.analyzerCou) || (rectificationData.PollutantName == 'NO2' && !values.analyzerCou) ? '0' : values.analyzerCou, indicaUnit = values.analyzerCouUnit;
        const dsData = values.dasCou, dsDataUnit = values.dasCouUnit;
        const scyData = values.dataCou, scyDataUnit = values.dataCouUnit;

        const indicaValFlag = (indicaVal || indicaVal == 0) && indicaUnit || rectificationData.concentrationType == '标杆浓度' || rectificationData.PollutantName == '流速' || rectificationData.Name == 'NOx' || rectificationData.PollutantName == '标干流量' || rectificationData.PollutantName == '温度' || rectificationData.PollutantName == '压力' || rectificationData.PollutantName == '湿度' ? true : false;
        const dsDataFlag = (dsData || dsData == 0) && dsDataUnit ? true : false; //只判断DAS示值填完的状态
        const scyDataFlag = (scyData || scyData == 0) && scyDataUnit ? true : false;
        const judgeConsistencyCouCheckFun = (par) => {
          props.judgeConsistencyCouCheck({
            PollutantCode: rectificationData.PollutantCode,
            Special: rectificationData.Special,//颗粒物有无显示屏 流速差压法和直测流速法
            CouType: rectificationData.CouType,
            ...par,
          }, (data) => {
            dataform.setFieldsValue({ couAutoStatus: data })
          })
        }

        if (indicaValFlag && dsDataFlag && !(scyData || scyData == 0)) { //只判断分析仪示值和DAS示值
          judgeConsistencyCouCheckFun({
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,
            DASCou: dsData, DASCouUnit: dsDataUnit,
          })
        } else if (indicaValFlag && scyDataFlag && !(dsData || dsData == 0)) { //只判断分析仪示值和数采仪
          judgeConsistencyCouCheckFun({
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,
            DataCou: scyData, DataCouUnit: scyDataUnit,
          })
        } else if (dsDataFlag && scyDataFlag && !(indicaVal || indicaVal == 0)) { //只判断DAS示值和数采仪
          judgeConsistencyCouCheckFun({
            DASCou: dsData, DASCouUnit: dsDataUnit,
            DataCou: scyData, DataCouUnit: scyDataUnit,
          })
        } else if (indicaValFlag && dsDataFlag && scyDataFlag) { //三项都填完的判断
          judgeConsistencyCouCheckFun({
            AnalyzerCou: indicaVal, AnalyzerCouUnit: indicaUnit,
            DASCou: dsData, DASCouUnit: dsDataUnit,
            DataCou: scyData, DataCouUnit: scyDataUnit,
          })
        } else {
          dataform.setFieldsValue({ couAutoStatus: undefined })
        }

        if (rectificationData.PollutantName === 'NO') {
          NO = values.analyzerCou;
        }
        if (rectificationData.PollutantName === 'NO2') {
          NO2 = values.analyzerCou;
        }
        if (NO && NO2) {  //获取NOx数采仪实时数据
          props.getNoxValue({ NO: NO, NO2: NO2 }, (data) => {
            dataform.setFieldsValue({ analyzerCou: data })
          })
        }
        break;
      case 3: // 参数一致性核查表 自动判断
        values = parform.getFieldsValue();

        const setVal = values.setValue,
          instrumentSetVal = values.instrumentSetValue,
          dataVal = values.dataValue,
          traceVal = values.traceabilityValue,
          setStatusVal = rectificationData.SetStatus,
          instrumentStatusVal = rectificationData.InstrumentStatus,
          dataStatusVal = rectificationData.DataStatus;
        if (traceVal || traceVal == 0) {
          if ((setStatusVal == 1 || instrumentStatusVal == 1 || dataStatusVal == 1) && ((setVal || setVal == 0) || (instrumentSetVal || instrumentSetVal == 0) || (dataVal || dataVal == 0))) {
            props.judgeParamCheck({
              PollutantCode: rectificationData.PollutantCode,
              SetValue: setVal, InstrumentSetValue: instrumentSetVal, DataValue: dataVal,
              TraceabilityValue: traceVal,
              SetStatus: setStatusVal,
              InstrumentStatus: instrumentStatusVal,
              DataStatus: dataStatusVal,
            }, (data) => {
              parform.setFieldsValue({ autoUniformity: data })
            })
          } else {
            parform.setFieldsValue({ autoUniformity: undefined })
          }
        } else {
          parform.setFieldsValue({ autoUniformity: undefined })
        }

        break;
    }
  }



  const rejectOrPassZGCheckRequest = (type, record, data) => {
    if (type == 1) {
      props.updZGRangeCheck({
        pollutantCode: record.PollutantCode,
        analyzerMin: record.AnalyzerMin,
        analyzerMax: record.AnalyzerMax,
        analyzerUnit: record.AnalyzerUnit,
        analyzerFile: record.AnalyzerFileList?.[0]?.FileUuid,
        dasMin: record.DASMin,
        dasMax: record.DASMax,
        dasUnit: record.DASUnit,
        dasFile: record.DASFileList?.[0]?.FileUuid,
        dataMin: record.DataMin,
        dataMax: record.DataMax,
        dataUnit: record.DataUnit,
        dataFile: record.DataFileList?.[0]?.FileUuid,
        rangeAutoStatus: record.RangeAutoStatus,
        rangeStatus: record.RangeStatus,   
        id: record.ID,
        zgid: record.ZGID,
        ...data,
      }, (isSuccess) => {
        if (isSuccess) {
          setRejectVisible(false)
          setPopVisble(false)
          props.getZGCheckInfoList({ id: id })
        }
      })
    } else if (type == 2) {
      props.updZGCouCheck({
        pollutantCode: record.PollutantCode,
        analyzerCou: record.AnalyzerCou,
        analyzerCouUnit: record.AnalyzerCouUnit,
        dasCou: record.DASCou,
        dasCouUnit: record.DASCouUnit,
        dataCou: record.DataCou,
        dataCouUnit: record.DataCouUnit,
        couFile: record.CouFileList?.[0]?.FileUuid,
        couAutoStatus: record.CouAutoStatus,
        couStatus : record.CouStatus,
        id: record.ID,
        zgid: record.ZGID,
        ...data,
      }, (isSuccess) => {
        if (isSuccess) {
          setRejectVisible(false)
          setPopVisble(false)
          props.getZGCheckInfoList({ id: id })
        }
      })
    } else {
      props.updZGParamCheck({
        checkItem: record.CheckItem,
        setValue: record.SetValue,
        setFile: record.SetFileList?.[0]?.FileUuid,
        instrumentSetValue: record.InstrumentSetValue,
        instrumentFile: record.InstrumentFileList?.[0]?.FileUuid,
        dataValue: record.DataValue,
        dataFile: record.DataFileList?.[0]?.FileUuid,
        traceabilityValue: record.TraceabilityValue,
        traceabilityFile: record.TraceabilityFileList?.[0]?.FileUuid,
        autoUniformity: record.AutoUniformity,
        uniformity: record.Uniformity,
        id: record.ID,
        zgid: record.ZGID,
        ...data,
      }, (isSuccess) => {
        if (isSuccess) {
          setRejectVisible(false)
          setPopVisble(false)
          props.getZGCheckInfoList({ id: id })
        }
      })
    }
  }

  const [rejectVisible, setRejectVisible] = useState(false)
  const [rejectTitle, setRejectTitle] = useState()
  const [rejectStatus, setRejectStatus] = useState()
  const reject = (record, type, title, status) => { //驳回弹框
    setRejectVisible(true)
    setRejectTitle(`${type == 1 ? '量程' : type == 2 ? '数据' : '参数'}一致性${title}（${record.PollutantName}）`)
    rejectform.resetFields();
    if(status==5){ //运维
      type==1 ? rejectform.setFieldsValue({operationRangeRemark: record.OperationRangeRemark}) :  type==2 ? rejectform.setFieldsValue({operationDataRemark : record.OperationDataRemark }) : rejectform.setFieldsValue({operationReamrk: record.OperationReamrk }) 
    }else{
      type==1 ? rejectform.setFieldsValue({rangeRemark: record.RangeRemark}) :  type==2 ? rejectform.setFieldsValue({couRemrak : record.CouRemrak }) : rejectform.setFieldsValue({remark: record.Remark }) 

    }
    setRectificationType(type)
    setRejectStatus(status)
    setRectificationData(record)

  }
  const jectOk = async () => {//整改或驳回通过 
    try {
      const values = await rejectform.validateFields();
      let reamrkData = {};
      if(rejectStatus==5){
         switch(rectificationType){
           case 1:   reamrkData ={ rangeRemark: rectificationData.RangeRemark}; break;
           case 2:   reamrkData ={ couRemrak: rectificationData.CouRemrak}; break;
           case 3:   reamrkData ={ remark: rectificationData.Remark}; break;
         }
      }else{
        switch(rectificationType){
          case 1:   reamrkData ={ operationRangeRemark: rectificationData.OperationRangeRemark}; break;
          case 2:   reamrkData ={ operationDataRemark: rectificationData.OperationDataRemark}; break;
          case 3:   reamrkData ={ operationReamrk: rectificationData.OperationReamrk}; break;
        }  
      }
      rejectOrPassZGCheckRequest(rectificationType, rectificationData, { ...values,...reamrkData, status: rejectStatus})
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const passOk = (type, record, status) => { //通过
    rejectOrPassZGCheckRequest(type, record, { status: status })
  }

  if (rectificaDetailType == 3) {
    rangCol = rangCol.filter(item => item.title != '操作')
    dataCol = dataCol.filter(item => item.title != '操作')
    parCol = parCol.filter(item => item.title != '操作')

  }
  const manualOptions = [
    { label: '是', value: 1 },
    { label: '否', value: 2 },
    { label: '不适用', value: 3 },
    { label: '不规范', value: 4 },
  ]
  const [manualVal, setManualVal] = useState([])
  const onManualChange = (value, name) => {
    // 如果选中的复选框数量为1，则更新setManualVal状态

    if (value?.length === 1) {
      setManualVal(value)
    } else {
      let diff = value.filter(x => !manualVal.includes(x));
      setManualVal(diff)
    }
  }

  const uploadButton = (name, type) => (
    <Upload {...uploadProps(name, type)} style={{ width: '100%' }}>
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传</div>
      </div>
    </Upload>
  );
  const commonForm = () => <Fragment><Col span={12} style={{ marginBottom: 12 }}>
    <Form.Item name={rectificationType == 1 ? 'rangeAutoStatus' : rectificationType == 2 ? 'couAutoStatus' : 'autoUniformity'} label='一致性'>
      <Radio.Group disabled>
        <Radio value={1}>是</Radio>
        <Radio value={2}>否</Radio>
      </Radio.Group>
    </Form.Item>
  </Col>
    {/* <Col span={12} style={{ marginBottom: 12 }}>
      <Form.Item label='手工修正结果'>
        <Checkbox.Group options={manualOptions} value={manualVal} onChange={(val, e) => { onManualChange(val, 'RangCheck', 1) }} />
      </Form.Item>
    </Col> */}
    <Col span={24}>
      <Form.Item
        label="备注"
        name={rectificationType == 1 ? "operationRangeRemark" : rectificationType == 2 ? 'operationDataRemark' : 'operationReamrk'}
      >
        <TextArea placeholder='请输入' rows={4} />
      </Form.Item>
    </Col>
    <Form.Item name="id" hidden>
      <Input />
    </Form.Item>
    <Form.Item name="zgid" hidden>
      <Input />
    </Form.Item>
    <Form.Item name="status" hidden>
      <Input />
    </Form.Item>
    <Form.Item name={rectificationType==3? "CheckItem": "pollutantCode"} hidden>
      <Input />
    </Form.Item>

  </Fragment>
  return (
    <div>
      <Form>
        <div style={{ padding: '8px 0' }}>
          <Row>
            <Col span={12}>
              <Form.Item label="企业名称" >
                {infoData && infoData.entName}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='监测点名称' >
                {infoData && infoData.pointName}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="运维人员"   >
                {infoData && infoData.OperationUser}
              </Form.Item>
            </Col >
            <Col span={12}>
              <Form.Item label="提交时间" >
                {infoData && infoData.CompleteDate}
              </Form.Item>
            </Col >
            <Col span={12}>
              <Form.Item label="核查人员"   >
                {infoData && infoData.CheckUser}
              </Form.Item>
            </Col >
            <Col span={12}>
              <Form.Item label="核查日期" >
                {infoData && infoData.CheckDate}
              </Form.Item>
            </Col >
          </Row>
        </div>
      </Form>

      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="量程一致性核查" key="1">
            <SdlTable
              dataSource={detailList?.rangeCheckList || []}
              columns={rangCol}
              pagination={false}
              loading={tableLoading}
              scroll={{ y: 'hidden', }}
              rowClassName={null}
            />
          </TabPane>
          <TabPane tab="数据一致性核查" key="2">
            <SdlTable
              dataSource={detailList?.couCheckList || []}
              columns={dataCol}
              pagination={false}
              loading={tableLoading}
              scroll={{ y: 'hidden', }}
              rowClassName={null}
            />
          </TabPane>
          <TabPane tab="参数一致性核查" key="3">
            <SdlTable
              dataSource={detailList?.paramCheckList || []}
              columns={parCol}
              pagination={false}
              loading={tableLoading}
              scroll={{ y: 'hidden', }}
              rowClassName={null}
            />
          </TabPane>
        </Tabs>
      </div>
      {/* 查看附件弹窗 */}
      <ImageView
        isOpen={previewVisible}
        images={imgUrlList}
        imageIndex={photoIndex}
        onCloseRequest={() => {
          setPreviewVisible(false);
        }}
      />
      <Modal
        title={rectificationTitle}
        visible={rectificationVisible}
        onOk={() => { rectificationOk() }}
        destroyOnClose
        onCancel={() => { setRectificationVisible(false) }}
        width={950}
        zIndex={888}
        wrapClassName={styles.rectificationModelSty}
        confirmLoading={rectificationType == 1 ? updZGRangeCheckLoading : rectificationType == 2 ? updZGCouCheckLoading : updZGParamCheckLoading}
      >
        {rectificationType == 1 ? <Form
          name="basics1"
          form={rangform}
          className={'rangformSty'}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="分析仪量程">
                <Row>
                  <Form.Item name={`analyzerMin`} >
                    <InputNumber placeholder='最小值' onBlur={() => { isJudge() }} />
                  </Form.Item>
                  <span style={{ padding: '0 2px', marginBottom: 12 }}> - </span>
                  <Form.Item name={`analyzerMax`} >
                    <InputNumber placeholder='最大值' onBlur={() => { isJudge() }} />
                  </Form.Item>
                  <Form.Item name={`analyzerUnit`} style={{ marginLeft: 6 }} >
                    <Select allowClear placeholder='单位列表' style={{ width: 100 }} onChange={() => { isJudge() }}>
                      {unitFormat(rectificationUnit)}
                    </Select>
                  </Form.Item>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='analyzerFile' label='分析仪照片'>
                {uploadButton('analyzerFile', 1)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="DAS量程"  >
                <Row>
                  <Form.Item name={`dasMin`} >
                    <InputNumber placeholder='最小值' onBlur={() => { isJudge() }} />
                  </Form.Item>
                  <span style={{ padding: '0 2px', marginBottom: 12 }}> - </span>
                  <Form.Item name={`dasMax`} >
                    <InputNumber placeholder='最大值' onBlur={() => { isJudge() }} />
                  </Form.Item>
                  <Form.Item name={`dasUnit`} style={{ marginLeft: 6 }} >
                    <Select allowClear placeholder='单位列表' style={{ width: 100 }} onChange={() => { isJudge() }}>
                      {unitFormat(rectificationUnit)}
                    </Select>
                  </Form.Item>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='dasFile' label='DAS量程照片'>
                {uploadButton('dasFile', 2)}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="数采仪量程" >
                <Row>
                  <Form.Item name={`dataMin`} >
                    <InputNumber placeholder='最小值' onBlur={() => { isJudge() }} />
                  </Form.Item>
                  <span style={{ padding: '0 2px', marginBottom: 12 }}> - </span>
                  <Form.Item name={`dataMax`} >
                    <InputNumber placeholder='最大值' onBlur={() => { isJudge() }} />
                  </Form.Item>
                  <Form.Item name={`dataUnit`} style={{ marginLeft: 5 }} >
                    <Select allowClear placeholder='单位列表' style={{ width: 100 }} onChange={() => { isJudge() }}>
                      {unitFormat(rectificationUnit)}
                    </Select>
                  </Form.Item>
                </Row>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='dataFile' label='数采仪量程照片'>
                {uploadButton('dataFile', 3)}
              </Form.Item>
            </Col>
            {commonForm()}
          </Row>

        </Form>
          :
          rectificationType == 2 ?
            <Form
              name="basics2"
              form={dataform}
              className={'dataformSty'}
            >
              <Row>
                <Col span={12}>
                  <Form.Item label="分析仪示值" style={{ marginBottom: 12 }}>
                    <Row>
                      <Form.Item name={`analyzerCou`} >
                        <InputNumber placeholder='请输入' onBlur={() => { isJudge() }} />
                      </Form.Item>
                      <Form.Item name={`analyzerCouUnit`} style={{ marginLeft: 6 }} >
                        <Select allowClear placeholder='单位列表' style={{ width: 100 }} onChange={() => { isJudge() }}>
                          {unitFormat(rectificationUnit)}
                        </Select>
                      </Form.Item>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="DAS示值" style={{ marginBottom: 12 }}>
                    <Row>
                      <Form.Item name={`dasCou`} >
                        <InputNumber placeholder='请输入' onBlur={() => { isJudge() }} />
                      </Form.Item>
                      <Form.Item name={`dasCouUnit`} style={{ marginLeft: 6 }} >
                        <Select allowClear placeholder='单位列表' style={{ width: 100 }} onChange={() => { isJudge() }}>
                          {unitFormat(rectificationUnit)}
                        </Select>
                      </Form.Item>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="数采仪实时数据"  >
                    <Row>
                      <Form.Item name={`dataCou`} >
                        <InputNumber placeholder='请输入' onBlur={() => { isJudge() }} />
                      </Form.Item>
                      <Form.Item name={`dataCouUnit`} style={{ marginLeft: 6 }} >
                        <Select allowClear placeholder='单位列表' style={{ width: 100 }} onChange={() => { isJudge() }}>
                          {unitFormat(rectificationUnit)}
                        </Select>
                      </Form.Item>
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='couFile' label='附件'>
                    {uploadButton('couFile', 4)}
                  </Form.Item>
                </Col>
                {commonForm()}
              </Row>

            </Form>
            :
            <Form
              name="basics3"
              form={parform}
              className={'parformSty'}
            >
              <Row>
                <Col span={12}>
                  <Form.Item label="仪表设定值" name={`setValue`} >
                    <InputNumber placeholder='请输入' onBlur={() => { isJudge() }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='setFile' label='仪表设定值照片'>
                    {uploadButton('setFile', 5)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="DAS设定值" name={`instrumentSetValue`} >
                    <InputNumber placeholder='请输入' onBlur={() => { isJudge() }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='instrumentFile' label='DAS设定值照片'>
                    {uploadButton('instrumentFile', 6)}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="数采仪设定值" name={`dataValue`}>
                    <InputNumber placeholder='请输入' onBlur={() => { isJudge() }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='dataFile' label='数采仪设定值照片'>
                    {uploadButton('dataFile', 7)}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="溯源值" name={`traceabilityValue`} >
                    <InputNumber placeholder='请输入' onBlur={() => { isJudge() }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='traceabilityFile' label='溯源值照片'>
                    {uploadButton('traceabilityFile', 8)}
                  </Form.Item>
                </Col>
                {commonForm()}
              </Row>

            </Form>
        }
      </Modal>
      <Modal
        title={rejectTitle}
        visible={rejectVisible}
        onOk={() => { jectOk() }}
        destroyOnClose
        onCancel={() => { setRejectVisible(false) }}
        width={'50%'}
        wrapClassName={styles.rejectSty}
        confirmLoading={rectificationType == 1 ? updZGRangeCheckLoading : rectificationType == 2 ? updZGCouCheckLoading : updZGParamCheckLoading}
      >
        <Form
          name="basics"
          form={rejectform}
        >
          {rejectStatus == 5 ?
            <Form.Item
              label="备注"
              name={rectificationType == 1 ? "operationRangeRemark" : rectificationType == 2 ? 'operationDataRemark' : 'operationReamrk'}
              rules={[
                {
                  required: true,
                  message: '请输入备注！'
                },
              ]}
            >
              <TextArea placeholder='请输入' rows={4} />
            </Form.Item>
            :
            <Form.Item
              label="备注"
              name={rectificationType == 1 ? "rangeRemark" : rectificationType == 2 ? 'couRemrak' : 'remark'}
              rules={[
                {
                  required: true,
                  message: '请输入备注！'
                },
              ]}
            >
              <TextArea placeholder='请输入' rows={4} />
            </Form.Item>
          }
        </Form>

      </Modal>
    </div>

  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);