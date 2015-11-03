"use strict";
var fs = require('fs');
var path = require('path');

class fileList {
  constructor(parentPath,div1) {
    this.path = parentPath;
    this.div = div1;
    this.leftTitle = document.querySelector("#leftTitle");
    this.leftBack  = document.querySelector("leftBack");
    this.leftList  = document.querySelector("#leftList");
    this.rightFiles = [];
    this.leftDirs   = [];
  }

  show(str){
    this.div.innerHTML = str;
  }

  bindClick(node,filename){
    return function () {
      console.log(filename);
    }
  }

  initListShow(path1,files){
    var self = this;
    self.leftDirs = [];
    self.rightFiles = [];
    for (let variable of files) {
      let sunPath = path.join(path1,variable);
      console.log(sunPath);
      fs.stat(sunPath,function (err,stats) {
        if(err)return;
        if(stats.isFile()){//加入到文件显示区
          self.rightFiles.push(variable);
          return;
        }
        if(stats.isDirectory()){// 加入当前显示区
          self.leftDirs.push(variable);
          let p = document.createElement("p");
          p.onclick = self.bindClick(path1,variable);
          p.innerHTML = variable;
          self.div.appendChild(p);
        }
      });
    }
  }

  readdir(path1){
    path1 = path1 || this.path;
    var self = this;

    fs.readdir(path1,function (err,files) {
      if(err)return;
      self.initListShow(path1,files);
    });
  }
}

function showFileList(holder,file) {
  // 处理拖动的文件列表
  function innerHTML(argument) {
    holder.innerHTML = argument;
  }
  console.log(file);
  var filename = file.path;
  fs.stat(filename,function (err,stats) {
    if(err)return;
    if(stats.isFile()){
      innerHTML(filename);
      return;
    }
    if (stats.isDirectory()) {
      // 显示一个文件列表,是文件放入右侧，否则放入当前队列
      let fl = new fileList(filename,holder);
      fl.readdir();
    }
  });

}

function holderDiv(argument) {
  var holder = document.getElementById('holder');
  holder.ondragover = function () {
    return false;
  };
  holder.ondragleave = holder.ondragend = function () {
    return false;
  };
  holder.ondrop = function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    console.log('File you dragged here is', file,file.path);
   showFileList(holder,file);
    return false;
  };
}

function show(argument) {
  // body...
  var t1 = 10;
  var t2 = 20;
  var t3 = `hello ${t1 + t2}`;
  console.log(t3,argument);
  argument.innerHTML = t3;
}




window.onload = function () {
  var show1 = document.querySelector("#show");
  console.log(show1);
  if(!show1)return;
  show(show1);
  holderDiv();
}
