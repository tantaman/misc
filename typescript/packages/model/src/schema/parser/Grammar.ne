# Parse Aphrodite schemas
@builtin "whitespace.ne"
@builtin "number.ne"

main -> _ preamble _ entities _
preamble -> (engineDeclaration dbDeclaration) | (dbDeclaration engineDeclaration)
engineDeclaration -> "storageEngine:" inlineSpace engine "\n"
dbDeclaration -> "dbName:" inlineSpace dbName "\n"
engine -> "postgres" # | "mysql" | "neo4j" | "redis" | "redis-graph" | "singlestore" | "mariadb" | "gremlin" | "opencypher"
dbName -> [a-zA-Z0-9]:+

entities -> null | entities node | entities edge

node -> "Node<" _ nodeTypeName _ ">" _
edge -> "Edge<" _ nodeTypeName _ "," _ nodeTypeName _ ">" _
nodeTypeName -> [a-zA-Z_] [a-zA-Z0-9_-]:*

inlineSpace -> [ \t\v\f]:* {% (_) => null %}

# storageEngine: postgres
# dbName: mealtrained

# Node<User> {
#   id: ID<User>
#   name: NaturalLanguage<string>
# } | Privacy {
#   AllowIf(Viewer is this)
#   AllowIf(
#     Trains.queryFromCreator(this).intersect(Trains.queryFromCreator(Viewer)).exists(),
#     'Viewer and the User share trains in common. Nit: check train privacy settings?',
#   )
# }

# Node<Train> {
#   id: ID<Train>
#   name: NaturalLanguage<string>
#   creatorId: ID<User>
#   status: Enumeration<Open | Created | Lapsed | Cancelled>
#   description: NaturalLanguage<string>
# } | OutboundEdges {
#   creator: FieldEdge<Train.creatorId>
#   participants: TrainToParticipantEdge
#   slots: ForeignKeyEdge<Slot.trainId>
# } | InboundEdges {
#   fromCreator: ForeignKeyEdge<Train.creatorId>
# } | Index {
#   id as primaryKey
#   creatorId
# } | Privacy {
#   AllowIf(Viewer is creator)
# }

# Edge<Train, Participant> as TrainToParticipantEdge {
#   src: Train
#   dest: Participant
#   role: Bitmask<PARTICIPANT | RECIPIENT>
# } | Constrain {
#   unique(src, dest)
# } | Invert as ParticipantToTrainEdge

# Slot {
#   id: ID<Slot>
#   trainId: ID<Train>
#   timestamp: Timestamp
#   mealType: Enumeration<Breakfast | Lunch | Dinner | Snack | Other>
#   recipientResponse: Enumeration<Accepted | Declined> | null
#   sponsorId: ID<User>
# } | OutboundEdges {
#   sponsor: FieldEdge<Slot.sponsorId>
#   items: SlotToItemEdge
# } | InboundEdges {
#   fromSponsor: ForeignKeyEdge<Slot.sponsorId>
# } | Index {
#   trainId
#   sponsor
# }

# Edge<Slot, Item> as SlotToItemEdge {

# }

# Item {

# }
