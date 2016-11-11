import '../antd/select/style/index.css';
import Select from 'antd/lib/select/index';
let selectAll = require('antd/lib/select/index');
let select: typeof Select = selectAll;
export let Option: typeof Select.Option = selectAll.Option;
export let OptGroup: typeof Select.OptGroup = selectAll.OptGroup;
export default select;
