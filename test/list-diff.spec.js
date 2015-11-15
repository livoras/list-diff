var diff = require("../index.js")
var chai = require("chai")
chai.should()

describe("List diff", function() {

  it("Making map from list with string key", function() {
    var list = [{key: "id1"}, {key: "id2"}, {key: "id3"}, {key: "id4"}]
    var map = diff.makeMap(list, "key")
    map.should.be.deep.equal({
      id1: 0,
      id2: 1,
      id3: 2,
      id4: 3
    })
  })

  it("Making map from list with function", function() {
    var list = [{key: "id1"}, {key: "id2"}, {key: "id3"}, {key: "id4"}]
    var map = diff.makeMap(list, function(item) {
      return item.key
    })
    map.should.be.deep.equal({
      id1: 0,
      id2: 1,
      id3: 2,
      id4: 3
    })
  })

  it("removing items", function() {
    var diffs = diff.diff(
      [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}], 
      [{id: 2}, {id: 3}, {id: 1}], 
      "id"
    )
    diffs.removes.length.should.be.equal(3)
  })

  it("inserting items", function() {
    var diffs = diff.diff(
      ["a", "b", "c", "d"],
      ["a", "b", "e", "f", "c", "d"],
      function(item) {return item}
    )
    diffs.inserts.length.should.be.equal(2)
    diffs.inserts[0].index.should.be.equal(2)
    diffs.inserts[1].index.should.be.equal(3)
  })

  it("moving items from back to front", function() {
    var diffs = diff.diff(
      ["a", "b", "c", "d", "e", "f"],
      ["a", "b", "e", "f", "c", "d", "g", "h"],
      function(item) {return item}
    )
    diffs.inserts.length.should.be.equal(4)
    diffs.inserts[0].index.should.be.equal(2)
    diffs.inserts[1].index.should.be.equal(3)
  })

  it("moving items from front to back", function() {
    var diffs = diff.diff(
      ["a", "b", "c", "d", "e", "f"],
      ["a", "c", "e", "f", "b", "d"],
      function(item) {return item}
    )
    diffs.inserts.length.should.be.equal(2)
    diffs.removes.length.should.be.equal(2)
  })

})
