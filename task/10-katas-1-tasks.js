'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W','N'];  // use array of cardinal directions only!
    var sector = 360 / 32; // 11.25
    var out = [], out1 =[];
    
    // adding cardinals N E S W
    for (var i = 0, count = 0; i < 360; i = i + 90, count++)
        out.push({
            abbreviation: sides[count],
            azimuth: i});
    
    // adding ordinals NE SE SW NW            
    for (var i = 45, count = 0; i < 360; i = i + 90, count++)
        out.push({
            // N,S go first,  E,W go second
            abbreviation: (count%2==0) ? (sides[count]+sides[count+1]) : (sides[count+1]+sides[count]), 
            azimuth: i});
    out = out.sort((a,b) => a.azimuth - b.azimuth);   
    
    // adding secondary-intercardinal NNE ENE ESE SSE ...     
    for (var i = 1; i <= out.length; i++) {
        var k;
        if (i === out.length) k = 1;
        out1.push( {
            // Cardinal directions (N,E,S,W) go first, ordinal second (NE,SE,SW,NW)
            abbreviation : (i%2!==0) ? (out[i-1].abbreviation + out[i].abbreviation) : (out[(k || i+1)-1].abbreviation + out[i-1].abbreviation),
            azimuth : 2*sector + 4*sector*(i-1) });
    }
    
    // adding stuff with 'b' before and afer ordinal and cardinal directions   
    var out2 = [];
    var crazySides = ['W','E','N','E','N','S','E','S','E','W','S','W','S','N','W','N'];
    var j = 0;
    for (var i = 0; i < out.length; i++) {
        out2.push( {
            abbreviation : out[i].abbreviation + 'b' + crazySides[j++], azimuth : out[i].azimuth - sector});
        out2.push( {
            abbreviation : out[i].abbreviation + 'b' + crazySides[j++], azimuth : out[i].azimuth + sector});
    }
    
    // pushing NbW (with negative azimuth) to the end
    out2.shift();
    out2.push({abbreviation: 'NbW', azimuth: 360 - sector});
    
    out = out.concat(out1).concat(out2);   
    out.sort((a,b) => a.azimuth - b.azimuth);
   
    return out;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    throw new Error('Not implemented');
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    
    var matrix = Array.from({length: n}, x => Array.from({length: n}));   
    var i = 1,
        j = 1;

    for (var e = 0; e < n*n; e++) {
        matrix[i - 1][j - 1] = e;
        if ((i + j) % 2 == 0) {
            // Even diagonal
            if (j < n) j ++;
                else   i += 2;
            if (i > 1) i --;
        } else {
            // Odd diagonal
            if (i < n) i ++;
                else   j += 2;
            if (j > 1) j --;
        }
    }
    return matrix;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    throw new Error('Not implemented');
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    throw new Error('Not implemented');
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
