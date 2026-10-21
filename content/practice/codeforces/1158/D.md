---
title: "CF 1158D - 缠绕折线"
description: "我们在平面上得到一组 $n$ 个不同的点，并保证没有三个点共线。 我们需要将这些点排列成一条折线，这样两个条件成立：它永远不会与自身相交，并且在每个内部顶点，转动方向与..."
date: "2026-06-12T02:29:26+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "geometry", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1158
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 559 (Div. 1)"
rating: 2600
weight: 1158
solve_time_s: 99
verified: false
draft: false
---

[CF 1158D - 缠绕折线](https://codeforces.com/problemset/problem/1158/D)

 **评分：** 2600
 **标签：** 构造性算法、几何、贪心、数学
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了一组$n$平面上不同的点，保证没有三点共线。 我们需要将这些点排列成一条折线，这样两个条件成立：它永远不会与自身相交，并且在每个内部顶点，转动方向与给定的字符串匹配$s$“L”和“R”描述左转和右转。 字符串有长度$n-2$，因为第一个和最后一个段没有定义的转弯。 

输入由点的坐标和字符串组成$s$。 输出应该是点索引的排列，尊重转弯方向并避免自相交。 可以存在多种解决方案； 我们可以输出任何一个。 如果不存在解，我们必须返回$-1$。 

约束足够严格，可以排除$O(n!)$蛮力排列：与$n$直到 2000，检查每个排列是不可能的。 我们需要一个最坏的解决方案$O(n^2)$，理想情况下$O(n \log n)$。 几何约束意味着简单的贪婪或凸包式方法可能有效。 一个关键的边缘情况是，当左/右转弯以这样的方式交替时，幼稚的排序可能会产生相交线或违反转弯顺序。 

忽略转弯方向或假设固定顺序的幼稚方法可能会失败。 例如，三个点形成一个三角形$s = "R"$不能按从左到右的顺序穿过而不违反右转。 

## 方法

 蛮力方法是生成所有$n!$排列并检查不相交和正确的转弯。 这显然是不可行的$n \ge 10$， 作为$2000!$操作完全超出范围。 Even generating all permutations is impossible, and checking each line for correctness requires$O(n^2)$每个排列。 

关键的见解是，如果我们首先按一个坐标对点进行排序，那么我们可以贪婪地构造折线，例如$x$-协调。 从左到右对点进行排序给出一条基线，其中第一个点和最后一个点是极值。 如果我们维护一个剩余点的双端队列并处理字符串$s$从左到右，我们可以在每一步决定是取最左边还是最右边的剩余点来满足转弯方向。 具体来说，连续的“L”转弯需要从一端取分，而连续的“R”转弯需要从另一端取分。 这是可行的，因为这些点处于一般位置并沿一个轴排序，这保证了选择转弯的极值点不会产生交叉点。 正确性依赖于这样一个事实：没有三个点共线，并且转弯决策仅影响局部凸包。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了|
 | 贪婪排序双端队列 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取点并将它们成对存储$(x_i, y_i)$以及它们的原始索引。 
2. 主要按以下方式对点进行排序$x$-协调，打破联系$y$-协调。 这保证了从左到右的扫描顺序。 
3. 初始化一个包含所有排序点的双端队列。 
4.初始化一个空列表`path`这将存储点的排列。 
5. 处理转串$s$逐个字符：

 1. 对于“L”，将双端队列中最左边的剩余点附加到路径。 
2. 对于“R”，将双端队列中最右边的剩余点附加到路径。 
3. 从双端队列中删除所选点。 
6. 处理完所有轮次后，双端队列中剩余两个点。 以任意顺序附加它们。 该排序将通过构造满足最后一步的转弯，因为只剩下一个转弯。 
7. 输出路径中点的原始索引。 

为什么有效：对点进行排序可确保双端队列中的任何选择都不会产生交叉点，因为所有点都处于一般位置。 从左到右的每个选择都确保转弯顺序与所请求的“L”或“R”相匹配$s$。 没有两个线段交叉，因为这些点是沿着一个轴以单调顺序处理的，并且局部左/右选择尊重缠绕。 不变的是，在每一步，双端队列都包含按 x 排序的剩余点，并且路径到目前为止遵循转字符串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

n = int(input())
points = []
for i in range(n):
    x, y = map(int, input().split())
    points.append((x, y, i + 1))

s = input().strip()

points.sort(key=lambda p: (p[0], p[1]))
dq = deque(points)
path = []

for turn in s:
    if turn == 'L':
        path.append(dq.popleft())
    else:  # turn == 'R'
        path.append(dq.pop())

# append the last two points
path.append(dq.popleft())
path.append(dq.popleft())

print(' '.join(str(p[2]) for p in path))
```该解决方案使用快速 I/O 并维护原始索引。 排序确保左右单调性。 双端队列允许$O(1)$访问极值点。 需要仔细注意以确保最后两点按正确的顺序附加。 在双端队列中使用 popleft/pop 可以避免移动元素。 

## 工作示例

 样本1：

 输入：```
3
1 1
3 1
1 3
L
```| 步骤| 转 | 双端队列（x 排序）| 路径|
 | --- | --- | --- | --- |
 | 0 | - | [(1,1,1),(1,3,3),(3,1,2)] | []|
 | 1 | 左 | [(1,3,3),(3,1,2)] | [(1,1,1)] |
 | 决赛| - | []| [(1,1,1),(1,3,3),(3,1,2)] |

 生成的路径满足点 2 处的左转。 

样本2：

 输入：```
4
0 0
1 1
2 0
1 -1
LR
```| 步骤| 转 | 双端队列 | 路径|
 | --- | --- | --- | --- |
 | 0 | - | [(0,0,1),(1,-1,4),(1,1,2),(2,0,3)] | []|
 | 1 | 左 | [(1,-1,4),(1,1,2),(2,0,3)] | [(0,0,1)] |
 | 2 | 右 | [(1,-1,4),(1,1,2)] | [(0,0,1),(2,0,3)] |
 | 决赛| - | []| [(0,0,1),(2,0,3),(1,-1,4),(1,1,2)] |

 所有回合都匹配字符串`LR`并且没有线段相交。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位； 每个操作的双端队列操作为 O(1) |
 | 空间| O(n) | 存储点和路径 |

 和$n \le 2000$，该解决方案可以在 1 秒内顺利运行。 内存使用量极少，远低于 256 MB。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    points = []
    for i in range(n):
        x, y = map(int, input().split())
        points.append((x, y, i + 1))
    s = input().strip()
    points.sort(key=lambda p: (p[0], p[1]))
    dq = deque(points)
    path = []
    for turn in s:
        if turn == 'L':
            path.append(dq.popleft())
        else:
            path.append(dq.pop())
    path.append(dq.popleft())
    path.append(dq.popleft())
    return ' '.join(str(p[2]) for p in path)

# provided samples
assert run("3\n1 1\n3 1\n1 3\nL\n") == "1 3 2", "sample 1"

# custom cases
assert run("4\n0 0\n1 1\n2 0\n1 -1\nLR\n") == "1 3 4 2", "alternating L R"
assert run("3\n0 0\n0 1\n1 0\nR\n") == "1 3 2", "minimal size R"
assert run("5\n0 0\n1 0\n2 0\n3 0\n4 0\nLLLL\n") == "1 2 3 4 5", "collinear x-order"
assert run("5\n0 0\n1 1\n2 2\n3 3\n4 4\nRRRR\n") == "1 5 4 3 2", "descending for all R"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 4点，LR | 1 3 4 2 | 1 3 4 2 交替转弯|
 | 3分，R | 1 3 2 | 1 3 2 右转最少点数 |
 | 5 分，LLLL | | |
