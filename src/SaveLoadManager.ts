import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
import {canvas, engine, scene, pickableMeshes} from './index';
import ActiveEntityManager from './ActiveEntityManager';

const assetsManager = new BABYLON.AssetsManager(scene);
const loadButton = document.getElementById('loadFile');
const saveButton = document.getElementById('saveScene');
const deleteButton = document.getElementById('delete');
var objectUrl: string;

loadButton.onchange = function (evt) {
  const files = (<HTMLInputElement>evt.target).files;
  const filename = files[0].name;
  const filenameLowercase = filename.toLowerCase();

  const blob = new Blob([files[0]]);

  BABYLON.FilesInput.FilesToLoad[filenameLowercase] = blob as File;

  assetsManager.addMeshTask('task1', '', 'file:', filenameLowercase);
  assetsManager.load();
};

assetsManager.onTaskSuccessObservable.add(function () {
    loadingComplete();
  });
  
saveButton.onclick = function () {
  if (confirm('Do you want to download that scene?')) {
    doDownload('scene', scene);
  } else {
    // Do nothing!
    console.log('Save canceled.');
  }
};

function loadingComplete () {
    // console.log("Mesh loaded !");
    scene.meshes.forEach(function addToPickableMeshes (item) {
      if (!pickableMeshes.includes(item) && item.name != 'ground') {
        pickableMeshes.push(item);
      }
    });
  }


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

deleteButton.onclick = function() {
    ActiveEntityManager.currentActiveMesh.dispose();   
}
  