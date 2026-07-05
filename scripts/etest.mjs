const H="https://alolebas-web.vercel.app";
const KEY="jina_580bdaa168d14bc6800ae4fecbf80183sWEW89HpBUCoA9X-RUmuzsfdwdJ7";
const r=await fetch(H+"/products/manto-1.jpg"); const b=Buffer.from(await r.arrayBuffer());
const b64="data:image/jpeg;base64,"+b.toString("base64");
for(let i=0;i<20;i++){
  const res=await fetch(H+"/api/embed",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({secret:KEY,images:[b64]})});
  if(res.status===200){const j=await res.json();console.log("✅ /api/embed live — dim",j.embeddings[0].length);process.exit(0);}
  if(res.status===403){console.log("403 forbidden (secret mismatch)");process.exit(1);}
  await new Promise(r=>setTimeout(r,6000));
}
console.log("timed out waiting for deploy");
