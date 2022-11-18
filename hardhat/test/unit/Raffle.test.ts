import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { assert, expect } from 'chai'
import { BigNumber } from 'ethers'
import { network, deployments, ethers } from 'hardhat'
import { developmentChains, networkConfig } from '../../helper-hardhat-config'
import { Raffle, VRFCoordinatorV2Mock } from '../../typechain-types'

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle unit tests', async function () {
      let raffle: Raffle
      let raffleContract: Raffle
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock
      let raffleEntranceFee: BigNumber
      let interval: number
      let player: SignerWithAddress
      let accounts: SignerWithAddress[]

      beforeEach(async () => {
        accounts = await ethers.getSigners() // could also do with getNamedAccounts
        //   deployer = accounts[0]
        player = accounts[1]
        await deployments.fixture(['mocks', 'raffle'])
        vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock')
        raffleContract = await ethers.getContract('Raffle')
        raffle = raffleContract.connect(player)
        raffleEntranceFee = await raffle.getEntranceFee()
        interval = (await raffle.getInterval()).toNumber()
      })

      describe('constructor', function () {
        it('intitiallizes the raffle correctly', async () => {
          console.log(network.config.chainId)
          // Ideally, we'd separate these out so that only 1 assert per "it" block
          // And ideally, we'd make this check everything
          const raffleState = (await raffle.getRaffleState()).toString()
          assert.equal(raffleState, '0')
          assert.equal(
            interval.toString(),
            networkConfig[network.config.chainId!]['keepersUpdateInterval']
          )
        })
      })

      describe('enterRaffle', function () {
        it("reverts when you don't pay enough", async () => {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            'Raffle__SendMoreToEnterRaffle'
          )
        })
        it('records player when they enter', async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee })
          const contractPlayer = await raffle.getPlayer(0)
          assert.equal(player.address, contractPlayer)
        })
        it('emits event on enter', async () => {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.emit(raffle, 'RaffleEnter')
        })
        it("doesn't allow entrance when raffle is calculating", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee })
          await network.provider.send('evm_increaseTime', [interval + 1])
          await network.provider.request({ method: 'evm_mine', params: [] })
          // we pretend to be a keeper for a second
          await raffle.performUpkeep([])
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.be.revertedWith('Raffle__RaffleNotOpen')
        })
      })
    })
