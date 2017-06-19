#!/usr/bin/env python

# Light each LED in sequence, and repeat.

import opc
import time
import math

client = opc.Client('localhost:7890')

ROW_0_IDX = [0]
ROW_1_IDX = [1,2,3,4,5,6,7,8]
ROW_2_IDX = [16,15,14,13,12,11,10,9]

ROW_0_VAL = [(0,0,0)]
ROW_1_VAL = [(255,0,0),(255,127,0),(255,255,0),(127,255,0),(0,255,0),(0,255,127),(0,255,255),(0,127,255)]
ROW_2_VAL = [(255,0,0),(255,127,0),(255,255,0),(127,255,0),(0,255,0),(0,255,127),(0,255,255),(0,127,255)]

pixels = [(0,0,0)] * 17
last_time = time.time()

def get_rgb_for_hsv(h,s,v):
	h = float(h)
	s = float(s)
	v = float(v)
	h60 = h / 60.0
	h60f = math.floor(h60)
	hi = int(h60f) % 6
	f = h60 - h60f
	p = v * (1 - s)
	q = v * (1 - f * s)
	t = v * (1 - (1 - f) * s)
	r, g, b = 0, 0, 0
	if hi == 0: r, g, b = v, t, p
	elif hi == 1: r, g, b = q, v, p
	elif hi == 2: r, g, b = p, v, t
	elif hi == 3: r, g, b = p, q, v
	elif hi == 4: r, g, b = t, p, v
	elif hi == 5: r, g, b = v, p, q
	r, g, b = int(r * 255), int(g * 255), int(b * 255)
	return r, g, b

spinning_rainbow_hue_pos = 0.0
def spinning_rainbow():
	global spinning_rainbow_hue_pos
	for i in range(0,8):
		hue = ((i * 45) + spinning_rainbow_hue_pos) % 360
		ROW_1_VAL[i] = get_rgb_for_hsv(hue, 1.0, 1.0)
		ROW_2_VAL[i] = get_rgb_for_hsv(hue, 1.0, 1.0)
	
	spinning_rainbow_hue_pos += 2 
	if spinning_rainbow_hue_pos >= 360:
		spinning_rainbow_hue_pos = 0.0

while True:
	# animate something on the pixels
	spinning_rainbow()				

	# render the rows out to the FadeCandy
	pixels[ROW_0_IDX[0]] = ROW_0_VAL[0]
	for i in range(len(ROW_1_IDX)):
		pixels[ROW_1_IDX[i]] = ROW_1_VAL[i]
	for i in range(len(ROW_2_IDX)):
		pixels[ROW_2_IDX[i]] = ROW_2_VAL[i]
	client.put_pixels(pixels)
	
	# run at 30 frames per second
	new_time = time.time()
	sleep_time = ((1000.0 / 30) - (new_time - last_time)) / 1000.0
	last_time = new_time
	if sleep_time > 0:
		time.sleep(sleep_time)
