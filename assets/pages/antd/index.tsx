import * as React from 'react';
import Button from '../../components/button/index';
import Select from '../../components/select/index';
import Validate from '../../components/validate/index';

const Option = Select.Option;
export default class Component extends React.Component<any, void> {
    render() {
        return <section className="page=home">
            <h2>我是内页</h2>
            <Button>Hello world!</Button>
            <Select size="large" defaultValue="lucy" style={{ width: 200 }} onChange={handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>Disabled</Option>
                <Option value="yiminghe">Yiminghe</Option>
            </Select>
            <h2>验证插件</h2>
            <div>
                <Validate required={true} min={10} />
            </div>
        </section>
    }
}

function handleChange(value) {
    console.log(`selected ${value}`);
}
