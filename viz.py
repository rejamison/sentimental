from vpython import *
from random import *

gorigin = vector(0, 0, 0)
gaxis = vector(0, 1, 0)
sphere_size = 0.1
default_color = vector(1.0, 0, 0)
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

while 1:
    rate(30)
    for obj in g:
        obj.rotate(angle=radians(0.5), axis=gaxis, origin=gorigin)

        rand = randint(0, 2)
        if rand==0:
            old = obj.red
            obj.red += uniform(-0.05, 0.05)
            print("{0} -> {1}".format(old, obj.red))
        elif rand == 1:
            old = obj.blue
            obj.blue += uniform(-0.05, 0.05)
            print("{0} -> {1}".format(old, obj.blue))
        else:
            old = obj.green
            obj.green += uniform(-0.05, 0.05)
            print("{0} -> {1}".format(old, obj.green))
