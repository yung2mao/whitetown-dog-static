import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
import { Button } from 'element-ui'
// eslint-disable-next-line no-unused-vars,import/no-duplicates
import { Message } from 'element-ui'
import { MessageBox } from 'element-ui';

Vue.use(Button)
Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox
