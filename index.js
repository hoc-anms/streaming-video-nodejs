const fs = require( "fs" );
const express = require( "express" );
const app = express();

app.get( "/", ( req, res ) => {
  res.send( "API Running!" )
} );

app.get( "/stream", ( req, res ) => {
  const path = "./upload/hpbd.mp4";
  const stat = fs.statSync( path );
  const fileSize = stat.size;
  const range = req.headers.range;
  if ( range ) {
    const parts = range.replace( /bytes=/, "").split("-");
    const start = parseInt( parts[ 0 ], 10 );
    const end = parts[ 1 ] ? parseInt( parts[ 1 ], 10 ) : fileSize - 1;
    const chunkSize = ( end - start ) + 1;
    const file = fs.createReadStream( path, { start, end } );
    const head = {
      "Content-Range": `bytes ${ start } - ${ end } / ${fileSize }`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    };
    res.writeHead( 206, head );
    return file.pipe( res );
  }
  const head = {
    "Content-Length": fileSize,
    "Content-Type": "video/mp4"
  };
  res.writeHead( 206, head );
  fs.createReadStream( path ).pipe( res );
} );


app.listen( 3001, () => {
  console.log( "API Running On Port 3001" );
} );
