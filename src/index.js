import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Engine } from "@babylonjs/core/Legacy/legacy";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas);

// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new BABYLON.ArcRotateCamera("Camera", -2.53, 0.95, 25, new BABYLON.Vector3(0, 0, 0), scene);

// This enables the position ( arrow ) gizmos on a mesh
var gizmoManager = new BABYLON.GizmoManager(scene);

// Enable position ( arrow ) gizmos 
gizmoManager.positionGizmoEnabled = true;  

// Create a list of meshes that can use gizmos in our scene
gizmoManager.attachableMeshes = []; 

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// Wether debugging BabylonJS Inspector is enabled
var debug = false;



// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 1;
// Create the floor mesh that is exempt from the gizmo list == unmovable obviously
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
ground.checkCollisions = true;

// Create boxes    
var box = BABYLON.MeshBuilder.CreateBox("mainBox", {width: 1, height: 1, depth: 1}, scene);
box.checkCollisions = true;
box.position.y = 2;

var box2 = BABYLON.MeshBuilder.CreateBox("positiveXaxisBox", {width: 1, height: 1, depth: 1}, scene);
box2.checkCollisions = true;
box2.position.x = 2;
box2.position.y = box2.scaling.y / 2;

var box3 = BABYLON.MeshBuilder.CreateBox("negativeXaxisBox", {width: 1, height: 1, depth: 1}, scene);
box3.checkCollisions = true;
box3.position.x = -2;
box3.position.y = box3.scaling.y / 2;

var box4 = BABYLON.MeshBuilder.CreateBox("positiveZaxisBox", {width: 1, height: 1, depth: 1}, scene);
box4.checkCollisions = true;
box4.position.z = 2;
box4.position.y = box4.scaling.y / 2;

var box5 = BABYLON.MeshBuilder.CreateBox("negativeZaxisBox", {width: 1, height: 1, depth: 1}, scene);
box5.checkCollisions = true;
box5.position.z = -2;
box5.position.y = box5.scaling.y / 2;

// Color the box black
var material = new BABYLON.StandardMaterial(scene);
material.alpha = 1;
material.diffuseColor = new BABYLON.Color3(0, 0, 0);
box.material = material;

// Make edges pop with color
box.enableEdgesRendering();    
box.edgesWidth = 4.0;
box.edgesColor = new BABYLON.Color4(0.05, 1, 0.02);

var sceneMeshes = [];
sceneMeshes.push(ground, box2, box3, box4, box5);

var utilLayer = new BABYLON.UtilityLayerRenderer(scene);
var gizmoY = new BABYLON.AxisDragGizmo(new BABYLON.Vector3(0,1,0), BABYLON.Color3.FromHexString("#FFFF00"), utilLayer);
gizmoY.attachedMesh = box;
gizmoY.dragBehavior.onDragObservable.add((event)=>{

    var currentPickedObject = gizmoY.attachedMesh;
    currentPickedObject.computeWorldMatrix();  
    //console.log("Started dragging : " + currentPickedObject.name);
    
    if(collisionWithObject(currentPickedObject)){        
        // Return the picked object to a position so that it barely touches something   
        currentPickedObject.position.y -= event.delta.y;  
        currentPickedObject.computeWorldMatrix();                  
    }
})

var gizmoX = new BABYLON.AxisDragGizmo(new BABYLON.Vector3(1,0,0), BABYLON.Color3.FromHexString("#e50000"), utilLayer);
gizmoX.attachedMesh = box;
gizmoX.dragBehavior.onDragObservable.add((event)=>{

    var currentPickedObject = gizmoX.attachedMesh;
    currentPickedObject.computeWorldMatrix();   
    //console.log("Started dragging : " + currentPickedObject.name);
    
    if(collisionWithObject(currentPickedObject)){
        // Add/subtract the appropriate value to go to no-collision state
         currentPickedObject.position.x -= event.delta.x;
         // Recalibrate the position of our current picked mesh -- so collision won't happen again
         currentPickedObject.computeWorldMatrix(); 
    }
})

var gizmoZ = new BABYLON.AxisDragGizmo(new BABYLON.Vector3(0,0,1), BABYLON.Color3.FromHexString("#0000ff"), utilLayer);
gizmoZ.attachedMesh = box;
gizmoZ.dragBehavior.onDragObservable.add((event)=>{

    // Getting the current picked mesh
    var currentPickedObject = gizmoZ.attachedMesh;
    // Linear algebra black magic I will explain asap || basically recalibrating
    // the position of our object in space
    currentPickedObject.computeWorldMatrix();    
    
    // On collision with the list of available meshes stop movement
    if(collisionWithObject(currentPickedObject)){
        // Add/subtract the appropriate value to go to no-collision state
        currentPickedObject.position.z -= event.delta.z;
        // Recalibrate the position of our current picked mesh -- so collision won't happen again
        currentPickedObject.computeWorldMatrix();                        
    }
})

function collisionWithObject(mesh)
{
    for (let i = 0; i < sceneMeshes.length; i++ ){
        if(mesh.intersectsMesh(sceneMeshes[i])){
            console.log(mesh.name + " collides with : " + sceneMeshes[i].name);
            return true;
        }
    }
    return false;
}


 //Weapon switching observable
 scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
    case BABYLON.KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {   
        case "`":
            console.log("Debug mode enabled");
           
            if(debug){
                scene.debugLayer.hide();
                debug = false;
            }
            else{
                scene.debugLayer.show();
                debug = true;
            }
            break;
        }                
        break;
    }
 });

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});