// 类型判断
function paramTypeFn(val, type) {
    const result = Object.prototype.toString.call(val).slice(8, -1)
    return type ? type === result : result
}

// 获取层级
 function getMaxLevel(treeData) {
    let maxLevel = 0
    function loop (data, level) {
        data.forEach(item => {
            item.level = level
            if (level > maxLevel) {
                maxLevel = level
            }
            if (item.children && item.children.length > 0) {
                loop(item.children, level + 1)
            }
        })             
    }
    loop(treeData, 1)
    return maxLevel
}

// 扁平化头部数组
function flatColumns(columns) {
    return columns.reduce(function (list, column) {
        list.push(column)
        if (column.children) {
            return list.concat(flatColumns(column.children))
        }
        return list
    }, [])
}

// 头部columns整合
function convertToColumns(treeData) {
    let maxLevel = 0
    function loop(data, level) {
        return data.map(item => {
            if (maxLevel < level) {
                maxLevel = level
            }
            const { children } = item
            return {
                ...item,
                level,
                children: children ? loop(children, level + 1) : null
            }
        })            
    }

    const list = loop(treeData, 1)
    return {
        list: list,
        level: maxLevel
    }
}

export {
    paramTypeFn,
    getMaxLevel,
    convertToColumns,
    flatColumns
}