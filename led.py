#!/usr/bin/env python

# Light each LED in sequence, and repeat.

import opc
import time

client = opc.Client('localhost:7890')

i=0
j=0
h=0

while True:
	i = i + 1
	j = j + 3
	h = h + 5
	pixels = [(i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h), (i, j, h)]
	client.put_pixels(pixels)
	time.sleep(0.1)
	if i > 255:
		i = 0
	if j > 255:
		j = 0
	if h > 255:
		h = 0
