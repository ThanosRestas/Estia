import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import {assetsManager,scene, pickableMeshes } from "./index";
import ActiveEntityManager from "./ActiveEntityManager";

//export let assetsManager = new BABYLON.AssetsManager(scene);
export const loadButton = document.getElementById("loadFile");
export const saveButton = document.getElementById("saveScene");
export const deleteButton = document.getElementById("delete");
// const assetsManager = new BABYLON.AssetsManager(scene);
var objectUrl: string;


saveButton.onclick = function () {
  if (confirm('Do you want to download that scene?')) {
    doDownload('scene', scene);
  } else {
    // Do nothing!
    console.log('Save canceled.');
  }
};



function doDownload (filename, scene) {
  if (objectUrl) {
    window.URL.revokeObjectURL(objectUrl);
  }

  var serializedScene = BABYLON.SceneSerializer.Serialize(scene);

  var strMesh = JSON.stringify(serializedScene);
  // var strMesh = safeJsonStringify(serializedScene);

  if (filename.toLowerCase().lastIndexOf('.babylon') !== filename.length - 8 || filename.length < 9) {
    filename += '.babylon';
  }

  var blob = new Blob([strMesh], { type: 'octet/stream' });

  // turn blob into an object URL; saved as a member, so can be cleaned out later
  objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

  var link = window.document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  var click = document.createEvent('MouseEvents');
  click.initEvent('click', true, false);
  link.dispatchEvent(click);
}


deleteButton.onclick = function ()
{
    ActiveEntityManager.currentActiveMesh.dispose();
    ActiveEntityManager.currentActiveGizmo.disable();
    console.log("Test");
};



loadButton.onchange = function (evt) {
  const files = (<HTMLInputElement>evt.target).files;
  const filename = files[0].name;
  const filenameLowercase = filename.toLowerCase();

  const blob = new Blob([files[0]]);

  BABYLON.FilesInput.FilesToLoad[filenameLowercase] = blob as File;

  let task = assetsManager.addMeshTask('task1', '', 'file:', filenameLowercase);
  assetsManager.load();
  task.onSuccess = function ( task ){
    task.loadedMeshes.forEach(mesh => {
       pickableMeshes.push(mesh);
    });    
  }  
};



