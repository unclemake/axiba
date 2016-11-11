import * as React from 'react';
import '../antd/button/style/index.css';
import { default as Butt, ButtonProps } from 'antd/lib/button/button';
import Spin from '../spin/index';
let Button: typeof Butt = require('antd/lib/button/index');
export { Button };
let SpinC = Spin as any;
export default class Component extends React.Component<ButtonProps, { loading: boolean }> {

    state = {
        loading: false
    }

    onClick(e) {
        let onClickBack: any = this.props.onClick(e);
        let self = this;
        if (onClickBack.then) {
            self.state.loading = true;
            self.setState(self.state);

            return onClickBack.then(function (arg) {
                self.state.loading = false;
                self.setState(self.state);
                return arg;
            }, function (arg) {
                self.state.loading = false;
                self.setState(self.state);
                return arg;
            });
        } else {
            return onClickBack;
        }
    }

    render() {
        return (<SpinC spinning={this.state.loading} size="small" style={{ display: 'inline-block' }}  >
            <Button onClick={this.props.onClick ? this.onClick.bind(this) : () => { } }>
                {this.props.children}
            </Button>
        </SpinC>);
    }
}