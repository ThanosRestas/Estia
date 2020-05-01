/* eslint-disable no-unused-vars */
import { Mesh, UtilityLayerRenderer, AxisDragGizmo, AxisScaleGizmo, Vector3, Color3, PlaneRotationGizmo, TransformNode, Axis } from '@babylonjs/core';

export default class CustomGizmo {
    name : string;
    mesh : Mesh;
    
    sceneMeshes : Mesh[];
    layer : UtilityLayerRenderer;
    positionGizmo : AxisDragGizmo[];
    rotationGizmo : PlaneRotationGizmo[];
    scaleGizmo : AxisScaleGizmo[];

    constructor (mesh : Mesh, layer: UtilityLayerRenderer) {
      this.name = mesh.name;
      this.mesh = mesh;
      this.layer = layer;      
      this.positionGizmo = [];
      this.rotationGizmo = [];
      this.scaleGizmo = [];

      this.setupGizmos();
    }

    setupGizmos () {
      this.positionGizmo.push(this.createPositionGizmo(Axis.X, Color3.Red()));
      this.positionGizmo.push(this.createPositionGizmo(Axis.Y, Color3.Yellow()));
      this.positionGizmo.push(this.createPositionGizmo(Axis.Z, Color3.Blue()));

      this.rotationGizmo.push(this.createRotationGizmo(Axis.X, Color3.Red()));
      this.rotationGizmo.push(this.createRotationGizmo(Axis.Y, Color3.Yellow()));
      this.rotationGizmo.push(this.createRotationGizmo(Axis.Z, Color3.Blue()));

      this.scaleGizmo.push(this.createScaleGizmo(Axis.X, Color3.Red()));
      this.scaleGizmo.push(this.createScaleGizmo(Axis.Y, Color3.Yellow()));
      this.scaleGizmo.push(this.createScaleGizmo(Axis.Z, Color3.Blue()));
    }

    

    createPositionGizmo (axis: Vector3, color: Color3) {
      var newGizmo = new AxisDragGizmo(axis, color, this.layer);
      newGizmo.attachedMesh = this.mesh;
      newGizmo.dragBehavior.onDragObservable.add((event) => {
        var currentPickedObject = newGizmo.attachedMesh;
        currentPickedObject.computeWorldMatrix();
        // console.log('Positioning : ' + currentPickedObject.name);
      });

      return newGizmo;
    }

    createRotationGizmo (axis: Vector3, color: Color3) {
      var newGizmo = new PlaneRotationGizmo(axis, color, this.layer);

      newGizmo.attachedMesh = this.mesh;
      newGizmo.dragBehavior.onDragObservable.add((event) => {
        var currentPickedObject = newGizmo.attachedMesh;
        currentPickedObject.computeWorldMatrix();
        // console.log('Rotating : ' + currentPickedObject.name);
      });

      return newGizmo;
    }

    createScaleGizmo (axis: Vector3, color: Color3) {
      var newGizmo = new AxisScaleGizmo(axis, color, this.layer);

      newGizmo.attachedMesh = this.mesh;
      newGizmo.dragBehavior.onDragObservable.add((event) => {
        var currentPickedObject = newGizmo.attachedMesh;
        currentPickedObject.computeWorldMatrix();
        // console.log('Scaling : ' + currentPickedObject.name);
      });
      return newGizmo;
    }
}

