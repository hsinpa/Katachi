import { vec2 } from "gl-matrix";
import { KeycodeTable } from "./KeycodeTable";



export const InputMovementType = Object.freeze({
    Up : vec2.fromValues(0, 1),
    Down : vec2.fromValues(0, -1),
    Left : vec2.fromValues(-1, 0),
    Right : vec2.fromValues(1, 0),
    Center : vec2.fromValues(0, 0),
})

export interface InputMovementCallback {
    (direction: vec2): void;
}

export interface InputMouseCallback {
    (mouse_delta: number[]): void;
}
  
class InputHandler {

    constructor() {

    }

    public RegisterMouseMovement(canvasDom : HTMLBodyElement, callback : InputMouseCallback) {
        canvasDom.requestPointerLock();

        let deltaArray = [0, 0];
        window.addEventListener('mousemove', e => {
            deltaArray[0] = e.movementX;
            deltaArray[1] = e.movementY;

            callback(deltaArray);
        });
    }

    public RegisterMovementEvent(callback : InputMovementCallback) {
        window.addEventListener("keydown", e => {
            if (e.key == KeycodeTable.a || e.key == KeycodeTable.arrowLeft)
                callback(InputMovementType.Left);
            else if (e.key == KeycodeTable.s || e.key == KeycodeTable.arrowDown)
                callback(InputMovementType.Down);
            else if (e.key == KeycodeTable.d || e.key == KeycodeTable.arrowRight)
                callback(InputMovementType.Right);
            else if (e.key == KeycodeTable.w || e.key == KeycodeTable.arrowUp)
                callback(InputMovementType.Up);
        } );
    }

}

export default InputHandler;