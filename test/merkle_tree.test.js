const {utils} = require("ethers");
const { ethers } = require('hardhat');
const {expect} = require('chai');
const { MerkleTree } = require("merkletreejs");

// 白名单地址
const tokens = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02eb",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02fb",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C021b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C022b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C023b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C024b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C025b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C026b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C027b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C028b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C029b",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02ab",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C03db",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C04db",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C05db",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C06db",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C07db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
];

describe('WETH9', () => {
  let mtree_contract
  let deployer, user1, user2, users
  let merkletree
  beforeEach(async () => {
    [deployer, user1, user2, ...users] = await ethers.getSigners();
  })

  describe('case 1', () => {
    it('case 101', async () => {
      const leaf = tokens.map(x => utils.keccak256(x))
      console.log('leafs:')
      console.log(leaf)

      console.log('leaf count: ')
      console.log(leaf.length)

      merkletree = new MerkleTree(leaf, utils.keccak256, { sortPairs: true });
      const proof = merkletree.getHexProof(leaf[0]);      
      console.log('merkle tree proof: ')
      console.log(proof)

      const root = merkletree.getHexRoot()
      const mtree = await ethers.getContractFactory('MerkleTree')
      mtree_contract = await mtree.deploy('name', 'symbol', root)
      await mtree_contract.deployed()
      console.log(`merkle tree contract deployed at ${mtree_contract.address}`)

      console.log(`NFT名称: ${await mtree_contract.name()}`)
      console.log(`NFT代号: ${await mtree_contract.symbol()}`)
      let tx = await mtree_contract.mint(tokens[0], proof)
      console.log("铸造中，等待交易上链")
      await tx.wait()
      console.log(`mint成功，地址${tokens[0]} 的NFT余额: ${await mtree_contract.balanceOf(tokens[0])}\n`)

      expect(await mtree_contract.balanceOf(tokens[0])).to.equal(1)

    })
  })

})

