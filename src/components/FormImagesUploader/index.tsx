import { memo, useState, useEffect } from 'react';
import { UseFormSetValue, UseFormRegister } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import './FormImagesUploader.css'
import { Box } from '@mui/material';
import { readFileAsBase64 } from '../PropertyForm';
 
interface ImagesUploaderProps {
  initialImages?: string[] | string;
  type?: 'multiple' | 'single';
  showLabel?: string;
  name: string;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  width?: string;
  onImagesDeleted?: (deletedImagePaths: string[]) => void;
  update?: string;
}

const FormImagesUploader = memo(
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
      Array.isArray(initialImages) ? initialImages : [] as any,
    );

    const [deletedImagePaths, setDeletedImagePaths] = useState<any>([]);

    const onDrop = async(acceptedFiles:any) => {
      // const imageObjects = acceptedFiles?.map((file:any) => ({
      //   file,
      //   URL: URL.createObjectURL(file),
      //   path: file.path,
      //   size: file.size,
      // }));

      const base64Files = await Promise.all(
        acceptedFiles.map(readFileAsBase64),
      );
      const imageObjects = base64Files.map((base64, index) => ({
        base64,
        name: acceptedFiles[index].name,
        size: acceptedFiles[index].size,
      }));
      if (type === 'single') {
        setImages([imageObjects[0]]);
        setValue(
          name,
          imageObjects[0].base64?.replace(/^data:.*;base64,/, ''),
        );
      } else {
        const newImages = [...images, ...imageObjects];
        setImages(newImages);
        const combinedValue = newImages.map((image) => {
          if (image.base64) {
            return image.base64.split(',')[1];
          }
          return image.base64.split(',')[1];
        });

        setValue(name, combinedValue);
      }
    };

    const handleDelete = (imageToDelete:any) => {
      let filteredImages = [];

      // 削除対象の判定ロジック
      if (imageToDelete?.url) {
        filteredImages = images?.filter((image: any) => getImageUrl(image) !== imageToDelete.url);
        setDeletedImagePaths((prev: any) => [...prev, imageToDelete.url]);
      } else if (imageToDelete?.base64) {
        filteredImages = images?.filter(
          (image: any) =>
            image.base64 !== imageToDelete.base64,
        );
        setDeletedImagePaths((prev:any) => {
          const updatedPaths = [...prev, imageToDelete?.base64];
          return updatedPaths;
        });
      } else if(imageToDelete?.URL){
        filteredImages = images.filter(
          (image: any) => image.URL !== imageToDelete.URL,
        );
      }else{
        filteredImages = imageToDelete;
      }
      if(type!=='single'){
        setImages(filteredImages);
        setValue(name, filteredImages);
      }else{
        setImages('');
        setValue(name, '');
        setDeletedImagePaths(imageToDelete)
      }

    };

    useEffect(() => {
      if (deletedImagePaths.length > 0) {
        onImagesDeleted(deletedImagePaths);
      }
    }, [deletedImagePaths]);

    useEffect(() => {
      // if (Array.isArray(initialImages) && initialImages.length > 0 && update) {
      //   setImages(initialImages);
      //   setValue(name, initialImages);
      // }else{
      //   setImages([initialImages])
      //   setValue(name, [initialImages]);
      // }
      if (update === "true") {
        if (Array.isArray(initialImages)) {
          if (initialImages.length > 0) {
            setImages(initialImages);
            setValue(name, initialImages);
          } else {
            setImages([]);
            setValue(name, []);
          }
        } else if (typeof initialImages === "string" && initialImages.trim() !== "") {
          setImages([initialImages]);
          setValue(name, [initialImages]);
        } else {
          setImages([]);
          setValue(name, []);
        }
      }
    }, [update, initialImages, setValue, name]);

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

    // 🔧 画像URL取得の関数
    function getImageUrl(image: any): string {
      // public_file_pathが存在する場合
      if (image?.public_file_path) {
        return image.public_file_path;
      }
      // base64データがURLの場合（S3 URLなど）
      if (image?.base64 && typeof image.base64 === 'string') {
        // URLかどうかを判定
        if (image.base64.startsWith('http://') || image.base64.startsWith('https://')) {
          return image.base64;
        }
        // Base64データの場合
        if (image.base64.startsWith('data:')) {
          return image.base64;
        }
        // Base64の場合は data: プレフィックスを追加
        return `data:image/jpeg;base64,${image.base64}`;
      }
      // 直接URLの場合
      if (typeof image === 'string') {
        return image;
      }
      return '';
    }

    const symbolOfAdditionForLargeImage = (
      <svg
        width="19"
        height="19"
        viewBox="0 0 15 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.57814 7.80326H0.646484V6.25587H6.57814V0.324219H8.12552V6.25587H14.0572V7.80326H8.12552V13.7349H6.57814V7.80326Z"
          fill="#0B9DBD"
        />
      </svg>
    );

    const symbolOfAdditionForSmallImage = (
      <svg
        width="28"
        height="37"
        viewBox="0 0 28 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8417 37V21.0277H0V16.0455H11.8417V0H16.1583V16.0455H28V21.0277H16.1583V37H11.8417Z"
          fill="#989898"
        />
      </svg>
    );

    function extractFileName(filePath:any) {
      if(filePath !== undefined && typeof filePath === 'string'){
        // const fileName = filePath?.split('/').pop();
        // return fileName.replace(/^\d+-/, '');
        const fileName = filePath.split("/").pop();
        return fileName;
      }
      return filePath;
    }

    return (
      <Box className='contentForUploadingImage'>
        {Array.isArray(images) &&
          images?.map((image: any, index) => {
            // const timestamp = new Date().toISOString();
            // const uniqueKey = image?.path || `${index}-${timestamp}`;
            const uniqueKey =
              image?.public_file_path || image?.base64 || `image-${index}`;
            // 🔧 画像URLを取得
            const imageUrl = getImageUrl(image);
            if (!imageUrl || imageUrl.trim() === "") {
              return null;
            }
            return (
              <div className='imageBlock'
                // key={`${image.URL}-${new Date().toISOString()}}`}
                key={uniqueKey}
              >
                <div className='imageWrapper'>
                  <img className='dragedImage'
                    src={imageUrl}
                    alt={`Selected ${index}`}
                  />

                  <button
                  className='deleteButton'
                    onClick={() => handleDelete({ ...image, url: imageUrl })}
                  />
                </div>
                {showLabel === 'true' && (
                  <p className='imageTitle'>
                    <span className='imageTitleSpan'>
                      {image?.name
                        ? image.name
                        : extractFileName(imageUrl)}
                    </span>
                  </p>
                )}
                {/* {showLabel === 'true' &&
                  image?.public_file_path &&
                  extractFileName(image?.s3_path)} */}
              </div>
            );
          })}
        {type !== 'single' || images.length === 0 ? (
          <Box className='containerForImageToUpload'>
           <li
              {...getRootProps({ isDragActive, isDragReject })}
              className={`areaToDropImage dropzone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              {width === '131px' || width === '180px'
                ? symbolOfAdditionForLargeImage
                : symbolOfAdditionForSmallImage}
              {/* {() => {
                let dropAreaContent = (
                  <SSentencesOfDropArea style={{ marginTop: '20px' }}>
                    ここにドラッグ＆ドロップ
                  </SSentencesOfDropArea>
                );

                if (isDragActive) {
                  dropAreaContent = (
                    <SSentencesOfDropArea isDragActive={isDragActive}>
                      離してアップロードを開始…
                    </SSentencesOfDropArea>
                  );
                } else if (isDragReject) {
                  dropAreaContent = (
                    <SSentencesOfDropArea>
                      Image を指定してください！！
                    </SSentencesOfDropArea>
                  );
                }

                return dropAreaContent;
              }} */}

              {!isDragActive && !isDragReject && (
                <p className={`sentencesOfDropArea ${isDragActive ? 'isDragActive' : ''}`}>
                  {width === '131px' || width === '180px' ? (
                    <>
                      ここにドラッグ＆ドロップ
                      <br />
                      <span className='sentencesOfDropAreaSpan'>
                        または
                      </span>
                      <span className='imageButton' >
                        <span>クリックして写真を選択</span>
                      </span>
                    </>
                  ) : (
                    <span className='sentencesOfDropAreaSpan'>
                      共有する<span className='spanWithBorder'>書類</span>を探す
                    </span>
                  )}
                </p>
              )}
            </li>
          </Box>
        ) : null}
      </Box>
    );
  },
);
 
export { FormImagesUploader };
