const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy Profiles contract first
  console.log("\n=== Deploying Profiles Contract ===");
  const Profiles = await ethers.getContractFactory("Profiles");
  const profiles = await Profiles.deploy();
  await profiles.waitForDeployment();
  const profilesAddress = await profiles.getAddress();
  console.log("Profiles deployed to:", profilesAddress);

  // Deploy Posts contract
  console.log("\n=== Deploying Posts Contract ===");
  const Posts = await ethers.getContractFactory("Posts");
  const posts = await Posts.deploy(profilesAddress);
  await posts.waitForDeployment();
  const postsAddress = await posts.getAddress();
  console.log("Posts deployed to:", postsAddress);

  // Deploy Comments contract
  console.log("\n=== Deploying Comments Contract ===");
  const Comments = await ethers.getContractFactory("Comments");
  const comments = await Comments.deploy(profilesAddress, postsAddress);
  await comments.waitForDeployment();
  const commentsAddress = await comments.getAddress();
  console.log("Comments deployed to:", commentsAddress);

  // Deploy Follow contract
  console.log("\n=== Deploying Follow Contract ===");
  const Follow = await ethers.getContractFactory("Follow");
  const follow = await Follow.deploy(profilesAddress);
  await follow.waitForDeployment();
  const followAddress = await follow.getAddress();
  console.log("Follow deployed to:", followAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      Profiles: profilesAddress,
      Posts: postsAddress,
      Comments: commentsAddress,
      Follow: followAddress
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require("fs");
  const path = require("path");
  
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const filename = `${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\nDeployment info saved to: deployments/${filename}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });