from vpython import *
from random import *

gorigin = vector(0, 0, 0)
gaxis = vector(0, 1, 0)
sphere_size = 0.1
default_color = vector(0.5, 0.5, 0.5)
g = []
g.append(sphere(pos=vector(0, 1, 0), radius=sphere_size, color=default_color))  # top

g.append(sphere(pos=vector(0, 0, 1), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(0, 0, -1), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(sin(pi/4), 0, cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(sin(pi/4), 0, -cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(1, 0, 0), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-sin(pi/4), 0, cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-sin(pi/4), 0, -cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-1, 0, 0), radius=sphere_size, color=default_color))

g.append(sphere(pos=vector(0, cos(pi/4), sin(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(0, cos(pi/4), -sin(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(sin(pi/4) * cos(pi/4), cos(pi/4), cos(pi/4) * cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(sin(pi/4) * cos(pi/4), cos(pi/4), -cos(pi/4) * cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(cos(pi/4), cos(pi/4), 0), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-sin(pi/4) * cos(pi/4), cos(pi/4), cos(pi/4) * cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-sin(pi/4) * cos(pi/4), cos(pi/4), -cos(pi/4) * cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-cos(pi/4), cos(pi/4), 0), radius=sphere_size, color=default_color))

g.append(sphere(pos=vector(0, -cos(pi/4), sin(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(0, -cos(pi/4), -sin(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(sin(pi/4) * cos(pi/4), -cos(pi/4), cos(pi/4) * cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(sin(pi/4) * cos(pi/4), -cos(pi/4), -cos(pi/4) * cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(cos(pi/4), -cos(pi/4), 0), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-sin(pi/4) * cos(pi/4), -cos(pi/4), cos(pi/4) * cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-sin(pi/4) * cos(pi/4), -cos(pi/4), -cos(pi/4) * cos(pi/4)), radius=sphere_size, color=default_color))
g.append(sphere(pos=vector(-cos(pi/4), -cos(pi/4), 0), radius=sphere_size, color=default_color))

# random drift
#  while 1:
#     rate(30)
#     for obj in g:
#         obj.rotate(angle=radians(0.5), axis=gaxis, origin=gorigin)
#
#         oldcolor = obj.color
#         rand = randint(0, 2)
#         if rand==0:
#             obj.color = vector(oldcolor.x + uniform(-0.01, 0.01), oldcolor.y, oldcolor.z)
#         elif rand == 1:
#             obj.color = vector(oldcolor.x, oldcolor.y + uniform(-0.01, 0.01), oldcolor.z)
#         else:
#             obj.color = vector(oldcolor.x, oldcolor.y, oldcolor.z + uniform(-0.01, 0.01))
#

# mottle - given two colors, randomly assign each pixel to somewhere between the two
# and slowly drift each pixel towards one of the colors
color_a = vector(1, 0, 0)
color_b = vector(0, 0, 1)
while 1:
    rate(30)
    for obj in g:
        obj.rotate(angle=radians(0.5), axis=gaxis, origin=gorigin)

        oldcolor = obj.color
        rand = randint(0, 2)
        if rand==0:
            obj.color = vector(oldcolor.x + uniform(-0.01, 0.01), oldcolor.y, oldcolor.z)
        elif rand == 1:
            obj.color = vector(oldcolor.x, oldcolor.y + uniform(-0.01, 0.01), oldcolor.z)
        else:
            obj.color = vector(oldcolor.x, oldcolor.y, oldcolor.z + uniform(-0.01, 0.01))




