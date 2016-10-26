#define UINT unsigned int
#define PATTERN_DELAY 2

// ***** Paste the generated code here (or add own) *****
#define SIZE 3
unsigned int pattern[][SIZE+1] = {
    {(UINT) 0b111111111, (UINT) 0b000000000, (UINT) 0b000000000, 1000},
    {(UINT) 0b000000000, (UINT) 0b111111111, (UINT) 0b000000000, 1000},
    {(UINT) 0b000000000, (UINT) 0b000000000, (UINT) 0b111111111, 1000}
  };
// ***** Override everything between these comments *****

// Declare all pins for up to 4x4 cube but only use as many as we need
const byte level[] = {0,1,2,3}; // Top layer first
const byte leds[] = {4,5,6,7,8,9,10,11,12,13,A0,A1,A2,A3,A4,A5}; // Top left, then as LrR

int patternLength; // Gets calculated in the setup

void setup() {
  // Init levels
  for (int i = 0; i < SIZE; i++){
    pinMode(level[i], OUTPUT);
  }
  
  // Init control pins
  for (int i = 0; i < SIZE * SIZE; i++){
    pinMode(leds[i], OUTPUT);
    digitalWrite(leds[i], HIGH);
  }
  
  // Calculate the size of the patterm array
  patternLength = sizeof(pattern) / (sizeof(unsigned int) * (SIZE+1));
}

void loop() {
  
  // Loop through all patterns and start over when done
  for (int i = 0; i < patternLength; i++) {
    // Load current pattern
    unsigned int *currentPattern = pattern[i];
    
    // Time to display pattern (ms)
    short displayTime = currentPattern[SIZE];
    
    long startTime = millis();
    
    do {
      printPattern(currentPattern);
    } while(millis() - startTime < displayTime);
  }
}

void printPattern(unsigned int *pat) {
  
  boolean bits[SIZE][SIZE * SIZE];
  
  // "Render" the bits for faster output
  for (int i = 0; i < SIZE; i++) {
    patternToBits(pat[i], bits[i]);
  }
  
  for (int lev = 0; lev < SIZE; lev++) {
    
    digitalWrite(level[lev], HIGH);
    for(int i = 0; i < SIZE * SIZE; i++) {
      digitalWrite(leds[i], bits[lev][i]);
    }
    delay(PATTERN_DELAY);
    for (int i = 0; i < SIZE * SIZE; i++) {
      digitalWrite(leds[i], LOW);
    }
    digitalWrite(level[lev], LOW);
  }
}

// Turn compressed pattern to array of booleans
void patternToBits(unsigned int pat, boolean *bits) {
  for (int i = 0; i < SIZE * SIZE; i++) {
    bits[i] = !((pat >> (SIZE * SIZE - (i + 1))) & 0x01); 
  }
}
