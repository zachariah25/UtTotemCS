from turtle import *
from math import *

def spirograph(R, r, p):
	t = 0

	up()
	goto( (R-r)*cos(t) - (r+p)*cos((R-r)/r*t), \
		  (R-r)*sin(t) - (r+p)*sin((R-r)/r*t))
	down()
	pensize(3)

	while t <= 2 * pi:
		pencolor(abs(cos(t)), abs(sin(t)), t / (2 * pi))
		goto( (R-r)*cos(t) - (r+p)*cos((R-r)/r*t), \
			  (R-r)*sin(t) - (r+p)*sin((R-r)/r*t))
		t += 0.001

def main():
	speed(0)
	spirograph(100, 4, 80)

main()