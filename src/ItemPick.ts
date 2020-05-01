import {canvas, engine, scene} from './index';
import {utilLayer} from './index';
import {pickableMeshes} from './index';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { Gizmo } from '@babylonjs/core/Legacy/legacy';
import CustomGizmo from './gizmoManager';
import ActiveEntityManager from './ActiveEntityManager';



export default function itemPick () {
    scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if (pointerInfo.pickInfo.hit !== false) {          
            if (pickableMeshes.includes(pointerInfo.pickInfo.pickedMesh)) {
              // If gizmo has a parent(mesh is made from multiple parts)
              // create gizmo on parent.
              if (pointerInfo.pickInfo.pickedMesh.parent != null) {
               ActiveEntityManager.currentActiveMesh = pointerInfo.pickInfo.pickedMesh.parent as BABYLON.Mesh;
              } else {
                ActiveEntityManager.currentActiveMesh = pointerInfo.pickInfo.pickedMesh as BABYLON.Mesh ;
              }
  
              if (ActiveEntityManager.currentActiveGizmo != null) {
                // Disable all other gizmos
               ActiveEntityManager.currentActiveGizmo.positionGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                ActiveEntityManager.currentActiveGizmo.rotationGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                ActiveEntityManager.currentActiveGizmo.scaleGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                ActiveEntityManager.currentActiveGizmo = new CustomGizmo(ActiveEntityManager.currentActiveMesh, utilLayer);
                // Enable gizmos on new active item
                // ActiveEntityManager.currentActiveGizmo = new Gizmo(pointerInfo.pickInfo.pickedMesh, utilLayer, sceneMeshes );
               ActiveEntityManager.positionGizmoActive = true;
  
                // Disable the rotation and scale gizmo on new active item |
                // making the default, the position one
                ActiveEntityManager.currentActiveGizmo.rotationGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                ActiveEntityManager.currentActiveGizmo.scaleGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                ActiveEntityManager.rotationGizmoActive = false;
                ActiveEntityManager.scaleGizmoActive = false;
                } else {
                    // Enable gizmo on new active item
                    ActiveEntityManager.currentActiveGizmo = new CustomGizmo(ActiveEntityManager.currentActiveMesh, utilLayer);
                   ActiveEntityManager.positionGizmoActive = true;
                    ActiveEntityManager.rotationGizmoActive = false;
                    ActiveEntityManager.scaleGizmoActive = false;
    
                    // Disable the rotation and gizmo on new active item |
                    // making the default, the position one
                    ActiveEntityManager.currentActiveGizmo.rotationGizmo.forEach(element => {
                    element.attachedMesh = null;
                    });
    
                    ActiveEntityManager.currentActiveGizmo.scaleGizmo.forEach(element => {
                    element.attachedMesh = null;
                    });
              }
            }
          }
          break;
      }
    });
  }