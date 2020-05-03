import {canvas, engine, scene} from './index';
import {utilLayer} from './index';
import {pickableMeshes} from './index';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { Gizmo, AxisDragGizmo, AxisScaleGizmo } from '@babylonjs/core/Legacy/legacy';
import CustomGizmo from './GizmoManager';
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
              } 
              else 
              {
                ActiveEntityManager.currentActiveMesh = pointerInfo.pickInfo.pickedMesh as BABYLON.Mesh ;
              } 
  
              if (ActiveEntityManager.currentActiveGizmo != null) {
                // Disable all other gizmos
                ActiveEntityManager.currentActiveGizmo.disable();  
                ActiveEntityManager.currentActiveGizmo = new CustomGizmo(ActiveEntityManager.currentActiveMesh, utilLayer, AxisDragGizmo);
          
              } 
              else 
              {
                // Enable gizmo on new active item
                ActiveEntityManager.currentActiveGizmo = new CustomGizmo(ActiveEntityManager.currentActiveMesh, utilLayer, AxisDragGizmo);
            }
            }
          }
          break;
      }
    });
  }