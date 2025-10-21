import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Highlighted } from '../Highlighted';

describe('Highlighted', () => {
  it('should render null when content is null', () => {
    const { container } = render(<Highlighted content={null} search="test" />);
    expect(container.textContent).toBe('');
  });

  it('should render content without highlighting when search is null', () => {
    render(<Highlighted content="Hello World" search={null} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render content without highlighting when search is empty', () => {
    render(<Highlighted content="Hello World" search="" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should highlight matching text', () => {
    const { container } = render(
      <Highlighted content="Hello World" search="World" />
    );
    const highlighted = container.querySelector('.highlighted');
    expect(highlighted).toBeInTheDocument();
    expect(highlighted?.textContent).toBe('World');
  });

  it('should be case-insensitive', () => {
    const { container } = render(
      <Highlighted content="Hello World" search="world" />
    );
    const highlighted = container.querySelector('.highlighted');
    expect(highlighted).toBeInTheDocument();
    expect(highlighted?.textContent).toBe('World');
  });

  it('should highlight multiple occurrences', () => {
    const { container } = render(
      <Highlighted content="test test test" search="test" />
    );
    const highlighted = container.querySelectorAll('.highlighted');
    expect(highlighted).toHaveLength(3);
  });

  it('should use custom className', () => {
    const { container } = render(
      <Highlighted content="Hello World" search="World" className="custom-class" />
    );
    const highlighted = container.querySelector('.custom-class');
    expect(highlighted).toBeInTheDocument();
  });
});
