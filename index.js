function diff(oldList, newList, key) {
  if (!key) throw new Error("Must provide a way to get items' keys!")
  var oldMap = makeMap(oldList, key)
  var newMap = makeMap(newList, key)
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
    if (typeof key === "string") {
      map[item[key]] = i
    } else {
      map[key(item)] = i
    }
  }
  return map
}

exports.makeMap = makeMap
