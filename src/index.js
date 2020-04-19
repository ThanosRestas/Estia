import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Engine } from "@babylonjs/core/Legacy/legacy";
import Item from "./item.js"
import Gizmo from "./gizmoManager.js"

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas);

// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new BABYLON.ArcRotateCamera("Camera", -2.53, 0.95, 25, new BABYLON.Vector3(0, 0, 0), scene);

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// Wether debugging BabylonJS Inspector is enabled
var debug = false;

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
// Default intensity is 1. Let's dim the light a small amount
light.intensity = 1;

// Layer that gizmos live
var utilLayer = new BABYLON.UtilityLayerRenderer(scene);

// Create the floor mesh that is exempt from the gizmo list == unmovable obviously
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
ground.checkCollisions = true;

// Create boxes 
var boxItem = new Item(BABYLON.MeshBuilder.CreateBox("mainBox", {width: 1, height: 1, depth: 1}, scene));
boxItem.mesh.checkCollisions = true;
boxItem.mesh.position.y = 2;


var box2 = BABYLON.MeshBuilder.CreateBox("positiveXaxisBox", {width: 1, height: 1, depth: 1}, scene);
box2.checkCollisions = true;
box2.position.x = 2;
box2.position.y = 2;

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
boxItem.mesh.material = material;

// Make edges pop with color
boxItem.mesh.enableEdgesRendering();    
boxItem.mesh.edgesWidth = 4.0;
boxItem.mesh.edgesColor = new BABYLON.Color4(0.05, 1, 0.02);

var sceneMeshes = [];
sceneMeshes.push(ground);

// Testing attaching position gizmos on a mesh through gizmo manager class
//let testGizmo = new Gizmo(boxItem.mesh, utilLayer, sceneMeshes);
//let testGizmo2 = new Gizmo(box2, utilLayer, sceneMeshes );


let pickableMeshes = [];
pickableMeshes.push(box2, boxItem.mesh, box3, box4, box5);

let currentActiveGizmo = null; 
let previousActiveGizmo = null; 
scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
        
            if(pointerInfo.pickInfo.hit != false){
                if(pickableMeshes.includes(pointerInfo.pickInfo.pickedMesh)){
                    if(currentActiveGizmo != null)
                    {
                        currentActiveGizmo.positionGizmoX.attachedMesh = null;
                        currentActiveGizmo.positionGizmoY.attachedMesh = null;
                        currentActiveGizmo.positionGizmoZ.attachedMesh = null;

                        currentActiveGizmo = new Gizmo(pointerInfo.pickInfo.pickedMesh, utilLayer, sceneMeshes );
                    }
                    else
                    {                        
                        currentActiveGizmo = new Gizmo(pointerInfo.pickInfo.pickedMesh, utilLayer, sceneMeshes );
                    }
                    
                     
                }
            }
            
            
            break;
    }
});



 // Key controller
 scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
    case BABYLON.KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
        // The button to enable the BabylonJS Inspector   
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


