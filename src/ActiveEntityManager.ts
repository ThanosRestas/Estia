import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import CustomGizmo from './GizmoManager';

export default class ActiveEntityManager {
    static currentActiveMesh : BABYLON.Mesh;
    static currentActiveGizmo : CustomGizmo;
    static positionGizmoActive : Boolean = false;
    static rotationGizmoActive  : Boolean = false;
    static scaleGizmoActive  : Boolean = false;
    static debug : Boolean = false;
}