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
  //- bonds
  //- staking

  const DAI = await ethers.getContractFactory('DAI');
  const dai = await DAI.deploy(31337);
  await dai.deployed();
  console.log('Mock DAI deployed to: ' + dai.address);

  const ARK = await ethers.getContractFactory('ArkERC20Token');
  const ark = await ARK.deploy(deployer.address);
  console.log('ArkERC20Token deployed to: ' + ark.address);

  const ArkTreasury = await ethers.getContractFactory('ArkTreasury');
  const arkTreasury = await ArkTreasury.deploy(ark.address, '0',  deployer.address);
  console.log('ArkTreasury deployed to: ' + arkTreasury.address);

  await arkTreasury.queueTimelock('0', deployer.address, deployer.address);
  await arkTreasury.queueTimelock('8', deployer.address, deployer.address);
  await arkTreasury.queueTimelock('2', DAI, DAI);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
