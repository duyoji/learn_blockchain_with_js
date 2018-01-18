import server from '../server';

describe('server.js', () => {
  it('should return a function', () => {
    expect(typeof server).toEqual('function');
  });
});