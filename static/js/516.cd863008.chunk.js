"use strict";(self.webpackChunkhk_independent_bus_eta=self.webpackChunkhk_independent_bus_eta||[]).push([[516],{5516:function(e,n,t){t.r(n),t.d(n,{default:function(){return be}});var r,i,a=t(9439),o=t(7313),s=t(6060),u=t(7829),l=t(1413),c=t(9099),d=t(9019),x=t(2720),h=t(1479),f=t(9563),p=t(6417),b=function(e){var n=e.k,t=e.handleClick,r=e.disabled,i=void 0!==r&&r,a=e.sx;return(0,p.jsx)(c.Z,{size:"large",variant:"contained",sx:(0,l.Z)((0,l.Z)({},Z),a),onClick:function(){return t(n)},disabled:i,disableRipple:!0,children:"b"===n?(0,p.jsx)(x.Z,{}):"c"===n?(0,p.jsx)(h.Z,{}):n})},g=function(e){var n=e.possibleChar,t=(0,o.useContext)(s.Z),r=t.numPadOrder,i=t.searchRoute,a=t.updateSearchRouteByButton;return(0,p.jsx)(d.ZP,{container:!0,spacing:0,children:r.split("").map((function(e){return(0,p.jsx)(d.ZP,{item:!0,xs:4,children:(0,p.jsx)(b,{k:e,handleClick:a,sx:C,disabled:"b"===e&&""===i||!"bc".includes(e)&&!n.includes(e)||"c"===e&&""===i})},"input-"+e)}))})},m=function(e){var n=e.possibleChar,t=(0,o.useContext)(s.Z).updateSearchRouteByButton;return(0,p.jsx)(d.ZP,{container:!0,spacing:1,children:n.filter((function(e){return isNaN(parseInt(e,10))})).map((function(e){return(0,p.jsx)(d.ZP,{item:!0,xs:12,children:(0,p.jsx)(b,{k:e,handleClick:t,sx:k})},"input-"+e)}))})},j=function(e){var n=e.boardTab,t=(0,o.useContext)(s.Z),r=t.searchRoute,i=t.db.routeList,a=T(r,i,n);return"prerendering"===navigator.userAgent?(0,p.jsx)(p.Fragment,{}):(0,p.jsxs)(u.Z,{sx:v,padding:0,children:[(0,p.jsx)(u.Z,{sx:w,padding:0,children:(0,p.jsx)(g,{possibleChar:a})}),(0,p.jsx)(u.Z,{sx:y,padding:0,children:(0,p.jsx)(m,{possibleChar:a})})]})},v={zIndex:0,background:function(e){return e.palette.background.default},display:"flex",flexDirection:"row",height:"248px",justifyContent:"space-around"},Z={background:function(e){return e.palette.background.paper},color:function(e){return e.palette.text.primary},width:"100%",fontSize:"1.8em",borderRadius:"unset","&:selected":{color:function(e){return e.palette.text.primary}},"&:hover":{backgroundColor:function(e){return e.palette.background.paper}}},C={height:"62px"},k={height:"52px"},y={width:"20%",height:"246px",overflowX:"hidden",overflowY:"scroll"},w={width:"72%"},T=function(e,n,t){if(null==n)return[];var r={};return Object.entries(n).forEach((function(n){var i=(0,a.Z)(n,2),o=i[0],s=i[1];if(o.startsWith(e.toUpperCase())&&s.co.some((function(e){return f.nR[t].includes(e)}))){var u=o.slice(e.length,e.length+1);r[u]=isNaN(r[u])?1:r[u]+1}})),Object.entries(r).map((function(e){return e[0]})).filter((function(e){return"-"!==e}))},S=t(4511),R=t(5823),I=t(4942),D=t(8485),B=t(5280),L=function(e){var n=e.boardTab,t=e.onChangeTab,r=(0,S.$)().t;return(0,p.jsx)(u.Z,{sx:F,children:(0,p.jsx)(D.Z,{value:n,onChange:function(e,n){return t(n,!0)},sx:M,children:Object.keys(f.nR).map((function(e){return(0,p.jsx)(B.Z,{label:r(e),value:e,disableRipple:!0},e)}))})})},M=(i={background:function(e){return e.palette.background.default},minHeight:"36px",overflow:"auto",maxWidth:"100%"},(0,I.Z)(i,"& .MuiTab-root",(r={py:0,minWidth:"85px",minHeight:"32px"},(0,I.Z)(r,"&.Mui-selected",{color:function(e){return"dark"===e.palette.mode?e.palette.primary.main:"black"}}),(0,I.Z)(r,"&.MuiButtonBase-root",{textTransform:"none"}),r)),(0,I.Z)(i,"& .MuiTabs-indicator",{backgroundColor:function(e){return"dark"===e.palette.mode?e.palette.primary.main:"black"}}),(0,I.Z)(i,"& .MuiTabs-scroller",{overflow:"auto !important"}),i),F={background:function(e){return"dark"===e.palette.mode?e.palette.background.default:"white"}},O=t(2547),z=t(275),$=t(2429),P=t(3165),H=t(8566),N=t(6912),W=t(1113),_=t(3135),A=t(3428),U=t(4183),E=t(8296),X=t(7131),Y=t(2135),q=function(e){var n=e.terminus,t=(0,S.$)(),r=t.t,i=t.i18n;return(0,p.jsxs)(u.Z,{sx:G,children:[(0,p.jsxs)(u.Z,{sx:J,children:[(0,p.jsx)("span",{children:"".concat(r("\u5f80")," ")}),(0,p.jsx)(W.Z,{component:"h3",variant:"h6",sx:Q,children:(0,R.iF)(n.dest[i.language])})]}),(0,p.jsx)(u.Z,{sx:K,children:(0,p.jsx)(W.Z,{variant:"body2",children:(0,R.iF)(n.orig[i.language])})})]})},G={textAlign:"left","& > span":{}},J={display:"flex",alignItems:"baseline",whiteSpace:"nowrap",overflowX:"hidden","& > span":{fontSize:"0.95rem",mr:.5}},K={display:"flex",alignItems:"baseline",whiteSpace:"nowrap",overflowX:"hidden"},Q={fontWeight:700},V=t(9530),ee=function(e){var n=e.route,t=(0,S.$)().t,r=n[0].split("-").slice(0,2),i=(0,a.Z)(r,2),o=i[0],s=i[1];return(0,p.jsxs)(u.Z,{children:[(0,p.jsxs)("div",{children:[(0,p.jsx)(V.Z,{routeNo:o}),parseInt(s,10)>=2&&(0,p.jsx)(W.Z,{variant:"caption",sx:te,children:t("\u7279\u5225\u73ed")})]}),(0,p.jsx)(W.Z,{component:"h4",variant:"caption",sx:ne,children:n[1].co.map((function(e){return t(e)})).join("+")})]})},ne={color:function(e){return e.palette.text.secondary}},te={fontSize:"0.6rem",marginLeft:"8px"},re=t(8586),ie=function(e){var n=e.route,t=e.handleClick,r=e.style,i=e.onRemove,a=(0,S.$)().i18n;return(0,p.jsx)(Y.rU,{to:"/".concat(a.language,"/route/").concat(n[0].toLowerCase()),style:r,children:(0,p.jsxs)(A.Z,{variant:"outlined",square:!0,sx:ae,children:[(0,p.jsx)(U.Z,{onClick:t,children:(0,p.jsxs)(E.Z,{sx:oe,children:[(0,p.jsx)(ee,{route:n}),(0,p.jsx)(q,{terminus:n[1]})]})}),null!==i&&(0,p.jsx)(X.Z,{onClick:i,children:(0,p.jsx)(re.Z,{onClick:i})})]},n[0])})},ae={border:"none",display:"flex",alignItems:"center"},oe={display:"grid",gridTemplateColumns:"25% 65%",py:.5,px:2,alignItems:"center"},se=t(8467),ue=o.memo((function(e){var n=e.data,t=n.routeList,r=n.vibrateDuration,i=n.tab,a=e.index,u=e.style,l=t[a],c=(0,o.useContext)(s.Z),d=c.addSearchHistory,x=c.removeSearchHistoryByRouteId,h=(0,S.$)().i18n,f=(0,se.s0)();return(0,p.jsx)(ie,{handleClick:function(e){e.preventDefault(),(0,R.tp)(r),d(l[0]),setTimeout((function(){f("/".concat(h.language,"/route/").concat(l[0].toLowerCase()))}),0)},route:l,style:u,onRemove:"recent"===i?function(e){e.preventDefault(),(0,R.tp)(r),x(l[0])}:null})}),P.wy),le=(0,N.Z)((function(e,n,t){return{routeList:e,vibrateDuration:n,tab:t}})),ce=(0,z.yP)((0,z.p6)(O.ZP)),de=function(e){var n=e.boardTab,t=e.onChangeTab,r=(0,o.useContext)(s.Z),i=r.searchRoute,l=r.db,c=l.holidays,d=l.routeList,x=r.isRouteFilter,h=r.busSortOrder,b=r.routeSearchHistory,g=r.vibrateDuration,m=(0,o.useMemo)((function(){return(0,_.HD)(c,new Date)}),[c]),j=(0,S.$)().t,v=(0,o.useMemo)((function(){var e=Object.entries(d).filter((function(e){var n=(0,a.Z)(e,2),t=n[0],r=n[1],o=r.stops,s=r.co;return t.startsWith(i.toUpperCase())&&(null==o[s[0]]||o[s[0]].length>0)})).filter((function(e){var n=(0,a.Z)(e,2),t=n[0],r=n[1].freq;return!x||(0,_.x4)(t,r,m)})).sort((function(e,n){return(0,R.nO)(e,n,f.Y$[h])}));return Object.entries(f.nR).map((function(n,t){var r=(0,a.Z)(n,2),o=r[0],s=r[1];return le("recent"===o?b.filter((function(e){return e.startsWith(i.toUpperCase())})).filter((function(e){return d[e]})).map((function(e){return[e,d[e]]})):e.filter((function(e){var n=(0,a.Z)(e,2);n[0];return n[1].co.some((function(e){return s.includes(e)}))})),g,o)}))}),[d,m,i,x,g,h,b]),Z=(0,o.useCallback)((function(e){var n=e.key,t=e.index;return(0,p.jsx)(o.Fragment,{children:v[t].routeList.length>0?(0,p.jsx)(H.Z,{children:function(e){var n=e.height,r=e.width;return(0,p.jsx)(P.t7,{height:.98*n,itemCount:v[t].routeList.length,itemSize:64,width:r,itemData:v[t],children:ue})}}):(0,p.jsxs)(u.Z,{sx:fe,children:[(0,p.jsx)($.Z,{fontSize:"small"}),(0,p.jsx)(u.Z,{children:t>0?(0,p.jsxs)(p.Fragment,{children:[(0,p.jsxs)(W.Z,{variant:"h6",children:['"',i,'"']}),(0,p.jsx)(W.Z,{variant:"h6",children:j("route-search-no-result")})]}):(0,p.jsx)(p.Fragment,{children:(0,p.jsx)(W.Z,{variant:"h6",children:j("no-recent-search")})})})]})},n)}),[v,i,j]);return(0,o.useMemo)((function(){return(0,p.jsx)(p.Fragment,{children:"prerendering"===navigator.userAgent?(0,p.jsx)(u.Z,{sx:he,children:v[0].routeList.map((function(e,n){return(0,p.jsx)(ue,{data:v[0],index:n,style:null},"route-".concat(n))}))}):(0,p.jsx)(ce,{index:xe.indexOf(n),onChangeIndex:function(e){t(xe[e])},style:{flex:1,display:"flex"},containerStyle:{flex:1},slideCount:v.length,overscanSlideAfter:1,overscanSlideBefore:1,slideRenderer:Z,enableMouseEvents:!0})})}),[Z,v,t,n])},xe=["recent","all","bus","minibus","lightRail","mtr"],he={height:"100%",overflowY:"scroll"},fe=(0,I.Z)({height:"140px",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"},"& .MuiSvgIcon-root",{fontSize:"4rem",mr:2}),pe=function(e){var n=e.boardTab,t=e.setBoardTab,r=(0,o.useContext)(s.Z).AppTitle,i=(0,S.$)(),a=i.t,l=i.i18n;(0,o.useEffect)((function(){(0,R.ND)({title:a("\u641c\u5c0b")+" - "+a(r),description:a("route-board-page-description"),lang:l.language})}),[l.language]);var c=(0,o.useCallback)((function(e){t(e),localStorage.setItem("boardTab",e)}),[t]);return(0,p.jsxs)(u.Z,{sx:{flex:1,display:"flex",flexDirection:"column"},children:[(0,p.jsx)(L,{boardTab:n,onChangeTab:c}),(0,p.jsx)(de,{boardTab:n,onChangeTab:c})]})},be=function(){var e,n=localStorage.getItem("boardTab"),t=(0,o.useState)("recent"===(e=n)||"all"===e||"bus"===e||"minibus"===e||"lightRail"===e||"mtr"===e?n:"all"),r=(0,a.Z)(t,2),i=r[0],s=r[1];return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(pe,{boardTab:i,setBoardTab:s}),(0,p.jsx)(j,{boardTab:i})]})}}}]);