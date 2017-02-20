import * as eventable from "../src/eventable";
var dispatcher = new eventable.Dispatcher();
describe("A suite", function() {
    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });
});