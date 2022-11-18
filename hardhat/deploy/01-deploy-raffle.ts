import { ethers } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from '../helper-hardhat-config'
import verify from '../utils/verify'

const FUND_AMOUNT = ethers.utils.parseEther('30').toString()

const deployRaffle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = 31337
  let vrfCoordinatorV2Address: string | undefined,
    subscriptionId: string | undefined

  if (chainId == 31337) {
    // create VRFV2 Subscription
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    )
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
    const transactionReceipt = await transactionResponse.wait()
    subscriptionId = transactionReceipt.events[0].args.subId
    // Fund the subscription
    // Our mock makes it so we don't actually have to worry about sending fund
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
  } else {
    vrfCoordinatorV2Address =
      networkConfig[network.config.chainId!]['vrfCoordinatorV2']
    subscriptionId = networkConfig[network.config.chainId!]['subscriptionId']
  }

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  log('----------------------------------------------------')
  const args: any[] = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[network.config.chainId!]['gasLane'],
    networkConfig[network.config.chainId!]['keepersUpdateInterval'],
    networkConfig[network.config.chainId!]['raffleEntranceFee'],
    networkConfig[network.config.chainId!]['callbackGasLimit'],
  ]

  const raffle = await deploy('Raffle', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...')
    await verify(raffle.address, args)
  }
  log('Run Price Feed contract with command:')
  const networkName = network.name == 'hardhat' ? 'localhost' : network.name
  log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
  log('----------------------------------------------------')
}

export default deployRaffle
deployRaffle.tags = ['all', 'raffle']
