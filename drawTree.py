from turtle import *

def drawTree(length, depth):
	if depth <= 0:
		pass
	else:
		forward(length)
		left(40)
		drawTree(2*length/3, depth-1)
		right(60)
		drawTree(2*length/3, depth-1)
		left(20)
		back(length)

def main():
	l = int(input("Enter length: "))
	d = int(input("Enter depth: "))
	hideturtle()
	speed(0)
	left(90)
	back(l)
	drawTree(l, d)
	input("Enter to close... ")
	bye()

main()