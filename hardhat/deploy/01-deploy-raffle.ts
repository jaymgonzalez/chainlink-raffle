import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deployRaffle: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  const raffle = await deploy('', {
    from: deployer,
    args: [],
    log: true,
    // waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  })
}
