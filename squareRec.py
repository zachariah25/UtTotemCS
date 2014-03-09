
from turtle import *

def iTree(s, n):

    if n <= 0:
        pass
    else:

        forward(s/2)
        left(90)
        iTree(s/2, n-1)
        right(90)
        back(s)
        left(90)
        iTree(s/2, n-1)
        right(90)
        forward(s/2)

def squares(s,n):
    if n <= 0:
        pass
    else:

        fd(s)
        lt(45)
        squares(s/2,n-1)
        lt(45)
        fd(s)
        lt(90)
        fd(s)
        lt(45)
        squares(s/2,n-1)
        lt(45)
        fd(s)
        lt(90)
        


def main():
    s = int(input("Enter size: "))
    n = int(input("Enter depth: "))
    speed(0)
    hideturtle()
    squares(s, n)
    input("Enter to close... ")
    bye()
    
main()
