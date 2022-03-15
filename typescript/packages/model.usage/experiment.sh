# TODO: the paths are relative to different things.
# first one is relative to cli.js location
# second is relative to where script is invoked
# both should be relative to script invoke location
node ./node_modules/@strut/model/lib/cli.js gen ./lib/example/SlideSchema.js --dest ./src/example/generated
node ./node_modules/@strut/model/lib/cli.js gen ./lib/example/DeckSchema.js --dest ./src/example/generated
node ./node_modules/@strut/model/lib/cli.js gen ./lib/example/ComponentSchema.js --dest ./src/example/generated