// ==UserScript==
// @name        teleport bookshelves - fimfiction.net
// @author      auceps
// @description put bookshelves at bottom of chapter when you get there
// @namespace   http://aucep.github.io
// @match       *://www.fimfiction.net/story/*
// @grant       none
// @license     MIT
// @version     1.0
// ==/UserScript==

/* jshint esversion:6 */

const doc = document;

(function(){
  "use strict";
  
  //copy css rules
  const style = doc.createElement("style");
  {
    style.textContent = 
    ".story-bookshelves-widget {\
      display: block;\
      padding: 0;\
      border: none;\
      vertical-align: middle;\
      text-decoration: none;\
      line-height: 0;\
      text-align: left;\
      margin-bottom: -1px;\
    }\
    .story-bookshelves-widget li {\
      display: inline-block;\
      width: 2.3125rem;\
      height: 2.3125rem;\
      margin-right: -1px;\
      overflow: hidden;\
      padding: 0;\
      font-size: 1.575rem;\
      border: 1px solid #333d4f;\
      cursor: pointer;\
      -webkit-touch-callout: none;\
      -webkit-user-select: none;\
      -khtml-user-select: none;\
      -moz-user-select: none;\
      -ms-user-select: none;\
      user-select: none;\
    }\
    .story-bookshelves-widget li.unselected {\
	    background: #1d222c !important;\
    }\
    .story-bookshelves-widget li span {\
      display: block;\
      line-height: 2.3125rem;\
      text-align: center;\
      -webkit-transition: color .2s;\
      transition: color .2s;\
    }\
    .story-bookshelves-widget li span.loading {\
	    display: none;\
    }\
    .story-bookshelves-widget li span::before {\
	    color: #afceff;\
	    -webkit-transition: color .2s;\
	    transition: color .2s;\
    }";
  }
  doc.body.appendChild(style);
  
  
  const bookshelves = $(".story-bookshelves-widget"),
        chapterPage = $(".chapter-page");
  let onBottom = false;
  let inMobile = false;
  doc.body.onscroll = placeByScroll;
  doc.body.onresize = placeByLayout;
  placeByScroll();
  placeByLayoutInitial();
  
  function placeByScroll() {
    if (!onBottom && 200 > pastBottom(chapterPage)) {
      //put on bottom
      bookshelves.style.translate = "";
      onBottom = true;
      $(".chapter_footer").appendChild(bookshelves);
      console.log("put on bottom!");
    } else if (onBottom && -200 < untilTop(chapterPage)) {
      onBottom = false;
      placeByLayoutInitial();
      console.log("put on top!");
    }/**/
  }
  
  function placeByLayout() {
    if (onBottom) {
      if (isHidden($(".story-top-toolbar"))) {
        inMobile = true;
      } else {
        inMobile = false;
      }
    } else {
      if (!inMobile && isHidden($(".story-top-toolbar")) ) {//mobile
        $("div.toolbar").insertBefore(bookshelves, $("div.toolbar > .cell"));
        bookshelves.style.translate = "";
        console.log("put in mobile!");
        inMobile = true;
      } else if (inMobile && !isHidden($(".story-top-toolbar")) ) {//desktop
        $(".story-top-toolbar").insertBefore(bookshelves, $(".story-top-toolbar > .right"));
        bookshelves.style.translate = "0 2px";
        console.log("put in desktop!");
        inMobile = false;
      }
    }
  }
  
  function placeByLayoutInitial() {//place widget in mobile toolbar if mobile layout
    if (isHidden($(".story-top-toolbar")) ) {//mobile
      $("div.toolbar").insertBefore(bookshelves, $("div.toolbar > .cell"));
      bookshelves.style.translate = "";
      console.log("put in mobile!");
      inMobile = true;
    } else if (!isHidden($(".story-top-toolbar")) ) {//desktop
      $(".story-top-toolbar").insertBefore(bookshelves, $(".story-top-toolbar > .right"));
      bookshelves.style.translate = "0 2px";
      console.log("put in desktop!");
      inMobile = false;
    }
  }
}());

  
function isHidden(e) { return e.offsetParent === null }
function pastBottom(e) { return e.getBoundingClientRect()['bottom'] - window.innerHeight }
function untilTop(e) { return e.getBoundingClientRect()['top'] }
function $(q) { return document.querySelector(q) }
