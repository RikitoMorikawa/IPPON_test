import { memo, useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImagesUploader.css'
import CustomModal from '../CustomModal';
import { Box, CircularProgress } from '@mui/material';
import CustomButton from '../CustomButton';
import { CameraIcon, DeleteIcon } from '../../common/icons';
import { ImagesUploaderProps } from '../../types';
import Cookies from 'js-cookie';

/* eslint-disable @typescript-eslint/no-explicit-any */

const ImagesUploader = memo(
  ({
    initialImages = [],
    type = 'multiple',
    showLabel = 'true',
    name,
    memberId,
    setValue,
    width = '180px',
    onImagesDeleted = () => {},
    update = 'false',
    onCleanup,
    isLoading: parentIsLoading = false, // Add prop from parent
  }: ImagesUploaderProps) => {
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeletingImage, setIsDeletingImage] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [deletedImagePaths, setDeletedImagePaths] = useState<any[]>([]);
    const [imageToDelete, setImageToDelete] = useState<any>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    
    // Keep track of created object URLs for cleanup
    const objectURLsRef = useRef<string[]>([]);
    // Flag to track if component is mounted
    const isMountedRef = useRef(true);
    // Timer refs for minimum loading duration
    const loadingTimerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    
    const employeeId = Cookies.get('employeeID')
    const role = Cookies.get('role')
    const handleCloseModal = () => setOpenModal(false);
    const handleCancelClick = () => setOpenModal(false);
    const isAdmin = role === 'admin';
    const isOwnProfile = (memberId == employeeId);
    
    // Check if user has permission to delete
    const canDelete = isAdmin || isOwnProfile;
    
    // Minimum loading duration - different for upload area vs images
    const MIN_LOADING_DURATION_WITH_IMAGE = 1000; // 1 second when showing images
    const MIN_LOADING_DURATION_NO_IMAGE = 1000;   // 2 seconds when showing upload area
    
    // Enhanced loading state that considers parent loading and minimum duration
    const isActuallyLoading = parentIsLoading || isLoading || isDeletingImage || isUploadingImage;
    
    // Comprehensive cleanup function
    const cleanupAllState = useCallback(() => {
      // Clear any pending timers
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      
      // Revoke all object URLs to prevent memory leaks
      objectURLsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn('Error revoking object URL:', error);
        }
      });
      objectURLsRef.current = [];
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        // Reset all state
        setImages([]);
        setIsLoading(false);
        setIsDeletingImage(false);
        setIsUploadingImage(false);
        setDeletedImagePaths([]);
        setImageToDelete(undefined);
        setOpenModal(false);
        
        // Clear form value
        if (setValue && name) {
          setValue(name, []);
        }
      }
      
      // Call parent cleanup callback if provided
      if (onCleanup) {
        onCleanup();
      }
    }, [setValue, name, onCleanup]);

    // Function to handle loading with minimum duration (with different durations based on content)
    const setLoadingWithMinDuration = useCallback((loading: boolean, hasImages: boolean = false, additionalDelay: number = 0) => {
      if (!isMountedRef.current) return;
      
      if (loading) {
        // Clear any existing timer
        if (loadingTimerRef.current) {
          clearTimeout(loadingTimerRef.current);
        }
        
        // Record start time and set loading immediately
        startTimeRef.current = Date.now();
        setIsLoading(true);
      } else {
        // Calculate how long we've been loading
        const elapsed = Date.now() - startTimeRef.current;
        // Use different minimum durations based on whether we're showing images or upload area
        const minDuration = hasImages ? MIN_LOADING_DURATION_WITH_IMAGE : MIN_LOADING_DURATION_NO_IMAGE;
        const remainingTime = Math.max(0, minDuration + additionalDelay - elapsed);
        
        if (remainingTime > 0) {
          // Wait for remaining time before stopping loading
          loadingTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setIsLoading(false);
            }
            loadingTimerRef.current = null;
          }, remainingTime);
        } else {
          // Enough time has passed, stop loading immediately
          setIsLoading(false);
        }
      }
    }, []);

    // Initial cleanup before mount
    useEffect(() => {
      isMountedRef.current = true;
      cleanupAllState();
      
      return () => {
        isMountedRef.current = false;
        cleanupAllState();
      };
    }, []);

    // Handle prop changes with proper cleanup and loading states
    useEffect(() => {
      if (!isMountedRef.current) return;

      // Clear previous state completely before setting new state
      setIsDeletingImage(false);
      setIsUploadingImage(false);
      setImages([]);
      setDeletedImagePaths([]);
      setImageToDelete(undefined);
      setOpenModal(false);
      
      // Check if there are actually images to load
      const hasImagesToLoad = Array.isArray(initialImages) && initialImages.length > 0;
      
      if (hasImagesToLoad || parentIsLoading) {
        // Start loading with minimum duration based on content type
        setLoadingWithMinDuration(true, hasImagesToLoad);
        
        if (hasImagesToLoad) {
          // Process images after a short delay to ensure loading state is visible
          const timer = setTimeout(() => {
            if (!isMountedRef.current) return;
            
            const validImages = Array.isArray(initialImages) ? initialImages : [];
            setImages(validImages);
            
            if (setValue && name) {
              setValue(name, validImages);
            }
            
            // Stop loading with minimum duration (has images = true)
            setLoadingWithMinDuration(false, true);
          }, 100);
          
          return () => {
            clearTimeout(timer);
          };
        } else {
          // No images to load, but parent is loading - this means we'll show upload area
          // Use longer loading duration for upload area
          const timer = setTimeout(() => {
            if (!isMountedRef.current) return;
            
            // Stop loading with minimum duration (has images = false for upload area)
            setLoadingWithMinDuration(false, false);
          }, 100);
          
          return () => {
            clearTimeout(timer);
          };
        }
      } else {
        // No images to load and parent not loading - show upload area with longer loading
        setLoadingWithMinDuration(true, false); // Start loading for upload area
        
        const timer = setTimeout(() => {
          if (!isMountedRef.current) return;
          
          setImages([]);
          if (setValue && name) {
            setValue(name, []);
          }
          
          // Stop loading with longer duration for upload area
          setLoadingWithMinDuration(false, false);
        }, 100);
        
        return () => {
          clearTimeout(timer);
        };
      }
    }, [initialImages, update, setValue, name, parentIsLoading, setLoadingWithMinDuration]);
    
    // Handle parent loading state changes
    useEffect(() => {
      if (!isMountedRef.current) return;
      
      if (parentIsLoading) {
        // When parent starts loading, we don't know yet if there will be images
        // Use the longer duration as default, will be adjusted when images are processed
        const hasImages = Array.isArray(images) && images.length > 0;
        setLoadingWithMinDuration(true, hasImages);
      } else if (!isLoading && !isDeletingImage && !isUploadingImage) {
        // When parent stops loading, check if we have images to determine duration
        const hasImages = Array.isArray(images) && images.length > 0;
        setLoadingWithMinDuration(false, hasImages);
      }
    }, [parentIsLoading, isLoading, isDeletingImage, isUploadingImage, images, setLoadingWithMinDuration]);
    
    const onDrop = async (acceptedFiles: any) => {
      if (!isMountedRef.current || !canDelete) return;
      
      if (acceptedFiles.length === 0) return;
      
      // Start upload loading with minimum duration
      setIsUploadingImage(true);
      startTimeRef.current = Date.now();
      
      try {
        const imageObjects = acceptedFiles?.map((file: any) => {
          const objectURL = URL.createObjectURL(file);
          objectURLsRef.current.push(objectURL);
          
          return {
            file,
            URL: objectURL,
            path: file.path,
            size: file.size,
          };
        });

        const newImages = type === 'single' ? imageObjects : [...images, ...imageObjects];

        if (isMountedRef.current) {
          setImages(newImages);
          if (setValue && name) {
            setValue(name, newImages);
          }
        }
        
        // Add processing delay
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        // Stop upload loading with minimum duration (has images = true after upload)
        const elapsed = Date.now() - startTimeRef.current;
        const remainingTime = Math.max(0, MIN_LOADING_DURATION_WITH_IMAGE - elapsed);
        
        setTimeout(() => {
          if (isMountedRef.current) {
            setIsUploadingImage(false);
          }
        }, remainingTime);
      }
    };

    const handleDelete = async (imageToDelete: any) => {
      if (!isMountedRef.current || !canDelete) return;
      
      setOpenModal(false);
      
      // Start delete loading with minimum duration
      setIsDeletingImage(true);
      startTimeRef.current = Date.now();
      
      let filteredImages = [] as any;
      
      try {
        if (imageToDelete) {
          // Revoke object URL if it exists
          if (imageToDelete.URL && objectURLsRef.current.includes(imageToDelete.URL)) {
            URL.revokeObjectURL(imageToDelete.URL);
            objectURLsRef.current = objectURLsRef.current.filter(url => url !== imageToDelete.URL);
          }
          
          filteredImages = images?.filter((image: any) => image !== imageToDelete);
          
          if (isMountedRef.current) {
            setDeletedImagePaths((prev: any) => {
              const updatedPaths = [...prev, imageToDelete];
              return updatedPaths;
            });
          }
        } else {
          filteredImages = images.filter((image: any) => image !== imageToDelete);
        }

        if (isMountedRef.current) {
          setImages(filteredImages);
          if (setValue && name) {
            setValue(name, filteredImages);
          }
        }
        
        // Add processing delay
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Error deleting image:', error);
      } finally {
        // Stop delete loading with minimum duration
        // After deletion, check if there are remaining images to determine duration
        const hasRemainingImages = filteredImages && filteredImages.length > 0;
        const elapsed = Date.now() - startTimeRef.current;
        const minDuration = hasRemainingImages ? MIN_LOADING_DURATION_WITH_IMAGE : MIN_LOADING_DURATION_NO_IMAGE;
        const remainingTime = Math.max(0, minDuration - elapsed);
        
        setTimeout(() => {
          if (isMountedRef.current) {
            setIsDeletingImage(false);
          }
        }, remainingTime);
      }
    };

    useEffect(() => {
      if (!isMountedRef.current) return;
      
      if (deletedImagePaths.length > 0) {
        onImagesDeleted(deletedImagePaths);
      }
    }, [deletedImagePaths, onImagesDeleted]);

    // Cleanup when browser tab/window is closed or refreshed
    useEffect(() => {
      const handleBeforeUnload = () => {
        cleanupAllState();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [cleanupAllState]);

    // Cleanup when page route changes
    useEffect(() => {
      const handlePopState = () => {
        cleanupAllState();
      };

      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }, [cleanupAllState]);

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
      useDropzone({
        onDrop,
        disabled: !canDelete || isActuallyLoading,
        accept: {
          'image/png': [],
          'image/jpeg': [],
        },
      });

    function extractFileName(filePath: any) {
      const fileName = filePath.split('/').pop();
      return fileName.replace(/^\d+-/, '');
    }

    // Show loading spinner during any loading operation
    if (isActuallyLoading) {
      return (
        <div className="loading-spinner-container">
          <CircularProgress style={{ color: '#344052' }} />
        </div>
      );
    }

    return (
      <div>
        {/* Show images if available */}
        {Array.isArray(images) && images.length > 0 && (
          <>
            {images.map((image: any, index) => {
              const uniqueKey = image || image?.path || `image-${index}`;
              return (
                <div className='imageBlock' key={uniqueKey}>
                  <div className='imageWrapper'>
                    <img 
                      className='sImage'
                      src={image?.URL || image}
                      alt={`Selected ${index}`}
                      onLoad={() => {
                        // Image loaded successfully
                      }}
                      onError={() => {
                        console.warn('Image load error:', image);
                      }}
                    />
                  </div>
                  {/* Only show delete icon if user has permission */}
                  {canDelete && (
                    <span className='deleteIcon' onClick={() => {
                      if (isMountedRef.current) {
                        setOpenModal(true);
                        setImageToDelete(image);
                      }
                    }}>
                      <DeleteIcon/>
                    </span>
                  )}
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
          </>
        )}
        
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
        
        {/* Show upload area if no images and user has permission */}
        {images.length === 0 && canDelete && (
          <div className='containerForImageToUpload'>
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
        )}
      </div>
    );
  },
);

/* eslint-enable @typescript-eslint/no-explicit-any */
export { ImagesUploader };