/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function diff(oldList, newList, key) {
  var oldMap = makeMap(oldList, key)
  var newMap = makeMap(newList, key)

  var inserts = []
  var removes = []
  var moves = []

  // a simulate list to manipulate
  var simulateList = oldList.slice(0)
  var i = 0;

  // first pass remove all items are not in new map
  while(i < simulateList.length) {
    var item = simulateList[i]
    var itemKey = getItemKey(item, key)
    if (!newMap.hasOwnProperty(itemKey)) {
      remove(i)
      simulateList.splice(i, 1)
    } else {
      i++;
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while(i < newList.length) {
    var item = newList[i]
    var itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (itemKey === simulateItemKey) {
      j++
    } else {
      // new item, just inesrt it
      if (!oldMap.hasOwnProperty(itemKey)) {
        insert(i, item)
      } else {
        // if remove current simulateItem make item in right place
        // then just remove it
        var nextItemKey = getItemKey(simulateList[j + 1], key);
        if (nextItemKey === itemKey) {
          remove(i)
          simulateList.splice(j, 1)
          j++ // after removing, current j is right, just jump to next one
        } else {
          // else insert item
          insert(i, item)
        }
      }
    }

    i++
  }

  function remove(index) {
    var move = {index: index, type: 0};
    moves.push(move)
  }

  function insert(index, item) {
    var move = {index: index, item: item, type: 1}
    moves.push(move)
  }

  return {moves: moves}

}

/**
 * Convert list to key-item map object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeMap(list, key) {
  var map = {}
  for(var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key);
    map[itemKey] = i;
  }
  return map
}

function getItemKey(item, key) {
  if (!item) return void 666
  if (!key) return item
  return typeof key === "string"
    ? item[key]
    : key(item)
}

exports.makeMap = makeMap // exports for test
exports.diff = diff
