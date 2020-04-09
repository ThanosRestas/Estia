import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { Engine } from "@babylonjs/core/Legacy/legacy";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas);

// This creates a basic Babylon Scene object (non-mesh)
var scene = new BABYLON.Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

// This enables the position ( arrow ) gizmos on a mesh
var gizmoManager = new BABYLON.GizmoManager(scene);

// Enable position ( arrow ) gizmos 
gizmoManager.positionGizmoEnabled = true;  

// Create a list of meshes that can use gizmos in our scene
gizmoManager.attachableMeshes = []; 

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 1;

// Create box.   
var box = BABYLON.MeshBuilder.CreateBox("box", {width: 1, height: 1, depth: 1}, scene);
// Color the box black
var material = new BABYLON.StandardMaterial(scene);
material.alpha = 1;
material.diffuseColor = new BABYLON.Color3(0, 0, 0);
box.material = material;
// Make edges pop with color
box.enableEdgesRendering();    
box.edgesWidth = 4.0;
box.edgesColor = new BABYLON.Color4(0.05, 1, 0.02);
// Move the box upward 1/2 its height to "sit" on top of the plane
box.position.y = box.scaling.y / 2;

// Create cone
var cone = BABYLON.MeshBuilder.CreateCylinder("cone", {diameterTop: 0, tessellation: 4}, scene);
cone.material = material;

// Make edges pop with color
cone.enableEdgesRendering();    
cone.edgesWidth = 4.0;
cone.edgesColor = new BABYLON.Color4(0.05, 1, 0.02);    

// Add our box to the gizmo enabled mesh list !
gizmoManager.attachableMeshes.push(box, cone);    

// Create the floor mesh that is exempt from the gizmo list == unmovable obviously
var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});