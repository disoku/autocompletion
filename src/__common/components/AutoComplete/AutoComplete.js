import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const defaultStyles = {
  items: {
      overflow: 'hidden',
      overflowY: 'scroll',
      overflowX: 'hidden',
      position: 'absolute',
      width: '100%',
  }
};

class AutoComplete extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isBlurListened: true,
            highlightedIndex: null
        };
    }

    /**
     * Primitive implementation keyboard control
     * @type {{ArrowDown: (function(): void), ArrowUp: (function(): void), Enter: AutoComplete.KeyboardHandlers.Enter}}
     */
    KeyboardHandlers = {
        ArrowDown: () => this.setHighlightedIndex(this.state.highlightedIndex + 1),
        ArrowUp: () => this.setHighlightedIndex(this.state.highlightedIndex - 1),
        Enter:      () => {
            const { highlightedIndex } = this.state;
            const { items, onClick, getItemTitle } = this.props;
            const item = items[highlightedIndex];
            onClick(getItemTitle(item), item);
            this.setState({ isOpen: false });
        }
    };

    onChange = (event) => {
        this.props.onChange(event, event.target.value)
    };

    onInputBlur = (event) => {
        const { isBlurListened } = this.state;
        if (!isBlurListened) {
            return
        }
        this.setState({ isOpen: false });
        const { onBlur } = this.props.inputProps;
        if (onBlur) {
            onBlur(event)
        }
    };

    onInputFocus = (event) => {
        this.setState({ isOpen: true });
        const { onFocus } = this.props.inputProps;
        if (onFocus) {
            onFocus(event);
        }
    };

    onItemClick = (e) => {
        e.preventDefault();
        const { onItemClick } = this.props;
        if (onItemClick) {
            onItemClick(e);
        }
    };

    setHighlightedIndex = (index) => {
      this.setState({highlightedIndex: index});
    };

    onItemClick = (item) => {
        const value = this.props.getItemTitle(item);
        this.setState({
            isOpen: false,
            highlightedIndex: null
        },
        this.props.onClick(value, item));
    };

    // Need to ignore blur right before click on item
    // (otherwise items will be closed before onClick handled)
    ignoreBlur = () => this.setState({ isBlurListened: false });

    listenBlur = () => this.setState({ isBlurListened: true });

    onKeyDown = (e) => {
        const handler = this.KeyboardHandlers[e.key];
        if (handler) {
            handler();
        }
    };

    renderItems() {
        const { items, getItemTitle } = this.props;
        const { highlightedStyle, itemStyle, itemsStyle } = this.props.style;
        const { highlightedIndex } = this.state;

        return <div className={`items`}
                    onMouseEnter={this.ignoreBlur}
                    onMouseLeave={this.listenBlur}
                    style={{ ...itemsStyle, ...defaultStyles.items }}>
            {items.map((item, i) => <div className="item" key={getItemTitle(item)}
                                         onClick={() => this.onItemClick(item)}
                                         onMouseEnter={() => this.setHighlightedIndex(i)}
                                         style={i === highlightedIndex ? { ...itemStyle, ...highlightedStyle } : itemStyle}>
                {getItemTitle(item)}
            </div>)}
        </div>
    }

    renderInput() {
        const { inputProps, value } = this.props;

        return <input {...inputProps} onFocus={this.onInputFocus} onBlur={this.onInputBlur} onChange={this.onChange}
                      onKeyDown={this.onKeyDown}
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
    /**
     * Items for displaying
     */
    items: PropTypes.array.isRequired,
    /***
     * Args: item: any
     * Used to get the title for display in `items`.
     */
    getItemTitle: PropTypes.func.isRequired,
    /***
     * Input value
     */
    value: PropTypes.string,
    /***
     * Props for input component
     */
    inputProps: PropTypes.object,
    /***
     * Args event: event, value: string
     * Used to handle input change
     */
    onChange: PropTypes.func,
    /***
     * Args value: string, item: any
     * Used to handle click on item
     */
    onClick: PropTypes.func,
    /**
     * Styles for overriding
     */
    style: PropTypes.shape({
        /***
         * The style for highlighted item
         */
        highlightedStyle: PropTypes.object,
        /***
         * The style for each item
         */
        itemStyle: PropTypes.object,
        /***
         * The style for items block
         */
        itemsStyle: PropTypes.object
    })
};

AutoComplete.defaultProps = {
    inputProps: {},
    style: {
        highlightedStyle: {
            backgroundColor: '#3B3E41',
            color: 'antiquewhite',

        },
        itemStyle: {
            backgroundColor: 'lightcyan',
            cursor: 'pointer'
        },
        itemsStyle: {
            maxHeight: '300px',
            backgroundColor: '#f7f9fa'
        }
    },
    onClick: () => {},
    onChange: () => {}
};

export default AutoComplete;
