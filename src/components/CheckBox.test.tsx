import { render, screen } from '@testing-library/react';
import { CheckBoxComponent } from './CheckBox';

// The checkbox should be rendered as unchecked by default
test('renders the checkbox', () => {
    render(<CheckBoxComponent  />);

    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.classList.contains('bg-indigo-600')).toBeFalsy()
});

// The checkbox should be rendered as checked
test('renders the checkbox', () => {
    render(<CheckBoxComponent checked={true}  />);

    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.classList.contains('bg-indigo-600')).toBeTruthy()
});