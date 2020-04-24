import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Engine, GizmoManager } from "@babylonjs/core/Legacy/legacy";
import Item from "./item.js"
import Gizmo from "./gizmoManager.js"
import "@babylonjs/loaders/glTF";
import "@babylonjs/loaders/OBJ";

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


let currentActiveGizmo = null; 
let currentActiveMesh = null;
let positionGizmoActive = false;
let rotationGizmoActive = false;
let scaleGizmoActive = false; 

let pickableMeshes = [];
pickableMeshes.push(boxItem.mesh, box2, box3, box4, box5);

let chair = null;
let  assetsManager = new BABYLON.AssetsManager(scene);  

assetsManager.onTaskSuccessObservable.add(function(task) {
    loadingComplete();
});

assetsManager.addMeshTask("task1", "", "/assets/", "Chair3.glb");

// Now let the assetsManager load/excecute every task
assetsManager.load();

function loadingComplete(){
    //console.log("Mesh loaded !");
    scene.meshes.forEach(function addToPickableMeshes(item){
        if(!scene.meshes.includes(item.name)){
            pickableMeshes.push(item);
        }
    })   
   
}






itemPick();
keyController();




// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});


function itemPick(){
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                //console.log(pointerInfo.pickInfo.pickedMesh.name);   
                //console.log(pickableMeshes);             
                if(pointerInfo.pickInfo.hit != false){
                    //console.log(pickableMeshes);
                    //console.log(pointerInfo.pickInfo.pickedMesh.name.parent)
                    if(pickableMeshes.includes(pointerInfo.pickInfo.pickedMesh)){
                        currentActiveMesh = pointerInfo.pickInfo.pickedMesh;
                        if(currentActiveGizmo != null)
                        {   
                            // Disable all other gizmos                     
                            currentActiveGizmo.positionGizmo.forEach(element => {
                                element.attachedMesh = null;
                            }); 
                            
                            currentActiveGizmo.rotationGizmo.forEach(element => {
                                element.attachedMesh = null;
                            }); 
    
                            currentActiveGizmo.scaleGizmo.forEach(element => {
                                element.attachedMesh = null;
                            });
                            
                            // Enable gizmos on new active item
                            currentActiveGizmo = new Gizmo(pointerInfo.pickInfo.pickedMesh, utilLayer, sceneMeshes );
                            positionGizmoActive = true;
    
                            // Disable the rotation and scale gizmo on new active item |
                            // making the default, the position one
                            currentActiveGizmo.rotationGizmo.forEach(element => {
                                element.attachedMesh = null;
                            });
    
                            currentActiveGizmo.scaleGizmo.forEach(element => {
                                element.attachedMesh = null;
                            });
    
                            rotationGizmoActive = false;
                            scaleGizmoActive = false;
                        }
                        else
                        {   
                           
                            // Enable gizmo on new active item
                            currentActiveGizmo = new Gizmo(pointerInfo.pickInfo.pickedMesh, utilLayer, sceneMeshes );
                            positionGizmoActive = true;
                            rotationGizmoActive = false;
                            scaleGizmoActive = false;
    
                            // Disable the rotation and gizmo on new active item |
                            // making the default, the position one
                            currentActiveGizmo.rotationGizmo.forEach(element => {
                                element.attachedMesh = null;
                            });
    
                            currentActiveGizmo.scaleGizmo.forEach(element => {
                                element.attachedMesh = null;
                            });
    
                        }     
                    }
    
                    
                }
                break;
        }
    });
}

function keyController(){
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

        case "1":
            if(positionGizmoActive)
            {
                positionGizmoActive = false;
                
                currentActiveGizmo.positionGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 
            }
            else
            {
                // Disable rotation gizmo
                currentActiveGizmo.rotationGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 

                // Disable the scale gizmo
                currentActiveGizmo.scaleGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 


                // Enable the position gizmo on the active item
                currentActiveGizmo.positionGizmo.forEach(element => {
                    element.attachedMesh = currentActiveMesh;
                }); 
            }
            break;

        case "2":
            if(rotationGizmoActive)
            {
                rotationGizmoActive = false;
                
                currentActiveGizmo.rotationGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 
            }
            else
            {
                rotationGizmoActive = true;
                

                // Disable position gizmo
                currentActiveGizmo.positionGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 

                 // Disable scale gizmo
                 currentActiveGizmo.scaleGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 

                // Enable the rotation gizmo on the active item
                currentActiveGizmo.rotationGizmo.forEach(element => {
                    element.attachedMesh = currentActiveMesh;
                }); 
            }
            break;

        case "3":
            if(scaleGizmoActive)
            {
                scaleGizmoActive = false;
                
                currentActiveGizmo.scaleGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 
            }
            else
            {
                scaleGizmoActive = true;
                

                // Disable position gizmo
                currentActiveGizmo.positionGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 

                
                // Disable rotation gizmo
                currentActiveGizmo.rotationGizmo.forEach(element => {
                    element.attachedMesh = null;
                }); 

                // Enable the scale gizmo on the active item
                currentActiveGizmo.scaleGizmo.forEach(element => {
                    element.attachedMesh = currentActiveMesh;
                }); 
            }
            break;

        }                
        break;
    }
 });
}