import {canvas, engine, scene, utilLayer} from './index';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import ActiveEntityManager from './ActiveEntityManager';
import CustomGizmo from './gizmoManager';
import { AxisDragGizmo, PlaneRotationGizmo, AxisScaleGizmo } from '@babylonjs/core/Legacy/legacy';


 export default function keyController () {
    // Key controller
    scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:
          switch (kbInfo.event.key) {
          // The button to enable the BabylonJS Inspector
            case '`':
              console.log('ActiveEntityManager.debug mode enabled');
              if (ActiveEntityManager.debug) {
                scene.debugLayer.hide();
                ActiveEntityManager.debug = false;
              } else {
                scene.debugLayer.show();
                ActiveEntityManager.debug = true;
              }
              break;
  
            case '1':
              // Turn off Rotation-Scale
              ActiveEntityManager.currentActiveGizmo.disable();  
              ActiveEntityManager.currentActiveGizmo = new CustomGizmo(ActiveEntityManager.currentActiveMesh, utilLayer, AxisDragGizmo);
        
              // Switch on Position
              break;
  
            case '2':
              // Turn off Positon-Scale
              ActiveEntityManager.currentActiveGizmo.disable();  
              ActiveEntityManager.currentActiveGizmo = new CustomGizmo(ActiveEntityManager.currentActiveMesh, utilLayer, PlaneRotationGizmo);
              // Switch on Rotation
              break;
  
            case '3':
              // Turn off Position-Rotation
              ActiveEntityManager.currentActiveGizmo.disable();  
              ActiveEntityManager.currentActiveGizmo = new CustomGizmo(ActiveEntityManager.currentActiveMesh, utilLayer, AxisScaleGizmo);
              // Switch on Scale
              break;
          }
          break;
      }
    });
}