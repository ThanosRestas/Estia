/* eslint-disable no-unused-vars */
import { Mesh, UtilityLayerRenderer, Color3, Axis, Gizmo } from '@babylonjs/core';


export default class CustomGizmo
{

    private mesh: Mesh;
    private layer: UtilityLayerRenderer
    private type: Gizmo;
    private gizmo = [];
    private readonly axis = [Axis.X, Axis.Y, Axis.Z];
    private readonly color = [Color3.Red(), Color3.Yellow(), Color3.Blue()];

    //Available types == AxisDragGizmo / PlaneRotationGizmo / AxisScaleGizmo;  
    constructor(mesh: Mesh, layer: UtilityLayerRenderer, type)
    {
        this.mesh = mesh;
        this.layer = layer;
        this.type = type;
        this.create(this.type);

    }

    create(type): void
    {
        for (let i = 0; i <= 2; i++)
        {
            this.gizmo[i] = new type(this.axis[i], this.color[i], this.layer);
            this.gizmo[i].attachedMesh = this.mesh;
        }
    }

    disable(): void
    {
        this.gizmo.forEach(axisGizmo =>
        {
            axisGizmo.attachedMesh = null;
        });
    }
}


