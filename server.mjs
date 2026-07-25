import http from 'http';
import fs from 'fs';
import path from 'path';
const port = Number(process.env.PORT) || 8080;
const root = path.resolve('site');
const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon'};
http.createServer((req,res)=>{
  let p = decodeURIComponent((req.url||'/').split('?')[0]);
  if(p.endsWith('/')) p+='index.html';
  const fp = path.join(root,p);
  if(!fp.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(fp,(e,d)=>{
    if(e){ res.writeHead(404); return res.end('404'); }
    res.writeHead(200,{'Content-Type':types[path.extname(fp)]||'application/octet-stream'});
    res.end(d);
  });
}).listen(port,'0.0.0.0',()=>console.log('serving on',port));
