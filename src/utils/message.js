//封装的Message
import { Message } from 'element-ui';

export default {
  info (message) {
    popMessage(message, "")
  },
  success (message) {
    popMessage(message, "success")
  },
  warning (message) {
    popMessage(message, "warning")
  },
  error (message) {
    popMessage(message, "error")
  },
}

function popMessage (message, type) {
  Message({
    message: message,
    type: type,
    showClose: true
  });
}