async function backend() {
  // Import
  const { ApiPromise, WsProvider } = require('@polkadot/api');

  const client = async (provider) => {
    // Setting up default provider if none provided
    provider = provider === undefined ? 'wss://rpc.polkadot.io' : provider

    const wsProvider = new WsProvider(provider);
    const client = new ApiPromise({ provider: wsProvider });

    await client.isReady;

    return client;
  };

  // CLI
  if (process.argv[2] == '--help') {
    console.log('Available options are:\n' +
      '--help: Shows you this menu\n' +
      '--latest-block [chain]: Returns latest block on `chain`. `chain` defaults to `kusama`\n' +
      '--search-block-by-number [chain] [number]: Searches for block `number` on `chain`. Defaults to latest block on kusama\n' +
      '--search-block-by-height [chain] [height]: Searches for block `height` on `chain`. Defaults to latest block on kusama\n'
    );

    process.exit(1);
  } else if (process.argv[2] == '--latest-block') {
    const chain = process.argv[3];

    client(chain)
      .then((api) => api.rpc.chain.getBlock())
      .then((block) => {
        console.log('Latest block:', block.toHuman())
        process.exit(0);
      });
  }
  else {
    console.log('Unknown command')

    process.exit(1);
  }
};

backend();
