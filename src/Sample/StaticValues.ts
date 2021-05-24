export const DeltaTime = 0.02;


export interface SceneLayoutType {
    gltf : GLTFMarkoutType[];
}

export interface GLTFMarkoutType {
    id: string,
    path : string;
    position : number[]; //Vector3
    orientation : number[]; //Vector3
    scale : number;
    parent_id : string;
}