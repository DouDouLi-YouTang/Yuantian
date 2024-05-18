import Dexie from 'dexie';
import XEUtils from 'xe-utils'
import webList from './websiteData'

const db = new Dexie('SystemDb');

db.version(1).stores({
  SystemNavs: '++id,title,webName,url,synopsis,imgUrl,parentId,createdDate,ClickTimes,sort',
  UserNavs: '++id,title,webName,url,synopsis,imgUrl,parentId,createdDate,ClickTimes,sort',
})
const todo = db.table('UserNavs')

function setData() {
  let ALLData = XEUtils.clone(webList)
  let data = [];
  let children = [];
  ALLData.forEach((item, index) => {
    const newItem = {...item}; // 创建一个新的对象，以避免直接修改原始对象
    newItem.sort = index
    item.children.forEach((child, childIndex) => {
      child.sort = childIndex
      children.push(child); // 将子项添加到新数组中
    });
    delete newItem.children; // 删除原始对象的 children 属性
    data.push(newItem); // 将处理后的父项添加到新数组中
  })
  db.table('SystemNavs').bulkPut(data)
  db.table('SystemNavs').bulkPut(children)
}

!(async function () {
  const SystemNavs = await db.table('SystemNavs')?.toArray() || []
  if (!SystemNavs.length) {
    setData()
  }
})()

// 获取用户表数据
export async function getUserTableData() {
  const UserNavs = await db.table('UserNavs').toArray() || []
  let data;
  if (UserNavs.length) {
    data = XEUtils.toArrayTree(UserNavs)
  } else {
    const SystemNavs = await db.table('SystemNavs').toArray() || []
    db.table('UserNavs').bulkPut(SystemNavs)
    data = XEUtils.toArrayTree(SystemNavs)
  }
  return data
}

// 获取系统表数据
export function getSystemNavsTableData() {
  return db.table('SystemNavs')?.toArray() || []
}

// 重置表所有数据
export function resetTableData(tableName) {
  return db[tableName].clear()
}

export function setTableData(id, data) {
  return todo.update(id, data);
}

export function removeTableData(id) {
  return todo.delete(id)
}

export function updateInBlock(data) {
  return todo.bulkPut(data)
}

export function deleteInBulk(ids) {
  return todo.bulkDelete(ids)
}

export function addTableData(data) {
  return todo.add(data)
}

export default db