var diff = require("../lib/diff.js")
var chai = require("chai")
chai.should()

describe("List diff", function() {

  function perform(list, moves) {
    moves.moves.forEach(function(move) {
      if (move.type) {
        list.splice(move.index, 0, move.item)
      } else {
        list.splice(move.index, 1)
      }
    })
    return list
  }

  function assertListEqual(after, before) {
    after.forEach(function(item, i) {
      after[i].should.be.deep.equal(before[i])
    })
  }

  function random(len) {
    return Math.floor(Math.random() * len)
  }

  it("Making map from list with string key", function() {
    var list = [{key: "id1"}, {key: "id2"}, {key: "id3"}, {key: "id4"}]
    var map = diff.makeKeyIndexAndFree(list, "key")
    map.keyIndex.should.be.deep.equal({
      id1: 0,
      id2: 1,
      id3: 2,
      id4: 3
    })
  })

  it("Making map from list with function", function() {
    var list = [{key: "id1"}, {key: "id2"}, {key: "id3"}, {key: "id4"}]
    var map = diff.makeKeyIndexAndFree(list, function(item) {
      return item.key
    })
    map.keyIndex.should.be.deep.equal({
      id1: 0,
      id2: 1,
      id3: 2,
      id4: 3
    })
  })

  it("removing items", function() {
    var before = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}];
    var after = [{id: 2}, {id: 3}, {id: 1}];
    var diffs = diff.diff(before, after, "id")
    diffs.moves.length.should.be.equal(5)
    perform(before, diffs)
    assertListEqual(after, before)
  })

  it("inserting items", function() {
    var before = ["a", "b", "c", "d"];
    var after = ["a", "b", "e", "f", "c", "d"];
    var diffs = diff.diff(before, after, function(item) {return item})
    diffs.moves.length.should.be.equal(2)
    perform(before, diffs)
    assertListEqual(after, before)
  })

  it("moving items from back to front", function() {
    var before = ["a", "b", "c", "d", "e", "f"];
    var after = ["a", "b", "e", "f", "c", "d", "g", "h"];
    var diffs = diff.diff(before, after, function(item) {return item})
    diffs.moves.length.should.be.equal(4)
    perform(before, diffs)
    assertListEqual(after, before);
  })

  it("moving items from front to back", function() {
    var before = ["a", "b", "c", "d", "e", "f"];
    var after = ["a", "c", "e", "f", "b", "d"];
    var diffs = diff.diff(before, after, function(item) {return item})
    diffs.moves.length.should.be.equal(4)
    perform(before, diffs)
    assertListEqual(after, before)
  })

  it("miscellaneous actions", function() {
    var before = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
    var after = ["h", "i", "a", "c", "d", "u","e", "f", "g", "j", "b", "z", "x", "y"]
    var diffs = diff.diff(before, after, function(item) {return item})
    perform(before, diffs)
    assertListEqual(after, before)
  })

  it("random moving", function() {
    var alphabet = "klmnopqrstuvwxyz"
    for(var i = 0; i < 20; i++) {
      var before = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
      var after = before.slice(0)

      // move
      var j = 0;
      var len = +(Math.random() * 4)
      for (j = 0; j < len; j++) {
        // random removing item
        var pos = random(after.length)
        var character = after[pos]
        after.splice(pos, 1)

        // random insert item
        var pos = random(after.length)
        after.splice(pos, 0, character)
      }

      // remove
      var j = 0;
      var len = +(Math.random() * 4)
      for (j = 0; j < len; j++) {
        var pos = random(after.length)
        after.splice(pos, 1)
      }

      // insert
      var j = 0;
      var len = +(Math.random() * 10)
      for (j = 0; j < len; j++) {
        var pos = random(after.length)
        var newItemPos = random(alphabet.length)
        var character = alphabet[newItemPos]
        after.splice(pos, 0, character)
      }

      var diffs = diff.diff(before, after, function(item) {return item})
      perform(before, diffs)
      assertListEqual(after, before)
    }
  })

  it("Test with no key: string item", function() {
    var before = ["a", "b", "c", "d", "e"]
    var after = ["c", "d", "e", "a"]
    var diffs = diff.diff(before, after)
    diffs.moves.length.should.be.equal(1)
    console.log(diffs.moves)
  })

  it("Test with no key: object item", function() {
    var before = [{id: "a"}, {id: "b"}, {id: "c"}, {id: "d"}, {id: "e"}]
    var after = [{id: "a"}, {id: "b"}, {id: "c"}, {id: "d"}, {id: "e"}, {id: "f"}]
    var diffs = diff.diff(before, after)
    diffs.moves.length.should.be.equal(1)
    perform(before, diffs)
    assertListEqual(after, before)
  })

})
