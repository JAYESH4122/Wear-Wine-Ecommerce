import { execSync } from 'child_process'

try {
  console.log('Checking Docker container...')

  const running = execSync("docker ps --filter name=wearwine-db --format '{{.Names}}'")
    .toString()
    .trim()

  if (running === 'wearwine-db') {
    console.log('Docker Postgres already running.')
  } else {
    console.log('Starting Docker Postgres...')
    execSync('docker-compose up -d', { stdio: 'inherit' })
  }
} catch {
  console.error('Docker is not running or not installed.')
}