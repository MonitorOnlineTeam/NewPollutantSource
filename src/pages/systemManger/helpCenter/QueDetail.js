/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Skeleton, Upload, Popconfirm, List, Form, Tag, Spin, Typography, Tree, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, RightOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';
import ImageView from '@/components/ImageView';
import { uploadPrefix } from '@/config'


const { TextArea, Search, } = Input;

const { Option } = Select;

const namespace = 'helpCenter'


const dvaPropsData = ({ loading, helpCenter }) => ({
  listData: helpCenter.questionListData,
  questionDetialLoading: loading.effects[`${namespace}/getQuestionDetialList`],
})

const dvaDispatch = (dispatch) => {
  return {
    updateState: (payload) => {
      dispatch({
        type: `${namespace}/updateState`,
        payload: payload,
      })
    },
    getQuestionDetialList: (payload, callback) => { //列表
      dispatch({
        type: `${namespace}/getQuestionDetialList`,
        payload: payload,
        callback: callback,
      })
    },
  }
}


const Index = (props) => {








  const { questionDetialLoading, match: { params: { id } } } = props;


  const [questionDetail, setQuestionDetail] = useState({ QuestionName: '', CreateUserName: '', CreateTime: '', Content: '' })
  const [filesList, setFilesList] = useState([])
  const isMobile = props.match.path && props.match.path == '/appoperation/appQuestionDetail/:id' ? true : false;

  useEffect(() => {
    props.getQuestionDetialList({ pageIndex: 1, pageSize: 100000 }, (res) => {
      const data = res.filter(item => item.ID == id)
      if (data && data[0]) {
        setQuestionDetail({
          QuestionName: data[0].QuestionName,
          CreateUserName: data[0].CreateUserName,
          CreateTime: data[0].CreateTime,
          Content: data[0].Content,
        })
        if (data[0].FileList && data[0].FileList[0]) { //文件列表
          const fileList = []
          data[0].FileList.map(item => {
            if (!item.IsDelete) {
              fileList.push({
                uid: item.GUID,
                name: item.FileActualName,
                status: 'done',
                url: `${uploadPrefix}/${item.FileName}`,
              })

            }
          })
          setFilesList(fileList)
        }
      }
    })

  }, []);
 

  const [isOpenImg,setIsOpenImg] = useState()
  const [imgList,setImgList] = useState([])
  const [imgIndex,setImgIndex] = useState(1)

  useEffect(() => {
    setImgIndex([])
    if (questionDetail?.Content) {
      const imgEleArr = isMobile? document.querySelectorAll('.mobileContentSty img') :  document.querySelectorAll('.ant-modal-content img')
      if (imgEleArr?.[0]) {
     
        let imgUrl = []
     
        // 循环遍历每个元素  
        for (let i = 0; i < imgEleArr.length; i++) {
          const img = new Image();
          let imgEle = imgEleArr[i]
          let url = imgEle.getAttribute('src')      
          // 改变图片的src
          img.src = url;
          img.onload = () =>{
            imgEle.setAttribute('width',img.width/2)
            imgEle.setAttribute('height',img.height/2)
           };
          imgEle.style.cursor = 'pointer'
          imgUrl.push(url)
          // 为每个元素添加点击事件  
          imgEle.addEventListener('click', () => {
            // var iframe = `<iframe width='100%' height='100%' src=${url}  frameborder='0' scrolling='no'></iframe>`
            // var x = window.open()
            // x.document.open()
            // x.document.write(iframe)
            // x.document.close()
            setIsOpenImg(true)
            setImgIndex(i)
          });

        }
        setImgList(imgUrl)
      }

    }
  }, [questionDetail]);
  return (
    <div className={questionDetialLoading ? styles.questLoadingSty : isMobile ? styles.mobileSty : styles.quesDetailSty} style={{ height: isMobile ? '100vh' : '100%', backgroundColor: isMobile ? '#f2f2f2' : '#fff' }}>
      {isMobile ?
        <Spin spinning={questionDetialLoading} active style={{ height: '100vh', maxHeight: '100vh' }}>
          <div style={{ textAlign: 'left', fontWeight: 'bold', lineHeight: '14px' }}>{questionDetail.QuestionName}</div>
          <div style={{ textAlign: 'left', color: 'rgb(194,194,194)', paddingTop: 8 }}><span>{questionDetail.CreateTime && `创建时间：${questionDetail.CreateTime}`}</span></div>
          <Divider style={{ margin: '12px  0' }} />
          <div dangerouslySetInnerHTML={{ __html: `<div class='mobileContentSty'>${questionDetail.Content}</div>` }}></div>
        </Spin>
        :
        <Spin spinning={questionDetialLoading} active style={{ height: '100%' }}>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15, }}>{questionDetail.QuestionName}</div>
          <div style={{ textAlign: 'center', color: 'rgb(194,194,194)', paddingTop: 8 }}><span>创建人：{questionDetail.CreateUserName}</span> <span style={{ paddingLeft: 22 }}>创建时间：{questionDetail.CreateTime}</span></div>
          <div style={{ paddingTop: 12 }} dangerouslySetInnerHTML={{ __html: questionDetail.Content }}></div>
          {filesList && filesList[0] && <div>
            <span> 附件：</span>
            <Upload fileList={filesList} showUploadList={{ showRemoveIcon: false, }} />
          </div>}
        </Spin>
      }
       <ImageView
        isMobile={isMobile}
        isOpen={isOpenImg}
        images={imgList}
        imageIndex={imgIndex}
        imageTitle={`${imgIndex+1}/${imgList.length}`}
        onCloseRequest={() => {
          setIsOpenImg(false)
        }}
      />
    </div>
  );
};
export default connect(dvaPropsData, dvaDispatch)(Index);