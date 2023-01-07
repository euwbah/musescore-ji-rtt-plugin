/**
    Lookup table for mapping accidental code/ID number to 
    musescore's internal accidental names and accidental symbol names.

    Note: this is a one-to-many lookup table, as there are multiple symbols/accidentals
    that look alike but have different internal representations. This plugin
    should treat identical looking accidentals all the same.

    All caps are accidental names (the string value of Note.accidentalType)
    Non caps are symbol names (string value of Element.symbol)

    E.g. codeToLabels[2] contains all the possible accidental names/symbol names
    that represent the sesquisharp (#+) accidental.

    Whenever 'accidentalID' is used in code, it refers to the index of the
    accidental in this array.
 */
CODE_TO_LABELS = [
    ['NONE'],
    ['NATURAL'],
    ['SHARP_SLASH4', 'accidentalWyschnegradsky9TwelfthsSharp'],
    ['SHARP_SLASH'],
    ['MIRRORED_FLAT'],
    ['MIRRORED_FLAT2'],
    ['DOUBLE_SHARP_THREE_ARROWS_UP'],
    ['DOUBLE_SHARP_TWO_ARROWS_UP'],
    ['SHARP2_ARROW_UP'],
    ['DOUBLE_SHARP_ONE_ARROW_UP'],
    ['SHARP2'],
    ['SHARP2_ARROW_DOWN'],
    ['DOUBLE_SHARP_ONE_ARROW_DOWN'],
    ['DOUBLE_SHARP_TWO_ARROWS_DOWN'],
    ['DOUBLE_SHARP_THREE_ARROWS_DOWN'],
    ['SHARP_THREE_ARROWS_UP'],
    ['SHARP_TWO_ARROWS_UP'],
    ['SHARP_ARROW_UP'],
    ['SHARP_ONE_ARROW_UP'],
    ['SHARP'],
    ['SHARP_ARROW_DOWN'],
    ['SHARP_ONE_ARROW_DOWN'],
    ['SHARP_TWO_ARROWS_DOWN'],
    ['SHARP_THREE_ARROWS_DOWN'],
    ['NATURAL_THREE_ARROWS_UP'],
    ['NATURAL_TWO_ARROWS_UP'],
    ['NATURAL_ARROW_UP'],
    ['NATURAL_ONE_ARROW_UP'],
    ['NATURAL_ARROW_DOWN'],
    ['NATURAL_ONE_ARROW_DOWN'],
    ['NATURAL_TWO_ARROWS_DOWN'],
    ['NATURAL_THREE_ARROWS_DOWN'],
    ['FLAT_THREE_ARROWS_UP'],
    ['FLAT_TWO_ARROWS_UP'],
    ['FLAT_ARROW_UP'],
    ['FLAT_ONE_ARROW_UP'],
    ['FLAT'],
    ['FLAT_ARROW_DOWN'],
    ['FLAT_ONE_ARROW_DOWN'],
    ['FLAT_TWO_ARROWS_DOWN'],
    ['FLAT_THREE_ARROWS_DOWN'],
    ['DOUBLE_FLAT_THREE_ARROWS_UP'],
    ['DOUBLE_FLAT_TWO_ARROWS_UP'],
    ['FLAT2_ARROW_UP'],
    ['DOUBLE_FLAT_ONE_ARROW_UP'],
    ['FLAT2'],
    ['FLAT2_ARROW_DOWN'],
    ['DOUBLE_FLAT_ONE_ARROW_DOWN'],
    ['DOUBLE_FLAT_TWO_ARROWS_DOWN'],
    ['DOUBLE_FLAT_THREE_ARROWS_DOWN']
];

/**
 * The inverse many-to-one mapping of the above CODE_TO_LABELS array.
 */
LABELS_TO_CODE = (function() {
    var mapping = {};
    for (var i = 0; i < codeToLabels.length; i++) {
      for (var j = 0; j < codeToLabels[i].length; j++)
        mapping[codeToLabels[i][j]] = i;
    }
    Object.freeze(mapping);
    return mapping;
})();

/**
 * Mapping of 12EDO note letters to nominals from A.
 */
LETTERS_TO_NOMINAL = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6
};

/**
 * Mapping of 12EDO note letters to semitones from A.
 * (A is the reference note which the octave is based on).
 */
LETTERS_TO_SEMITONES = {
    'a': 0,
    'b': 2,
    'c': -9,
    'd': -7,
    'e': -5,
    'f': -4,
    'g': -2
};

/**
 * Mapping from 12edo TPCs to a [nominals, midiOctaveOffset] tuple.
 * 
 * Used in conjuction with Note.pitch to calculate `nominalsFromA4` 
 * property of MSNote.
 * 
 * nominals: 
 *      0-6, representing A, B, C, ...
 * 
 * midiOctaveOffset: 
 *      represents the number of octaves to add/sub when calculating octaves
 *      using its MIDI note because the MIDI pitch of this TPC will appear
 *      to be in a different octave if it has accidentals.
 *      
 *      In these calculations, the 12edo octave is considered to reset
 *      on the note A. (A4 = 0th octave, G4 = -1st octave)
 */
TPC_TO_NOMINAL = (function() {
    var x = {};
    x[-8] = [5, 0]; // Fbbb
    x[-7] = [2, 0]; // Cbbb
    x[-6] = [6, 0]; // Gbbb
    x[-5] = [3, 0]; // Dbbb
    x[-4] = [0, 1]; // Abbb
    x[-3] = [4, 0]; // Ebbb
    x[-2] = [1, 1]; // Bbbb

    x[-1] = [5, 0]; // Fbb
    x[0] = [2, 0]; // Cbb
    x[1] = [6, 0]; // Gbb
    x[2] = [3, 0]; // Dbb
    x[3] = [0, 1]; // Abb
    x[4] = [4, 0]; // Ebb
    x[5] = [1, 0]; // Bbb

    x[6] = [5, 0]; // Fb
    x[7] = [2, 0]; // Cb
    x[8] = [6, 0]; // Gb
    x[9] = [3, 0]; // Db
    x[10] = [0, 1]; // Ab
    x[11] = [4, 0]; // Eb
    x[12] = [1, 0]; // Bb

    x[13] = [5, 0]; // F
    x[14] = [2, 0]; // C
    x[15] = [6, 0]; // G
    x[16] = [3, 0]; // D
    x[17] = [0, 0]; // A
    x[18] = [4, 0]; // E
    x[19] = [1, 0]; // B

    x[20] = [5, 0]; // F#
    x[21] = [2, 0]; // C#
    x[22] = [6, 0]; // G#
    x[23] = [3, 0]; // D#
    x[24] = [0, 0]; // A#
    x[25] = [4, 0]; // E#
    x[26] = [1, 0]; // B#

    x[27] = [5, 0]; // Fx
    x[28] = [2, 0]; // Cx
    x[29] = [6, -1]; // Gx
    x[30] = [3, 0]; // Dx
    x[31] = [0, 0]; // Ax
    x[32] = [4, 0]; // Ex
    x[33] = [1, 0]; // Bx

    x[34] = [5, 0]; // Fx#
    x[35] = [2, 0]; // Cx#
    x[36] = [6, -1]; // Gx#
    x[37] = [3, 0]; // Dx#
    x[38] = [0, 0]; // Ax#
    x[39] = [4, 0]; // Ex#
    x[40] = [1, 0]; // Bx#
    return x;
})();

function test() {
    (() => console.log("Hello world! Helper function."))();
}


/**
 * Reads the Ms::PluginAPI::Note and creates a `MSNote` data structure.
 */
function readNote(note) {
    // 69 = MIDI A4
    var octavesFromA4 = Math.floor((note.pitch - 69) / 12);
    var nominals = TPC_TO_NOMINAL[note.tpc][0];
    octavesFromA4 += TPC_TO_NOMINAL[note.tpc][1];
    
    var accidentals = {};

    if (note.accidental) {
        // If note has a Full/Half supported accidental,

        accidentals[LABELS_TO_CODE['' + note.accidental]] = 1;
    }

    for (var i = 0; i < note.elements.length; i++) {
        // If note has a Full/Half supported accidental,

        var acc = LABELS_TO_CODE['' + note.elements[i].symbol];

        if (acc) {
            if (accidentals[acc])
                accidentals[acc] += 1;
            else
                accidentals[acc] = 1;
        }
    }

    var msNote = { // MSNote
        tpc: note.tpc,
        nominalsFromA4: nominals + (octavesFromA4 * 7),
        accidentals: accidentals
    };

    return msNote;
}

/**
 * Tests system/staff text to see if it is a tuning config.
 * 
 * If it is, parses it and creates a TuningConfig object.
 * 
 * @param {string} text The system/staff text contents to parse.
 * 
 * @returns {TuningConfig} The parsed tuning configuration object, or null text was not a tuning config.
 */
function parseTuningConfig(text) {
    var text = text.trim();

    if (text.length == 0)
        return null;
    
    var tuningConfig = {
        notesTable: {},
        tuningTable: {},
        avTable: {},
        stepsList: [],
        stepsLookup: {},
        enharmonics: {},
        nominals: [],
        numNominals: null,
        equaveSize: null,
        tuningNote: null,
        tuningNominal: null,
        tuningFreq: null,
    };

    var lines = text.split('\n');

    var referenceTuning = lines[0].split(':').forEach(x => x.trim());

    if (referenceTuning.length != 2)
        return null;

    var referenceLetter = referenceTuning[0][0].toLowerCase();
    var referenceOctave = parseInt(referenceTuning[0].slice(1));

    var nominalsFromA4 = (referenceOctave - 4) * 7;
    var lettersNominal = LETTERS_TO_NOMINAL[referenceLetter];
    nominalsFromA4 += lettersNominal;

    // Since the written octave resets at C, but we need to convert it
    // such that the octave resets at A4, we need to subtract one octave
    // if the nominal is within C to G.
    if (lettersNominal >= 2)
        nominalsFromA4 -= 7;
    
    tuningConfig.tuningNominal = nominalsFromA4;
    tuningConfig.tuningNote = LETTERS_TO_SEMITONES[referenceLetter] + (referenceOctave - 4) * 12 + 69;
    tuningConfig.tuningFreq = parseFloat(referenceTuning[1]);
}