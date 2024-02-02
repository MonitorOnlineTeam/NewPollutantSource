import React, { useState } from 'react';
import { Upload, Form, message } from 'antd';
import { API } from '@config/API';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import Cookie from 'js-cookie';
import { cookieName, uploadPrefix } from '@/config'
import cuid from 'cuid';
import { connect } from 'dva';
import ImageView from '@/components/ImageView';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
    saveLoading: loading.effects['autoform/UpdatePlanItem'],

});
const Index = ({ name, uid, onFileChange, dispatch }) => {

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewTitle, setPreviewTitle] = useState()
    const [photoIndex, setPhotoIndex] = useState(0); //预览图片Index
    const [imgUrlList, setImgUrlList] = useState([]);//预览图片列表

    const [fileList, setFileList] = useState([]);
    const uploadProps = {
        action: API.UploadApi.UploadPicture,
        headers: { Cookie: null, Authorization: "Bearer " + Cookie.get(cookieName) },
        accept: 'image/*',
        data: {
            FileUuid: uid,
            FileActualType: '0',
        },
        listType: "picture-card",
        locale:{uploading: '上传中...'},
        beforeUpload: (file) => {
            const fileType = file?.type; //获取文件类型 type  image/*
            if (!(/^image/g.test(fileType))) {
                message.error(`请上传图片格式文件!`);
                return false;
            }
        },
        onChange(info) {
            const fileData = [];
            info.fileList.map(item => {
                if (item.response && item.response.IsSuccess) { //刚上传的
                    fileData.push({ ...item, url: `/${item.response.Datas}`, })
                } else if (!item.response) {
                    fileData.push({ ...item })
                }
            })
            if (info.file.status === 'uploading') {
                setFileList(fileData)
            }
            if (info.file.status === 'done' || info.file.status === 'removed' || info.file.status === 'error') {
                setFileList(fileData)
                if (info.file.status === 'done') {
                    if (info.file?.response?.IsSuccess) {
                        onFileChange(name, uid);
                        message.success('上传成功！')
                    } else {
                        message.error(info.file?.response?.Message)
                    }
                }
                info.file.status === 'error' && message.error(`${info.file.name}${info.file && info.file.response && info.file.response.Message ? info.file.response.Message : '上传失败'}`);
            }
        },
        onPreview: async file => { //预览

            const imageList = fileList

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
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
        },
        onRemove: (file) => {
            if (!file.error) {
                dispatch({
                    type: "autoForm/deleteAttach",
                    payload: {
                        Guid: file.response && file.response.Datas ? file.response.Datas : file.uid,
                    }
                })
            }

        },
        fileList: fileList

    }

    return (<>
        <Form.Item name={name}>
            <Upload
                {...uploadProps}
            >
                <div>
                  <PlusOutlined />
                    <div className="ant-upload-text">上传</div>
                </div>
            </Upload>
        </Form.Item>
        <ImageView
            isOpen={previewVisible}
            images={imgUrlList?.length ? imgUrlList : []}
            imageIndex={photoIndex}
            onCloseRequest={() => {
                setPreviewVisible(false);
            }}
        />
    </>
    );
};

export default connect(dvaPropsData)(Index);