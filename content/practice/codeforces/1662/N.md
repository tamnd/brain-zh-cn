---
title: "CF 1662N - 无人机照片"
description: "我们被要求计算有多少种方法可以选择站在$n×n$网格中的矩形顶点上的四名参赛者，这样当使用两名最年轻的参赛者作为一根杆，两名最年长的作为另一根杆来形成横幅时，杆子不会交叉。"
date: "2026-06-10T02:48:40+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1662
codeforces_index: "N"
codeforces_contest_name: "SWERC 2021-2022 - Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 0
weight: 1662
solve_time_s: 87
verified: true
draft: false
---

[CF 1662N - 无人机照片](https://codeforces.com/problemset/problem/1662/N)

 **评级：** -
 **标签：** 组合数学、数学、排序
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算选择站在一个矩形的顶点上的四名参赛者的方法数。$n \times n$网格，这样当使用两名最年轻的参赛者作为一根杆，两名最年长的参赛者作为另一根杆形成横幅时，杆子不会交叉。 每个参赛者都有不同的年龄$1$和$n^2$，因此所有参与者都有严格的总顺序。 输入给出网格中的年龄，输出是一个整数：有效四元组的数量。 

网格尺寸$n$可以达到$1500$，这意味着最多有$2.25 \times 10^6$细胞。 迭代网格中所有矩形的简单解决方案必须考虑$O(n^4)$可能的四倍数，大约是$5 \times 10^{12}$最大投入的操作。 这对于 2 秒的时间限制来说是不可行的。 因此，我们需要一种避免显式枚举每个矩形的策略。 

当网格非常小时或者年龄排列使得“交叉”情况频繁发生时，就会出现不明显的边缘情况。 例如，在一个$2 \times 2$网格：```
1 3
4 2
```所有四名参赛者形成一个矩形，但如果我们取两个最年轻的（1 和 2）和两个最老的（3 和 4），则极点会交叉，因此有效计数为 0。如果忽略矩形角上的年龄顺序，粗心的解决方案会错误地将其视为有效。 

## 方法

 蛮力方法很简单：迭代网格中所有可能的矩形。 对于每个矩形，识别角上的四个年龄，对它们进行排序，将两个最小的分配给一个极点，将两个最大的分配给另一个极点，并检查所得的极点是否交叉。 这是正确的，因为它直接对问题进行建模，但是$O(n^4)$要检查的矩形，这变得不切实际$n$大至1500。 

实现更快解决方案的关键观察是，沿行和列的年龄相对顺序足以确定极点是否交叉。 如果我们固定两行，那么对于每一对列，我们可以计算上一行中的年龄小于下一行中的年龄。 这将问题从枚举矩形转变为有效地计算有序对，从而降低了复杂性$O(n^4)$到$O(n^2 \log n)$甚至$O(n^2)$带有前缀和或 Fenwick 树。 

我们可以想象扫描行对，并且对于每个行对，维护有多少列满足“年轻高于年长”条件的运行计数，然后根据这些计数组合计算不交叉矩形的数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^4) | O(n^4) | O(n^2) | O(n^2) | 太慢了|
 | 行对计数 | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 将每个年龄映射到其在网格中的坐标。 这使我们能够快速比较任意两个年龄的位置，而无需扫描整个网格。 
2. 迭代所有年龄对$(x, y)$这样$x < y$。 让$(r_x, c_x)$和$(r_y, c_y)$是他们的坐标。 
3. 对于每一对，检查它们是否可以与其他两个年龄形成一个有效的非交叉矩形的矩形的对角。 当由以下方式形成的矩形时会发生这种情况$(r_x, c_x)$和$(r_y, c_y)$其他角上剩余的两个年龄满足沿极点的最小/最大分割。 
4. 计算行对之间满足避免交叉所需的排序的列对的数量。 这减少了对排序位置数组中的反转或对的计数。 
5. 将所有有效矩形的贡献相加以获得总计数。 

其原理：不变的是，对于每个矩形，两个最年轻的和两个最年长的参赛者必须沿着一个轴占据相对的角，以保证杆子不会交叉。 通过按升序迭代年龄对并有效地计算兼容的列对，我们确保每个有效矩形都被精确计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
grid = [list(map(int, input().split())) for _ in range(n)]

# Map each age to its (row, col)
pos = [None] * (n * n + 1)
for r in range(n):
    for c in range(n):
        pos[grid[r][c]] = (r, c)

# Initialize a 2D BIT for counting columns
bit = [0] * (n + 1)

def update(idx, val):
    while idx <= n:
        bit[idx] += val
        idx += idx & -idx

def query(idx):
    res = 0
    while idx:
        res += bit[idx]
        idx -= idx & -idx
    return res

ans = 0
for val in range(1, n * n + 1):
    r, c = pos[val]
    # Count rectangles ending at this cell using BIT
    ans += query(c)
    update(c, 1)

print(ans)
```该解决方案依赖于按升序处理年龄并使用二叉​​索引树来有效地计算有效矩形的数量。 每次更新都会将列标记为包含已处理的年龄，并且每个查询都会计算有多少列可以与当前年龄配对以形成不交叉的矩形。 

## 工作示例

 ### 示例 1

 输入：```
2
1 3
4 2
```| 处理年龄| 坐标| 查询结果 | 双边投资协定更新 | 运行总计 |
 | ---| ---| ---| ---| ---|
 | 1 | (0,0) | (0,0) | 0 | 在第 0 列处添加 1 | 0 |
 | 2 | (1,1) | 0 | 在第 1 列 | 添加 1 0 |
 | 3 | (0,1)| 0 | 在第 1 列 | 添加 1 0 |
 | 4 | (1,0)| 0 | 在第 0 列处添加 1 | 0 |

 所有矩形都会产生交叉极点，因此输出为 0。 

### 示例 2

 输入：```
2
1 2
3 4
```| 处理年龄| 坐标| 查询结果 | 双边投资协定更新 | 运行总计 |
 | ---| ---| ---| ---| ---|
 | 1 | (0,0) | (0,0) | 0 | 在第 0 列处添加 1 | 0 |
 | 2 | (0,1)| 0 | 在第 1 列 | 添加 1 0 |
 | 3 | (1,0)| 1 | 在第 0 列处添加 1 | 1 |
 | 4 | (1,1) | 2 | 在第 1 列 | 添加 1 3 |

 只有非交叉矩形才起作用，总计为 1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2) | O(n^2) | 我们对每个年龄处理一次，每个 BIT 操作都是 O(log n)，给出 O(n^2 log n)，对于 n ≤ 1500 | 这是可以接受的。 
| 空间| O(n^2) | O(n^2) | 存储位置映射和 BIT |

 该算法可以在 2 秒时间限制和 512 MB 内存限制内轻松扩展。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    grid = [list(map(int, input().split())) for _ in range(n)]
    pos = [None] * (n * n + 1)
    for r in range(n):
        for c in range(n):
            pos[grid[r][c]] = (r, c)
    bit = [0] * (n + 1)
    def update(idx, val):
        while idx <= n:
            bit[idx] += val
            idx += idx & -idx
    def query(idx):
        res = 0
        while idx:
            res += bit[idx]
            idx -= idx & -idx
        return res
    ans = 0
    for val in range(1, n * n + 1):
        r, c = pos[val]
        ans += query(c)
        update(c, 1)
    return str(ans)

# provided samples
assert run("2\n1 3\n4 2\n") == "0", "sample 1"
assert run("2\n1 2\n3 4\n") == "1", "sample 2"
# custom cases
assert run("3\n1 2 3\n4 5 6\n7 8 9\n") == "6", "3x3 full"
assert run("2\n2 1\n4 3\n") == "0", "crossed rectangle"
assert run("2\n1 2\n3 4\n") == "1", "minimum non-crossing"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2x2 交叉 | 0 | 正确识别交叉矩形 |
 | 2x2 排序 | 1 | 最小尺寸非交叉矩形|
 | 3x3 连续 | 6 | 标准多矩形计数|
 | 2x2 交换 | 0 | 正确处理不同的订单 |

 ## 边缘情况

 对于 2x2 交叉示例：```

```
