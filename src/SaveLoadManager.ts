import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { assetsManager, scene, pickableMeshes } from "./index";
import ActiveEntityManager from "./ActiveEntityManager";


export const loadButton = document.getElementById("loadFile");
export const saveButton = document.getElementById("saveScene");
export const deleteButton = document.getElementById("delete");


class SaveLoadManager
{
  private static objectUrl: string;
  private static saveFileName = 'scene';
  

  static save(): void
  {
    if (SaveLoadManager.objectUrl)
    {
      window.URL.revokeObjectURL(SaveLoadManager.objectUrl);
    }

    const serializedScene = BABYLON.SceneSerializer.Serialize(scene);
    const strMesh = JSON.stringify(serializedScene);



    if (SaveLoadManager.saveFileName.toLowerCase().lastIndexOf('.babylon') !== SaveLoadManager.saveFileName.length - 8 || SaveLoadManager.saveFileName.length < 9)
    {
      SaveLoadManager.saveFileName += '.babylon';
    }

    const blob = new Blob([strMesh], { type: 'octet/stream' });

    // Turn blob into an object URL; saved as a member, so can be cleaned out later
    SaveLoadManager.objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

    const link = window.document.createElement('a');
    link.href = SaveLoadManager.objectUrl;
    link.download = SaveLoadManager.saveFileName;
    const click = document.createEvent('MouseEvents');
    click.initEvent('click', true, false);
    link.dispatchEvent(click);
  }


  static load(this: HTMLElement, evt: Event): void
  {
    const files = (evt.target as HTMLInputElement).files;
    const filename = files[0].name.toLowerCase();

    const blob = new Blob([files[0]]);

    BABYLON.FilesInput.FilesToLoad[filename] = blob as File;

    const task = assetsManager.addMeshTask('task1', '', 'file:', filename);
    assetsManager.load();
    task.onSuccess = function (task): void
    {
      // Temporary parent for non parented meshes for easy gizmo pick
      const parentTemp = new BABYLON.TransformNode("parentTemp");
      task.loadedMeshes.forEach(mesh =>
      {
        pickableMeshes.push(mesh);
        // Assign temp parent
        mesh.parent = parentTemp;
      });
    };
  }

  static delete(): void
  {
    ActiveEntityManager.currentActiveMesh.dispose();
    ActiveEntityManager.currentActiveGizmo.disable();
    console.log("Test");
  }
}

deleteButton.addEventListener("click", SaveLoadManager.delete);
loadButton.addEventListener("change", SaveLoadManager.load);
saveButton.addEventListener("click", SaveLoadManager.save);


