from turtle import *
import sys
import time

def drawTree(length, depth):
	if depth <= 0:
		pass
	else:
		for i in range(3, len(sys.argv)):
			exec(sys.argv[i])

def main():
	l = int(sys.argv[1])
	d = int(sys.argv[2])
	#hideturtle()
	#speed(0)
	left(90)
	try:
		drawTree(l, d)
	except:
		pass
	time.sleep(2)	
	bye()

main()
