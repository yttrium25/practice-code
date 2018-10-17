import numpy as np
import matplotlib.pylab as plt
import math

N = 10
a = 13.0
b = 0.5

def weierstrass(x):
    item = []
    for i in range(N):
        s = b**i * np.cos(math.pi* a**i * x)
        item.append(s)
    return sum(item)
    
x = np.arange(-2.0, 2.0, 0.001)
y = weierstrass(x)
plt.plot(x, y)
plt.ylim(-5.1, 5.1) # y 軸の範囲を指定
plt.show()
