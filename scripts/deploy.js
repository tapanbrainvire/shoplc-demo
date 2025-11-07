const { execSync } = require('child_process');
const fs = require('fs-extra');

// If a store name is passed in the command (e.g. store3), only deploy to that one
const allStores = ['store1', 'store2', 'store3', 'store4'];
const targetStore = process.argv[2]; // e.g., "store3"
const stores = targetStore ? [targetStore] : allStores;

async function buildAndDeploy(store) {
  const buildDir = `build/${store}`;
  
  await fs.remove(buildDir);
  await fs.ensureDir(buildDir);
  
  await fs.copy('shared', buildDir);

  const overridesPath = `stores/${store}/overrides`;
  if (await fs.pathExists(overridesPath)) {
    await fs.copy(overridesPath, buildDir, { overwrite: true });
  }

  console.log(`🚀 Deploying to ${store}...`);
  execSync(`shopify theme push --path=${buildDir}`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      SHOPIFY_FLAG_STORE: process.env[`${store.toUpperCase()}_SHOPIFY_FLAG_STORE`],
      SHOPIFY_CLI_THEME_TOKEN: process.env[`${store.toUpperCase()}_SHOPIFY_CLI_THEME_TOKEN`],
    },
  });
}

Promise.all(stores.map(buildAndDeploy)).catch(console.error);
