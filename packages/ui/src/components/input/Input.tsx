
import React, { useState } from "react";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  size?: "large" | "middle" | "small";
  type?: "text" | "password";
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  allowClear?: boolean;
  maxLength?: number;
  showCount?: boolean;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

type InputComponent = React.FC<InputProps> & {
  TextArea: React.FC<InputProps>;
  Search: React.FC<SearchProps>;
  Password: React.FC<InputProps>;
};

export const Input: InputComponent = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  size = "middle",
  type = "text",
  className,
  prefix,
  suffix,
  addonBefore,
  addonAfter,
  maxLength,
  onPressEnter,
  onKeyDown,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown && onKeyDown(e);
    if (e.key === "Enter") {
      onPressEnter && onPressEnter(e);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getSizeClass = () => {
    switch (size) {
      case "large":
        return "py-3 px-4 text-lg";
      case "small":
        return "py-1 px-2 text-sm";
      default:
        return "py-2 px-3";
    }
  };

  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  const inputElement = (
    <input
      type={inputType}
      placeholder={placeholder}
      value={value !== undefined ? value : inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      maxLength={maxLength}
      className={`border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${getSizeClass()} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className || ""}`}
    />
  );

  const renderSuffix = () => {
    if (type === "password") {
      return (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-hidden"
        >
          {isPasswordVisible ? "Hide" : "Show"}
        </button>
      );
    }
    return suffix;
  };

  const renderInput = () => {
    if (prefix || suffix || type === "password") {
      return (
        <div className={`flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 ${getSizeClass()} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className || ""}`}>
          {prefix && <div className="mr-2">{prefix}</div>}
          <input
            type={inputType}
            placeholder={placeholder}
            value={value !== undefined ? value : inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={maxLength}
            className="flex-1 focus:outline-hidden"
          />
          {renderSuffix()}
        </div>
      );
    }
    return inputElement;
  };

  if (addonBefore || addonAfter) {
    return (
      <div className="flex">
        {addonBefore && (
          <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
            {addonBefore}
          </div>
        )}
        {renderInput()}
        {addonAfter && (
          <div className="flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md">
            {addonAfter}
          </div>
        )}
      </div>
    );
  }

  return renderInput();
};

// TextArea 组件
export const TextArea: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  size = "middle",
  className,
  maxLength,
  showCount,
  autoSize = false,
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e as any);
  };

  const getSizeClass = () => {
    switch (size) {
      case "large":
        return "py-3 px-4 text-lg";
      case "small":
        return "py-1 px-2 text-sm";
      default:
        return "py-2 px-3";
    }
  };

  const getAutoSizeStyle = () => {
    if (!autoSize) return {};

    if (typeof autoSize === "boolean") {
      return { minHeight: "80px" };
    }

    const { minRows = 2, maxRows = 6 } = autoSize;
    return { 
      minHeight: `${minRows * 24}px`,
      maxHeight: `${maxRows * 24}px`
    };
  };

  return (
    <div className={`relative ${className || ""}`}>
      <textarea
        placeholder={placeholder}
        value={value !== undefined ? value : inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        maxLength={maxLength}
        className={`border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${getSizeClass()} ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} w-full`}
        style={{ ...getAutoSizeStyle(), resize: autoSize ? "none" : "vertical" }}
      />
      {showCount && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {inputValue.length}{maxLength ? `/${maxLength}` : ""}
        </div>
      )}
    </div>
  );
};

// Search 组件
interface SearchProps extends InputProps {
  onSearch?: any;
  enterButton?: boolean | React.ReactNode;
  loading?: boolean;
}

export const Search: React.FC<SearchProps> = ({
  onSearch,
  enterButton = false,
  loading = false,
  ...inputProps
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    onSearch && onSearch(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    inputProps.onPressEnter && inputProps.onPressEnter(e);
  };

  const renderSearchButton = () => {
    if (enterButton === true) {
      return (
        <button
          onClick={handleSearch}
          disabled={loading}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? "..." : "Search"}
        </button>
      );
    }

    if (typeof enterButton === "object") {
      return (
        <button
          onClick={handleSearch}
          disabled={loading}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? "..." : enterButton}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="flex">
      <Input
        {...inputProps}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {renderSearchButton()}
    </div>
  );
};

// Password 组件
export const Password: React.FC<InputProps> = (props) => {
  return <Input {...props} type="password" />;
};

Input.TextArea = TextArea;
Input.Search = Search;
Input.Password = Password;
