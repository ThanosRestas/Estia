import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import CustomGizmo from './GizmoManager';

export default class ActiveEntityManager {
    static currentActiveMesh: BABYLON.Mesh;
    static currentActiveGizmo: CustomGizmo;
    static positionGizmoActive = false;
    static rotationGizmoActive = false;
    static scaleGizmoActive = false;
    static debug = false;
}