import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/core/Meshes/meshBuilder';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
import  itemPick from './itemPICK';
import  keyController from './KeyController';
import ActiveEntityManager from './ActiveEntityManager';
import CustomGizmo from './gizmoManager';
import { AxisDragGizmo, PlaneRotationGizmo } from '@babylonjs/core/Legacy/legacy';

// Basic scene setup
export const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
export const engine = new BABYLON.Engine(canvas);
export const scene = new BABYLON.Scene(engine);
const camera = new BABYLON.ArcRotateCamera('Camera', -2.53, 0.95, 25, new BABYLON.Vector3(0, 0, 0), scene);

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// Wether debugging BabylonJS Inspector is enabled
let debug = false;

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
// Default intensity is 1. Let's dim the light a small amount
light.intensity = 1;

// Layer that gizmos live
export const utilLayer = new BABYLON.UtilityLayerRenderer(scene);

// Create the floor mesh that is exempt from the gizmo list == unmovable obviously
var ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);
ground.checkCollisions = true;

var boxItem = BABYLON.MeshBuilder.CreateBox('mainBox', { width: 1, height: 1, depth: 1 }, scene);
boxItem.checkCollisions = true;
boxItem.position.y = 2;

var box2 = BABYLON.MeshBuilder.CreateBox('positiveXaxisBox', { width: 1, height: 1, depth: 1 }, scene);
box2.checkCollisions = true;
box2.position.x = 2;
box2.position.y = 2;

var box3 = BABYLON.MeshBuilder.CreateBox('negativeXaxisBox', { width: 1, height: 1, depth: 1 }, scene);
box3.checkCollisions = true;
box3.position.x = -2;
box3.position.y = box3.scaling.y / 2;

var box4 = BABYLON.MeshBuilder.CreateBox('positiveZaxisBox', { width: 1, height: 1, depth: 1 }, scene);
box4.checkCollisions = true;
box4.position.z = 2;
box4.position.y = box4.scaling.y / 2;

var box5 = BABYLON.MeshBuilder.CreateBox('negativeZaxisBox', { width: 1, height: 1, depth: 1 }, scene);
box5.checkCollisions = true;
box5.position.z = -2;
box5.position.y = box5.scaling.y / 2;

// Color the box black
var material = new BABYLON.StandardMaterial('mainBox', scene);
material.alpha = 1;
material.diffuseColor = new BABYLON.Color3(0, 0, 0);
boxItem.material = material;

// Make edges pop with color
boxItem.enableEdgesRendering();
boxItem.edgesWidth = 4.0;
boxItem.edgesColor = new BABYLON.Color4(0.05, 1, 0.02);

var sceneMeshes = [];
sceneMeshes.push(ground);

export const pickableMeshes = [];
pickableMeshes.push(boxItem, box2, box3, box4, box5);

// var position = new CustomGizmo(box5, utilLayer, AxisDragGizmo);
// var rotation = new CustomGizmo(box5, utilLayer, PlaneRotationGizmo);

// position.disable();

itemPick();
keyController();

// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});


