/**
 * Diff two list in O(N).
 */

function diff(oldList, newList, key) {
  if (!key) throw new Error("List's items must have keys!")
  var oldMap = makeMap(oldList, key)
  var newMap = makeMap(newList, key)

  var inserts = []
  var removes = []


  // a simulate list ot manipulate
  var simulateList = oldList.slice(0)
  var i = 0;

  // first pass remove all items are not in new map
  while(i < simulateList.length) {
    var item = simulateList[i]
    var itemKey = getItemKey(item, key)
    if (!newMap.hasOwnProperty(itemKey)) {
      remove(i)
    } else {
      i++;
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0
  while(i < newList.length) {
    var item = newList[i]
    var simulateItem = simulateList[j]

    if (item === simulateItem) {
      j++
    } else {
      var itemKey = getItemKey(item, key)
      if (!oldMap.hasOwnProperty(itemKey)) {
        // new item, just inesrt it
        insert(i, item)
      } else {
        // if remove current simulateItem make item in right place
        // the just remove it
        if (simulateList[j + 1] === item) {
          remove(i)
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
    simulateList.splice(index, 1)
    removes.push({index: index})
  }

  function insert(index, item) {
    inserts.push({index: index, item: item})
  }

  return {
    inserts: inserts,
    removes: removes
  }

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
  return typeof key === "string"
    ? item[key]
    : key(item)
}

exports.makeMap = makeMap
exports.diff = diff
