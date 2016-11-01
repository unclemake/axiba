import * as React from 'react';
import Button from '../../components/button/index';
import Select from '../../components/select/index';

const Option = Select.Option;
export default class Component extends React.Component<any, void> {
    render() {
        return <section className="page=home">
            <h2>我是内页</h2>
            <Button>Hello world!</Button>
            <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
            </Select>
        </section>
    }
}

function handleChange(value) {
    console.log(`selected ${value}`);
}
