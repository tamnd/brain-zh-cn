---
title: "CF 1360E - 多边形"
description: "我们得到一个 $n 乘以 n$ 的方阵，开始时完全用零填充。 沿着顶部边缘，有 $n$ 大炮，每列上方一门，沿着左边缘，有 $n$ 大炮，每行左侧一门。"
date: "2026-06-11T12:51:43+07:00"
tags: ["codeforces", "competitive-programming", "dp", "graphs", "implementation", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1360
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 644 (Div. 3)"
rating: 1300
weight: 1360
solve_time_s: 129
verified: true
draft: false
---

[CF 1360E - 多边形](https://codeforces.com/problemset/problem/1360/E)

 **评分：** 1300
 **标签：** dp、图、实现、最短路径
 **求解时间：** 2m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个$n \times n$方阵开始完全由零填充。 沿着顶部边缘，有$n$大炮，每列上方一门，沿着左边缘，有$n$大炮，每行左侧一门。 每门大炮沿直线向右（行大炮）或向下（列大炮）发射一个“1”，直到击中另一个 1 或矩阵的边缘。 一旦 1 停止，它就会永久保留在该单元格中。 

任务是确定这些大炮的某些射击序列是否可以产生给定的 0 和 1 的最终配置。 输入是一系列测试用例，每个测试用例由大小组成$n$和$n \times n$如果配置可行，则输出应为“YES”，否则输出应为“NO”。 

限制因素$1 \le n \le 50$以及所有测试用例的总单元数$\le 10^5$建议$O(n^2)$每个矩阵的方法是可以接受的。 非明显的情况是 1 所处的位置，如果没有其他 1 阻挡其路径，它将继续移动越过边缘。 例如，右下角的 1 总是可以的，但是位置处的 1$(1,1)$在 2x2 矩阵中，第一行或第一列中没有任何 1 是不可能的，因为没有什么可以提前阻止射击。 不考虑这种“邻居阻塞”规则的幼稚实现会错误地接受此类配置。 

## 方法

 暴力方法将尝试模拟每个可能的射击序列，并查看它是否与最终矩阵匹配。 每门大炮可以多次射击，并且有$2n$大炮。 尝试所有序列本质上是组合且不可行的，即使对于$n=10$。 

关键的见解是向后工作。 矩阵中的 1 必须位于底部边缘、右侧边缘，或者紧邻其右侧或下方有一个 1。 如果 1 不满足此属性，则任何炮弹射击序列都不可能将其放置在那里而不违反碰撞规则。 这一观察使我们能够独立检查每个细胞$O(n^2)$时间：对于不在最后一行或最后一列中的每个 1，我们确保下方或右侧的单元格也是 1。这捕获了 1 在到达矩阵边界或另一个 1 时停止的基本约束。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((2n)^k) k 个镜头 | O(n^2) | O(n^2) | 太慢了 |
 | 最佳 | O(n^2) | O(n^2) | O(1) 额外 | 已接受 |

 ## 算法演练

 1. 迭代每个测试用例并读取大小$n$和矩阵。 
2. 对于每个单元格$(i, j)$检查矩阵中是否包含 1。 
3. 如果单元格包含 1，并且它**不在**最后一行或最后一列，请检查可能阻挡其射击的两个单元格：$(i+1, j)$（下）和$(i, j+1)$（正确的）。 
4. 如果下面的单元格和右边的单元格都为0，则无法配置。 立即将此测试用例标记为“NO”并移至下一个测试用例。 
5. 如果全部1通过检查，则可以进行配置，因此将测试用例标记为“YES”。 
6. 输出所有测试用例的结果。 

原理：根据构造，任何处于非边界位置的 1 必须在正下方或正右侧有一个阻挡者才能停在那里。 这个不变量确保每个 1 都可能源自炮弹射击并适当停止。 如果任何 1 违反了此属性，则任何射击序列都无法产生它。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
results = []

for _ in range(t):
    n = int(input())
    grid = [input().strip() for _ in range(n)]
    possible = True
    for i in range(n):
        for j in range(n):
            if grid[i][j] == '1':
                if i < n - 1 and j < n - 1:
                    if grid[i+1][j] != '1' and grid[i][j+1] != '1':
                        possible = False
                        break
        if not possible:
            break
    results.append("YES" if possible else "NO")

print("\n".join(results))
```该解决方案迭代每个单元格。 嵌套循环仅检查不在最后一行或最后一列的单元格。 一旦发现违规行为，提前休息可以避免不必要的检查。 网格存储为字符串列表，以简化索引和比较`'1'`。 

## 工作示例

 输入示例 1：```
4
0010
0011
0000
0000
```| 我| j | 网格[i][j] | i<n-1 & j<n-1? | 网格[i+1][j] | 网格[i][j+1] | 结果 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 2 | 1 | 真实| 0 | 1 | 好的 |
 | 1 | 2 | 1 | 真实| 0 | 1 | 好的 |
 | 1 | 3 | 1 | 假 | - | - | 好的 |

 全1满足阻塞规则，输出为YES。 

输入示例 2：```
2
10
01
```| 我| j | 网格[i][j] | i<n-1 & j<n-1? | 网格[i+1][j] | 网格[i][j+1] | 结果 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 0 | 1 | 真实| 0 | 0 | 失败|

 (0,0) 处的 1 没有右邻或下邻为 1，不可能配置，输出为 NO。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n^2) | 每个单元格最多检查一次，总单元格 ≤ 10^5 |
 | 空间| O(n^2) | O(n^2) | 存储每个测试用例的网格，没有额外的结构 |

 考虑到这些限制，该解决方案可以在 2 秒的限制内轻松运行，并且使用的内存远低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    t = int(input())
    results = []
    for _ in range(t):
        n = int(input())
        grid = [input().strip() for _ in range(n)]
        possible = True
        for i in range(n):
            for j in range(n):
                if grid[i][j] == '1':
                    if i < n - 1 and j < n - 1:
                        if grid[i+1][j] != '1' and grid[i][j+1] != '1':
                            possible = False
                            break
            if not possible:
                break
        results.append("YES" if possible else "NO")
    return "\n".join(results)

# Provided samples
assert run("5\n4\n0010\n0011\n0000\n0000\n2\n10\n01\n2\n00\n00\n4\n0101\n1111\n0101\n0111\n4\n0100\n1110\n0101\n0111\n") == "YES\nNO\nYES\nYES\nNO"

# Custom cases
assert run("1\n1\n1\n") == "YES"  # single-cell 1
assert run("1\n2\n11\n11\n") == "YES"  # full 2x2 grid
assert run("1\n3\n100\n010\n001\n") == "NO"  # diagonal without blockers
assert run("1\n3\n110\n111\n011\n") == "YES"  # complex valid pattern
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1x1 网格，其中 1 | 是 | 单细胞小案例|
 | 2x2 全 1 秒 | 是 | 小全格|
 | 3x3 对角线 1s | 否 | 没有拦截器就不可能放置 |
 | 3x3 复杂 | 是 | 具有正确拦截器的多个 1 |

 ## 边缘情况

 对于单单元矩阵，任何 1 始终有效，因为它同时位于最后一行和最后一列。 

对于 2x2 矩阵，其中 1 位于 (0,0) 和 (1,1)，但 (0,1) 和 (1,0) 为 0，算法识别出 (0,0) 处的 1 没有阻止程序阻止它，从而产生 NO。 

对于完全充满 1 的矩阵，每个 1 要么在右侧或下方有一个邻居，要么在边界上，产生 YES。 

该算法自然地处理所有这些场景，无需额外的条件逻辑，从而确认正确性。
