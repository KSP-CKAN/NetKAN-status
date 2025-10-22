import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../select';

describe('Select', () => {
  it('should render without crashing', () => {
    render(
      <Select>
        <option value="test">Test Option</option>
      </Select>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should display placeholder when provided', () => {
    render(
      <Select placeholder="Select an option">
        <option value="test">Test Option</option>
      </Select>
    );

    expect(screen.getByRole('option', { name: 'Select an option' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Select an option' })).toBeDisabled();
  });

  it('should render options correctly', () => {
    render(
      <Select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );

    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
  });

  it('should call onChange when selection changes', () => {
    const handleChange = vi.fn();
    render(
      <Select onChange={handleChange}>
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option1' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({ value: 'option1' })
    }));
  });

  it('should apply custom className', () => {
    render(
      <Select className="custom-class">
        <option value="test">Test</option>
      </Select>
    );

    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });

  it('should display chevron icon', () => {
    const { container } = render(
      <Select>
        <option value="test">Test</option>
      </Select>
    );

    // Check for the ChevronDown icon (svg element)
    const chevronIcon = container.querySelector('svg');
    expect(chevronIcon).toBeInTheDocument();
  });

  it('should handle disabled state', () => {
    render(
      <Select disabled>
        <option value="test">Test</option>
      </Select>
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should set correct value when controlled', () => {
    const handleChange = vi.fn();
    render(
      <Select value="option2" onChange={handleChange}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </Select>
    );

    expect(screen.getByRole('combobox')).toHaveValue('option2');
  });
});
