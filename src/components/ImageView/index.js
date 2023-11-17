/*
 * @Author: JiaQi
 * @Date: 2023-05-30 16:47:59
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-06-06 09:02:59
 * @Description：图片查看器
 */
import React, { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox-rotate';
import 'react-image-lightbox/style.css';

const ImageView = props => {
  const { images, imageIndex, isOpen, onCloseRequest,isMobile } = props;
  const [photoIndex, setPhotoIndex] = useState({});

  useEffect(() => {
    setPhotoIndex(imageIndex);
  }, [imageIndex, isOpen]);

  return (
    <div>
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => onCloseRequest()}
          onPreMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onPreMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          imageTitle={
            isMobile?  `${photoIndex+1}/${images.length}`: <div
              style={{
                width: '100vw',
                textAlign: 'center',
                lineHeight: '64px',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              {`${photoIndex + 1} / ${images.length}`}
            </div>
          }
        />
      )}
    </div>
  );
};

export default ImageView;
