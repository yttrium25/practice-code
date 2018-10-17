# 2次元ガウス分布の3次元プロット図

from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
import numpy as np
import sys

def det(a, b, c, d):
    return a * d - b * c

def inv(a, b, c, d):
    M = np.array([a, b,
                  c, d])
    if det(*M) == 0.0:
        print("This matrix cannot be defined inverse.")
        sys.exit()
    else:
        m = 1.0/det(*M)
        M = np.array([d, -b,
                     -c, a])
        return np.array(m * M)

def Quad(x_1, x_2, a, b, c, d):
    return a*x_1**2 + (b + c)*x_1 * x_2 + d * x_2**2

def gauss(x_1, x_2):
    [u_1, u_2] = [0, 0]
    S = np.array([1, 1, 
                  -1, 1])
    y = np.array([x_1 - u_1, x_2 - u_2])
    T = inv(*S)
    z = Quad(*[*y, *T])
    return 1/(2 * np.pi * np.sqrt(det(*S)) ) * np.exp(-0.5 * z)



# 描写
x_1 = np.arange(-3.0, 3.0, 0.1)
x_2 = np.arange(-3.0, 3.0, 0.1)

X_1, X_2 = np.meshgrid(x_1, x_2) # 2次元メッシュの作成
Z = gauss(X_1, X_2)

fig = plt.figure()  # 2次元の図を生成
ax = Axes3D(fig)    # 3次元の図を生成

# 軸ラベルの設定
ax.set_xlabel("x_1")
ax.set_ylabel("x_2")
ax.set_zlabel("z")

ax.plot_wireframe(X_1, X_2, Z)
plt.show()


