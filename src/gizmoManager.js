export default class Gizmo{
    constructor(mesh, layer, sceneMeshes){
        console.log("Gizmo is created");
        this.name = mesh.name;
        this.mesh = mesh;
        this.layer = layer;
             
        this.sceneMeshes = sceneMeshes;

        this.positionGizmo = [];
        this.rotationGizmo = [];
        this.scaleGizmo = [];

        this.positionGizmo.push(this.createPositionGizmo(new BABYLON.Vector3(1, 0, 0), BABYLON.Color3.FromHexString("#FF0000")));
        this.positionGizmo.push(this.createPositionGizmo(new BABYLON.Vector3(0, 1, 0), BABYLON.Color3.FromHexString("#FFFF00")));
        this.positionGizmo.push(this.createPositionGizmo(new BABYLON.Vector3(0, 0, 1), BABYLON.Color3.FromHexString("#0000FF")));

        this.rotationGizmo.push(this.createRotationGizmo(new BABYLON.Vector3(1, 0, 0), BABYLON.Color3.FromHexString("#FF0000")));
        this.rotationGizmo.push(this.createRotationGizmo(new BABYLON.Vector3(0, 1, 0), BABYLON.Color3.FromHexString("#FFFF00")));
        this.rotationGizmo.push(this.createRotationGizmo(new BABYLON.Vector3(0, 0, 1), BABYLON.Color3.FromHexString("#0000FF")));

        this.scaleGizmo.push(this.createScaleGizmo(new BABYLON.Vector3(1, 0, 0), BABYLON.Color3.FromHexString("#FF0000")));
        this.scaleGizmo.push(this.createScaleGizmo(new BABYLON.Vector3(0, 1, 0), BABYLON.Color3.FromHexString("#FFFF00")));
        this.scaleGizmo.push(this.createScaleGizmo(new BABYLON.Vector3(0, 0, 1), BABYLON.Color3.FromHexString("#0000FF")));


        
    
    }

    createPositionGizmo(axis, color){
        var newGizmo = new BABYLON.AxisDragGizmo(axis, color, this.layer);
        newGizmo.updateGizmoRotationToMatchAttachedMesh = false;         
        newGizmo.attachedMesh = this.mesh;
        newGizmo.dragBehavior.onDragObservable.add((event)=>{
            var currentPickedObject = newGizmo.attachedMesh;
            currentPickedObject.computeWorldMatrix();  
            console.log("Started dragging : " + currentPickedObject.name);
            

            // Return the picked object to a position so that it barely touches something 
            if(collisionWithObject(currentPickedObject, this.sceneMeshes)){
                // Detecting which axis we are moving                 
                if(axis.x == 1)
                {
                    currentPickedObject.position.x -= event.delta.x;  
                }
                else if(axis.y == 1 )
                {
                    currentPickedObject.position.y -= event.delta.y;  
                }
                else if(axis.z == 1)
                {
                    currentPickedObject.position.z -= event.delta.z;  
                }                
                currentPickedObject.computeWorldMatrix();                  
            }
        })

        return newGizmo;
    }

    createRotationGizmo(axis, color){
        var newGizmo = new BABYLON.PlaneRotationGizmo(axis, color, this.layer);   
        newGizmo.updateGizmoRotationToMatchAttachedMesh = false;     
        newGizmo.attachedMesh = this.mesh;
        newGizmo.dragBehavior.onDragObservable.add((event)=>{
            var currentPickedObject = newGizmo.attachedMesh;
            currentPickedObject.computeWorldMatrix();  
            console.log("Started rotating : " + currentPickedObject.name);

            /*// Return the picked object to a position so that it barely touches something 
            if(collisionWithObject(currentPickedObject, this.sceneMeshes)){
                // Detecting which axis we are moving                 
                if(axis.x == 1)
                {
                    //currentPickedObject.position.x -= event.delta.x;
                    
                    currentPickedObject.rotation.x -= event.delta.x;  
                }
                else if(axis.y == 1 )
                {
                    currentPickedObject.rotation.y -= event.delta.z;   
                }
                else if(axis.z == 1)
                {
                    currentPickedObject.rotation.z -= 0.05;
                }                
                currentPickedObject.computeWorldMatrix();                  
            }*/
        })

        return newGizmo;
    }

    createScaleGizmo(axis, color){
        var newGizmo = new BABYLON.AxisScaleGizmo(axis, color, this.layer);
        newGizmo.updateGizmoRotationToMatchAttachedMesh = false;     
        newGizmo.attachedMesh = this.mesh;
        newGizmo.dragBehavior.onDragObservable.add((event)=>{
            var currentPickedObject = newGizmo.attachedMesh;
            currentPickedObject.computeWorldMatrix();  
            console.log("Started rotating : " + currentPickedObject.name);

            /*// Return the picked object to a position so that it barely touches something 
            if(collisionWithObject(currentPickedObject, this.sceneMeshes)){
                // Detecting which axis we are moving                 
                if(axis.x == 1)
                {
                    //currentPickedObject.position.x -= event.delta.x;
                    
                    currentPickedObject.rotation.x -= event.delta.x;  
                }
                else if(axis.y == 1 )
                {
                    currentPickedObject.rotation.y -= event.delta.z;   
                }
                else if(axis.z == 1)
                {
                    currentPickedObject.rotation.z -= 0.05;
                }                
                currentPickedObject.computeWorldMatrix();                  
            }*/
        })

        return newGizmo;
    }
}

function collisionWithObject(mesh, sceneMeshes)
{
    for (let i = 0; i < sceneMeshes.length; i++ ){
        if(mesh.intersectsMesh(sceneMeshes[i]) && mesh != sceneMeshes[i]){
            //console.log(mesh.name + " collides with : " + sceneMeshes[i].name);
            return true;
        }
    }
    return false;
}