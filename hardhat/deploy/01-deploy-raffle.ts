import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from '../helper-hardhat-config'
// import verify from '../utils/verify'

const deployRaffle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = 31337

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

  const raffle = await deploy('Raffle', {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })
}

export default deployRaffle
deployRaffle.tags = ['all', 'raffle']
