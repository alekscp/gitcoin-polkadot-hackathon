async function backend() {
  // Import
  const { ApiPromise, WsProvider } = require('@polkadot/api');

  // Construct
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = new ApiPromise({ provider: wsProvider });

  // Wait until we are ready and connected
  await api.isReady;

  // Do something
  console.log(api.genesisHash.toHex());
};

backend();
