/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function diff(oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var oldFree = oldMap.free
  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  // a simulate list to manipulate
  var childrens = [];
  var i = 0;
  var freeIndex = 0;

  // first pass remove all items are not in new keyIndex
  while(i < oldList.length) {
    var item = oldList[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        childrens.push(null)
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        childrens.push(newList[newItemIndex])
      }
    } else {
      var freeItem =  newFree[freeIndex++]
      childrens.push(freeItem || null)
    }
    i++
  }

  // while(freeIndex < newFree.length)  {
  //   childrens.push(newFree[freeIndex++])
  // }

  var simulateList = childrens.slice(0)

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while(i < newList.length) {
    var item = newList[i]
    var simulateItem = simulateList[j]

    // if is null, then it needs to be removed
    while (simulateItem === null) {
      remove(i)
      removeSimulate(j)
      simulateItem = simulateList[j]
    }

    var itemKey = getItemKey(item, key)
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++
      } else {
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key);
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j++ // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }

    i++
  }

  // while (j < simulateList.length) {
  //   remove(i++)
  //   removeSimulate(j++)
  // }

  function remove(index) {
    var move = {index: index, type: 0};
    moves.push(move)
  }

  function insert(index, item) {
    var move = {index: index, item: item, type: 1}
    moves.push(move)
  }

  function removeSimulate(index) {
    simulateList.splice(index, 1)
  }

  return {
    moves: moves,
    childrens: childrens
  }

}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree(list, key) {
  var keyIndex = {}
  var free = []
  for(var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key);
    if (itemKey) {
      keyIndex[itemKey] = i;
    } else {
      free.push(item)
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey(item, key) {
  if (!item || !key) return void 666
  return typeof key === "string"
    ? item[key]
    : key(item)
}

exports.makeKeyIndexAndFree = makeKeyIndexAndFree // exports for test
exports.diff = diff
