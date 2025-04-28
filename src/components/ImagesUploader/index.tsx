import { memo, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImagesUploader.css'
import CustomModal from '../CustomModal';
import { Box } from '@mui/material';
import CustomButton from '../CustomButton';
import { CameraIcon, DeleteIcon } from '../../common/icons';
import { ImagesUploaderProps } from '../../types';
/* eslint-disable @typescript-eslint/no-explicit-any */

const ImagesUploader = memo(
  ({
    initialImages = [],
    type = 'multiple',
    showLabel = 'true',
    name,
    setValue,
    register,
    width = '180px',
    onImagesDeleted = () => {},
    update = 'false',
  }: ImagesUploaderProps) => {
    const [images, setImages] = useState(
      Array.isArray(initialImages) ? initialImages : [],
    );

    const [deletedImagePaths, setDeletedImagePaths] = useState<any>([]);
    const [imageToDelete,setImageToDelete] = useState<any>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleCloseModal = () => setOpenModal(false);
    const handleCancelClick = () => setOpenModal(false);
    const onDrop = (acceptedFiles:any) => {
      const imageObjects = acceptedFiles?.map((file:any) => ({
        file,
        URL: URL.createObjectURL(file),
        path: file.path,
        size: file.size,
      }));

      const newImages =
        type === 'single' ? imageObjects : [...images, ...imageObjects];

      setImages(newImages);
      setValue(name, newImages);
    };

    const handleDelete = (imageToDelete:any) => {
      setOpenModal(false)
      let filteredImages = [] as any;
      if (imageToDelete) {
        filteredImages = images?.filter(
          (image: any) =>
            image !== imageToDelete,
        );
        setDeletedImagePaths((prev:any) => {
          const updatedPaths = [...prev, imageToDelete];
          return updatedPaths;
        });
      } else {
        filteredImages = images.filter(
          (image: any) => image!== imageToDelete,
        );
      }

      setImages(filteredImages);
      setValue(name, filteredImages);
    };

    useEffect(() => {
      if (deletedImagePaths.length > 0) {
        onImagesDeleted(deletedImagePaths);
      }
    }, [deletedImagePaths]);

    useEffect(() => {
      if (update) {
        setImages(initialImages);
        setValue(name, initialImages);
      }else if (Array.isArray(initialImages) && initialImages.length > 0 && !update &&initialImages!==undefined) {
        setImages(initialImages);
        setValue(name, initialImages);
      }
    }, [update,initialImages, setValue, name]);

    useEffect(() => {
      register(name);
    }, [register, name]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
      useDropzone({
        onDrop,
        accept: {
          'image/png': [],
          'image/jpeg': [],
        },
      });

    function extractFileName(filePath:any) {
      const fileName = filePath.split('/').pop();
      return fileName.replace(/^\d+-/, '');
    }

    return (
      <div>
        {Array.isArray(images) &&
          images?.map((image: any, index) => {
            const uniqueKey =
              image || image?.path || `image-${index}`;
            return (
              <div className='imageBlock'
                key={uniqueKey}
              >
                <div className='imageWrapper'>
                  {!image?.URL ? (
                    <img className='sImage'
                      src={image}
                      alt={`Selected ${index}`}
                    />
                  ) : (
                    <img className='sImage'
                      src={image?.URL || image}
                      alt={`Selected ${index}`}
                    />
                  )}
                </div>
                <span className='deleteIcon' onClick={() => {
                  setOpenModal(true);
                  setImageToDelete(image);
                }}><DeleteIcon/></span>
                {showLabel === 'true' && (
                  <p className='imageTitle'>
                    <span className='imageTitleSpan'>
                      {image?.public_file_path
                        ? `${extractFileName(image?.public_file_path)}`
                        : `${image.path}`}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
          <CustomModal title='削除の確認' openModal={openModal} handleCloseModal={handleCloseModal} bodyText='社員を削除してよろしいですか？'>
          <Box sx={{display: 'flex',justifyContent:'center',gap:'10px'}}>
                <CustomButton
                    label="戻る"
                    onClick={handleCancelClick}
                    buttonCategory='cancel'  
                /> 
                <CustomButton
                    label="作成"
                    type='button'
                    onClick={()=>handleDelete(imageToDelete)}
                />
            </Box>
          </CustomModal>
        {images.length === 0 ? (
          <div className='containerForImageToUpload' >
            <li className={`areaToDropImage ${isDragActive && 'isDrag'}`}
              {...getRootProps({ isDragActive, isDragReject })}
            >
              <input {...getInputProps()} />
              <CameraIcon/>
                <p className={`sentencesOfDropArea`}>
                  {width === '131px' || width === '180px' ? (
                    <>
                      ここにドラッグ＆ドロップ
                      <br />
                      <span className='sentencesOfDropAreaSpan'>
                      または
                      </span >
                      <span className='imageButton'>
                        <span>クリックしてコンピューターから選択</span>
                      </span>
                    </>
                  ) : (
                    <span className='sentencesOfDropAreaSpan'>
                      共有する<span className='spanWithBorder'>書類</span>を探す
                      </span >
                  )}
                </p>
            </li>
          </div>
        ) : null}
      </div>
    );
  },
);

/* eslint-enable @typescript-eslint/no-explicit-any */
export { ImagesUploader };
