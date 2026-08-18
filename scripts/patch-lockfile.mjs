import fs from 'fs';
import path from 'path';

const lockfilePath = path.resolve('package-lock.json');
const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));

const platformPackages = {
  "@tailwindcss/oxide-linux-x64-gnu": {
    version: "4.3.3",
    resolved: "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-gnu/-/oxide-linux-x64-gnu-4.3.3.tgz",
    integrity: "sha512-tx7us1muwOKAKWao2v/GaafFeQboE6aj88vC6ziN2NCGcRm8gWUhwjzg+YdVB1e4boAtdtma4L43onunI6NS4w==",
    cpu: ["x64"],
    os: ["linux"],
    optional: true
  },
  "@tailwindcss/oxide-linux-x64-musl": {
    version: "4.3.3",
    resolved: "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-musl/-/oxide-linux-x64-musl-4.3.3.tgz",
    integrity: "sha512-SJxX60smvHgasZoBy11dX6YRjXJFovwWBoedhbQPOBzgFWBHGB+TVPWB9BxzR7TTxU8FQZAI2AyiNCMzFm8Img==",
    cpu: ["x64"],
    os: ["linux"],
    optional: true
  },
  "lightningcss-linux-x64-gnu": {
    version: "1.32.0",
    resolved: "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz",
    integrity: "sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==",
    cpu: ["x64"],
    os: ["linux"],
    optional: true
  },
  "lightningcss-linux-x64-musl": {
    version: "1.32.0",
    resolved: "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.32.0.tgz",
    integrity: "sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==",
    cpu: ["x64"],
    os: ["linux"],
    optional: true
  },
  "@next/swc-linux-x64-gnu": {
    version: "16.2.9",
    resolved: "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.2.9.tgz",
    integrity: "sha512-xm0HfRNX+UkH4R3c18ynswjj5o5uEj/7iI9p9omdtTSIsRCzQqkGMA+10nzJ4EHnYC3as65IMhbbl5fWRUWHYg==",
    cpu: ["x64"],
    os: ["linux"],
    optional: true
  },
  "@next/swc-linux-x64-musl": {
    version: "16.2.9",
    resolved: "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.2.9.tgz",
    integrity: "sha512-QumimHkGEG6vM3PfEDWKyKen03NcqLOkeKB1EfcPe7VxzmEiCa4jNnMyBn/US5zcd/VE1CI+O8Ovb3lfjVHfGw==",
    cpu: ["x64"],
    os: ["linux"],
    optional: true
  }
};

if (lockfile.packages) {
  for (const [pkgName, pkgData] of Object.entries(platformPackages)) {
    lockfile.packages[`node_modules/${pkgName}`] = pkgData;
    lockfile.packages[`app/node_modules/${pkgName}`] = pkgData;
  }
  
  if (lockfile.packages[""]) {
    lockfile.packages[""].optionalDependencies = {
      ...lockfile.packages[""].optionalDependencies,
      "@next/swc-linux-x64-gnu": "16.2.9",
      "@next/swc-linux-x64-musl": "16.2.9",
      "@tailwindcss/oxide-linux-x64-gnu": "4.3.3",
      "@tailwindcss/oxide-linux-x64-musl": "4.3.3",
      "lightningcss-linux-x64-gnu": "1.32.0",
      "lightningcss-linux-x64-musl": "1.32.0"
    };
  }

  if (lockfile.packages["app"]) {
    lockfile.packages["app"].optionalDependencies = {
      ...lockfile.packages["app"].optionalDependencies,
      "@next/swc-linux-x64-gnu": "16.2.9",
      "@next/swc-linux-x64-musl": "16.2.9",
      "@tailwindcss/oxide-linux-x64-gnu": "4.3.3",
      "@tailwindcss/oxide-linux-x64-musl": "4.3.3",
      "lightningcss-linux-x64-gnu": "1.32.0",
      "lightningcss-linux-x64-musl": "1.32.0"
    };
  }
}

fs.writeFileSync(lockfilePath, JSON.stringify(lockfile, null, 2) + '\n');
console.log('Successfully patched package-lock.json with Linux platform binaries.');
