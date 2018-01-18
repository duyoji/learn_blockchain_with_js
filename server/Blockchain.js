import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex';

class Blockchain {
  constructor() {
    this._chain = [];
    this._currentTransactions = [];

    // Create a genesis block
    // '1' means genesis block.
    this.newBlock({previous_hash: '1', proof: 100});
  }

  /**
   *
   * @param {object} param0 proof(required): proof by POW. previous_hash(option): hash of previous block
   * @returns {number} Index of next block
   */
  newBlock({proof = null, previous_hash = null} = {}) {
    if(!proof) {
      throw new Error('Need to set `proof`');
    }

    const block = {
      index: this._chain.length + 1,
      timestamp: Date.now(),
      transactions: this._currentTransactions,
      previous_hash: previous_hash || Blockchain.hash(this.lastBlock),
      proof
    };

    // Reset current transactions
    this._currentTransactions = [];

    this._chain.push(block);

    return block;
  }

  /**
   *
   * @param {string} sender The address of sender
   * @param {string} recipient The address of recipient
   * @param {number} amount The amount of value (e.g. coin.)
   * @returns {number} Index of next block
   */
  newTransaction(sender, recipient, amount) {
    if(!sender || !recipient || !amount || amount <= 0) {
      throw new Error('Invalid params.');
    }

    this._currentTransactions.push({sender, recipient, amount});
    const lastBlock = this.lastBlock;
    if(!lastBlock) {
      return 0;
    }
    return lastBlock['index'] + 1;
  }

  get lastBlock() {
    const length = this._chain.length;
    if(length === 0) {
      return null;
    }
    return this._chain[length - 1];
  }

  /**
   *
   * @param {object} block Hash block
   * @returns {string} Hashed block
   */
  static hash(block) {
    const hashDigest = sha256(block);
    return hex.stringify(hashDigest);
  }
}

export default Blockchain;