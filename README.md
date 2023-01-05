# Microtonal/Xenharmonic MuseScore plugin suite

**Work in progress.**

A rewrite of the n-edo plugin.

## Target features

- Multiple accidentals (using symbols attached to a note)
- any number of nominals + custom nominal tuning
- equave stretching (1 equave = 1 cycle of nominals)
- custom accidental tuning
- declare a finite number of accidental permutations
- rank-N tunings/JI subgroups of dim-N with N different chains of accidentals
- transpose up/down to the nearest pitch
- enharmonic respell
- a list of copypasta tuning configs of commonly used tunings for beginning users.

## Dev Notes

### Example

This tuning system/staff text specifies a 2.3.5 JI subset:

```
A4: 440
0 203.91 294.13 498.04 701.96 792.18 996.09 1200
bb b (113.685) # x 130
35 \ (21.506) / 39
```

- `A4: 440`
  - Sets tuning note to MIDI note A4, sets A4 to 440hz.
  - Because of how this plugin works, the tuning note must be without accidental.
- `0 203.91 294.13 498.04 701.96 792.18 996.09 1200`
  - Sets a cycle of 7 nominals extending upwards/downwards from A4.
  - Tunes 7 nominals to 203.91cents, 294.13c, 498.04c, 701.96c, etc... respectively, representing the note names A, B, C, etc... (3-limit JI)
  - The last number sets equave to 1200c.
- `bb b (113.685) # x 130`
  - Declares a chain of accidentals that go double-flat, flat, natural/none, sharp, double-sharp, triple-sharp (let's just assume for now `130` is the accidental code for triple-sharp).
  - Each step in the flat/sharp direction lowers/raises the pitch by 113.685 cents respectively.
  - A chain of accidentals are mutually exclusive. That is, you cannot have two different accidentals within the same chain applied to the same note.
  - Declaring the chain of accidentals limits the search space of the 'transpose up/down to nearest pitch' function such that only the declared accidentals are regarded. (too many accidentals / nominals will cause lag.)
- `35 \ (21.506) / 39`
  - Declares a second chain of accidentals that go double-syntonic down (let's say it's accidental code `35` for now), syntonic down, natural/none, syntonic up, double-syntonic up (e.g. accidental code `39`) --- where each adjacent step in the accidental chain is 21.506 cents apart.
  - You can combine accidentals from different chains.

Upon parsing the above tuning config, the plugin should generate all permutations of nominals and accidentals within an equave and sort it in ascending pitch order like so:
