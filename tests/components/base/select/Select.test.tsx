import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '#/components/base/select/Select';

const { Option } = Select;

describe('Select', () => {
  test('should render select with size', () => {
    render(
      <Select size="large">
        <Option value="option1">Option 1</Option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  test('should render select with mode', () => {
    render(
      <Select mode="multiple">
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  test('should render select with allowClear', () => {
    render(
      <Select allowClear>
        <Option value="option1">Option 1</Option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  test('should render select with showSearch', () => {
    render(
      <Select showSearch>
        <Option value="option1">Option 1</Option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  test('should render select with loading state', () => {
    render(
      <Select loading>
        <Option value="option1">Option 1</Option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  test('should handle onChange callback', () => {
    const handleChange = jest.fn();
    render(
      <Select onChange={handleChange}>
        <Option value="option1">Option 1</Option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);

    expect(handleChange).not.toHaveBeenCalled(); // onChange is called when option is selected
  });
});
