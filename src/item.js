export default class Item{
    constructor(mesh){
        console.log("Item is created");
        this.name = mesh.name;
        this.mesh = mesh;
    }
}