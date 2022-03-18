import { NotificationManager } from 'react-notifications';

export const createNotification = (type, title, message, duration) => {
    console.log(type);
    return () => {
        switch (type) {
            case 'info':
                NotificationManager.info(message, title, duration);
                break;
            case 'success':
                NotificationManager.success(message, title, duration);
                break;
            case 'warning':
                NotificationManager.warning(message, title, duration);
                break;
            case 'error':
                NotificationManager.error(message, title, duration, () => {
                    alert('callback');
                });
                break;
        }
    };
};