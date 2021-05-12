# Katachi
Super simple webgl 3D engine, but it work.

# Feature
- Force you to write shader code
- Directional light shadow map
- Hierarchy modeling
- Work well with css and responsive to window resize

# Documentation
## Initialization

```typescript
import Katachi from './Katachi/Katachi';

let configJsonPath = "./Dataset/katachi_basic_layout.json"; //Relative to public folder
window.onload = () => {
    fetch(configJsonPath)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let katachi = new Katachi(myJson);
    });
};
 ```
 
 ## What config json file look like
 You can create your shader inside 'shader' column or create with other method; However, do not edit the default shader settings
 ```text
 {
    "canvas_dom_query" : "#webgl_canvas", //Point to the canvas id
    "shaders" : [
        {
            "id" : "glprogram@standard_material", //Do not edit this id
            "vertex" : "./glsl/basic/standard_mat.vert", //File path relate to public folder
            "fragment" : "./glsl/basic/standard_mat.frag"
        },
        {
            "id" : "glprogram@unlit_material", //Do not edit this id
            "vertex" : "./glsl/basic/unlit_mat.vert",
            "fragment" : "./glsl/basic/unlit_mat.frag"
        },
        {
            "id" : "glprogram@depth_material", //Do not edit this id
            "vertex" : "./glsl/basic/depth_mat.vert",
            "fragment" : "./glsl/basic/depth_mat.frag"
        }
    ]
}
 ```
 
 ## Engine Update loop
 ```typescript
 //katachi.setup return a boolean, indictacting if the initialization is goint well
 //func UpdateLoop will be call in every frame
 this.katachiIsReady = await katachi.SetUp(this.UpdateLoop.bind(this));
 
 function UpdateLoop(timeInSecond : number) {
  //Do something need iteration here
 }
 ```
 
## Camera
Support Perspective and orthographic projection
 ```typescript
 
 katachi.scene.camera.projection.projectionType = ProjectionType.Perspective;
 katachi.scene.camera.projection.foxyPerspective = 70; //foxy only work in perspective; 
 
 katachi.scene.camera.projection.projectionType = ProjectionType.Orthographic;
 katachi.scene.camera.projection.sizeOrtho = 5; //SizeOrtho only work in ortho project
 
 katachi.scene.camera.transform.Translate(-direction[0] * speed, 0, direction[1] * speed); //Camera is able to move and rotate around
 ```
 ## Create some primitive shape
 Current only Cube and Quad is support
  ```typescript
  
  //Its using glprogram@standard_material by default, but you are enable to create customize material
  let Quad = katachi.shapeBuilder.BuildQuad();
  let Cube = katachi.shapeBuilder.BuildCube();
  
  Quad.transform.Scale(0.2); // Scale to 0.2 percent
  Quad.transform.SetPosition(-1.2, 0, -1); // x, y, z

  Quad.transform.Rotate( Math.PI*1.5, 0,0 ); //Rotate in euler coordinate, and use radian unit

  //Remember to append them to scene
  katachi.scene.AddShapeObj(Cube);
  katachi.scene.AddShapeObj(Quad);
  
  //Remove object from scene
  //katachi.scene.RemoveShapeObj(this.mainQuad);
 ```

  ## Transform
  SetPosition, Scale, Rotate, SetEuler, Translate
  
  - SetPosition : Set object position in world position
  - Scale : Scale the size of object
  - Rotate : rotate in euler angle (radian)
  - SetEuler : Set euler coordinate directly (radian)
  - Translate : Move object base on its orientation
  ```typescript
    //What the code is doing, behind the scene
    function Translate(x : number, y : number , z :number) {
      let translate  = (transform.forward * z) + (transform.right * x) + (transform.up * y);
      transform.position = transform.position + translate;
    }
  ```
## Hierarchy Modeling
Set object as child to another object, therefore, its transform now act relatively to its parent
```typescript
  katachi.scene.SetParent(childObject, parentObject);
  katachi.scene.SetParent(childObject, null); // Move childObject back to root hierarchy
```

## Material

## Create your own (TDB)
## Set material property
```typescript
  //Set texture, path link is relative to public folder
  katachi.materialManager.LoadTextureToObject(CubeObject, "u_mainTex", "./texture/Personal_01.png");
  
  //Set Color or other integer or array properties
  // Color is given as example here, it is a vec4, and need gl.uniform4fv to process it
  //Check the link below, to see what is avilable
  //https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
  mainCube.SetCustomUniformAttr("u_mainColor", {value : [1, 1, 1, 1], isMatrix : false, function : this.katachi.webglContext.uniform4fv})
```

## Shader
If you want to write custom shader, there is some predefine variable are required, and other base on your perference
###### Vert shader (Require)
| Attribute name  | Purpose |
| ------------- | ------------- |
| vec4 a_vertex  | Vertex  |
| vec4 a_color  | Vertex color  |
| vec3 a_normal  | Normal  |
| vec2 a_uv  | UV  |

Yes, they look pretty straight forward
###### Vert shader
| Uniform name  | Purpose |
| ------------- | ------------- |
| mat4 u_modelMatrix  | Model Matrix  |
| mat4 u_MVPMatrix  | MVP Matrix  |
| u_inverseTransposeModelMatrix  | Need this to make normal look right, while rotated  |

```glsl
  v_normal = normalize(mat3(u_inverseTransposeModelMatrix) * a_normal);
```

###### Fragment shader
| Uniform name  | Purpose |
| ------------- | ------------- |
| float u_time  | World time in second  |
| vec4 u_mainColor  | Main color  |
| sampler2D u_mainTex  | Main texture  |
| vec3 u_directionLightDir  | Light orientation  |
| vec4 u_directionLightColor  | Light color  |
| vec4 u_ambientLightColor  | Ambient light color  |

## Roadmap, Order by priority
- Experient on how to create custom shader with ease
- 3D object loader (Which format not decide yet, maybe gltf)
- Booming effect
- Stencil shader

## Third party tool
- gl-matrix (prettry good one, it function as Float32Array by default)
