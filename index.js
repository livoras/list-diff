/**
 * Diff two list in O(N).
 */

function diff(oldList, newList, key) {
  if (!key) throw new Error("List's items must have keys!")
  var oldMap = makeMap(oldList, key)
  var newMap = makeMap(newList, key)

  var inserts = []
  var removes = []
  var moves = []

  var list = oldList.slice(0)
  var i = 0;

  // first pass remove all items are not in new map
  while(i < list.length) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (!newMap.hasOwnProperty(itemKey)) {
      list.splice(i, 1)
      removes.push({index: i})
    } else {
      i++;
    }
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
