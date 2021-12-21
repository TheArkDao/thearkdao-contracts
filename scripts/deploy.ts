// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ' + deployer.address);
  //deploy sequence
  //- mock dai
  //- Ark token
  //- treasury
  //- sArk
  //- staking
  //- redeem helper
  //- distributor
  //- bonds depos

  const DAI = await ethers.getContractFactory('DAI');
  const dai = await DAI.deploy(31337);
  await dai.deployed();
  console.log('Mock DAI deployed to: ' + dai.address);

  const ARK = await ethers.getContractFactory('ArkERC20Token');
  const ark = await ARK.deploy(deployer.address);
  console.log('ArkERC20Token deployed to: ' + ark.address);

  const Calculator = await ethers.getContractFactory('ArkBondingCalculator');
  const calculator = await Calculator.deploy(deployer.address);
  console.log('Calculator deployed to: ' + calculator.address);

  const ArkTreasury = await ethers.getContractFactory('ArkTreasury');
  const arkTreasury = await ArkTreasury.deploy(ark.address, dai.address, deployer.address, 0);
  console.log('ArkTreasury deployed to: ' + arkTreasury.address);

  const sARK = await ethers.getContractFactory('sArk');
  const sark = await sARK.deploy();
  console.log('sArk deployed to: ' + sark.address);

  const epochLength = '2200'; // >8 hours
  const firstEpochNumber = '1';
  const firstEpochBlock = '1';

  const ArkStaking = await ethers.getContractFactory('ArkStaking');
  const arkStaking = await ArkStaking.deploy(deployer.address, sark.address, epochLength, firstEpochNumber, firstEpochBlock);
  console.log('ArkStaking deployed to: ' + arkStaking.address);

  const StakingHelper = await ethers.getContractFactory('StakingHelper');
  const stakingHelper = await StakingHelper.deploy(arkStaking.address, ark.address);
  console.log('StakingHelper deployed to: ' + stakingHelper.address);

  const StakingWarmup = await ethers.getContractFactory('StakingWarmup');
  const stakingWarmup = await StakingWarmup.deploy(arkStaking.address, sark.address);
  console.log('StakingWarmup deployed to: ' + stakingWarmup.address);

  const RedeemHelper = await ethers.getContractFactory('RedeemHelper');
  const redeemHelper = await RedeemHelper.deploy();
  console.log('RedeemHelper deployed to: ' + redeemHelper.address);

  const Distributor = await ethers.getContractFactory('Distributor');
  const distributor = await Distributor.deploy(deployer.address, arkTreasury.address, epochLength, firstEpochBlock);
  console.log('Distributor deployed to: ' + distributor.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
