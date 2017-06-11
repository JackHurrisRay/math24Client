/**
 * Created by Jack.L on 2017/6/11.
 */

function getRandIndex(count)
{
    var array = [];

    const group_length = Math.floor( math24TableSize / count );

    for( var i = 0; i<count; i++ )
    {
        const index = common.GET_RAND(group_length) + i * group_length;
        array.push(math24Table[index]);
    }

    return array;
}

function randIndexFor4Cells()
{
    const cellGroups =
        [
            ////
            [0,1,2,3],
            [0,1,3,2],
            [0,2,1,3],
            [0,2,3,1],
            [0,3,1,2],
            [0,3,2,1],

            ////
            [1,0,2,3],
            [1,0,3,2],
            [1,2,0,3],
            [1,2,3,0],
            [1,3,0,2],
            [1,3,2,0],

            ////
            [2,1,0,3],
            [2,1,3,0],
            [2,0,1,3],
            [2,0,3,1],
            [2,3,1,0],
            [2,3,0,1],

            ////
            [3,1,2,0],
            [3,1,0,2],
            [3,2,1,0],
            [3,2,0,1],
            [3,0,1,2],
            [3,0,2,1],
        ];

    const length = cellGroups.length;
    const index  = common.GET_RAND(length);
    var _selectGroup = cellGroups[index];

    return _selectGroup;
}

function changeArray4Sort(array)
{
    const randSortIndex = randIndexFor4Cells();

    var new_array = [];
    for( var i in randSortIndex )
    {
        const index = randSortIndex[i];
        new_array.push(array[index]);
    }

    return new_array;
}

var PlayerData =
    (
        function()
        {
            var instance =
            {

            };

            return instance;
        }
    )();