import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";
import { assetsManager, scene, pickableMeshes } from "./index";
import ActiveEntityManager from "./ActiveEntityManager";
import { GLTF2Export } from '@babylonjs/serializers/glTF';

export const loadButton = document.getElementById("loadFile");
export const saveButton = document.getElementById("saveScene");
export const deleteButton = document.getElementById("delete");

class SaveLoadManager
{
  private static objectUrl: string;
  private static saveFileName = 'scene';

  static save(): void
  {
    GLTF2Export.GLBAsync(scene, "fileName").then((glb) => {
      glb.downloadFiles();
    });
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
      task.loadedMeshes.forEach(mesh =>
      {
        pickableMeshes.push(mesh);       
      });
    };
  }

  static delete(): void
  {
    ActiveEntityManager.currentActiveMesh.dispose();
    ActiveEntityManager.currentActiveGizmo.disable();    
  }
}

deleteButton.addEventListener("click", SaveLoadManager.delete);
loadButton.addEventListener("change", SaveLoadManager.load);
saveButton.addEventListener("click", SaveLoadManager.save);


