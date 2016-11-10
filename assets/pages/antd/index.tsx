import * as React from 'react';
import Button from '../../components/button/index';
import Select from '../../components/select/index';
import Input from '../../components/input/index';
import Tree from '../../components/tree/index';
import DatePicker from '../../components/date-picker/index';
import { error, success } from '../../components/notification/index';
import { default as Validate, addRule } from '../../components/validate/index';
let TreeNode = Tree.TreeNode;

addRule({
    key: 'gan',
    messages: () => '必须 = 你好',
    rule: (value, parameter) => value === '你好',
})

const Option = Select.Option;
export default class Component extends React.Component<any, void> {
    render() {
        return <section className="page=home">
            <h2>插件</h2>
            <ul>
                <li>
                    <h3>按钮</h3>
                    <Button>Hello world!</Button>
                </li>
                <li>
                    <h3>下拉框</h3>
                    <Select size="large" defaultValue="lucy" style={{ width: 200 }} onChange={handleChange}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>Disabled</Option>
                        <Option value="yiminghe">Yiminghe</Option>
                    </Select>
                </li>
                <li>
                    <h3>输入框</h3>
                    <Input />
                </li>
                <li>
                    <h3>弹窗</h3>
                    <Button onClick={() => success({
                        message: '你好',
                        description: 'success'
                    })}>success</Button>
                    <Button onClick={() => error({
                        message: '你好',
                        description: 'error'
                    })}>error</Button>
                </li>
                <li>
                    <h3>时间</h3>
                    <DatePicker />
                </li>
                <li>
                    <h3>树</h3>
                    <Tree className="myCls">
                        <TreeNode title="parent 1" key="0-0">
                            <TreeNode title="parent 1-0" key="0-0-0" disabled>
                                <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
                                <TreeNode title="leaf" key="0-0-0-1" />
                            </TreeNode>
                            <TreeNode title="parent 1-1" key="0-0-1">
                                <TreeNode title={<span style={{ color: '#08c' }}>sss</span>} key="0-0-1-0" />
                            </TreeNode>
                        </TreeNode>
                    </Tree>
                </li>
            </ul>
            <h2>验证插件</h2>
            <div>
                <h3>字符串长度 大小=&gt;10 =&lt;20</h3>
                <Validate required={true} min={10} max={20} />
            </div>
            <div>
                <h3>字符串长度 最短10 最长12</h3>
                <Validate required={true} minLength={10} maxLength={12} />
            </div>
            <div>
                <h3>只能输入英文和数字和中文</h3>
                <Validate noSymbol={true} />
            </div>
            <div>
                <h3>手机号码</h3>
                <Validate telephone={true} />
            </div>
            <div>
                <h3>自定义规则</h3>
                <Validate gan={true} />
                <code>
                    {`addRule({
                        key: 'gan',
                        messages: () => '必须 = 你好',
                        rule: (value, parameter) => value === '你好',
                    })`}
                </code>
            </div>
        </section>
    }
}

function handleChange(value) {
    console.log(`selected ${value}`);
}
