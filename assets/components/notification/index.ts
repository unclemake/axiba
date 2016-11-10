import '../antd/notification/style/index.css';
import { Notification, ArgsProps } from 'antd/lib/notification/index';
let notification: typeof Notification = require('antd/lib/notification/index');

export default notification;
export let open: (args: ArgsProps) => void = notification.open;
export let success: (args: ArgsProps) => void = notification.success;
export let info: (args: ArgsProps) => void = notification.info;
export let error: (args: ArgsProps) => void = notification.error;
export let warning: (args: ArgsProps) => void = notification.warning;
