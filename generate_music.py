import wave
import math
import struct

sample_rate = 44100

def note_to_freq(note_str):
    notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    flat_map = {'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'}
    
    if len(note_str) == 3:
        name = note_str[:2]
        octave = int(note_str[2])
    else:
        name = note_str[:1]
        octave = int(note_str[1])
        
    if name in flat_map:
        name = flat_map[name]
        
    idx = notes.index(name)
    semitones = idx + (octave - 4) * 12 - 9 # A4 is 440Hz
    return 440.0 * (2.0 ** (semitones / 12.0))

def render_note(freq, duration, velocity=0.8, is_piano=True):
    num_samples = int(duration * sample_rate)
    samples = [0.0] * num_samples
    
    if is_piano:
        harmonics = [
            (1.0, 1.0, 1.0),
            (2.0, 0.45, 1.2),
            (3.0, 0.22, 1.5),
            (4.0, 0.10, 1.8),
            (5.0, 0.05, 2.2),
        ]
    else:
        harmonics = [
            (1.0, 0.7, 0.8),
            (2.0, 0.35, 1.1),
            (2.76, 0.25, 1.4),
            (4.0, 0.12, 1.8),
        ]
    
    for h, amp, decay_mult in harmonics:
        h_freq = freq * h
        decay_rate = (2.2 * decay_mult) / max(0.5, math.log10(freq / 20.0))
        for i in range(num_samples):
            t = i / sample_rate
            att = t / 0.005 if t < 0.005 else 1.0
            env = att * math.exp(-t * decay_rate)
            val = math.sin(2.0 * math.pi * h_freq * t) + 0.12 * math.sin(2.0 * math.pi * (h_freq * 1.002) * t)
            samples[i] += val * amp * env * velocity
            
    return samples

tempo = 68.0
beat = 60.0 / tempo

melody_notes = [
    ('C4', 0.0, 0.75, 0.6),
    ('C4', 0.75, 0.25, 0.5),
    ('D4', 1.0, 1.0, 0.75),
    ('C4', 2.0, 1.0, 0.7),
    ('F4', 3.0, 1.0, 0.85),
    ('E4', 4.0, 2.0, 0.75),

    ('C4', 6.0, 0.75, 0.6),
    ('C4', 6.75, 0.25, 0.5),
    ('D4', 7.0, 1.0, 0.75),
    ('C4', 8.0, 1.0, 0.7),
    ('G4', 9.0, 1.0, 0.85),
    ('F4', 10.0, 2.0, 0.75),

    ('C4', 12.0, 0.75, 0.65),
    ('C4', 12.75, 0.25, 0.55),
    ('C5', 13.0, 1.0, 0.95),
    ('A4', 14.0, 1.0, 0.85),
    ('F4', 15.0, 1.0, 0.8),
    ('E4', 16.0, 1.0, 0.75),
    ('D4', 17.0, 1.5, 0.7),

    ('Bb4', 18.5, 0.75, 0.85),
    ('Bb4', 19.25, 0.25, 0.75),
    ('A4', 19.5, 1.0, 0.9),
    ('F4', 20.5, 1.0, 0.8),
    ('G4', 21.5, 1.0, 0.85),
    ('F4', 22.5, 2.5, 0.9),

    ('A4', 25.0, 1.0, 0.7),
    ('C5', 26.0, 1.0, 0.75),
    ('F5', 27.0, 2.0, 0.85),
    ('E5', 29.0, 1.0, 0.8),
    ('D5', 30.0, 1.0, 0.75),
    ('C5', 31.0, 2.0, 0.8),
    ('Bb4', 33.0, 1.0, 0.75),
    ('A4', 34.0, 1.0, 0.7),
    ('G4', 35.0, 2.0, 0.75),
    ('F4', 37.0, 3.0, 0.8),
]

accompaniment = [
    ('F2', 0.0, 3.0, 0.6), ('F3', 0.5, 2.0, 0.4), ('A3', 1.0, 1.5, 0.4), ('C4', 1.5, 1.5, 0.4), ('F4', 2.0, 1.5, 0.45),
    ('E2', 3.0, 3.0, 0.55), ('G3', 3.5, 2.0, 0.4), ('C4', 4.0, 1.5, 0.4), ('E4', 4.5, 1.5, 0.4), ('G4', 5.0, 1.5, 0.4),
    ('C2', 6.0, 3.0, 0.55), ('E3', 6.5, 2.0, 0.4), ('G3', 7.0, 1.5, 0.4), ('Bb3', 7.5, 1.5, 0.4), ('C4', 8.0, 1.5, 0.4),
    ('F2', 9.0, 3.0, 0.6), ('C3', 9.5, 2.0, 0.4), ('F3', 10.0, 1.5, 0.4), ('A3', 10.5, 1.5, 0.4), ('C4', 11.0, 1.5, 0.4),
    ('F2', 12.0, 3.0, 0.6), ('A2', 12.5, 2.0, 0.45), ('C3', 13.0, 1.5, 0.4), ('Eb3', 13.5, 1.5, 0.4), ('A3', 14.0, 1.5, 0.4),
    ('Bb1', 15.0, 3.0, 0.65), ('D3', 15.5, 2.0, 0.45), ('F3', 16.0, 1.5, 0.4), ('Bb3', 16.5, 1.5, 0.4), ('D4', 17.0, 1.5, 0.4),
    ('C2', 18.0, 3.0, 0.6), ('F3', 18.5, 1.5, 0.4), ('A3', 19.0, 1.5, 0.4), ('G3', 20.0, 1.5, 0.4), ('C4', 20.5, 1.5, 0.4),
    ('F1', 21.0, 4.0, 0.7), ('C3', 21.5, 3.0, 0.5), ('F3', 22.0, 2.5, 0.5), ('A3', 22.5, 2.5, 0.5), ('C4', 23.0, 2.5, 0.5), ('F4', 23.5, 2.5, 0.55),
    
    ('D2', 25.0, 3.0, 0.6), ('A2', 25.5, 2.0, 0.4), ('D3', 26.0, 2.0, 0.4), ('F3', 26.5, 2.0, 0.4),
    ('Bb1', 28.0, 3.0, 0.6), ('F2', 28.5, 2.0, 0.4), ('Bb2', 29.0, 2.0, 0.4), ('D3', 29.5, 2.0, 0.4),
    ('C2', 31.0, 3.0, 0.6), ('G2', 31.5, 2.0, 0.4), ('C3', 32.0, 2.0, 0.4), ('E3', 32.5, 2.0, 0.4),
    ('F1', 34.0, 4.0, 0.65), ('C2', 34.5, 3.0, 0.5), ('F2', 35.0, 3.0, 0.5), ('A2', 35.5, 3.0, 0.5), ('C3', 36.0, 3.0, 0.5), ('F3', 36.5, 3.0, 0.5),
]

total_beats = 40.0
total_duration = total_beats * beat + 3.0
total_samples = int(total_duration * sample_rate)

left_channel = [0.0] * total_samples
right_channel = [0.0] * total_samples

print(f"Generating audio: {total_duration:.1f} seconds...")

for note, start_b, dur_b, vel in melody_notes:
    freq = note_to_freq(note)
    dur_sec = dur_b * beat + 0.6
    note_samples = render_note(freq, dur_sec, vel, is_piano=True)
    start_idx = int(start_b * beat * sample_rate)
    for i, s in enumerate(note_samples):
        if start_idx + i < total_samples:
            left_channel[start_idx + i] += s * 0.55
            right_channel[start_idx + i] += s * 0.45

for note, start_b, dur_b, vel in melody_notes:
    freq = note_to_freq(note) * 2.0
    dur_sec = dur_b * beat + 0.8
    bell_samples = render_note(freq, dur_sec, vel * 0.2, is_piano=False)
    start_idx = int(start_b * beat * sample_rate)
    for i, s in enumerate(bell_samples):
        if start_idx + i < total_samples:
            left_channel[start_idx + i] += s * 0.3
            right_channel[start_idx + i] += s * 0.7

for note, start_b, dur_b, vel in accompaniment:
    freq = note_to_freq(note)
    dur_sec = dur_b * beat + 0.8
    note_samples = render_note(freq, dur_sec, vel, is_piano=True)
    start_idx = int(start_b * beat * sample_rate)
    for i, s in enumerate(note_samples):
        if start_idx + i < total_samples:
            left_channel[start_idx + i] += s * 0.4
            right_channel[start_idx + i] += s * 0.6

delay_samples_l = int(0.22 * sample_rate)
delay_samples_r = int(0.32 * sample_rate)
feedback = 0.28

for i in range(delay_samples_l, total_samples):
    left_channel[i] += left_channel[i - delay_samples_l] * feedback

for i in range(delay_samples_r, total_samples):
    right_channel[i] += right_channel[i - delay_samples_r] * feedback

max_val = 0.0001
for i in range(total_samples):
    if abs(left_channel[i]) > max_val:
        max_val = abs(left_channel[i])
    if abs(right_channel[i]) > max_val:
        max_val = abs(right_channel[i])

gain = 0.85 / max_val
print(f"Normalizing with gain: {gain:.2f}")

wav_file = wave.open("romantic_music.wav", "w")
wav_file.setnchannels(2)
wav_file.setsampwidth(2)
wav_file.setframerate(sample_rate)

frames = bytearray()
for i in range(total_samples):
    l = int(max(-32767, min(32767, left_channel[i] * gain * 32767)))
    r = int(max(-32767, min(32767, right_channel[i] * gain * 32767)))
    frames.extend(struct.pack('<hh', l, r))

wav_file.writeframes(frames)
wav_file.close()
print("Saved romantic_music.wav successfully!")
