import sid from "@strut/sid";
import SlideQuery from "../SlideQuery.js";

// We'll try to load all slides and see how it goes!
test("Query from id", () => {
  SlideQuery.fromId(sid("foo"));
});
