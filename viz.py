from vpython import *

gorigin = vector(0, 0, 0)
gaxis = vector(0, 1, 0)
g[0] = sphere(pos=vector(0, 0, 1), radius=0.1, color=color.red)
g[1] = sphere(pos=vector(0, 0, -1), radius=0.1, color=color.red)
g[2] = sphere(pos=vector(0, 1, 0), radius=0.1, color=color.red)
g[3] = sphere(pos=vector(1, 0, 0), radius=0.1, color=color.red)
g[4] = sphere(pos=vector(-1, 0, 0), radius=0.1, color=color.red)

while 1:
    rate(60)
    for obj in g:
        g.rotate(angle=radians(1), axis=gaxis, origin=gorigin)