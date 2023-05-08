/*
 * @Author: JiaQi 
 * @Date: 2023-04-28 10:00:58 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-05-06 10:22:58
 * @Description：查看图片组件
 */
import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox-rotate';
import 'react-image-lightbox/style.css';

export default class ImageLightboxView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }

  render() {
    const { photoIndex, isOpen } = this.state;
    const { images } = this.props;
    return (
      <div>
        <a onClick={() => this.setState({ isOpen: true })}>查看附件</a>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onPreMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onPreMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
            imageTitle={
              <div
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
  }
}
