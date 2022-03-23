-- SIGNED-SOURCE: <d640f1b0086bcf28ac21bc238bb9135e>
CREATE TABLE Slide (
  id BIGINT,
  selected BOOLEAN,
  focused BOOLEAN,
  classes TEXT,
  style JSON,
  deck BIGINT
);