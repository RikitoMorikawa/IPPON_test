import { useState, useEffect, useCallback } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import checkMark from '../../assets/check_circle2.png';
import deleteIcon from '../../assets/delete.png';
import errorIcon from '../../assets/error_icon.png';
import './Toastify.css'
import { useNavigate } from 'react-router';
/* eslint-disable @typescript-eslint/no-explicit-any */
const Icon = ({ type }:any) => {
  let icon;

  if (type === 'success') {
    icon = <img src={checkMark} alt="check_mark" />;
  } else if (type === 'error') {
    icon = <img src={errorIcon} style={{ width: '20px' }} alt="errorIcon" />;
  } else if (type === 'deleted') {
    icon = <img src={deleteIcon} alt="deleteIcon" />;
  } else {
    icon = <PriorityHighIcon/>;
  }

  return <span className='icon'>{icon}</span>;
};

const Toast = ({
  message,
  secondMessage = '',
  type,
  linkId = '',
  linkName = '',
  onClose,
}:any) => {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const triggerClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const detailHandler = () => {
    navigate(`/properties/search_properties/${linkId}`);
    onClose();
  };

  return (
    <div className={`toastMessage ${isClosing ? 'fade-out':'fade-in'} ${type}`} >
      <div className={`topLineWrapper ${linkName !==''? 'isLink': ''}`}>
        <div className='messageWrapper'>
          <span style={{ display: 'flex' }}>
            <Icon type={type} />
          </span>
          <p style={{ fontSize: '16px',margin:'0',fontWeight:'700' }}>
            {message}
            {secondMessage !== '' && (
              <>
                <br />
                {secondMessage}
              </>
            )}
          </p>
        </div>
        <button className='closeButton' onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      {linkId && linkName && (
        <div className='bottomWrapper'>
          <div className='linkName'>
            物件名:
            <p className='link' onClick={detailHandler}>
              {linkName}
              <span style={{ marginLeft: '5px' }}>
                <OpenInNewIcon/>
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const ToastManager = () => {
  const [toasts, setToasts] = useState<any>([]);

  useCallback(
    ({ message, secondMessage = '', type, linkId = '', linkName = '' }:any) => {
      const id = Date.now();
      setToasts((prevToasts:any) => [
        ...prevToasts,
        { id, message, secondMessage, type, linkId, linkName },
      ]);
    },
    [],
  );

  const removeToast = useCallback((id:any) => {
    setToasts((prevToasts:any) => prevToasts.filter((toast:any) => toast.id !== id));
  }, []);

  return (
    <div className='toastContainer'>
      {toasts.map((toast:any) => (
        <Toast
          key={toast.id}
          message={toast.message}
          secondMessage={toast.secondMessage}
          type={toast.type}
          linkId={toast.linkId}
          linkName={toast.linkName}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<any>([]);

  const addToast = useCallback(
    ({
      message,
      secondMessage = '',
      type,
      // textColor,
      textColor = '#3e3e3e',
      linkId = '',
      linkName = '',
    }:any) => {
      const id = Date.now();
      setToasts((prevToasts:any) => [
        ...prevToasts,
        { id, message, secondMessage, type, textColor, linkId, linkName },
      ]);
    },
    [],
  );

  const removeToast = useCallback((id:any) => {
    setToasts((prevToasts:any) => prevToasts.filter((toast:any) => toast.id !== id));
  }, []);

  return {
    addToast,
    toasts: (
      <div className='toastContainer'>
        {toasts.map((toast:any) => (
          <Toast
            key={toast.id}
            message={toast.message}
            secondMessage={toast.secondMessage}
            type={toast.type}
            linkId={toast.linkId}
            linkName={toast.linkName}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    ),
  };
};
/* eslint-enable @typescript-eslint/no-explicit-any */