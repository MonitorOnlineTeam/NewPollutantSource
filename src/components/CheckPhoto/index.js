/**
 * 功  能：查看照片
 * 创建人：jab
 * 创建时间：2024.04
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Tooltip, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import ImageView from '@/components/ImageView';
import { uploadPrefix } from '@/config'



const Index = (props) => {

    const [isImageViewOpen, setIsImageViewOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [imageList, setImageList] = useState(0);

   
    const { fileList } = props;

    const photoClick = ()=>{
        setIsImageViewOpen(true)
        setImageIndex(0)
        let imgData = []
        if(fileList?.[0]?.FileName){ 
            imgData =  fileList.map(item => `${uploadPrefix}/${item.FileName}`)
        }else{
            imgData = fileList.ImgList.map(item => `/${item}`)
        }
        setImageList(imgData);
    }
    return (<>
        {(fileList?.[0] || fileList?.ImgList?.[0]) &&<a onClick={photoClick}>查看照片</a>}
        <ImageView  //查看附件弹窗 
        isOpen={isImageViewOpen}
        images={imageList}
        imageIndex={imageIndex}
        onCloseRequest={() => {
            setIsImageViewOpen(false);
        }}
    />
    </>
    );
};

export default (Index);


