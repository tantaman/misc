import * as ohm from "ohm-js";

const grammarDefinition = String.raw`
Aphro {
  Main
  	= PropertyList Entities
  
  PropertyList
  	= PropertyList Property -- proplist
    | ""
  
  Property
  	= propertyKey name
  
  propertyKey
  	= name ":"
  
  name
  	= alnum+
    
  Entities
  	= Entities Node -- node
    | Entities Edge -- edge
    | Entities NodeTrait -- nodeTrait
    | ""
  
  Node
  	= name "as" "Node" NodeFields NodeFunctions
  
  Edge
  	= name "as" "Edge" "<" name "," name ">" NodeFields EdgeFunctions
  
  NodeFields
  	= "{" FieldDeclarations "}"
  
  NodeTrait
  	= name "as" "NodeTrait" NodeFields NodeFunctions
  
  FieldDeclarations
  	= FieldDeclarations FieldDeclaration -- list
    | ""
  
  FieldDeclaration
  	= propertyKey FieldType
  
  FieldType
  	= NonCompositeFieldType | CompositeFieldType
  
  NonCompositeFieldType
  	= IdField
    | NaturalLanguageField
    | EnumField
    | TimeField
    | CurrencyField
    | PrimitiveField
    | BitmaskField
  
  CompositeFieldType
  	= ArrayField
    | MapField
  
  IdField
  	= "ID" "<" name ">"
  
  NaturalLanguageField
  	= "NaturalLanguage"
  
  EnumField
  	= "Enumeration" "<" EnumKeys ">"
  
  EnumKeys
  	= EnumKeys "|" name -- list
    | name
    
  BitmaskField
  	= "Bitmask" "<" EnumKeys ">"
  
  TimeField
  	= "Timestamp"
  
  CurrencyField
  	= "Currency" "<" name ">"
  
  PrimitiveField
  	= "bool"
    | "int32"
    | "int64"
    | "float32"
    | "float64"
    | "uint32"
    | "uint64"
    | "string"
  
  ArrayField
  	= "Array" "<" FieldType ">"
  
  MapField
  	= "Map" "<" NonCompositeFieldType "," FieldType ">"
  
  NodeFunctions
  	= NodeFunctions "&" NodeFunction -- list
    | ""
  
  EdgeFunctions
  	= EdgeFunctions "&" EdgeFunction -- list
    | ""
  
  EdgeFunction
  	= Index
    | Invert
  
  NodeFunction
  	= OutboundEdges
    | InboundEdges
    | Index
    | ReadPrivacy
    | Traits
  
  OutboundEdges
  	= "OutboundEdges" "{" EdgeDeclarations "}"
  
  InboundEdges
  	= "InboundEdges" "{" EdgeDeclarations "}"
  
  Index
  	= "Index" "{" Indices "}"
  
  Invert
  	= "Invert" "as" name
  
  ReadPrivacy
  	= "ReadPrivacy" "{" "}"
  
  Traits
  	= "Traits" "{" NameList "}"
  
  EdgeDeclarations
  	= EdgeDeclarations EdgeDeclaration -- list
    | ""
  
  EdgeDeclaration
  	= propertyKey InlineEdgeDefinition
    | propertyKey name

  InlineEdgeDefinition
    = "Edge" "<" NameOrResolution ">"
  
  NameOrResolution
  	= name "." name -- resolution
    | name
  
  Indices
  	= Indices IndexDeclaration -- list
    | ""
  
  IndexDeclaration
  	= propertyKey Index -- fullDef
    | name -- shortDef
  
  NameList
  	= NameList name -- list
    | name
}
`;

const grammar = ohm.grammar(grammarDefinition);

export default grammar;
