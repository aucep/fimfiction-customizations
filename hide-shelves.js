// ==UserScript==
// @name        hide shelves - fimfiction.net
// @author      auceps
// @description hides bookshelves that start with # from the header/sidebar Library, and adds a toggle to show them again.
// @namespace   http://auceps.github.io
// @match       *://www.fimfiction.net/*
// @grant       none
// @license     MIT
// @version     1.0
// ==/UserScript==

/* jshint esversion:6 */
(function(){
"use strict";

function modifyShelfList(list) {
  let hid = false;
  //hide all shelves beginning with "#"
  for (const li of list.children) {
    const a = li.querySelector(":scope > a");//boomer browsers cant, xd
    if (a) {
      if (a.textContent[0]=="#") {
        li.className += " hiddenShelf";
        li.style.display = "none";
        hid = true;
      }
    }
  }
  //create and place a button to toggle showing them again
  if (hid) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const i = document.createElement("i");
    i.className = "fa fa-eye-slash";
    a.append(i, document.createTextNode("Show hidden"));
    li.append(a);
    
    //eventListener can suck it
    a.onclick = function() {
      if (this.textContent == "Show hidden") {
        for (const shelf of document.querySelectorAll(".hiddenShelf")) {
          shelf.style.display = "";
        }
        this.lastChild.data = "Hide #shelves";
      } else {
        for (const shelf of document.querySelectorAll(".hiddenShelf")) {
          shelf.style.display = "none";
        }
        this.lastChild.data = "Show hidden";
      }
    };
    
    list.append(li);
  }
}

//desktop
modifyShelfList($(".bookshelves"));

//mobile
const ob = new MutationObserver((_, ob) => {
  ob.disconnect();
  modifyShelfList($(".navigation-drawer > .navigation-drawer-tab:last-child > ul:nth-of-type(3)"));
});

ob.observe($(".navigation-drawer"), {childList: true});

}());

function $(q) { return document.querySelector(q); }
