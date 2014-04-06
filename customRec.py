from turtle import *
import sys

def drawTree(length, depth):
	if depth <= 0:
		pass
	else:
		exec(sys.argv[3])

def main():
	l = int(sys.argv[1])
	d = int(sys.argv[2])
	hideturtle()
	speed(0)
	left(90)
	back(l)
	drawTree(l, d)
	input("Enter to close... ")
	bye()

main()
