function paramTypeFn(val, type) {
    const result = Object.prototype.toString.call(val).slice(8, -1)
    return type ? type === result : result
}

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

function headerSource(treeData) {
    let maxLevel = 0
    const list = []
    function loop(data, level) {
        return data.map(item => {
            if (maxLevel < level) {
                maxLevel = level
            }
            const { children } = item
            const child = {
                ...item,
                level,
                colSpan: children && children.length || 1,
                rowSpan: level,
                children: children ? loop(children, level + 1) : null
            }
            list.push(child)
            return child
        })            
    }

    loop(treeData, 1)
    return {
        list: list,
        level: maxLevel
    }
}

export {
    paramTypeFn,
    getMaxLevel,
    headerSource
}