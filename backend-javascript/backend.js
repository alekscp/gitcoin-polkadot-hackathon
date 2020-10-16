async function backend() {
  const { ApiPromise, WsProvider } = require('@polkadot/api');

  const api = async (provider) => {
    const wsProvider = new WsProvider(provider);
    const api = new ApiPromise({ provider: wsProvider });

    await api.isReady;

    return api;
  };

  const fetchBlock = async (options) => {
    const provider = options.provider || 'wss://rpc.polkadot.io';
    const number = options.number;
    const hash = options.hash;

    const client = await api(provider);

    let block;
    if (number) {
      const blockHash = await client.rpc.chain.getBlockHash(number)

      block = await client.rpc.chain.getBlock(blockHash);
    } else if (hash) {
      block = await client.rpc.chain.getBlock(hash);
    } else {
      block = await client.rpc.chain.getBlock();
    }

    console.log(block.toHuman());
    process.exit(0);
  };

  // Extract command line arguments
  const [ , , ...args] = process.argv;

  // CLI
  if (args[0] == '--help') {
    console.log('This CLI tool returns block information for a given Substrate-based chain.\n\n' +
      'Usage: backend.js [options]\n\n' +
      'Default behaviour: Returns latest block on the polkadot chain.\n\n' +
      'Options:\n' +
      '--help: Shows you this menu\n' +
      '--provider: Provider address of a Substrate-based chain; eg.: `ws:localhost:9944`\n' +
      '--number: block number (height)\n' +
      '--hash: block hash\n\n' +
      'Example:\n\n' +
      'node backend.js --provider ws://127.0.0.1:9944 --number 1234'
    );

    process.exit(0);
  } else if (args[0] === '--provider') {
    const provider = args[1];

    if (args[2] === '--number') {
      const number = args[3];

      fetchBlock({provider: provider, number: number});
    } else if (args[2] === '--hash') {
      const hash = args[3];

      fetchBlock({provider: provider, hash: hash});
    } else {
      fetchBlock({});
    }
  } else if (args[0] === '--number') {
    const number = args[1];

    fetchBlock({number: number});
  } else if (args[0] === '--hash') {
    const hash = args[1];

    fetchBlock({hash: hash});
  } else if (!args[0]) {
    fetchBlock({})
  } else {
    console.log('Unknown command.');

    process.exit(1);
  }
};

backend();
