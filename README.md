This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi) and updated for Smart Wallet.

NOTE: Most of the hooks here are a bit of a poor man's Wagmi :D Hopefully the Wevm team adds hooks for Viem experimental features.

To run:

1. install bun `curl -fsSL <https://bun.sh/install> | bash`
2. install packages `bun i`
3. run next app `bun run dev`

To use:

1. click "Coinbase wallet" button
2. create a new wallet, or use an existing one
3. transact! Click "mint" and use your new smart wallet on Base Sepolia.

ETH
all calls [
  {
    target: '0xD5da60a7CFe87C73AEa0Bf83EBe75e520F72ccD3',
    value: 100000000000n,
    data: '0xd3f5475f000000000000000000000000000000000000000000000000000000008c936305'
  }
]

erc20 token
all calls [
  {
    target: '0xf62FB3d97bDAFd50F028bA4D5fB5beDA0038CaE0',
    value: 0n,
    data: '0x095ea7b3000000000000000000000000d5da60a7cfe87c73aea0bf83ebe75e520f72ccd30000000000000000000000000000000000000000000000001bc16d674ec80000'
  },
  {
    target: '0xD5da60a7CFe87C73AEa0Bf83EBe75e520F72ccD3',
    value: 0n,
    data: '0xb1cccca2000000000000000000000000f62fb3d97bdafd50f028ba4d5fb5beda0038cae00000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000000000bcc568e0'
  }
]