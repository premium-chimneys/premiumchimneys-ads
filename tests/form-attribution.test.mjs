import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attributionCookie, readAttribution, captureServerAttribution } from '../lib/form-attribution.mjs';
const now=1800000000000;
test('captures actual request tags, drops unrelated data, and expires retained campaigns',()=>{
 const value=attributionCookie('https://example.com/contact?utm_source=bing&utm_medium=cpc&email=private',now);
 assert.deepEqual(readAttribution(value,now),{utm_source:'bing',utm_medium:'cpc'});
 assert.equal(value.includes('private'),false);
 assert.deepEqual(readAttribution(value,now+31*86400000),{});
 assert.deepEqual(readAttribution('bad',now),{});
 assert.equal(attributionCookie('https://example.com/contact',now),null);
});
test('only document requests set a secure HttpOnly host cookie; prefetch never changes attribution',()=>{
 let writes=0;
 const response={cookies:{set:(key,value,options)=>{
  writes++;assert.equal(options.httpOnly,true);assert.equal(options.secure,true);assert.equal(options.domain,undefined);
 }}};
 const request={url:'https://example.com/?utm_source=bing',nextUrl:{protocol:'https:'},method:'GET',headers:new Headers({accept:'text/html'})};
 assert.equal(captureServerAttribution(request,response),response);assert.equal(writes,1);
 request.headers.set('next-router-prefetch','1');captureServerAttribution(request,response);assert.equal(writes,1);
 request.headers.delete('next-router-prefetch');request.headers.set('accept','application/json');captureServerAttribution(request,response);assert.equal(writes,1);
});

