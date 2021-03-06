import React from 'react';

export const Feedback = () => <div>Feedback</div>;

export const indicators = {
  Correct: () => <div>Correct</div>,
};

export const color = {
  text: jest.fn(),
  correct: jest.fn(),
  incorrect: jest.fn(),
  disabled: jest.fn(),
  primary: jest.fn(),
  primaryText: jest.fn(),
  secondary: jest.fn(),
  secondaryText: jest.fn(),
};
