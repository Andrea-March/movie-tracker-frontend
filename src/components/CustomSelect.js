import React, { useState } from 'react';
import './CustomSelect.css';

const CustomSelect = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleOptionClick = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedLabel = options.find(option => option.value === value)?.label || "Seleziona";

    return (
        <div className="custom-select-container">
            <div
                className={`custom-select ${isOpen ? 'open' : ''}`}
                onClick={handleToggle}
                tabIndex={0} // rende il div focusable
                onBlur={() => setIsOpen(false)}
            >
                {selectedLabel}
            </div>
            {isOpen && (
                <div className="custom-options">
                    {options.map(option => (
                        <div
                            key={option.value}
                            className="custom-option"
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;