import { NotificationManager } from 'react-notifications';

export default function clipboard(string) {
    var textField = document.createElement("textarea");
    textField.innerText = string;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    NotificationManager.info(`${string}`, 'คัดลอกเรียบร้อยแล้ว', 1000);
}
