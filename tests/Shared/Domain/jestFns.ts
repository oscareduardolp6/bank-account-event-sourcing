
export function getNumberOfCalls(mock: jest.Mock) {
  return mock.mock.calls.length
}

export function getArgumentOfCall(mock: jest.Mock, callNum = 1) {
  return mock.mock.calls[callNum - 1][0]
}