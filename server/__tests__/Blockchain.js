import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex';
import Blockchain from '../Blockchain';

describe('server/Blockchain.js', () => {
  it('is class(function)', () => {
    expect(typeof Blockchain).toEqual('function');
  });

  describe('constructor', () => {
    it('creates an instance with some member variables', () => {
      const block = new Blockchain();
      expect(Array.isArray(block._chain)).toEqual(true);
      expect(Array.isArray(block._currentTransactions)).toEqual(true);
      expect(block._chain.length).toEqual(1);
    });
  });

  describe('Instance methods', () => {
    describe('The newBlock method', () => {
      it('throws Error if invalid argument is set.', () => {
        const block = new Blockchain();
        const invalidCall = () => {
          block.newBlock();
        };
        expect(invalidCall).toThrowError('Need to set `proof`');
      });

      it('adds a block into instance._chain and returns the block.', () => {
        const block = new Blockchain();
        const newBlock = block.newBlock({proof: 100});
        expect(newBlock).toEqual(block._chain[block._chain.length - 1]);
      });
    });

    describe('The newTransaction method', () => {
      it('throws error if arguments are invalid', () => {
        const block = new Blockchain();
        const invalidArguments = [
          // [sender, recipient, amount]
          [null, 'address_of_recipient', 100],
          ['address_of_sender', null, 100],
          ['address_of_sender', 'address_of_recipient', null],
          ['address_of_sender', 'address_of_recipient', 0],
          ['address_of_sender', 'address_of_recipient', -1],
        ];

        invalidArguments.forEach(args => {
          const invalidCall = () => {
            block.newTransaction(...args);
          };
          expect(invalidCall).toThrowError('Invalid params.');
        });
      });

      it('adds a transaction into instance._currentTransaction and returns index of next block', () => {
        const block = new Blockchain();
        const sender = 'address_of_sender';
        const recipient = 'address_of_recipient';
        const amount = 9999;

        expect(block._currentTransactions.length).toEqual(0);

        block.newTransaction(sender, recipient, amount);
        expect(block._currentTransactions.length).toEqual(1);
        expect(block._currentTransactions[0]).toEqual({
          sender,
          recipient,
          amount
        });

      });
    });

    describe('The lastBlock getter', () => {
      it('returns last block in instance._chain.', () => {
        const block = new Blockchain();
        expect(block.lastBlock).toEqual(block._chain[0]);

        block.newTransaction('ADDRESS_1', 'ADDRESS_2', 1234);
        block.newBlock({proof: 100});
        expect(block.lastBlock).toEqual(block._chain[1]);
      });
    });
  });

  describe('Class methods', () => {
    describe('The hash method', () => {
      it('returns hashed value', () => {
        const planeValue = {a:1, b:2};
        const hashedValue = hex.stringify(sha256(planeValue));

        expect(Blockchain.hash(planeValue)).toEqual(hashedValue);
      });
    });
  });
});