import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';
import { antdUtils } from '~/utils/antd';


const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if(!isJpgOrPng) {
    antdUtils.message?.error('文件类型错误')
  }

  const isLt2M = file.size / 1024 / 1024 < 2;
  if(!isLt2M) {
    antdUtils.message?.error('文件大小不能超过2M')
  }
  if(!(isJpgOrPng && isLt2M)) {
    return Upload.LIST_IGNORE
  }
  return true
}

interface PropsType {
    value?: UploadFile[]
    onChange?:(value: UploadFile[]) => void
}


const Avatar: React.FC<PropsType> = ({value, onChange}) => {
   const handleChange:UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if(onChange) {
        onChange(info.fileList)
    }
   }

   const onPreview = async(file:UploadFile) => {
    const src = file.url || file?.response.filePath
    if(src) {
        const imgWindow = window.open('localhost:9000' + src)

        if(imgWindow) {
            const image = new Image()
            image.src = src
            imgWindow.document.write(image.outerHTML)
        } else {
            window.location.href = src
        }
    }
   }

    return (
        <ImgCrop showGrid rotationSlider showReset >
          <Upload 
            action="/api/file/upload"
            listType="picture-card"
            className='avatar-uploader'
            fileList={value}
            onChange={handleChange}
            onPreview={onPreview}
            beforeUpload={beforeUpload}
          >
            {(value?.length || 0) < 1 && <PlusOutlined />}
          </Upload>
        </ImgCrop>
      );
}

  

 

export default Avatar;