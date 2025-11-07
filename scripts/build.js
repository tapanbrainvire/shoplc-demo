const fs = require('fs-extra');
const path = require('path');

const stores = ['store1', 'store2'];


async function buildTheme(storeName) {
  console.log(`\n🏗️  Building theme for ${storeName}...`);
  
  const buildPath = path.join(__dirname, '..', 'build', storeName);
  const storePath = path.join(__dirname, '..', 'stores', storeName);
  const sharedPath = path.join(__dirname, '..', 'shared');
  
  try {
    // 1. Clean and create build directory
    await fs.remove(buildPath);
    await fs.ensureDir(buildPath);
    console.log('  ✓ Created build directory');
    
    // 2. Copy ALL shared files
    await fs.copy(sharedPath, buildPath);
    console.log('  ✓ Copied shared files');
    
    // 3. Copy store-specific sections (OVERRIDES shared sections)
    const storeSectionsPath = path.join(storePath, 'sections');
    const buildSectionsPath = path.join(buildPath, 'sections');
    
    if (await fs.pathExists(storeSectionsPath)) {
      await fs.copy(storeSectionsPath, buildSectionsPath, { overwrite: true });
      console.log('  ✓ Copied store-specific section overrides');
    }
    
    // 4. Copy store-specific snippets (if any overrides)
    const storeSnippetsPath = path.join(storePath, 'snippets');
    const buildSnippetsPath = path.join(buildPath, 'snippets');
    
    if (await fs.pathExists(storeSnippetsPath)) {
      await fs.copy(storeSnippetsPath, buildSnippetsPath, { overwrite: true });
      console.log('  ✓ Copied store-specific snippet overrides');
    }
    
    // 5. Copy store-specific templates
    const storeTemplatesPath = path.join(storePath, 'templates');
    const buildTemplatesPath = path.join(buildPath, 'templates');
    
    if (await fs.pathExists(storeTemplatesPath)) {
      await fs.ensureDir(buildTemplatesPath);
      await fs.copy(storeTemplatesPath, buildTemplatesPath, { overwrite: true });
      console.log('  ✓ Copied store-specific templates');
    }
    
    // 6. Copy store-specific assets
    const storeAssetsPath = path.join(storePath, 'assets');
    const buildAssetsPath = path.join(buildPath, 'assets');
    
    if (await fs.pathExists(storeAssetsPath)) {
      await fs.ensureDir(buildAssetsPath);
      await fs.copy(storeAssetsPath, buildAssetsPath, { overwrite: true });
      console.log('  ✓ Copied store-specific assets');
    }
    
    // 7. Copy store-specific config
    const storeConfigPath = path.join(storePath, 'config');
    const buildConfigPath = path.join(buildPath, 'config');
    
    if (await fs.pathExists(storeConfigPath)) {
      await fs.ensureDir(buildConfigPath);
      await fs.copy(storeConfigPath, buildConfigPath, { overwrite: true });
      console.log('  ✓ Copied store-specific config');
    }
    
    console.log(`✅ Build complete for ${storeName}`);
    console.log(`   Output: build/${storeName}/\n`);
    
    return true;
  } catch (error) {
    console.error(`❌ Build failed for ${storeName}:`, error.message);
    return false;
  }
}

async function main() {
  const storeToBuild = process.argv[2];
  
  console.log('🚀 Shopify Theme Builder\n');
  
  if (storeToBuild) {
    if (stores.includes(storeToBuild)) {
      const success = await buildTheme(storeToBuild);
      process.exit(success ? 0 : 1);
    } else {
      console.error(`❌ Store "${storeToBuild}" not found.`);
      console.log(`   Available stores: ${stores.join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log('Building all stores...\n');
    const results = await Promise.all(stores.map(buildTheme));
    const allSuccess = results.every(r => r === true);
    
    if (allSuccess) {
      console.log('✅ All stores built successfully!');
    } else {
      console.log('⚠️  Some stores failed to build. Check logs above.');
    }
    
    process.exit(allSuccess ? 0 : 1);
  }
}

main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});