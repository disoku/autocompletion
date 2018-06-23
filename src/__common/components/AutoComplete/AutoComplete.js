import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class AutoComplete extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.onChange = this.onChange.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.renderInput = this.renderInput.bind(this);
    }

    onChange(event) {
        this.props.onChange(event, event.target.value)
    }

    onInputBlur(event) {
        // this.setState({ isOpen: false });
        const { onBlur } = this.props.inputProps;
        if (onBlur) {
            onBlur(event)
        }
    }

    onInputFocus(event) {
        this.setState({ isOpen: true });
        const { onFocus } = this.props.inputProps;
        if (onFocus) {
            onFocus(event)
        }
    }

    renderItems() {
        const { items } = this.props;

        return <div className={`items`} style={{
            height: '300px',
            overflow: 'hidden',
            overflowY: 'scroll',
            overflowX: 'hidden',
            position: 'absolute',
            width: '100%',
            backgroundColor: '#f7f9fa'
        }}>
            {items.map(item => <div className={`item`} key={item}>{item}</div>)}
        </div>
    }

    renderInput() {
        const { inputProps, value } = this.props;

        return <input {...inputProps} onFocus={this.onInputFocus} onBlur={this.onInputBlur} onChange={this.onChange}
                      value={value}
                      style={{
                          width: '100%'
                      }}/>
    }

    render() {
        const { isOpen } = this.state;

        return (
            <div style={{ width: '300px', position: 'relative', ...this.props.containerStyle }} {...this.props.containerProps}>
                {this.renderInput()}
                {isOpen && this.renderItems()}
            </div>
        )
    }
}


AutoComplete.propTypes = {
    items: PropTypes.array.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
};

AutoComplete.defaultProps = {
    inputProps: {}
};

export default AutoComplete;
