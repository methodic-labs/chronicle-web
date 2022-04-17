global.console = {
  debug: console.debug,
  error: jest.fn(),
  log: jest.fn(),
  trace: console.trace,
  warn: jest.fn(),
};
