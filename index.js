const db = require('./db')
const inquirer = require('inquirer')

module.exports.add = async title => {
  const list = await db.read()
  list.push({ title, done: false })
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

module.exports.showAll = async () => {
  const list = await db.read()
  printTasks(list)
}

function printTasks(list) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: '请选择列表项',
        choices: [
          { name: '退出', value: '-1' },
          ...list.map((task, index) => {
            return {
              name: `${task.done ? '[✔]' : '[_]'} ${index + 1} - ${task.title}`,
              value: index.toString()
            }
          }),
          { name: '+ 创建任务', value: '-2' }
        ]
      }
    ])
    .then(({ index }) => {
      if (+index >= 0) {
        askForAction(list, index)
      } else if (+index === -2) {
        askForCreateTask(list)
      }
    })
}

function askForAction(list, index) {
  const actions = { done, undone, updateTitle, remove }
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: '请选择操作',
        choices: [
          { name: '退出', value: 'quit' },
          { name: '已完成', value: 'done' },
          { name: '未完成', value: 'undone' },
          { name: '改标题', value: 'updateTitle' },
          { name: '删除', value: 'remove' }
        ]
      }
    ])
    .then(({ action }) => {
      const fn = actions[action]
      typeof fn === 'function' && fn(list, index)
    })
}

function done(list, index) {
  list[index].done = true
  db.write(list)
}
function undone(list, index) {
  list[index].done = false
  db.write(list)
}
function updateTitle(list, index) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '请输入新标题',
      default: list[index].title
    })
    .then(async ({ title }) => {
      list[index].title = title
      db.write(list)
    })
}
function remove(list, index) {
  list.splice(index, 1)
  db.write(list)
}

function askForCreateTask(list) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '请输入任务标题'
    })
    .then(({ title }) => {
      list.push({ title, done: false })
      db.write(list)
    })
}
