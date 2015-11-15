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

  it("diff", function() {
    diff.diff(
      [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}], 
      [{id: 2}, {id: 3}, {id: 1}], 
      "id"
    )
  })

})
