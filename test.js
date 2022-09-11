let str = `<html><title>You are being redirected...</title>
<noscript>Javascript is required. Please enable javascript before you are allowed to see this page.</noscript>
<script>var s={},u,c,U,r,i,l=0,a,e=eval,w=String.fromCharCode,sucuri_cloudproxy_js='',S='eD0nMG1TZScuc3Vic3RyKDMsIDEpICsgJycgKycnKyIzIi5zbGljZSgwLDEpICsgImNzdWN1ciIuY2hhckF0KDApKyIybCIuY2hhckF0KDApICsgICcnICsgCiI3c3VjdXIiLmNoYXJBdCgwKSsnNycgKyAgICcnICsnMjAnLnNsaWNlKDEsMikrJzUnICsgICJkIiArICIiICsiZXN1Ii5zbGljZSgwLDEpICsgIjNzdWN1ciIuY2hhckF0KDApKyIiICsndUcxJy5jaGFyQXQoMikrJz0xJy5zbGljZSgxLDIpK1N0cmluZy5mcm9tQ2hhckNvZGUoMHgzMykgKyAnMCcgKyAgJzknICsgICAnJyArJzAnICsgICI0ayIuY2hhckF0KDApICsgICcnICsgCiI0dyIuY2hhckF0KDApICsgIjAiICsgImEiICsgIiIgKydiJyArICBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4MzMpICsgImQiLnNsaWNlKDAsMSkgKyAgJycgKyAKIjNzdWN1ciIuY2hhckF0KDApKyAnJyArJzMnICsgICJhbSIuY2hhckF0KDApICsgICcnICsgCiIzc3UiLnNsaWNlKDAsMSkgKyAiIiArU3RyaW5nLmZyb21DaGFyQ29kZSgweDY0KSArICdWeD44Jy5zdWJzdHIoMywgMSkgKyAnJyArIjZzdWN1ciIuY2hhckF0KDApKyIxIiArICAnJyArJyc7ZG9jdW1lbnQuY29va2llPSdzc3VjdXJpJy5jaGFyQXQoMCkgKyAndXMnLmNoYXJBdCgwKSsnYycrJ3VzdScuY2hhckF0KDApICsnc3VjdXJyJy5jaGFyQXQoNSkgKyAnaScrJ19zdScuY2hhckF0KDApICsnc3VjdXJpYycuY2hhckF0KDYpKydsJy5jaGFyQXQoMCkrJ29zdWN1Jy5jaGFyQXQoMCkgICsnc3UnLmNoYXJBdCgxKSsnc3VjdXJkJy5jaGFyQXQoNSkgKyAncCcuY2hhckF0KDApKydyJysnJysnc3VjdXJpbycuY2hhckF0KDYpKyd4c3VjdScuY2hhckF0KDApICArJ3lzJy5jaGFyQXQoMCkrJ18nKyd1JysndScrJ2knKydkJysnX3N1Y3VyJy5jaGFyQXQoMCkrICc1Jysnc3VjdXIyJy5jaGFyQXQoNSkgKyAnYicrJzRzJy5jaGFyQXQoMCkrJ2FzdWN1cmknLmNoYXJBdCgwKSArICc4Jy5jaGFyQXQoMCkrJ2VzdScuY2hhckF0KDApICsnOXN1YycuY2hhckF0KDApKyAnM3MnLmNoYXJBdCgwKSsiPSIgKyB4ICsgJztwYXRoPS87bWF4LWFnZT04NjQwMCc7IGxvY2F0aW9uLnJlbG9hZCgpOw==';L=S.length;U=0;r='';var A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';for(u=0;u<64;u++){s[A.charAt(u)]=u;}for(i=0;i<L;i++){c=s[S.charAt(i)];U=(U<<6)+c;l+=6;while(l>=8){((a=(U>>>(l-=8))&0xff)||(i<(L-2)))&&(r+=w(a));}}e(r);</script></html>`;

function solveSucuri(str) {
  let scriptStart = str.indexOf('<script>') + 8,
    scriptEnd = str.indexOf('</script>');
  let scriptBody = str.substring(scriptStart, scriptEnd);
  let injectedScriptBody = scriptBody.replace(
    "r=''",
    `r="const document = {}, location = { reload: () => document };"`,
  );

  return eval(injectedScriptBody).cookie;
}

console.log(solveSucuri(str));
