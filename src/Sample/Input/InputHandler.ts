import { vec2, vec3 } from "gl-matrix";
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

    private _buttonState = Object.create({});

    private _keyboardCallback : InputMovementCallback;
    private _cacheKeyboardDirection : vec2 = vec2.create();

    constructor() {

    }

    public GetButtonState(actionName : string) : boolean {
        return false;
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

        let self = this;
        this._keyboardCallback = callback;

        window.addEventListener("keydown", e => {
            this.SetKeyboardState(e.key, true);
        } );

        window.addEventListener("keyup", e => {
            this.SetKeyboardState(e.key, false);

            // if (e.key == KeycodeTable.a || e.key == KeycodeTable.arrowLeft)
            //     callback(InputMovementType.Left);
            // else if (e.key == KeycodeTable.s || e.key == KeycodeTable.arrowDown)
            //     callback(InputMovementType.Down);
            // else if (e.key == KeycodeTable.d || e.key == KeycodeTable.arrowRight)
            //     callback(InputMovementType.Right);
            // else if (e.key == KeycodeTable.w || e.key == KeycodeTable.arrowUp)
            //     callback(InputMovementType.Up);
        } );
    }

    public OnUpdate() {
        //Reset to zero
        this._cacheKeyboardDirection[0] = 0;
        this._cacheKeyboardDirection[1] = 0;
        
        if (this._buttonState.hasOwnProperty(KeycodeTable.a) || this._buttonState.hasOwnProperty(KeycodeTable.arrowLeft)) {
            vec2.add(this._cacheKeyboardDirection, this._cacheKeyboardDirection,InputMovementType.Left);
        }

        if (this._buttonState.hasOwnProperty(KeycodeTable.s) || this._buttonState.hasOwnProperty(KeycodeTable.arrowDown)) {
            vec2.add(this._cacheKeyboardDirection, this._cacheKeyboardDirection,InputMovementType.Down);
        }

        if (this._buttonState.hasOwnProperty(KeycodeTable.d) || this._buttonState.hasOwnProperty(KeycodeTable.arrowRight)) {
            vec2.add(this._cacheKeyboardDirection, this._cacheKeyboardDirection,InputMovementType.Right);
        }

        if (this._buttonState.hasOwnProperty(KeycodeTable.w) || this._buttonState.hasOwnProperty(KeycodeTable.arrowUp)) {
            vec2.add(this._cacheKeyboardDirection, this._cacheKeyboardDirection,InputMovementType.Up);
        }

        this._keyboardCallback(this._cacheKeyboardDirection);
    }

    private SetKeyboardState(keyCode : string, state : boolean) {
        if (state)
            this._buttonState[keyCode] = true;
        else 
            delete this._buttonState[keyCode];
    }

}

export default InputHandler;