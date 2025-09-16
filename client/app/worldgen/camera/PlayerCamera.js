import { PerspectiveCamera } from "three";

export default class PlayerCamera {
    fov = 75;
    aspect = window.innerWidth / window.innerHeight;
    near = 0.1;
    far = 1000;

    /**
     * 
     * @returns {PerspectiveCamera}
     */
    static getInstance()
    {
        if(!!PlayerCamera.instance) {
            return PlayerCamera.instance;
        }

        PlayerCamera.instance = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        return PlayerCamera.instance;
    }
    
}
