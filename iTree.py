from turtle import *

def iTree(s, n):
    if n <= 0:
        return
    forward(s/2)
    left(90)
    iTree(s/2, n-1)
    right(90)
    back(s)
    left(90)
    iTree(s/2, n-1)
    right(90)
    forward(s/2)

def main():
    speed(0)
    hideturtle()
    iTree(300, 7)

main()
