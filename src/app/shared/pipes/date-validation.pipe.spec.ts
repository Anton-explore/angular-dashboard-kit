import { DateValidationPipe } from './date-validation.pipe';

describe('DateValidationPipe', () => {
  it('create an instance', () => {
    const pipe = new DateValidationPipe();
    expect(pipe).toBeTruthy();
  });
});
