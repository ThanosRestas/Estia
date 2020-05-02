/* eslint-disable no-unused-vars */
import { Mesh, UtilityLayerRenderer, AxisDragGizmo, AxisScaleGizmo, Vector3, Color3, PlaneRotationGizmo, TransformNode, Axis, Gizmo } from '@babylonjs/core';


export default class CustomGizmo{

    mesh : Mesh;
    layer : UtilityLayerRenderer;
    type : Gizmo;
    gizmoX : Gizmo;
    gizmoY : Gizmo;
    gizmoZ : Gizmo;
    gizmo  = [this.gizmoX, this.gizmoY, this.gizmoZ];
    axis = [Axis.X, Axis.Y, Axis.Z];
    color = [Color3.Red(), Color3.Yellow(), Color3.Blue()];
    //type = [AxisDragGizmo, PlaneRotationGizmo, AxisScaleGizmo];  
    
    constructor (mesh: Mesh, layer: UtilityLayerRenderer, type ){
        this.mesh = mesh;
        this.layer = layer;
        this.type = type;

        this.create(this.type);
    }

    create(type){
        for(let i=0; i<=2; i++){           
            this.gizmo[i] = new type(this.axis[i], this.color[i], this.layer);
            this.gizmo[i].attachedMesh = this.mesh;           
        }  
    }

    disable(){
        this.gizmo.forEach(axisGizmo =>{
            axisGizmo.attachedMesh = null;
        })
    }
}


