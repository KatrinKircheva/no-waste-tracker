#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get current branch
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();

// Branch to project mapping
const branchProjects = {
  'main': 'no-waste-tracker',
  'develop': 'no-waste-tracker-dev', 
  'staging': 'no-waste-tracker-staging',
  'feature/*': 'no-waste-tracker-dev'
};

// Determine target project
let targetProject = branchProjects[currentBranch];
if (!targetProject) {
  // Check if it's a feature branch
  if (currentBranch.startsWith('feature/')) {
    targetProject = branchProjects['feature/*'];
  } else {
    targetProject = branchProjects['develop']; // default to dev
  }
}

console.log(`🚀 Deploying branch: ${currentBranch}`);
console.log(`📦 Target project: ${targetProject}`);

try {
  // Switch to target project
  execSync(`firebase use ${targetProject}`, { stdio: 'inherit' });
  
  // Deploy
  execSync('firebase deploy', { stdio: 'inherit' });
  
  console.log(`✅ Successfully deployed ${currentBranch} to ${targetProject}`);
  
  // Show URLs
  const urls = {
    'no-waste-tracker': 'https://no-waste-tracker.web.app',
    'no-waste-tracker-dev': 'https://no-waste-tracker-dev.web.app',
    'no-waste-tracker-staging': 'https://no-waste-tracker-staging.web.app'
  };
  
  console.log(`🌐 URL: ${urls[targetProject]}`);
  
} catch (error) {
  console.error('❌ Deploy failed:', error.message);
  process.exit(1);
}
