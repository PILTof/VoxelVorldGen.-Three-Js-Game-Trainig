
let data = {
    positions: [
        0, 1, 0,
        0, 0, 0,
        0, 1, 1,
        0, 0, 1,
        
        1, 1, 1,
        1, 0, 1,
        1, 1, 0,
        1, 0, 0,
        
        1, 0, 1,
        0, 0, 1,
        1, 0, 0,
        0, 0, 0,
        
        0, 1, 1,
        1, 1, 1,
        0, 1, 0,
        1, 1, 0,
        
        1, 0, 0,
        0, 0, 0,
        1, 1, 0,
        0, 1, 0,
        
        0, 0, 1,
        1, 0, 1,
        0, 1, 1,
        1, 1, 1,
    ],
    uvs: [
        0, 1,
        0, 0,
        1, 1,
        1, 0,

        0, 1,
        0, 0,
        1, 1,
        1, 0,

       0, 1,
        0, 0,
        1, 1,
        1, 0,

        0, 1,
        0, 0,
        1, 1,
        1, 0,

       0, 1,
        0, 0,
        1, 1,
        1, 0,

       0, 1,
        0, 0,
        1, 1,
        1, 0,
    ],
    normals: [
        -1, 0, 0,
        1, 0, 0,
        0, -1, 0,
        0, 1, 0,
        0, 0, -1,
    ],
}

export default {
    positions: data.positions,
    uvs: data.uvs,
    normals: data.normals,
    indexes: (() => {
        let res = [];

        for (let index = 0; index < data.positions.length / 3; index++) {
            
            res.push(
                index,
                index + 1,
                index + 2,
                index + 2,
                index + 1,
                index + 3
            )
            
        }

        return res;

    })()
}