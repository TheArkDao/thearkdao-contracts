import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  hardhat: 31337,
  arkdevnet: 777
};

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC ?? "NO_MNEMONIC";

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  if (network == 'arkdevnet' || true) {
    return {
      accounts: {
        count: 10,
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
      chainId: chainIds[network],
      url: 'http://3.17.27.169',
    };
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: chainIds.hardhat,
    },
    cronosdev:getChainConfig("arkdevnet"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.7.5",
        settings: {
          metadata: {
            bytecodeHash: "none",
          },
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
      {
        version: "0.5.16",
      },
    ],
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"]
        }
      }
    }
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  }
};

export default config;
