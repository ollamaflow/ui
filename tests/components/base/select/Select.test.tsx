import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OllamaFlowSelect from "#/components/base/select/Select";

describe("OllamaFlowSelect", () => {
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  test("should render select with options", () => {
    render(<OllamaFlowSelect options={mockOptions} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  // test('should render select with placeholder', () => {
  //   const placeholder = 'Select an option';
  //   render(<OllamaFlowSelect options={mockOptions} placeholder={placeholder} />);

  //   expect(screen.getByText(placeholder)).toBeInTheDocument();
  // });

  // test('should render select with custom style', () => {
  //   const customStyle = { width: '200px' };
  //   const { container } = render(<OllamaFlowSelect options={mockOptions} style={customStyle} />);

  //   const select = container.querySelector('.ant-select');
  //   expect(select).toBeInTheDocument();
  // });

  // test('should render readonly select', () => {
  //   render(<OllamaFlowSelect options={mockOptions} readonly={true} />);

  //   const select = screen.getByRole('combobox');
  //   expect(select).toHaveAttribute('aria-readonly', 'true');
  // });

  test("should render select with default value", () => {
    const defaultValue = "option1";
    render(
      <OllamaFlowSelect options={mockOptions} defaultValue={defaultValue} />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with value", () => {
    const value = "option2";
    render(<OllamaFlowSelect options={mockOptions} value={value} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with multiple mode", () => {
    render(<OllamaFlowSelect options={mockOptions} mode="multiple" />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with allowClear", () => {
    render(<OllamaFlowSelect options={mockOptions} allowClear />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  // test('should render select with disabled state', () => {
  //   render(<OllamaFlowSelect options={mockOptions} disabled />);

  //   const select = screen.getByRole('combobox');
  //   expect(select).toBeDisabled();
  // });

  test("should render select with loading state", () => {
    render(<OllamaFlowSelect options={mockOptions} loading />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with size", () => {
    render(<OllamaFlowSelect options={mockOptions} size="large" />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with showSearch", () => {
    render(<OllamaFlowSelect options={mockOptions} showSearch />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with filterOption", () => {
    const filterOption = (input: string, option: any) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

    render(
      <OllamaFlowSelect options={mockOptions} filterOption={filterOption} />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with onSearch callback", () => {
    const onSearch = jest.fn();
    render(<OllamaFlowSelect options={mockOptions} onSearch={onSearch} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with onChange callback", () => {
    const onChange = jest.fn();
    render(<OllamaFlowSelect options={mockOptions} onChange={onChange} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with onFocus callback", () => {
    const onFocus = jest.fn();
    render(<OllamaFlowSelect options={mockOptions} onFocus={onFocus} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with onBlur callback", () => {
    const onBlur = jest.fn();
    render(<OllamaFlowSelect options={mockOptions} onBlur={onBlur} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with dropdownRender", () => {
    const dropdownRender = (menu: React.ReactElement) => (
      <div>
        {menu}
        <div>Custom dropdown content</div>
      </div>
    );

    render(
      <OllamaFlowSelect options={mockOptions} dropdownRender={dropdownRender} />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  // test('should render select with all props combined', () => {
  //   const onChange = jest.fn();
  //   const onSearch = jest.fn();
  //   const customStyle = { width: '300px' };

  //   render(
  //     <OllamaFlowSelect
  //       options={mockOptions}
  //       placeholder="Select an option"
  //       style={customStyle}
  //       readonly={false}
  //       allowClear
  //       showSearch
  //       onChange={onChange}
  //       onSearch={onSearch}
  //       size="middle"
  //     />
  //   );

  //   expect(screen.getByRole('combobox')).toBeInTheDocument();
  //   expect(screen.getByText('Select an option')).toBeInTheDocument();
  // });

  test("should render select without options", () => {
    render(<OllamaFlowSelect />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  test("should render select with empty options array", () => {
    render(<OllamaFlowSelect options={[]} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
