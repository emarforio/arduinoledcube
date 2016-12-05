# Arduino LED Cube
An implementation of a 3D LED-cube to be run on arduino.

## Pattern
The cube displays a series of 3D "precomputed" patterns. These patterns can be created manually or by using the patterngenerator.

### The generic model:

```cpp
{(UINT) layer1Pattern, (UINT) layer2Pattern, (UINT) ..layerNPattern, onTime}

N = size of cube
```

`layerNPattern` = pattern for layer compressed into a single variable, each bit represents the state of a led in a flattened 2d array

`onTime` = the amount of time this layer should show for (ms)

### An example:

```cpp
{(UINT) 0b000000000, (UINT) 0b000010000, (UINT) 0b000000000, 200}
```

(This pattern represents a single dot in the center of a 3x3 cube)

## Connections
The cube is limited to be at maximum 4x4 at default because of the limitations on the Arduino/Genuino Uno which only has 20 GPIOs. This code aims for simplicity and does therefore not use bit-shift registers to support larger cubes. If you have a higher capacity Arduino like the Mega you can extend the pins in the declaration.

The number of pins used are defined by the size, we use one pin for each layer we control and one for each column. P<sub>s</sub> = s + s<sup>2</sup> which gives that for the Uno that only has 20 pins s \<= 4

### Connect pins to Arduino
`layerPins`: first = top layer

`ledPins`: first = upper left seen from above

Only the used pins need to be connected, the others are simply ignored, eg. for a 3x3 cube you don't plug in the pin 3 since the layer is not used and you only plug in 3<sup>2</sup>=9 pins for the columns and leave the rest unconnected.

### Creating a cube

To create a cube you follow these steps:

1. Begin with the layers, connect all the anodes together by bending the legs and soldering them together. The kathodes should point straight down. 

2. Place the layers on top of each other and  solder the kathodes to the one below.

3. Done! Connect the layers and the columns to the Arduino as explained above.
