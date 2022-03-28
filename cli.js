#!/usr/bin/env node

const program = require('commander')
const api = require('./index')
const pkg = require('./package.json')

program.version(pkg.version)
program
  .command('add')
  .description('add a task')
  .action((...args) => {
    const words = args.slice(0, -1).join('')
    api.add(words)
  })
program
  .command('clear')
  .description('clear all tasks')
  .action((...args) => {
    api.clear()
  })

program.parse(process.argv)

if (process.argv.length === 2) {
  // Run node cli directly
  api.showAll()
}
