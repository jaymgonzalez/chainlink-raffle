import { ethers } from 'hardhat'

export interface networkConfigItem {
  name?: string
  subscriptionId?: string
  gasLane?: string
  keepersUpdateInterval?: string
  raffleEntranceFee?: string
  callbackGasLimit?: string
  vrfCoordinatorV2?: string
}

export interface networkConfigInfo {
  [key: number]: networkConfigItem
}

const networkConfig: networkConfigInfo = {
  31337: {
    name: 'localhost',
    subscriptionId: '6615',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    keepersUpdateInterval: '30',
    raffleEntranceFee: ethers.utils.parseEther('0.01').toString(), // 0.01 ETH
    callbackGasLimit: '500000', // 500,000 gas
  },
  4: {
    name: 'goerli',
    subscriptionId: '6615',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    keepersUpdateInterval: '30',
    raffleEntranceFee: ethers.utils.parseEther('0.01').toString(), // 0.01 ETH
    callbackGasLimit: '500000', // 500,000 gas
    vrfCoordinatorV2: '0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D',
  },
  1: {
    name: 'mainnet',
    keepersUpdateInterval: '30',
  },
}
