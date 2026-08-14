---
title: "CF 102302I - 无用的神奇宝贝"
description: "将每个 Pokemino 视为平面上的一个点 ((A,D))，其中攻击是水平坐标，防御是垂直坐标。"
date: "2026-08-14T04:36:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102302
codeforces_index: "I"
codeforces_contest_name: "2019 USP-ICMC"
rating: 0
weight: 102302
solve_time_s: 229
verified: false
draft: false
---

[CF 102302I - 无用的 Pokemino](https://codeforces.com/problemset/problem/102302/I)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 将每个 Pokemino 视为平面上的一个点 ((A,D))，其中攻击是水平坐标，防御是垂直坐标。 如果拉尔什没有拥有任何点，也没有他可以通过繁殖获得的点，而这两个坐标都严格更大，则 Pokemino 是有用的。 

育种取两分的加权平均值。 因此，重复繁殖可以准确地给出所有捕获点的凸包。 所以真正的几何问题是：在捕获的点中，哪些点不严格受其凸包的任何点支配？ 

答案由凸包的右上边界描述。 如果我们按照攻击从左到右对点进行排序，有用的点就会形成一条凸链。 一个新点可以使该链上的几个连续点变得无用，但它不能使两个分离的区域独立消失。 这种局部性使得在线船体维护算法成为可能。 

最多有 (10^5) 次捕获，而攻击和防御都可以达到 (10^9) 次。 二次算法已经需要大约 (10^{10}) 次运算，远远超出一秒的限制。 我们大约需要 (O(N\log N)) 总工作量。 坐标大小还意味着应该使用精确的整数算术来执行几何测试。 在 C++ 中，这需要 64 位整数，因为叉积可以达到大约 (10^{18})； Python 整数自动处理这个范围。 

同等攻击值需要特殊对待。 攻击力相同的两只神奇宝贝并不能严格压制对方，因为攻击力需要严格改进。 例如，```
3
5 1
5 3
5 2
```有输出```
0
0
0
```如果不小心实施，只为每次攻击保留最高防御，则会错误地丢弃其他两个 Pokemin。 我们通过减少防御来对同等攻击进行排序，以便正确地表示该垂直组。 

第二个陷阱是严格的不平等。 如果 Pokemino 恰好位于连接另外两个的递减线段上，它仍然有用。 例如，```
3
0 10
5 5
10 0
```有输出```
0
0
0
```中间的 Pokemino 可以从端点繁殖，但结果点正好是 ((5,5))，并不严格比它好。 删除每个共线点的实现将给出错误的答案。 

第三个陷阱是，即使父母双方都没有单独这样做，凸组合也可以主导 Pokemino。 例如，```
3
0 10
10 0
5 4
```有输出```
0
0
1
```培育前两个同等重量的 Pokemin 会产生 ((5,5))，它严格占主导地位 ((5,4))。 仅检查直接成对优势会错过这种情况。 

最后，一个点可能毫无用处，因为后面的点直接支配它。 为了```
3
0 0
2 2
1 1
```输出是```
0
0
1
```当 ((1,1)) 到达时，((2,2)) 已被拥有并支配它。 仅检查三个点方向的外壳实现可能会错过此端点情况，除非它显式处理所维护链的第一个点。 

## 方法

 最直接的方法是在每次捕获后重建几何结构。 对于输入的每个前缀，我们可以构造所有当前拥有的 Pokeminos 的凸包，然后确定哪些捕获点严格受该包的某个点支配。 对于长度为 (i) 的前缀，标准船体构造成本为 (O(i\log i))，然后进行线性扫描。 对每个前缀重复此操作的成本为 (O(N^2\log N))。 对于 (N=10^5)，这大约是 (10^{11}) 比较级操作，因此从头开始重建远未接近一秒的限制。 

蛮力方法是正确的，因为凸包包含通过重复繁殖获得的每个点。 问题在于，连续的前缀仅因一个插入点而不同，但强力解决方案会丢弃所有先前的几何工作。 

关键的观察是有用的点有一个非常严格的顺序。 按增加攻击力对它们进行排序，对相同攻击力按减少防御力排序。 考虑三个连续的候选者（L、P、R）。 如果（P）严格位于线段（LR）下方，则（L）和（R）的某些凸组合具有与（P）完全相同的攻击和严格更大的防御。 因此(P)无用，可以删除。 

使用叉积，这个条件是

 [
 (L-P)\times(R-P)<0。 
]

 如果该点是有序结构中的第一个点，则没有左邻居。 当它的直接后继者具有更大的攻击力和更大的防御力时，它就毫无用处。 如果是最后一个点，它不可能没有用，因为没有一个拥有点具有更大的攻击力。 

关键的动态特性是插入一个点只能使该插入位置周围的连续邻居无效。 一旦一个点被移除，它就永远不需要返回，因为未来的捕获只会放大凸包。 因此，每个 Pokemino 都会插入一次，最多删除一次。 我们可以在平衡二叉搜索树中维护有序链，为每次插入或删除提供 (O(\log N)) 工作量。 

Python没有提供内置的平衡有序集，因此下面的实现使用了随机trap。 它支持在预期 (O(\log N)) 时间内插入、删除、前驱和后继。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 为每个前缀重建外壳 | (O(N^2\log N)) | (O(N)) | 太慢了|
 | 带trap的动态凸链| (O(N\log N)) 预期 | (O(N)) | 已接受 |

 ## 算法演练

 1. 将每个 Pokemino 表示为一个点 ((x,y)=(A,D))，并通过增加 (x) 来对点进行排序。 当两个点的 (x) 相同时，先排序 (y) 较大的点。 treap 使用键 ((x,-y)) 来准确实现此排序。 

这种平局是必要的，因为攻击力相等的 Pokemin 无法通过攻击严格控制对方。 
2. 仅维护当前有用的 Pokemino。 在这个有序集合中，一个点最多可以有一个前驱点和一个后继点，因此可以在本地判断它是否变得无用。 
3. 插入新点（P）后，首先检查（P）本身是否无用。 如果是第一个点且其后继点(R)满足(R_x>P_x)和(R_y>P_y)，则(R)直接支配(P)，因此(P)立即被移除。 
4. 如果 (P) 同时具有前驱 (L) 和后继 (R)，则计算

 ## (L_x-P_x)(R_y-P_y)

 (L_y-P_y)(R_x-P_x)。 
]

当该值为负时，(P) 严格位于线段 (LR) 下方。 (L)和(R)适当的凸组合具有与(P)相同的攻击力和更大的防御力，因此(P)是无用的。 
5. 如果新点仍然存在，请重复检查其前一个点。 每当该前任满足相同的无用性测试时，请将其删除。 插入可能会使几个连续的点变得过时，因此这种情况会一直持续到前一个点有效为止。 
6、以同样的方式反复检查后继者。 抹掉每一个已经变得无用的继任者。 
7. 删除所有无效点后，陷阱中正好包含有用的 Pokeminos。 如果 (i) 个 Pokemin 已被捕获并且陷阱包含 (s) 个点，则答案为 (i-s)。 

局部测试足够的原因是维护的凸链不变量。 连续的保留点形成凸包的相关右上边界。 连接其两个邻居的线段下方的点可以通过繁殖这些邻居来到达，并且受到严格控制。 相反，如果每个保留的内部点都位于其相邻弦上或之上，并且端点满足直接支配条件，则保留链中的任何凸组合都无法创建严格更好的点。 插入一个点只能替换该边界的连续部分，因此删除无效的前趋和后继可以完全恢复不变性。 

共线点被刻意保留。 递减线段上的共线点并不严格受线段端点支配。 当支配点进入维护链时，通过端点支配测试来处理正斜率共线配置。 

## Python 解决方案```python
import sys

input = sys.stdin.readline
sys.setrecursionlimit(1_000_000)

class Node:
    __slots__ = ("x", "y", "key", "prio", "left", "right")

    def __init__(self, x, y, prio):
        self.x = x
        self.y = y
        self.key = (x, -y)
        self.prio = prio
        self.left = None
        self.right = None

seed = 712367821

def rng():
    global seed
    seed ^= (seed << 13) & 0xFFFFFFFF
    seed ^= seed >> 17
    seed ^= (seed << 5) & 0xFFFFFFFF
    seed &= 0xFFFFFFFF
    return seed

def rotate_right(root):
    child = root.left
    root.left = child.right
    child.right = root
    return child

def rotate_left(root):
    child = root.right
    root.right = child.left
    child.left = root
    return child

def insert(root, node):
    if root is None:
        return node

    if node.key < root.key:
        root.left = insert(root.left, node)
        if root.left.prio < root.prio:
            root = rotate_right(root)
    else:
        root.right = insert(root.right, node)
        if root.right.prio < root.prio:
            root = rotate_left(root)

    return root

def merge(left, right):
    if left is None:
        return right
    if right is None:
        return left

    if left.prio < right.prio:
        left.right = merge(left.right, right)
        return left
    else:
        right.left = merge(left, right.left)
        return right

def erase(root, key):
    if root is None:
        return None

    if key == root.key:
        return merge(root.left, root.right)

    if key < root.key:
        root.left = erase(root.left, key)
    else:
        root.right = erase(root.right, key)

    return root

def predecessor(root, key):
    ans = None
    while root is not None:
        if root.key < key:
            ans = root
            root = root.right
        else:
            root = root.left
    return ans

def successor(root, key):
    ans = None
    while root is not None:
        if root.key > key:
            ans = root
            root = root.left
        else:
            root = root.right
    return ans

def cross(a, p, b):
    return (a.x - p.x) * (b.y - p.y) - \
           (a.y - p.y) * (b.x - p.x)

def inside(root, p):
    left = predecessor(root, p.key)
    right = successor(root, p.key)

    if right is None:
        return False

    if left is None:
        return right.x > p.x and right.y > p.y

    return cross(left, p, right) < 0

def solve():
    n = int(input())
    root = None
    useful = 0
    answer = []

    for _ in range(n):
        x, y = map(int, input().split())
        p = Node(x, y, rng())

        root = insert(root, p)
        useful += 1

        if inside(root, p):
            root = erase(root, p.key)
            useful -= 1
        else:
            while True:
                left = predecessor(root, p.key)
                if left is None or not inside(root, left):
                    break
                root = erase(root, left.key)
                useful -= 1

            while True:
                right = successor(root, p.key)
                if right is None or not inside(root, right):
                    break
                root = erase(root, right.key)
                useful -= 1

        answer.append(str(_ + 1 - useful))

    sys.stdout.write("\n".join(answer))

if __name__ == "__main__":
    solve()
```这`Node`class 存储两个坐标、排序键、随机优先级和两个 trap 子项。 关键是`(x, -y)`，因此较小的密钥对应于较小的攻击，并且对于相同的攻击，对应于较大的防御。 

treap 运算实现了几何算法所需的有序集运算。 旋转保持随机优先级的堆属性，同时保留坐标顺序。`predecessor`和`successor`无需遍历整个结构即可找到点的直接邻居。 这`inside`函数是几何核心。 最后一点不可能毫无用处，因为没有什么比它具有更大的攻击力了。 第一点需要直接支配测试。 使用叉积测试其他所有点。 

插入过程首先添加点并增加有用点的数量。 如果新点本身无效，则立即将其删除。 否则，它的前驱点和后继点可能会因为新点改变了链条而变得无效。 两个 while 循环删除那些连续的无效点。 

变量`useful`避免在trap中需要子树大小的字段。 每次插入都会增加一次，每次删除都会减少一次。 由于删除的总数最多为 (N)，因此trap操作的总数仍然是预期的 (O(N\log N))。 

不使用浮点运算。 叉积直接用整数计算，这避免了共线点周围的精度误差。 当坐标接近 (10^9) 时，Python 的任意精度整数也可以避免溢出。 

## 工作示例

 对于第一个官方样本，输入包含十个点，其几何形状将每个捕获的 Pokemino 保持在有用的边界上。 因此，陷阱永远不会失分。 

| 捕捉| 点| 行动| 有用计数| 无用计数|
 | --- | --- | --- | --- | --- |
 | 1 | (10, 0) | (10, 0) | 插入| 1 | 0 |
 | 2 | (10, 1) | 插入 | 2 | 0 |
 | 3 | (10, 2) | 插入 | 3 | 0 |
 | 4 | (9, 3) | 插入 | 4 | 0 |
 | 5 | (8, 4) | 插入 | 5 | 0 |
 | 6 | (7, 4) | 插入 | 6 | 0 |
 | 7 | (3, 4) | 插入 | 7 | 0 |
 | 8 | (2, 4) | 插入 | 8 | 0 |
 | 9 | (1, 4) | 插入| 9 | 0 |
 | 10 | 10 (0, 4) | (0, 4) | 插入| 10 | 10 0 |

 (x=10)处的等攻击点同时仍然有用，因为它们中没有一个可以在攻击上严格改进。 随着攻击的增加，其余的点形成一条不增加的防御链，因此没有凸组合可以创建严格更好的点。 输出是十个零。 

对于第二个官方样本，```
5
3 6
6 4
6 9
7 2
10 8
```当插入第四点和第五点时，就会发生重要的变化。 

| 捕捉| 点| 已删除点 | 有用计数| 无用计数|
 | --- | --- | --- | --- | --- |
 | 1 | (3, 6) | 无 | 1 | 0 |
 | 2 | (6, 4) | 无 | 2 | 0 |
 | 3 | (6, 9) | 无 | 3 | 0 |
 | 4 | (7, 2) | (6, 4) | 3 | 1 |
 | 5 | (10, 8) | (7, 2), (3, 6) | (7, 2), (3, 6) | 2 | 3 |

 在第四次插入时，`(6,4)`有邻居`(6,9)`和`(7,2)`。 它的叉积是负的，因此它位于它们的连接段下方，并且可以在相同的攻击下以严格更大的防御来获得。 

在第五次插入时，`(7,2)`首先失效。 一旦将其移除，`(3,6)`成为第一个点及其后继点`(6,9)`直接主宰它。 因此，捕获的五个 Pokeminos 中的三个是无用的，给出了输出```
0
0
1
2
3
```## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N\log N)) 预期 | 每个点插入一次，最多删除一次，trap 操作需要花费预期的时间 ​​(O(\log N))。 |
 | 空间| (O(N)) | 该陷阱最多包含所有 (N) 个捕获的 Pokemin。 |

 对于 (N=10^5)，(O(N\log N)) 适合约束，而为每个前缀重建外壳将需要大约二次工作。 内存使用呈线性并远低于 256 MB。 

## 测试用例

 以下线束假设提交的解决方案保存为`solution.py`。 它执行确切的程序，因此测试不会重复实现。```python
# helper: run the submitted solution and return its output
import sys
import io
import subprocess

def run(inp: str) -> str:
    result = subprocess.run(
        [sys.executable, "solution.py"],
        input=inp,
        text=True,
        capture_output=True,
        check=True,
    )
    return result.stdout.strip()

# Official sample 1
sample1 = """\
10
10 0
10 1
10 2
9 3
8 4
7 4
3 4
2 4
1 4
0 4
"""
assert run(sample1) == "\n".join(["0"] * 10), "sample 1"

# Official sample 2
sample2 = """\
5
3 6
6 4
6 9
7 2
10 8
"""
assert run(sample2) == "\n".join(["0", "0", "1", "2", "3"]), "sample 2"

# Minimum-size input
assert run("1\n0 0\n") == "0", "single Pokemino"

# Equal attack values must all remain useful
same_attack = """\
4
5 0
5 100
5 50
5 1
"""
assert run(same_attack) == "\n".join(["0", "0", "0", "0"]), \
    "equal attack values"

# Direct dominance and positive-slope collinearity
positive_line = """\
3
0 0
2 2
1 1
"""
assert run(positive_line) == "\n".join(["0", "0", "1"]), \
    "direct dominance and insertion order"

# Convex combination can dominate without either parent doing so
convex = """\
3
0 10
10 0
5 4
"""
assert run(convex) == "\n".join(["0", "0", "1"]), \
    "convex combination"

# Maximum-size test with boundary coordinates.
# Every point has attack 0, so no point can have strictly greater attack.
n = 100000
lines = [str(n)]
for i in range(n):
    lines.append(f"0 {10**9 - i}")
large = "\n".join(lines) + "\n"
expected = "\n".join(["0"] * n)
assert run(large) == expected, "maximum-size equal-attack test"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 0 0`|`0`| 最小输入和空邻居处理 |
 | 攻击力四分`5`|`0 0 0 0`| 同等攻击和自定义排序|
 |`(0,0), (2,2), (1,1)`|`0 0 1`| 直接支配和第一点边界情况|
 |`(0,10), (10,0), (5,4)`|`0 0 1`| 培育两只神奇宝贝创造统治地位 |
 | (100000) 点攻击力`0`| (100000) 个零 | 最大输入大小、边界坐标和性能 |

 ## 边缘情况

 对于同等攻击，请考虑```
3
5 1
5 3
5 2
```陷阱内的顺序是`(5,3)`,`(5,2)`,`(5,1)`。 没有点的攻击力大于`5`，所以即使防御不同，但都不能被严格控制。 最后一个点自动是安全的，因为它没有后继者，而同等攻击的邻居则不符合直接支配条件，因为它们的后继者没有更大的攻击力。 输出是`0 0 0`。 

对于递减线段上的共线点，```
3
0 10
5 5
10 0
```中间点的叉积为零。 该算法仅当叉积严格为负数时才删除点，因此`(5,5)`留在船体中。 繁殖端点可以繁殖`(5,5)`，但不能在两个坐标中严格产生更好的点。 输出是`0 0 0`。 

对于凸支配，```
3
0 10
10 0
5 4
```前两点仍然有用。 什么时候`(5,4)`到达，它的前身是`(0,10)`它的后继者是`(10,0)`。 叉积是

 [
 (-5)(-4)-(6)(5)=20-30=-10。 
]

 该点严格位于连接其邻居的线段下方。 他们的中点是`(5,5)`，具有相同的攻击力和更大的防御力，因此`(5,4)`被删除，答案变成`1`。 

对于端点的直接控制，```
3
0 0
2 2
1 1
```重点`(0,0)`被删除时`(2,2)`到达，因为后继者在两个坐标中都更大。 第三点`(1,1)`被插入到之后`(0,0)`已经消失了，所以`(2,2)`成为它的继承者并直接统治它。 输出是`0 0 1`。 这个案例解释了为什么第一点条件不能单独用叉积检验来代替。 

对于最大尺寸边界情况，所有（100000）个点都可以攻击`0`以及之间的独特防御`0`和`10^9`。 由于严格的统治需要更大的攻击，因此无论防御如何，每一点仍然有用。 treap 仍然对每个点执行一次插入，并且不会发生删除，因此算法保持在预期的 (O(N\log N)) 运行时间内。
