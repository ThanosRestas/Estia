import {canvas, engine, scene} from './index';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import ActiveEntityManager from './ActiveEntityManager';


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
              if (ActiveEntityManager.positionGizmoActive) {
                ActiveEntityManager.positionGizmoActive = false;
  
                ActiveEntityManager.currentActiveGizmo.positionGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
              } else {
                // Disable rotation gizmo
                ActiveEntityManager.currentActiveGizmo.rotationGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                // Disable the scale gizmo
                ActiveEntityManager.currentActiveGizmo.scaleGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                // Enable the position gizmo on the active item
                ActiveEntityManager.currentActiveGizmo.positionGizmo.forEach(element => {
                  element.attachedMesh = ActiveEntityManager.currentActiveMesh;
                });
              }
              break;
  
            case '2':
              if (ActiveEntityManager.rotationGizmoActive) {
                ActiveEntityManager.rotationGizmoActive = false;
  
                ActiveEntityManager.currentActiveGizmo.rotationGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
              } else {
                ActiveEntityManager.rotationGizmoActive = true;
  
                // Disable position gizmo
                ActiveEntityManager.currentActiveGizmo.positionGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                // Disable scale gizmo
                ActiveEntityManager.currentActiveGizmo.scaleGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                // Enable the rotation gizmo on the active item
                ActiveEntityManager.currentActiveGizmo.rotationGizmo.forEach(element => {
                  element.attachedMesh = ActiveEntityManager.currentActiveMesh;
                });
              }
              break;
  
            case '3':
              if (ActiveEntityManager.scaleGizmoActive) {
                ActiveEntityManager.scaleGizmoActive = false;
  
                ActiveEntityManager.currentActiveGizmo.scaleGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
              } else {
                ActiveEntityManager.scaleGizmoActive = true;
  
                // Disable position gizmo
                ActiveEntityManager.currentActiveGizmo.positionGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                // Disable rotation gizmo
                ActiveEntityManager.currentActiveGizmo.rotationGizmo.forEach(element => {
                  element.attachedMesh = null;
                });
  
                // Enable the scale gizmo on the active item
                ActiveEntityManager.currentActiveGizmo.scaleGizmo.forEach(element => {
                  element.attachedMesh = ActiveEntityManager.currentActiveMesh;
                });
              }
              break;
          }
          break;
      }
    });
  }