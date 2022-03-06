import {components} from 'react-select';

import './AsyncTemplates.css';

//Declare a template for the menu so it doesnt show an empty dropdown on first tap
export const customMenu = props => {
    if (props.selectProps.inputValue.length === 0) return null
    return (
        <>
        <components.Menu {...props} />
        </>
    ) 
};

//Declare the custom template for the dropdown
export const customOption = props => {
    const { innerProps, innerRef } = props;
    return (
        <div ref={innerRef} {...innerProps} className="custom-option" style={{ backgroundColor: props.isFocused ? "lightblue" : "inherit" }}>
            <div style={{display: props.data.header?"flex":"none"}}>
                <div className="custom-option-header" >{props.data.label}</div>
                <div className='custom-option-version'>{props.data.version}</div>
            </div>
            <div className="custom-option-desc">{props.data.description}</div>
        </div>
    );
};